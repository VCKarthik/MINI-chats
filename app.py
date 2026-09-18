import hashlib
import hmac
import os
import time
from collections import defaultdict, deque
from pathlib import Path
from typing import Deque, Dict, List

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()

# Which model answers: "gemini" (API, costs money) or "ollama" (local, free).
# Set MODEL_BACKEND=ollama in .env to switch, or change the default here.
MODEL_BACKEND = os.getenv("MODEL_BACKEND", "gemini")

if MODEL_BACKEND == "ollama":
    from localbot import ask, model  # local qwen2.5:3b via Ollama
else:
    from botnew import ask, model  # Gemini; also loads .env

# React build output (cd frontend && npm run build)
DIST_DIR = Path(__file__).parent / "frontend" / "dist"

# Access passkey. If APP_PASSKEY is empty the site is open (handy for local dev).
PASSKEY = os.getenv("APP_PASSKEY", "")
COOKIE_NAME = "mini_session"
SESSION_SECONDS = 7 * 24 * 3600
LOGIN_ATTEMPTS_PER_MIN = 5  # per visitor
LOGIN_ATTEMPTS_PER_MIN_TOTAL = 30  # all visitors combined; IP headers can be faked
CHATS_PER_MIN = int(os.getenv("CHATS_PER_MIN", "20"))

app = FastAPI(title="mini API")


# ---------- auth & rate limiting ----------

def session_token() -> str:
    # Derived from the passkey, so changing APP_PASSKEY logs everyone out
    return hmac.new(PASSKEY.encode(), b"mini-session-v1", hashlib.sha256).hexdigest()


def is_authenticated(request: Request) -> bool:
    if not PASSKEY:
        return True
    return hmac.compare_digest(request.cookies.get(COOKIE_NAME, ""), session_token())


def require_auth(request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=401, detail="Passkey required")


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


_hits: Dict[str, Deque[float]] = defaultdict(deque)


def check_limit(key: str, limit: int, window: float = 60):
    now = time.monotonic()
    hits = _hits[key]
    while hits and now - hits[0] > window:
        hits.popleft()
    if len(hits) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Try again in a minute.")


def record_hit(key: str):
    _hits[key].append(time.monotonic())


def rate_limit(key: str, limit: int):
    check_limit(key, limit)
    record_hit(key)


# ---------- API ----------

class Turn(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[Turn] = []


class ChatResponse(BaseModel):
    reply: str


class LoginRequest(BaseModel):
    passkey: str


@app.get("/api/session")
def session(request: Request):
    return {"required": bool(PASSKEY), "authenticated": is_authenticated(request)}


@app.post("/api/login")
def login(req: LoginRequest, request: Request, response: Response):
    if not PASSKEY:
        return {"ok": True}
    # Only wrong guesses count toward the limits
    ip_key = f"login:{client_ip(request)}"
    check_limit(ip_key, LOGIN_ATTEMPTS_PER_MIN)
    check_limit("login:all", LOGIN_ATTEMPTS_PER_MIN_TOTAL)
    if not hmac.compare_digest(req.passkey.encode(), PASSKEY.encode()):
        record_hit(ip_key)
        record_hit("login:all")
        raise HTTPException(status_code=401, detail="Wrong passkey")
    https = request.headers.get("x-forwarded-proto", request.url.scheme) == "https"
    response.set_cookie(
        COOKIE_NAME,
        session_token(),
        max_age=SESSION_SECONDS,
        httponly=True,
        samesite="strict",
        secure=https,
    )
    return {"ok": True}


@app.post("/api/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return {"ok": True}


@app.post("/api/chat", response_model=ChatResponse, dependencies=[Depends(require_auth)])
def chat(req: ChatRequest, request: Request):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    rate_limit(f"chat:{client_ip(request)}", CHATS_PER_MIN)
    try:
        reply = ask(req.message, [t.dict() for t in req.history])
    except Exception as e:
        text = str(e)
        if "429" in text or "quota" in text.lower():
            raise HTTPException(status_code=429, detail="Gemini quota exceeded. Wait a bit, or check billing on your API key's project.")
        raise HTTPException(status_code=502, detail=f"Model error: {text[:300]}")
    return ChatResponse(reply=reply)


@app.get("/api/info", dependencies=[Depends(require_auth)])
def info():
    return {"model": model.model.replace("models/", ""), "backend": MODEL_BACKEND}


# ---------- React app ----------

@app.get("/")
def index():
    if not (DIST_DIR / "index.html").exists():
        raise HTTPException(status_code=404, detail="React app not built. Run: cd frontend && npm run build")
    return FileResponse(DIST_DIR / "index.html")


if (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")


if __name__ == "__main__":
    import uvicorn

    PORT = 8001  # change the port here
    uvicorn.run("app:app", host="127.0.0.1", port=PORT, reload=True)
