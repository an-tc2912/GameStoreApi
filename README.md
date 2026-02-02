# GameStore

A full-stack game store application with ASP.NET Core API backend and React frontend.

## What This Does

A personal project to learn and practice building a complete web application. The app allows managing a game catalog with CRUD operations - create, read, update, and delete games with their genres.

## Tech Stack

- **Backend**: ASP.NET Core (.NET 10) - Minimal API with Entity Framework Core
- **Database**: SQLite - Simple file-based database for development
- **Frontend**: React 19 + Vite - Modern, fast development experience
- **Data Fetching**: SWR - React hooks for data fetching with caching

## Project Structure

```
GameStoreApi/
├── GameStoreBackEnd/          # ASP.NET Core API
│   ├── GameStore/
│   │   ├── Data/              # EF Core context & migrations
│   │   ├── Dtos/              # Data transfer objects
│   │   ├── EndPoints/         # API endpoints
│   │   └── Models/            # Entity models
│   └── GameStore.slnx
└── GameStoreFrontEnd/         # React + Vite
    └── src/
        ├── components/        # React components
        └── services/          # API client
```

## Getting Started

### Backend

```bash
cd GameStoreBackEnd/GameStore
dotnet restore
dotnet run
```

API runs at `http://localhost:5000`

### Frontend

```bash
cd GameStoreFrontEnd
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/games` | Get all games |
| GET | `/games/{id}` | Get game by ID |
| POST | `/games` | Create new game |
| PUT | `/games/{id}` | Update game |
| DELETE | `/games/{id}` | Delete game |
| GET | `/genres` | Get all genres |

## License

Personal project for learning purposes.
