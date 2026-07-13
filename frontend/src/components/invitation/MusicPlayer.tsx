'use client'

import { useState, useRef, useEffect } from 'react'
import type { ThemeConfig } from '@/themes/config'
import { useAnalytics } from '@/hooks/useAnalytics'

interface MusicPlayerProps {
  musicUrl: string
  theme:    ThemeConfig
}

export default function MusicPlayer({ musicUrl, theme }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [asked,   setAsked]   = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { track } = useAnalytics('music_player')

  useEffect(() => {
    if (!musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [musicUrl])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      track('music_paused')
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true)
        track('music_played')
      }).catch(() => {})
    }
    setAsked(true)
  }

  if (!musicUrl) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        style={{ backgroundColor: theme.primaryHex }}
      >
        {playing ? (
          /* Pause icon */
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          /* Play icon */
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      {/* Animated rings when playing */}
      {playing && (
        <>
          <span className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: theme.primaryHex }} />
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 animation-delay-300"
            style={{ backgroundColor: theme.primaryHex }} />
        </>
      )}
    </div>
  )
}
