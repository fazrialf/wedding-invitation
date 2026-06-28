'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import type { ThemeConfig } from '@/themes/config'

import 'swiper/css'
import 'swiper/css/effect-coverflow'

interface LoveStoryEvent {
  date: string
  title: string
  description: string
  photoUrl?: string
}

const DEFAULT_STORIES: LoveStoryEvent[] = [
  {
    date: 'March 2020',
    title: 'First Met',
    description: 'A chance encounter at a friend\'s gathering — little did we know it would change our lives forever.',
  },
  {
    date: 'June 2020',
    title: 'First Date',
    description: 'Coffee turned into hours of conversation. We knew there was something magical between us.',
  },
  {
    date: 'December 2020',
    title: 'First Trip Together',
    description: 'Exploring a new city hand in hand — every adventure is better with you by my side.',
  },
  {
    date: 'February 2021',
    title: 'Said "I Love You"',
    description: 'Under the stars, three little words that meant the whole world.',
  },
  {
    date: 'August 2022',
    title: 'Moving In Together',
    description: 'Building our little home, filling it with love, laughter, and a few too many houseplants.',
  },
  {
    date: 'December 2023',
    title: 'The Proposal',
    description: 'A dreamy evening, a sparkling ring, and the happiest "Yes!" ever spoken.',
  },
]

interface LoveStoryProps {
  theme: ThemeConfig
  stories?: LoveStoryEvent[]
}

/* ── Floating hearts / stars particle ─────────────────────────── */
function FloatingParticles({ theme }: { theme: ThemeConfig }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 5.7 + 3) % 100}%`,
        delay: `${(i * 0.8) % 6}s`,
        duration: `${6 + (i % 5) * 2}s`,
        size: 10 + (i % 4) * 4,
        isHeart: i % 3 === 0,
        opacity: 0.12 + (i % 5) * 0.04,
        drift: i % 2 === 0 ? 'float-up' : 'float-up-drift',
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute ${p.drift}`}
          style={{
            left: p.left,
            bottom: '-20px',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            color: theme.primaryHex,
          }}
        >
          {p.isHeart ? '♥' : theme.ornamentChar}
        </span>
      ))}
    </div>
  )
}

