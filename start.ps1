# Script used for development proces

# Start FastAPI (with venv)
Start-Process powershell -ArgumentList "-NoExit","
    cd ./backend;
    .venv\Scripts\activate;
    fastapi dev api/main.py;
"

# Start Next.js
Start-Process powershell -ArgumentList "
    cd ./frontend;
    npm run dev
"