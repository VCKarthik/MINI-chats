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

To change the model, edit `botnew.py`. To change the port, edit `PORT` in `app.py` (and the proxy in `frontend/vite.config.js`).
