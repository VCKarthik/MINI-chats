# mini

A Netflix-style AI chat app. React (Vite) frontend, FastAPI backend, Google Gemini via LangChain.

Say hi or ask for a joke and watch what happens.

## Setup

Requires Python 3.9+ and Node 18+.

```bash
git clone https://github.com/VCKarthik/MINI-chats.git
cd MINI-chats

pip install -r requirements.txt
cp .env.example .env          # then put your Gemini API key in .env

cd frontend
npm install
```

## Run

**Normal use** (one terminal):

```bash
cd frontend && npm run build && cd ..
python3 app.py
```

Open http://localhost:8001

**While editing React code** (two terminals, live reload):

```bash
python3 app.py                # terminal 1
cd frontend && npm run dev    # terminal 2
```

Open http://localhost:5173

## Project layout

```
app.py          FastAPI: /api/chat, /api/info, serves the built React app
botnew.py       Gemini model and ask() helper
frontend/src/
  App.jsx       chat state, sending, celebration effects
  rows.js       home page card rows
  vibe.js       greeting / fun prompt detection
  components/   Navbar, Hero, Row, ChatView, Message, Composer, Sparkles, Intro, ...
```

## Passkey

Set `APP_PASSKEY` (in `.env` locally, or in your host's environment settings) to lock the site behind a passkey. Leave it empty to keep it open. Wrong guesses are rate-limited, a correct passkey keeps you signed in for 7 days, and changing it signs everyone out.

## Deploy (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/VCKarthik/MINI-chats)

Click the button, sign in with GitHub, and fill in `GOOGLE_API_KEY` and `APP_PASSKEY` when asked. Settings come from `render.yaml`. Every push to `main` redeploys.

To change the model, edit `botnew.py`. To change the port, edit `PORT` in `app.py` (and the proxy in `frontend/vite.config.js`).
