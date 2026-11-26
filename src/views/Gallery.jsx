'use client'
import { useEffect, useState, useCallback } from 'react'
import { useLive } from '../Brand.jsx'

import './gallery.css'

// The gallery shows one album per category (cover photo, name, count). Opening an album shows
// every photo in it; a photo opens full size. ?album=<slug> keeps the open album in the address.
const albumFromUrl = () => typeof window === 'undefined' ? null : new URLSearchParams(location.search).get('album')

export function Gallery() {
  const [categories, setCategories] = useState([])
  const [photos, setPhotos] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [album, setAlbum] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const ref = useLive()

  useEffect(() => {
    setAlbum(albumFromUrl())
    const onPop = () => { setAlbum(albumFromUrl()); setLightboxIndex(null) }
    addEventListener('popstate', onPop)
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => { if (data.ok) { setCategories(data.categories || []); setPhotos(data.photos || []) } })
      .catch(() => {})
      .finally(() => setLoaded(true))
    return () => removeEventListener('popstate', onPop)
  }, [])

  const albums = categories
    .map(c => {
      const list = photos.filter(p => p.categorySlug === c.slug)
      return { ...c, list, cover: list.find(p => p.featured) || list[0] }
    })
    .filter(a => a.list.length)
  const current = albums.find(a => a.slug === album) || null
  const filteredPhotos = current ? current.list : []
  const backs = a => a.list.filter(p => p !== a.cover).slice(0, 2)

  const openAlbum = slug => {
    history.pushState(null, '', slug ? `?album=${slug}` : location.pathname)
    setAlbum(slug); setLightboxIndex(null)
    scrollTo({ top: 0, behavior: 'instant' })
  }

  // Lightbox handlers
  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const showNext = useCallback(() => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
  }, [lightboxIndex, filteredPhotos.length])

  const showPrev = useCallback(() => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)
  }, [lightboxIndex, filteredPhotos.length])

  useEffect(() => {
    const onKey = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') showNext()
      if (e.key === 'ArrowLeft') showPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, showNext, showPrev])

  return (
    <>
      <section className="sec pub-gallery-hero" ref={ref}>
        <div className="wrap">
          {!current ? <>
            <div className="pub-gal-head">
              <p className="nw-eyebrow">Moments &amp; Culture</p>
              <h1 className="h-xl pub-gal-title">Life at Appzeto</h1>
              <p className="lead pub-gal-lead">Festivals, birthdays and everyday moments from our team in Indore. Pick an album to see every photo.</p>
            </div>
            <div className="gal-albums">
              {albums.map(a => (
                <button key={a.slug} type="button" className="gal-album" onClick={() => openAlbum(a.slug)} aria-label={`Open album ${a.name}, ${a.list.length} photos`}>
                  <span className="gal-stack" aria-hidden="true">
                    {backs(a).map((p, i) => <img key={p._id || i} className={`gal-back b${2 - i}`} src={p.imageUrl} alt="" loading="lazy" />).reverse()}
                    <img className="gal-cover" src={a.cover.imageUrl} alt="" loading="lazy" />
                    <span className="gal-count">{a.list.length} {a.list.length === 1 ? 'photo' : 'photos'}</span>
                  </span>
                  <span className="gal-album-name"><span aria-hidden="true">{a.icon}</span> {a.name}</span>
                  {a.description && <span className="gal-album-desc">{a.description}</span>}
                </button>
              ))}
            </div>
            {loaded && !albums.length && <div className="pub-gal-empty"><p>Photos are on their way. Check back soon!</p></div>}
          </> : <>
            <div className="gal-open-head">
              <button type="button" className="gal-back-btn" onClick={() => openAlbum(null)}>&#8592; All albums</button>
              <h1 className="h-xl gal-open-title"><span aria-hidden="true">{current.icon}</span> {current.name}</h1>
              <p className="lead">{current.list.length} {current.list.length === 1 ? 'photo' : 'photos'}{current.description ? ` · ${current.description}` : ''}</p>
            </div>
            <div className="gal-photos">
              {filteredPhotos.map((photo, idx) => (
                <button key={photo._id || idx} type="button" className="gal-photo" onClick={() => openLightbox(idx)} aria-label={`View photo: ${photo.title}`}>
                  <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
                  <span className="gal-photo-cap">{photo.title}</span>
                </button>
              ))}
            </div>
          </>}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="pub-lb-overlay" onClick={closeLightbox} role="dialog" aria-modal="true">
          <div className="pub-lb-container" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="pub-lb-close"
              onClick={closeLightbox}
              aria-label="Close photo preview"
            >
              &times;
            </button>

            {filteredPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="pub-lb-nav prev"
                  onClick={showPrev}
                  aria-label="Previous photo"
                >
                  &#8592;
                </button>
                <button
                  type="button"
                  className="pub-lb-nav next"
                  onClick={showNext}
                  aria-label="Next photo"
                >
                  &#8594;
                </button>
              </>
            )}

            <div className="pub-lb-media-wrap">
              <img
                src={filteredPhotos[lightboxIndex].imageUrl}
                alt={filteredPhotos[lightboxIndex].title}
                className="pub-lb-img"
              />
            </div>

            <div className="pub-lb-caption-wrap">
              <div className="pub-lb-meta">
                <span className="pub-lb-cat">{filteredPhotos[lightboxIndex].category}</span>
                <span className="pub-lb-count">
                  {lightboxIndex + 1} of {filteredPhotos.length}
                </span>
              </div>
              <h3 className="pub-lb-title">{filteredPhotos[lightboxIndex].title}</h3>
              {filteredPhotos[lightboxIndex].caption && (
                <p className="pub-lb-text">{filteredPhotos[lightboxIndex].caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  )
}
