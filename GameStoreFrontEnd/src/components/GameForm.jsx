import { useState, useMemo, useCallback } from 'react'
import { gamesAPI, useGenres } from '../services/api'
import './GameForm.css'

export default function GameForm({ game, onSave, onCancel }) {
  const { genres, isLoading: loadingGenres } = useGenres()

  // Derive initial form data from game prop (runs once per game change via key prop)
  const initialFormData = useMemo(() => {
    if (!game) {
      return { name: '', price: '', genreId: '', releaseDate: '' }
    }

    let genreId = game.genreId?.toString() || ''

    // If no genreId, lookup by genre name
    if (!genreId && genres.length > 0) {
      const genreName = game.genreName || game.genre
      if (genreName) {
        const foundGenre = genres.find(g => g.name === genreName)
        if (foundGenre) {
          genreId = foundGenre.id.toString()
        }
      }
    }

    return {
      name: game.name,
      price: game.price.toString(),
      genreId,
      releaseDate: game.releaseDate || '',
    }
  }, [game, genres])

  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Game name cannot be empty'
    }

    const price = parseFloat(formData.price)
    if (!formData.price) {
      newErrors.price = 'Price cannot be empty'
    } else if (price < 0.01 || price > 1000) {
      newErrors.price = 'Price must be between 0.01 and 1000'
    }

    if (!formData.genreId) {
      newErrors.genreId = 'Please select a genre'
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Please select a release date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setSubmitting(true)
      const data = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        genreId: parseInt(formData.genreId),
        releaseDate: formData.releaseDate,
      }

      if (game?.id) {
        await gamesAPI.update(game.id, data)
      } else {
        await gamesAPI.create(data)
      }

      onSave()
    } catch (error) {
      console.error('Failed to save game:', error)

      // Parse backend validation errors
      if (error.validationErrors) {
        const backendErrors = {}
        Object.keys(error.validationErrors).forEach((field) => {
          const fieldName = field.charAt(0).toLowerCase() + field.slice(1)
          backendErrors[fieldName] = error.validationErrors[field][0]
        })
        setErrors(backendErrors)
      } else {
        setErrors({ submit: error.message })
      }
    } finally {
      setSubmitting(false)
    }
  }, [validateForm, formData, game?.id, onSave])

  return (
    <form className="game-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">
          Tên Game <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ví dụ: Elden Ring"
          disabled={submitting}
        />
        {errors.name ? <span className="error-message">{errors.name}</span> : null}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">
            Giá (USD) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ví dụ: 59.99"
            step="0.01"
            min="0"
            disabled={submitting}
          />
          {errors.price ? <span className="error-message">{errors.price}</span> : null}
        </div>

        <div className="form-group">
          <label htmlFor="genreId">
            Thể Loại <span className="required">*</span>
          </label>
          <select
            id="genreId"
            name="genreId"
            value={formData.genreId}
            onChange={handleChange}
            disabled={submitting || loadingGenres}
          >
            <option value="">{loadingGenres ? 'Đang tải...' : 'Chọn thể loại'}</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genreId ? <span className="error-message">{errors.genreId}</span> : null}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="releaseDate">
          Ngày Phát Hành <span className="required">*</span>
        </label>
        <input
          type="date"
          id="releaseDate"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
          disabled={submitting}
        />
        {errors.releaseDate ? <span className="error-message">{errors.releaseDate}</span> : null}
      </div>

      <div className="form-actions">
        {errors.submit ? (
          <div className="error-banner">
            <span className="error-message">{errors.submit}</span>
          </div>
        ) : null}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Đang xử lý...' : game?.id ? 'Cập Nhật' : 'Thêm Game'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Hủy
        </button>
      </div>
    </form>
  )
}
