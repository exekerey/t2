#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting backend setup..."

# 1. Check for .env file
if [ ! -f .env ]; then
    echo "📄 .env file not found. Copying from example.env..."
    cp example.env .env
    echo "⚠️  Created .env. Please update it with your local DB credentials if needed."
fi

# 2. Setup Virtual Environment
if [ ! -d .venv ]; then
    echo "🐍 Creating virtual environment..."
    python3 -m venv .venv
fi

# 3. Install Dependencies
echo "📦 Installing dependencies..."
source .venv/bin/activate
pip install -r requirements.txt --quiet

# 4. Run Database Migrations
echo "🗄️  Running database migrations..."
# This assumes the database is already running and accessible as per .env
sh prestart.sh

# 5. Start the Server
echo "⚡ Starting the server at http://localhost:8000..."
uvicorn app.main:app --reload
