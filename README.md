# VoltStream

VoltStream is split into a React frontend and a FastAPI backend.

## Project Structure

```text
voltstream/
  backend/
    app/
      main.py
    requirements.txt
    README.md
  frontend/
    src/
      api.js
      main.jsx
      VoltStream.jsx
    index.html
    package.json
    vite.config.js
    README.md
  .gitignore
  README.md
```

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend API docs: http://localhost:8000/docs

## Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend app: http://localhost:5173

## API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | Backend health check |
| GET | `/api/v1/dashboard/live` | Live grid, solar, and net usage |
| GET | `/api/v1/analytics/history?period=daily` | Usage history for daily, weekly, or monthly |
| GET | `/api/v1/devices` | Device list |
| PATCH | `/api/v1/devices/{device_id}` | Update device on/off state |
| GET | `/api/v1/billing/summary` | Billing summary |
