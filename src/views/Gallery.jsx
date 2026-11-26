'use client'
import { useEffect, useState, useCallback } from 'react'
import { Link } from '../router.jsx'
import { useLive } from '../Brand.jsx'

// Fallback seed photos in case API is loading or during hydration
const FALLBACK_CATEGORIES = [
  { name: 'Life at Appzeto', slug: 'life-at-appzeto', icon: '🚀' },
  { name: 'Diwali Celebration', slug: 'diwali-celebration', icon: '🪔' },
  { name: 'Birthday Celebration', slug: 'birthday-celebration', icon: '🎂' },
  { name: 'Milestones & Events', slug: 'milestones-events', icon: '🏆' },
]

const FALLBACK_PHOTOS = [
  {
    _id: 'fb-1',
    title: 'Diwali Lights & Rangoli',
    caption: 'Traditional celebrations and office illumination at Appzeto HQ',
    category: 'Diwali Celebration',
    categorySlug: 'diwali-celebration',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    _id: 'fb-2',
    title: 'Team Diwali Pooja & Festivities',
    caption: 'Celebrating light and togetherness with the whole Appzeto team',
    category: 'Diwali Celebration',
    categorySlug: 'diwali-celebration',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
  {
    _id: 'fb-3',
    title: 'Engineering Jam Session',
    caption: 'Brainstorming architecture and whiteboard wireframing in the lounge',
    category: 'Life at Appzeto',
    categorySlug: 'life-at-appzeto',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    _id: 'fb-4',
    title: 'Coffee, Code & Smiles',
    caption: 'Everyday high-octane development from our Indore workspace',
    category: 'Life at Appzeto',
    categorySlug: 'life-at-appzeto',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
  {
    _id: 'fb-5',
    title: 'Birthday Bash & Cake Cutting',
    caption: 'Sweet moments, surprise birthday cakes, and joyful cheers',
    category: 'Birthday Celebration',
    categorySlug: 'birthday-celebration',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    _id: 'fb-6',
    title: 'Midnight Release Celebration',
    caption: 'Popping confetti when a major client app hit 100k+ downloads',
    category: 'Milestones & Events',
    categorySlug: 'milestones-events',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  },
]

export function Gallery() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [photos, setPhotos] = useState(FALLBACK_PHOTOS)
  const [activeFilter, setActiveFilter] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const ref = useLive()

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          if (data.categories?.length > 0) setCategories(data.categories)
          if (data.photos?.length > 0) setPhotos(data.photos)
        }
      })
      .catch(() => {})
  }, [])

  const filteredPhotos = photos.filter(p => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'featured') return p.featured
    return p.categorySlug === activeFilter
  })

  // Lightbox handlers
  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const showNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
    }
  }, [lightboxIndex, filteredPhotos.length])

  const showPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length)
    }
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
          <div className="pub-gal-head">
            <p className="nw-eyebrow">Moments &amp; Culture</p>
            <h1 className="h-xl pub-gal-title">Life at Appzeto</h1>
            <p className="lead pub-gal-lead">
              Behind the code and product launches: the birthdays, Diwali celebrations, hackathons, and vibrant everyday moments of our engineering team in Indore.
            </p>
          </div>

          {/* Highlights ribbon */}
          <div className="pub-gal-badges">
            <span className="pub-gal-badge">🪔 Diwali Celebrations</span>
            <span className="pub-gal-badge">🎂 Birthday Bashes</span>
            <span className="pub-gal-badge">🚀 Sprint Milestones</span>
            <span className="pub-gal-badge">☕ Indore HQ Energy</span>
          </div>

          {/* Category Filter Pills */}
          <div className="pub-gal-filters" role="tablist" aria-label="Gallery filters">
            <button
              type="button"
              className={`pub-gal-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Moments ({photos.length})
            </button>
            <button
              type="button"
              className={`pub-gal-pill ${activeFilter === 'featured' ? 'active' : ''}`}
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
                  className={`pub-gal-pill ${activeFilter === c.slug ? 'active' : ''}`}
                  onClick={() => setActiveFilter(c.slug)}
                >
                  {c.icon} {c.name} {count > 0 && `(${count})`}
                </button>
              )
            })}
          </div>

          {/* Photos Grid */}
          <div className="pub-gal-grid">
            {filteredPhotos.map((photo, idx) => (
              <article
                key={photo._id || idx}
                className="pub-gal-card"
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
                aria-label={`View photo: ${photo.title}`}
              >
                <div className="pub-gal-img-wrap">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="pub-gal-img"
                    loading="lazy"
                  />
                  <div className="pub-gal-overlay">
                    <span className="pub-gal-zoom-icon">🔍 View photo</span>
                  </div>
                  {photo.featured && (
                    <span className="pub-gal-star-badge" title="Featured Highlight">
                      ⭐ Highlight
                    </span>
                  )}
                  <span className="pub-gal-cat-badge">{photo.category}</span>
                </div>
                <div className="pub-gal-body">
                  <h2 className="pub-gal-card-title">{photo.title}</h2>
                  {photo.caption && <p className="pub-gal-card-caption">{photo.caption}</p>}
                </div>
              </article>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="pub-gal-empty">
              <p>No photos in this category yet. Check back soon!</p>
            </div>
          )}
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

      {/* CTA Section */}
      <section className="sec pub-gal-cta">
        <div className="wrap">
          <div className="work-next">
            <div>
              <p className="nw-eyebrow">Work With Us</p>
              <h2 className="h-xl">Want to build something with our team?</h2>
              <p className="lead">
                From napkin sketches to 100k+ download applications, we design, build, and support high-impact software from our office in Indore.
              </p>
              <div className="row" style={{ marginTop: '24px' }}>
                <Link to="/contact" className="btn btn-y">Tell us your idea</Link>
                <Link to="/apply-now" className="btn btn-k">Join our team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
