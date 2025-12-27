FastAPI backend scaffold

Quick start:

1. Create a Python virtual environment and activate it:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update `DATABASE_URL`.

4. Run server:

```bash
uvicorn app.main:app --reload --port 8000
```

Default API: http://localhost:8000/

Docker MySQL (optional):

1. Start MySQL via Docker Compose from the `server/` folder:

```bash
docker compose up -d
```

2. The compose file exposes MySQL on `localhost:3306` with:

- user: `root`
- password: `password`
- database: `civicportal`

Set `DATABASE_URL` in `.env` to:

```
mysql+pymysql://root:password@localhost:3306/civicportal
```

3. Run the FastAPI app:

```bash
uvicorn app.main:app --reload --port 8000
```

API endpoints (examples):

- `GET /complaints` — list complaints
- `POST /complaints` — create complaint (JSON `title`, `description`)

Frontend proxy:

The frontend dev server proxies `/api` to the backend. Use fetch calls like `/api/complaints` from the React app during development.