/* ── Animated photo placeholder with decorative frame ─────────── */
function PhotoPlaceholder({ theme }: { theme: ThemeConfig }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Decorative double-frame */}
      <div
        className="relative w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          border: `2px solid ${theme.primaryHex}30`,
          boxShadow: `inset 0 0 20px ${theme.primaryHex}08`,
        }}
      >
        {/* Inner ring */}
        <div
          className="absolute inset-2 rounded-full animate-spin-slow"
          style={{
            border: `1px dashed ${theme.primaryHex}30`,
          }}
        />
        {/* Center icon */}
        <div className="text-center">
          <div
            className="text-4xl mb-1 animate-pulse-gentle"
            style={{ color: theme.primaryHex, opacity: 0.35 }}
          >
            {theme.ornamentChar}
          </div>
          <p
            className={`${theme.fontLabel} text-[10px] tracking-[0.25em] opacity-40`}
            style={{ color: theme.primaryHex }}
          >
            PHOTO
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoveStory({ theme, stories = DEFAULT_STORIES }: LoveStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [cardsVisible, setCardsVisible] = useState(false)

  /* Staggered reveal after section enters viewport */
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setCardsVisible(true), 200)
      return () => clearTimeout(timer)
    }
  }, [inView])

  return (
    <section
      ref={ref}
      className={`relative py-24 px-6 overflow-hidden bg-pattern-floral ${theme.bgSection1}`}
    >
      {/* Floating background particles */}
      <FloatingParticles theme={theme} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* ── Section Header ─────────────────────────────── */}
        <div
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className={`${theme.fontLabel} text-xs tracking-[0.4em] ${theme.textAccent} mb-3`}>
            {theme.ornamentChar} OUR JOURNEY {theme.ornamentChar}
          </p>
          <h2 className={`${theme.fontHeading} text-4xl md:text-5xl ${theme.textDark} mb-3`}>
            Love Story
          </h2>
          {/* Decorative underline */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span
              className="block h-px w-12"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.primaryHex}60)` }}
            />
            <span
              className="block w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.primaryHex }}
            />
            <span
              className="block h-px w-12"
              style={{ background: `linear-gradient(90deg, ${theme.primaryHex}60, transparent)` }}
            />
          </div>
          <p className={`${theme.fontBody} text-sm ${theme.textMuted} mb-14 max-w-md mx-auto`}>
            Every love story is beautiful, but ours is our favorite.
          </p>
        </div>

        {/* ── Timeline connector dots ────────────────────── */}
        <div className="flex items-center justify-center gap-1.5 mb-10">
          {stories.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideTo(i)}
              className="group flex items-center"
              aria-label={`Go to story ${i + 1}`}
            >
              {/* Connector line */}
              {i > 0 && (
                <div
                  className="h-px w-4 sm:w-8 transition-all duration-500"
                  style={{
                    backgroundColor: i <= activeIndex ? theme.primaryHex : undefined,
                    opacity: i <= activeIndex ? 0.6 : 0.15,
                    boxShadow: i <= activeIndex ? `0 0 4px ${theme.primaryHex}30` : 'none',
                  }}
                />
              )}
              {/* Dot */}
              <div
                className="rounded-full transition-all duration-500 flex items-center justify-center"
                style={{
                  width: i === activeIndex ? 16 : 8,
                  height: i === activeIndex ? 16 : 8,
                  backgroundColor: i <= activeIndex ? theme.primaryHex : 'transparent',
                  border: `2px solid ${i <= activeIndex ? theme.primaryHex : `${theme.primaryHex}30`}`,
                  boxShadow: i === activeIndex ? `0 0 10px ${theme.primaryHex}40` : 'none',
                  opacity: i <= activeIndex ? 1 : 0.4,
                }}
              >
                {i === activeIndex && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* ── Swiper Carousel ────────────────────────────── */}
        <div
          className={`transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={1}
            spaceBetween={30}
            loop={stories.length > 2}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 1.2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 1.5,
                spaceBetween: 40,
              },
            }}
            className="love-story-swiper"
          >
            {stories.map((story, i) => (
              <SwiperSlide key={i}>
                <div
                  className={`love-story-card relative rounded-2xl overflow-hidden mx-auto max-w-sm group transition-all duration-700 ${
                    cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${i * 120}ms`,
                    border: `1.5px solid ${theme.primaryHex}25`,
                    boxShadow: `0 8px 30px ${theme.shadowColor ?? `${theme.primaryHex}15`}, 0 2px 8px ${theme.primaryHex}08`,
                  }}
                >
                  {/* Decorative corner accents */}
                  <div
                    className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl z-10 pointer-events-none"
                    style={{ borderColor: `${theme.primaryHex}40` }}
                  />
                  <div
                    className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-2xl z-10 pointer-events-none"
                    style={{ borderColor: `${theme.primaryHex}40` }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-2xl z-10 pointer-events-none"
                    style={{ borderColor: `${theme.primaryHex}40` }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl z-10 pointer-events-none"
                    style={{ borderColor: `${theme.primaryHex}40` }}
                  />

                  {/* Photo area */}
                  <div
                    className="relative w-full aspect-[4/3] overflow-hidden"
                    style={{ backgroundColor: `${theme.primaryHex}08` }}
                  >
                    {story.photoUrl ? (
                      <Image
                        src={story.photoUrl}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 90vw, 400px"
                        loading="lazy"
                      />
                    ) : (
                      <PhotoPlaceholder theme={theme} />
                    )}

                    {/* Gradient overlay at bottom of photo */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-16"
                      style={{
                        background: `linear-gradient(to top, ${theme.primaryHex}10, transparent)`,
                      }}
                    />

                    {/* Date badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-xs font-medium shadow-md backdrop-blur-sm"
                      style={{
                        backgroundColor: `${theme.primaryHex}dd`,
                        boxShadow: `0 2px 8px ${theme.primaryHex}40`,
                      }}
                    >
                      {story.date}
                    </div>

                    {/* Story number badge */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold backdrop-blur-sm"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        color: theme.primaryHex,
                        border: `1.5px solid ${theme.primaryHex}30`,
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-white relative">
                    {/* Small ornamental line above title */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="block h-px flex-1 max-w-[24px]"
                        style={{ backgroundColor: `${theme.primaryHex}40` }}
                      />
                      <span
                        className="text-[10px]"
                        style={{ color: theme.primaryHex }}
                      >
                        {theme.ornamentChar}
                      </span>
                      <span
                        className="block h-px flex-1 max-w-[24px]"
                        style={{ backgroundColor: `${theme.primaryHex}40` }}
                      />
                    </div>

                    <h3
                      className={`${theme.fontHeading} text-xl mb-2`}
                      style={{ color: theme.primaryHex }}
                    >
                      {story.title}
                    </h3>
                    <p className={`${theme.fontBody} text-sm ${theme.textMuted} leading-relaxed`}>
                      {story.description}
                    </p>
                  </div>

                  {/* Timeline connector nub at bottom center */}
                  <div className="flex justify-center -mb-1.5 relative z-20">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: theme.primaryHex,
                        boxShadow: `0 0 8px ${theme.primaryHex}50`,
                      }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ── Global styles ─────────────────────────────────── */}
      <style jsx global>{`
        /* Swiper layout */
        .love-story-swiper {
          padding: 20px 0 48px;
        }

        /* ── Elegant pagination bullets ── */
        .love-story-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${theme.primaryHex}20;
          border: 1.5px solid ${theme.primaryHex}30;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        .love-story-bullet:hover {
          background: ${theme.primaryHex}40;
          transform: scale(1.2);
        }
        .love-story-bullet-active {
          width: 28px;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(90deg, ${theme.primaryHex}, ${theme.primaryDark});
          border-color: ${theme.primaryHex};
          box-shadow: 0 0 10px ${theme.primaryHex}40, 0 0 4px ${theme.primaryHex}20;
        }

        /* ── Floating particle animations ── */
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 0;
          }
        }
        @keyframes float-up-drift {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-50vh) translateX(30px) rotate(90deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(-10px) rotate(200deg);
            opacity: 0;
          }
        }
        .float-up {
          animation: float-up linear infinite;
        }
        .float-up-drift {
          animation: float-up-drift linear infinite;
        }

        /* ── Photo placeholder animations ── */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        /* ── Card hover lift ── */
        .love-story-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px ${theme.primaryHex}20, 0 4px 12px ${theme.primaryHex}10 !important;
        }
      `}</style>
    </section>
  )
}
