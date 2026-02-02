import { memo } from 'react'

const GameCard = memo(function GameCard({ game, onEdit, onDelete }) {
  return (
    <div className="game-card">
      <div className="game-card-header">
        <h3>{game.name}</h3>
        <div className="game-card-actions">
          <button
            className="btn-icon btn-edit"
            onClick={onEdit}
            title="Edit"
          >
            ✎
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={onDelete}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="game-card-body">
        <p className="genre">📁 {game.genre || 'Unknown'}</p>
        <p className="price">${game.price.toFixed(2)}</p>
        <p className="release-date">📅 {game.releaseDate || 'Unknown'}</p>
      </div>
    </div>
  )
})

export default GameCard
