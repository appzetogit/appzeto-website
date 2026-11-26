'use client'
import { useState, useRef, useEffect } from 'react'
import { topApps } from './data.js'
import { reduced } from './Brand.jsx'

const GooglePlayIcon = () => (
  <svg viewBox="0 0 512 512" width="16" height="16" aria-hidden="true" className="gp-ico">
    <path fill="#4285F4" d="M32.5 12.8C24.4 21.4 20 34.3 20 50.4v411.2c0 16.1 4.4 29 12.5 37.6l2.1 1.9L260 275.7v-5.4L34.6 10.9l-2.1 1.9z" />
    <path fill="#FBBC04" d="M340 355.7l-80-80v-5.4l80-80 1.9 1.1 94.6 53.7c27 15.3 27 40.3 0 55.7L341.9 354.6l-1.9 1.1z" />
    <path fill="#EA4335" d="M341.9 354.6L260 272.7 32.5 500.2c8.9 9.5 23.5 10.7 40 1.3l269.4-146.9" />
    <path fill="#34A853" d="M341.9 157.4L72.5 10.5C56 1.1 41.4 2.3 32.5 11.8L260 239.3l81.9-81.9z" />
  </svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true" className="dl-ico">
    <path d="M10 2v10m0 0l-3.5-3.5M10 12l3.5-3.5M3 15v1a2 2 0 002 2h10a2 2 0 002-2v-1" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function RollingApps() {
  const [paused, setPaused] = useState(false)
  const isReduced = useRef(false)

  useEffect(() => {
    isReduced.current = reduced()
  }, [])

  // Duplicate items 3 times for a completely seamless, continuous loop
  const stream = [...topApps, ...topApps, ...topApps]

  return (
    <section className="rolling-slope-sec" aria-label="Applications with the highest downloads developed by Appzeto">
      <div className="wrap rolling-head">
        <div className="rolling-badge">
          <span className="pulse-dot" aria-hidden="true" />
          <span>Real-World Proof &bull; Live on Google Play</span>
        </div>
        <h2 className="h-xl rolling-title">
          Applications with the highest downloads <span className="highlight-tag">developed by Appzeto</span>
        </h2>
        <p className="lead rolling-sub">
          Over <strong>200,000+ total downloads</strong> across client platforms. From fast-growing OTT streaming to multi-vendor delivery and ride-hailing networks.
        </p>
      </div>

      {/* Sloped rolling runway */}
      <div 
        className={`rolling-slope-wrap ${paused ? 'is-paused' : ''}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="rolling-incline-stage">
          <div className="rolling-track" role="list">
            {stream.map((app, idx) => (
              <a
                key={`${app.id}-${idx}`}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="roll-card"
                role="listitem"
                aria-label={`${app.name} on Google Play - ${app.downloads} downloads, ${app.category}`}
              >
                {/* Floating upright card pill with stats */}
                <div className="roll-card-pill">
                  <div className="roll-card-top">
                    <span className="roll-category">{app.category}</span>
                    <span className="roll-dl-chip">
                      <DownloadIcon />
                      {app.downloads}
                    </span>
                  </div>
                  <div className="roll-card-body">
                    <h3 className="roll-name">{app.name}</h3>
                    <p className="roll-tagline">{app.tagline}</p>
                  </div>
                  <div className="roll-card-foot">
                    <span className="roll-store-link">
                      <GooglePlayIcon />
                      <span>Play Store</span>
                    </span>
                    <span className="roll-arrow" aria-hidden="true">&rarr;</span>
                  </div>
                </div>

                {/* Stalk connecting card to the rolling wheel */}
                <div className="roll-stalk" aria-hidden="true">
                  <span className="stalk-line" />
                  <span className="stalk-joint" />
                </div>

                {/* Rolling physical wheel that rotates as it moves downhill */}
                <div className="roll-wheel-wrap" aria-hidden="true">
                  <div className="roll-wheel" style={{ '--app-color': app.color }}>
                    <div className="wheel-tread" />
                    <img
                      src={app.icon}
                      alt=""
                      className="wheel-img"
                      loading="lazy"
                      width="68"
                      height="68"
                    />
                    <div className="wheel-rim" />
                    <div className="wheel-center-cap" />
                  </div>
                  <div className="wheel-shadow" />
                </div>
              </a>
            ))}
          </div>

          {/* Road / ground track rail aligned with the steep */}
          <div className="rolling-road-rail" aria-hidden="true">
            <div className="rail-glow" />
            <div className="rail-line" />
            <div className="rail-dashes" />
          </div>
        </div>
      </div>
    </section>
  )
}
