from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from botnew import ask, model

# React build output (cd frontend && npm run build)
DIST_DIR = Path(__file__).parent / "frontend" / "dist"

app = FastAPI(title="Bot API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class Turn(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[Turn] = []


class ChatResponse(BaseModel):
    reply: str


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        reply = ask(req.message, [t.dict() for t in req.history])
    except Exception as e:
        text = str(e)
        if "429" in text or "quota" in text.lower():
            raise HTTPException(status_code=429, detail="Gemini quota exceeded. Wait a bit, or check billing on your API key's project.")
        raise HTTPException(status_code=502, detail=f"Model error: {text[:300]}")
    return ChatResponse(reply=reply)


@app.get("/api/info")
def info():
    return {"model": model.model.replace("models/", "")}


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
