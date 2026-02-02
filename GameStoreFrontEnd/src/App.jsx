import GameList from './components/GameList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎮 Game Store</h1>
        <p>Discover amazing games</p>
      </header>
      <main>
        <GameList />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Game Store. Built with React + Vite</p>
      </footer>
    </div>
  )
}

export default App
