'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Thumbs, Zoom, Navigation as SwiperNavigation } from 'swiper/modules'
import Lightbox from 'yet-another-react-lightbox'
import type { Slide } from 'yet-another-react-lightbox'
import ZoomPlugin from 'yet-another-react-lightbox/plugins/zoom'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import type { ThemeConfig } from '@/themes/config'
import { useAnalytics } from '@/hooks/useAnalytics'

import 'swiper/css'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'
import 'swiper/css/navigation'
import 'yet-another-react-lightbox/styles.css'

const PLACEHOLDER_PHOTOS = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
]

interface PhotoGalleryProps {
  photos?: string[]
  theme: ThemeConfig
}

export default function PhotoGallery({ photos = PLACEHOLDER_PHOTOS, theme }: PhotoGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider')
  const mainSwiperRef = useRef<SwiperType | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { trackViewed, track } = useAnalytics('photo_gallery')

  // Track section viewed
  useEffect(() => { trackViewed(inView) }, [inView, trackViewed])

  const lightboxSlides: Slide[] = photos.map((src) => ({ src }))

  const handleThumbnailClick = useCallback((index: number) => {
    mainSwiperRef.current?.slideTo(index)
  }, [])

  const handleGridImageClick = useCallback((index: number) => {
    setViewMode('slider')
    setActiveIndex(index)
    track('gallery_grid_image_clicked', { index })
    setTimeout(() => {
      mainSwiperRef.current?.slideTo(index)
    }, 50)
  }, [track])

  if (!photos || photos.length === 0) return null

  return (
    <section ref={ref} className={`py-20 px-6 ${theme.bgSection2}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className={`${theme.fontLabel} text-xs tracking-[0.4em] ${theme.textAccent} mb-2`}>
            OUR MOMENTS
          </p>
          <h2 className={`${theme.fontHeading} text-4xl ${theme.textDark} mb-6`}>
            Gallery
          </h2>

          {/* View toggle */}
          <div className="inline-flex items-center rounded-full p-1" style={{ backgroundColor: `${theme.primaryHex}10` }}>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${theme.fontLabel}`}
              style={{
                backgroundColor: viewMode === 'slider' ? theme.primaryHex : 'transparent',
                color: viewMode === 'slider' ? 'white' : theme.primaryHex,
              }}
            >
              Slider
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${theme.fontLabel}`}
              style={{
                backgroundColor: viewMode === 'grid' ? theme.primaryHex : 'transparent',
                color: viewMode === 'grid' ? 'white' : theme.primaryHex,
              }}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Slider View */}
        <div
          className={`transition-all duration-700 ${
            viewMode === 'slider' ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div
            className={`transition-all duration-1000 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Main Image Slider */}
            <div className="max-w-4xl mx-auto mb-4">
              <Swiper
                onSwiper={(swiper) => { mainSwiperRef.current = swiper }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                modules={[Thumbs, Zoom, SwiperNavigation]}
                thumbs={{ swiper: thumbsSwiper }}
                spaceBetween={10}
                slidesPerView={1}
                zoom
                navigation={{
                  prevEl: '.gallery-main-prev',
                  nextEl: '.gallery-main-next',
                }}
                className="gallery-main-swiper rounded-2xl overflow-hidden shadow-xl"
                style={{ border: `1px solid ${theme.primaryHex}15` }}
              >
                {photos.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="swiper-zoom-container">
                      <div className="relative w-full aspect-[4/3] bg-gray-100">
                        <Image
                          src={src}
                          alt={`Gallery photo ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 800px"
                          loading="lazy"
                        />
                        {/* Fullscreen button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setLightboxOpen(true)
                          }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
                          aria-label="View fullscreen"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Main nav arrows */}
              <div className="flex items-center justify-between mt-3 px-2">
                <button
                  className="gallery-main-prev w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    border: `1.5px solid ${theme.primaryHex}30`,
                    color: theme.primaryHex,
                  }}
                  aria-label="Previous photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <p className={`${theme.fontBody} text-xs ${theme.textMuted}`}>
                  {activeIndex + 1} / {photos.length}
                </p>

                <button
                  className="gallery-main-next w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    border: `1.5px solid ${theme.primaryHex}30`,
                    color: theme.primaryHex,
                  }}
                  aria-label="Next photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="max-w-4xl mx-auto mt-4">
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
                spaceBetween={8}
                slidesPerView={4}
                watchSlidesProgress
                breakpoints={{
                  480: { slidesPerView: 5 },
                  640: { slidesPerView: 6 },
                  768: { slidesPerView: 7 },
                  1024: { slidesPerView: 8 },
                }}
                className="gallery-thumbs-swiper"
              >
                {photos.map((src, i) => (
                  <SwiperSlide key={i}>
                    <button
                      onClick={() => handleThumbnailClick(i)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 w-full ${
                        activeIndex === i ? 'ring-2 scale-105 shadow-md' : 'opacity-50 hover:opacity-80'
                      }`}
                      style={{
                        boxShadow: activeIndex === i ? `0 0 0 2px ${theme.primaryHex}` : undefined,
                      }}
                      aria-label={`View photo ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        loading="lazy"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        {/* Grid View */}
        <div
          className={`transition-all duration-700 ${
            viewMode === 'grid' ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div
            className={`grid grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-1000 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {photos.map((src, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIndex(i)
                  setLightboxOpen(true)
                }}
                className="relative aspect-square overflow-hidden rounded-xl group"
                aria-label={`View photo ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Gallery photo ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                    style={{ backgroundColor: `${theme.primaryHex}80` }}
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox for fullscreen view */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={activeIndex}
        slides={lightboxSlides}
        plugins={[ZoomPlugin]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
          },
        }}
      />

      {/* Custom Swiper styles */}
      <style jsx global>{`
        .gallery-thumbs-swiper {
          padding: 4px 0;
        }
        .gallery-thumbs-swiper .swiper-slide {
          opacity: 0.5;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .gallery-thumbs-swiper .swiper-slide-thumb-active {
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
