# Backend Guide for Frontend Engineers

This backend is built with **FastAPI**. Follow these steps to get it running locally.

## Prerequisites
- **Python 3.10+**
- **PostgreSQL** (Running locally or via Docker)

## Quick Start
1. **Prepare your database:**
   Ensure you have a PostgreSQL database created (default name: `t2`).
2. **Run the setup script:**
   ```bash
   ./run_backend.sh
   ```
   This script will:
   - Create a virtual environment (`.venv`).
   - Install all dependencies.
   - Setup your `.env` file (copying from `example.env`).
   - Run database migrations.
   - Start the server at `http://localhost:8000`.

## API Documentation
Once the server is running, you can access the interactive API docs at:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Authentication
To use the API, you first need to register an account or log in.
1. Use the `/api/v1/auth/register` endpoint in Swagger to create your user.
2. Use the "Authorize" button in Swagger or the `/api/v1/auth/login` endpoint to get your token.

## Configuration
The application uses environment variables defined in `.env`. 
If you need to change your database connection string or secret keys, edit the `.env` file directly:
```env
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=t2
SECRET_KEY=your_super_secret_key_here
```

## Troubleshooting
- **Database Connection:** If you get a connection error, ensure PostgreSQL is running and the credentials in `.env` match your setup.
- **Python Version:** Ensure `python3 --version` returns 3.10 or higher.
