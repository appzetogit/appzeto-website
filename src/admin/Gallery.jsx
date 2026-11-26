'use client'
import { useEffect, useState, useRef } from 'react'
import { api, ago } from './api.js'

export default function GalleryManager() {
  const [categories, setCategories] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  // UI state
  const [showUpload, setShowUpload] = useState(false)
  const [showCatSection, setShowCatSection] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  // Form state
  const [mode, setMode] = useState('file') // 'file' | 'url'
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [featured, setFeatured] = useState(false)
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  // New Category form
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('📷')
  const [addingCat, setAddingCat] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await api('/api/admin/gallery')
      if (data.ok) {
        setCategories(data.categories || [])
        setPhotos(data.photos || [])
        if (!category && data.categories?.length > 0) {
          setCategory(data.categories[0].name)
        }
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    setFile(f || null)
    if (f) {
      const reader = new FileReader()
      reader.onload = () => setFilePreview(reader.result)
      reader.readAsDataURL(f)
    } else {
      setFilePreview('')
    }
  }

  const handleAddPhoto = async (e) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    if (!title.trim()) return setErr('Please enter a photo title.')
    if (!category.trim()) return setErr('Please select a category.')

    setUploading(true)
    try {
      if (mode === 'file') {
        if (!file) {
          setUploading(false)
          return setErr('Please select an image file to upload.')
        }
        const fd = new FormData()
        fd.append('file', file)
        fd.append('title', title.trim())
        fd.append('caption', caption.trim())
        fd.append('category', category.trim())
        fd.append('featured', featured)

        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          body: fd,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to upload photo.')
      } else {
        if (!imageUrl.trim()) {
          setUploading(false)
          return setErr('Please provide an image URL.')
        }
        await api('/api/admin/gallery', {
          method: 'POST',
          body: {
            title: title.trim(),
            caption: caption.trim(),
            category: category.trim(),
            imageUrl: imageUrl.trim(),
            featured,
          },
        })
      }

      setMsg(`Photo "${title}" added to gallery!`)
      setTitle('')
      setCaption('')
      setImageUrl('')
      setFile(null)
      setFilePreview('')
      setFeatured(false)
      setShowUpload(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await loadData()
    } catch (e) {
      setErr(e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (id, photoTitle) => {
    if (!confirm(`Delete "${photoTitle}" from the gallery?`)) return
    try {
      await api(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      setPhotos(photos.filter(p => p._id !== id))
      setMsg(`Photo "${photoTitle}" deleted.`)
    } catch (e) {
      setErr(e.message)
    }
  }

  const handleToggleFeatured = async (photo) => {
    try {
      const next = !photo.featured
      await api(`/api/admin/gallery/${photo._id}`, {
        method: 'PUT',
        body: { featured: next },
      })
      setPhotos(photos.map(p => (p._id === photo._id ? { ...p, featured: next } : p)))
      setMsg(next ? `Marked "${photo.title}" as featured highlight.` : `Unfeatured "${photo.title}".`)
    } catch (e) {
      setErr(e.message)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setAddingCat(true)
    setErr('')
    try {
      const res = await api('/api/admin/gallery/categories', {
        method: 'POST',
        body: {
          name: newCatName.trim(),
          description: '',
          icon: newCatIcon.trim() || '📷',
        },
      })
      if (res.ok) {
        setCategories([...categories, res.category])
        setNewCatName('')
        setMsg(`Category "${res.category.name}" created!`)
      }
    } catch (e) {
      setErr(e.message)
    } finally {
      setAddingCat(false)
    }
  }

  const handleDeleteCategory = async (catId, catName) => {
    if (!confirm(`Delete category "${catName}"? Photos in this category will remain.`)) return
    try {
      await api(`/api/admin/gallery/categories?id=${catId}`, { method: 'DELETE' })
      setCategories(categories.filter(c => c._id !== catId))
      setMsg(`Category "${catName}" removed.`)
    } catch (e) {
      setErr(e.message)
    }
  }

  const filteredPhotos = photos.filter(p => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'featured') return p.featured
    return p.categorySlug === activeFilter
  })

  return (
    <div className="adm-gal-wrap">
      {/* Page Header */}
      <header className="adm-head">
        <div>
          <h1>Gallery &amp; Media</h1>
          <p className="adm-sub">
            Manage company photo collections (Life at Appzeto, Birthday Celebrations, Diwali, Events).
          </p>
        </div>
        <div className="adm-acts">
          <button
            type="button"
            className={`adm-btn ${showUpload ? 'adm-btn-y' : ''}`}
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? '✕ Close uploader' : '+ Add photo'}
          </button>
          <button
            type="button"
            className={`adm-btn ${showCatSection ? 'adm-btn-y' : ''}`}
            onClick={() => setShowCatSection(!showCatSection)}
          >
            📁 {showCatSection ? 'Hide categories' : 'Manage categories'}
          </button>
        </div>
      </header>

      {/* Alerts */}
      {msg && <p className="adm-ok" role="status">{msg}</p>}
      {err && <p className="adm-err" role="alert">{err}</p>}

      {/* KPI Cards / Overview */}
      <section className="adm-kpis">
        <div className="adm-card">
          <b>{photos.length}</b>
          <span>Total Photos</span>
        </div>
        <div className="adm-card k-y">
          <b>{photos.filter(p => p.featured).length}</b>
          <span>⭐ Highlights</span>
        </div>
        <div className="adm-card k-g">
          <b>{categories.length}</b>
          <span>Categories</span>
        </div>
        <div className="adm-card">
          <b>{categories.find(c => c.slug === 'diwali-celebration') ? photos.filter(p => p.categorySlug === 'diwali-celebration').length : 0}</b>
          <span>Diwali Photos</span>
        </div>
      </section>

      {/* Section: Manage Categories (Collapsible / Spacious) */}
      {showCatSection && (
        <section className="adm-card adm-gal-cat-card">
          <div className="adm-gal-cat-head">
            <h2>Categories</h2>
            <p className="adm-sub">Create and manage event categories shown on the website filters.</p>
          </div>

          <div className="adm-gal-cat-chips">
            {categories.map(c => {
              const count = photos.filter(p => p.categorySlug === c.slug).length
              return (
                <div key={c.slug} className="adm-gal-chip">
                  <span className="adm-gal-chip-icon">{c.icon || '📁'}</span>
                  <span className="adm-gal-chip-title">{c.name}</span>
                  <span className="adm-gal-chip-count">{count}</span>
                  {categories.length > 1 && (
                    <button
                      type="button"
                      className="adm-gal-chip-del"
                      onClick={() => handleDeleteCategory(c._id, c.name)}
                      title="Delete category"
                    >
                      &times;
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <form onSubmit={handleAddCategory} className="adm-gal-cat-form">
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Add new category:</span>
            <input
              type="text"
              placeholder="e.g. Birthday Celebration 2025"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{ flex: '1 1 240px' }}
              required
            />
            <input
              type="text"
              placeholder="Icon (e.g. 🎂)"
              value={newCatIcon}
              onChange={e => setNewCatIcon(e.target.value)}
              style={{ width: '80px', textAlign: 'center' }}
            />
            <button type="submit" className="adm-btn" disabled={addingCat}>
              Add Category
            </button>
          </form>
        </section>
      )}

      {/* Section: Upload Photo (Spacious multi-column card) */}
      {showUpload && (
        <section className="adm-card adm-gal-upload-card">
          <div className="adm-gal-upload-header">
            <div>
              <h2>Add New Photo</h2>
              <p className="adm-sub">Upload an image file or paste an image URL to add to the gallery.</p>
            </div>
            <div className="adm-gal-mode-toggle">
              <button
                type="button"
                className={`adm-steps-btn ${mode === 'file' ? 'on' : ''}`}
                onClick={() => setMode('file')}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                className={`adm-steps-btn ${mode === 'url' ? 'on' : ''}`}
                onClick={() => setMode('url')}
              >
                🔗 Image URL
              </button>
            </div>
          </div>

          <form onSubmit={handleAddPhoto} className="adm-form adm-gal-upload-form">
            <label className="adm-wide">
              Photo Title *
              <input
                type="text"
                placeholder="e.g. Diwali Pooja & Sweets Celebration"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </label>

            <label>
              Category *
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                {categories.map(c => (
                  <option key={c.slug} value={c.name}>
                    {c.icon || '📷'} {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Featured Highlight
              <span className="adm-gal-check-wrap">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                />
                Show with ⭐ Highlight badge on website
              </span>
            </label>

            <label className="adm-wide">
              Caption / Short Note (optional)
              <textarea
                rows={2}
                placeholder="A warm memory or context for this photo..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </label>

            {mode === 'file' ? (
              <div className="adm-wide adm-gal-dropzone">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>
                  Select Image File (JPG, PNG, WebP up to 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {filePreview && (
                  <div className="adm-gal-preview-box">
                    <img src={filePreview} alt="Preview" />
                    <span>Ready to upload: {file?.name} ({(file?.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            ) : (
              <label className="adm-wide">
                Image Direct Link
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  required
                />
              </label>
            )}

            <div className="adm-wide adm-gal-form-actions">
              <button type="submit" className="adm-btn adm-btn-y" disabled={uploading}>
                {uploading ? 'Uploading & saving...' : '✓ Save Photo to Gallery'}
              </button>
              <button
                type="button"
                className="adm-link"
                onClick={() => setShowUpload(false)}
                style={{ marginLeft: '16px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main Section: Photos Filter & Grid */}
      <section className="adm-card adm-gal-photos-card">
        {/* Category Pills Filter Bar */}
        <div className="adm-gal-toolbar">
          <div className="adm-gal-pills">
            <button
              type="button"
              className={`adm-gal-filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Photos ({photos.length})
            </button>
            <button
              type="button"
              className={`adm-gal-filter-pill ${activeFilter === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveFilter('featured')}
            >
              ⭐ Highlights ({photos.filter(p => p.featured).length})
            </button>
            {categories.map(c => {
              const count = photos.filter(p => p.categorySlug === c.slug).length
              return (
                <button
                  key={c.slug}
                  type="button"
                  className={`adm-gal-filter-pill ${activeFilter === c.slug ? 'active' : ''}`}
                  onClick={() => setActiveFilter(c.slug)}
                >
                  {c.icon} {c.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <p className="adm-wait" style={{ padding: '60px 0', textAlign: 'center' }}>
            Loading photos...
          </p>
        ) : filteredPhotos.length === 0 ? (
          <div className="adm-empty" style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', marginBottom: '12px' }}>No photos found in this category.</p>
            <button
              type="button"
              className="adm-btn adm-btn-y"
              onClick={() => setShowUpload(true)}
            >
              + Add a photo
            </button>
          </div>
        ) : (
          <div className="adm-gal-grid">
            {filteredPhotos.map(photo => (
              <article key={photo._id} className="adm-gal-item">
                <div className="adm-gal-thumb-wrap">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="adm-gal-thumb"
                    loading="lazy"
                  />
                  {photo.featured && (
                    <span className="adm-gal-star-tag" title="Featured Highlight">
                      ⭐ Highlight
                    </span>
                  )}
                  <span className="adm-gal-cat-tag">{photo.category}</span>
                </div>

                <div className="adm-gal-meta">
                  <h3 className="adm-gal-title">{photo.title}</h3>
                  {photo.caption && <p className="adm-gal-caption">{photo.caption}</p>}

                  <div className="adm-gal-footer">
                    <span className="adm-gal-date">{ago(photo.createdAt)}</span>
                    <div className="adm-gal-acts">
                      <button
                        type="button"
                        className={`adm-gal-action-btn ${photo.featured ? 'is-featured' : ''}`}
                        onClick={() => handleToggleFeatured(photo)}
                        title={photo.featured ? 'Remove highlight' : 'Mark as highlight'}
                      >
                        {photo.featured ? '★ Featured' : '☆ Feature'}
                      </button>
                      <button
                        type="button"
                        className="adm-gal-action-btn del"
                        onClick={() => handleDeletePhoto(photo._id, photo.title)}
                        title="Delete photo"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
