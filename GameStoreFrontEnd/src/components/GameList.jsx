import { useState, useCallback, useMemo } from 'react'
import { gamesAPI, useGames } from '../services/api'
import GameCard from './GameCard'
import GameForm from './GameForm'
import Modal from './Modal'
import { useToast } from './Toast'
import './GameList.css'

export default function GameList() {
  const { games, isLoading, isError, mutate } = useGames()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const { showToast, clearAllToasts, ToastContainer } = useToast()

  const handleAddNew = useCallback(() => {
    clearAllToasts()
    setSelectedGame(null)
    setModalOpen(true)
  }, [clearAllToasts])

  const handleEdit = useCallback((game) => {
    clearAllToasts()
    setSelectedGame(game)
    setModalOpen(true)
  }, [clearAllToasts])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setSelectedGame(null)
  }, [])

  const handleSave = useCallback(async () => {
    const isUpdate = !!selectedGame?.id
    const actionName = isUpdate ? 'Updated' : 'Added'

    showToast(`${actionName} game successfully!`, 'success')

    setTimeout(() => {
      setModalOpen(false)
      setSelectedGame(null)
    }, 100)

    await mutate()
  }, [selectedGame?.id, showToast, mutate])

  const handleDeleteClick = useCallback((game) => {
    clearAllToasts()
    setDeleteConfirm(game)
  }, [clearAllToasts])

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirm(null)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    try {
      await gamesAPI.delete(deleteConfirm.id)
      showToast('Game deleted successfully!', 'success')

      setTimeout(() => {
        setDeleteConfirm(null)
      }, 100)

      await mutate()
    } catch (error) {
      showToast('Failed to delete game!', 'error')
      console.error('Delete error:', error)
    }
  }, [deleteConfirm?.id, showToast, mutate])

  // Memoize game card handlers to prevent unnecessary re-renders
  const gameCardHandlers = useMemo(() => {
    return games.map(game => ({
      game,
      onEdit: () => handleEdit(game),
      onDelete: () => handleDeleteClick(game),
    }))
  }, [games, handleEdit, handleDeleteClick])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading games...</p>
      </div>
    )
  }

  return (
    <div className="game-list-container">
      <div className="game-list-header">
        <h2>Game Store</h2>
        <button className="btn-add-new" onClick={handleAddNew}>
          + Add New Game
        </button>
      </div>

      {isError ? (
        <div className="error-banner">
          <p>Failed to load games</p>
          <button onClick={() => mutate()}>Retry</button>
        </div>
      ) : null}

      {games.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎮</div>
          <h3>No games found</h3>
          <p>No data to display</p>
        </div>
      ) : (
        <div className="games-grid">
          {gameCardHandlers.map(({ game, onEdit, onDelete }) => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedGame?.id ? 'Edit Game' : 'Add New Game'}
      >
        <GameForm
          key={selectedGame?.id ?? 'new'}
          game={selectedGame}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>

      {deleteConfirm ? (
        <div className="confirm-dialog-overlay" onClick={handleCancelDelete}>
          <div
            className="confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
            </p>
            <p style={{ color: '#999', fontSize: '0.9em', marginTop: '10px' }}>
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-delete-confirm"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                className="btn btn-cancel-confirm"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ToastContainer />
    </div>
  )
}
