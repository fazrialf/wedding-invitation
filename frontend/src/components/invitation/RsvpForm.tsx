'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import type { ThemeConfig } from '@/themes/config'

/* ─── SVG Icons ──────────────────────────────────────────────── */
const EnvelopeIcon = ({ color }: { color: string }) => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4L12 13 2 4" />
  </svg>
)

const CheckCircleIcon = ({ color }: { color: string }) => (
  <svg
    className="w-16 h-16"
    viewBox="0 0 64 64"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="32" cy="32" r="28" className="check-circle-path" />
    <path d="M20 33 L28 41 L44 25" className="check-mark-path" />
  </svg>
)

const SendIcon = ({ color }: { color: string }) => (
  <svg
    className="w-4 h-4 inline-block ml-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const SpinnerIcon = () => (
  <svg className="animate-spin w-4 h-4 inline-block ml-2" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

/* ─── Corner Ornament Component ──────────────────────────────── */
const CornerOrnament = ({
  position,
  color,
  char,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color: string
  char: string
}) => {
  const posClasses = {
    'top-left': '-top-3 -left-3',
    'top-right': '-top-3 -right-3',
    'bottom-left': '-bottom-3 -left-3',
    'bottom-right': '-bottom-3 -right-3',
  }
  return (
    <span
      className={`absolute ${posClasses[position]} text-lg z-10 select-none pointer-events-none`}
      style={{ color }}
    >
      {char}
    </span>
  )
}

/* ─── Props Interface ────────────────────────────────────────── */
interface RsvpFormProps {
  invitationId: string
  guestName?: string
  theme: ThemeConfig
}

/* ─── Component ──────────────────────────────────────────────── */
export default function RsvpForm({ invitationId, guestName, theme }: RsvpFormProps) {
  const [form, setForm] = useState({
    guest_name: guestName || '',
    attendance: 'hadir' as 'hadir' | 'tidak',
    guest_count: 1,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  /* Scroll-triggered reveal */
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/rsvp', {
        invitation_id: invitationId,
        ...form,
      })
      setSubmitted(true)
      /* Small delay so DOM mounts before triggering animation */
      requestAnimationFrame(() => {
        setTimeout(() => setShowSuccess(true), 50)
      })
    } catch {
      toast.error('Failed to submit RSVP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* Dynamic inline style helpers */
  const glowFocus = {
    '--tw-ring-color': theme.primaryHex,
    '--tw-ring-shadow': `0 0 0 3px ${theme.primaryHex}33`,
  } as React.CSSProperties

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 px-6 ${theme.bgSection1} bg-texture-paper overflow-hidden`}
      id="rsvp"
    >
      <Toaster position="top-center" />

      {/* Extra style overrides for animations & focus glow */}
      <style>{`
        /* ── Animated focus glow for inputs ── */
        .rsvp-input {
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }
        .rsvp-input:focus {
          border-color: ${theme.primaryHex};
          box-shadow: 0 0 0 3px ${theme.primaryHex}22, 0 0 16px ${theme.primaryHex}15;
          background-color: ${theme.primaryLight}08;
        }

        /* ── Success SVG drawing animations ── */
        @keyframes drawCircle {
          from { stroke-dashoffset: 176; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 48; }
          to   { stroke-dashoffset: 0; }
        }
        .check-circle-path {
          stroke-dasharray: 176;
          stroke-dashoffset: 176;
          animation: drawCircle 0.6s ease-out 0.2s forwards;
        }
        .check-mark-path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.4s ease-out 0.7s forwards;
        }

        /* ── Success container fade-in-up ── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .success-enter {
          animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── Staggered fade-in for form children ── */
        @keyframes staggerIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-stagger > * {
          opacity: 0;
          animation: staggerIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .form-stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .form-stagger > *:nth-child(2) { animation-delay: 0.12s; }
        .form-stagger > *:nth-child(3) { animation-delay: 0.19s; }
        .form-stagger > *:nth-child(4) { animation-delay: 0.26s; }
        .form-stagger > *:nth-child(5) { animation-delay: 0.33s; }
        .form-stagger > *:nth-child(6) { animation-delay: 0.40s; }

        /* ── Submit button shimmer ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .btn-shimmer {
          background-size: 200% 100%;
        }
        .btn-shimmer:hover {
          animation: shimmer 1.5s ease-in-out infinite;
        }

        /* ── Decorative underline expand ── */
        @keyframes expandLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .decor-underline {
          animation: expandLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: center;
        }

        /* ── Heartbeat pulse for the ornamental icon ── */
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.15); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.4s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`max-w-lg mx-auto text-center transition-all duration-700 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* ── Decorative Envelope Icon ── */}
        <div className="flex justify-center mb-4">
          <EnvelopeIcon color={theme.primaryHex} />
        </div>

        {/* ── Section Header with Decorative Underline ── */}
        <p
          className={`${theme.fontLabel} text-xs tracking-[0.4em] ${theme.textAccent} mb-2`}
        >
          KINDLY REPLY
        </p>
        <h2 className={`${theme.fontHeading} text-4xl ${theme.textDark} mb-2`}>RSVP</h2>

        {/* Decorative underline */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className="decor-underline block h-px w-12"
            style={{ backgroundColor: theme.primaryHex }}
          />
          <span className="text-sm" style={{ color: theme.primaryHex }}>
            {theme.ornamentChar}
          </span>
          <span
            className="decor-underline block h-px w-12"
            style={{ backgroundColor: theme.primaryHex }}
          />
        </div>

        {submitted ? (
          /* ── Success State ── */
          <div
            className={`success-enter relative border ${theme.borderAccent} p-10 bg-texture-paper`}
            style={{
              boxShadow: `0 4px 24px ${theme.shadowColor}`,
            }}
          >
            {/* Corner ornaments on success card */}
            <CornerOrnament position="top-left" color={theme.primaryHex} char={theme.ornamentChar} />
            <CornerOrnament position="top-right" color={theme.primaryHex} char={theme.ornamentChar} />
            <CornerOrnament position="bottom-left" color={theme.primaryHex} char={theme.ornamentChar} />
            <CornerOrnament position="bottom-right" color={theme.primaryHex} char={theme.ornamentChar} />

            <div
              className={`flex justify-center mb-5 transition-all duration-500 ${
                showSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <CheckCircleIcon color={theme.primaryHex} />
            </div>
            <p className={`${theme.fontHeading} text-2xl ${theme.textDark} mb-2`}>Thank You!</p>
            <p className={`${theme.fontBody} text-sm ${theme.textMuted}`}>
              {form.attendance === 'hadir'
                ? "We can't wait to celebrate with you!"
                : "We'll miss you, but thank you for letting us know."}
            </p>
            <div className="mt-4 text-2xl animate-heartbeat" style={{ color: theme.primaryHex }}>
              {theme.ornamentChar}
            </div>
          </div>
        ) : (
          /* ── Form State ── */
          <div className="relative">
            {/* Decorative border frame with corner ornaments */}
            <div
              className={`relative border ${theme.borderAccent} p-8 sm:p-10`}
              style={{
                boxShadow: `0 4px 24px ${theme.shadowColor}`,
              }}
            >
              <CornerOrnament position="top-left" color={theme.primaryHex} char={theme.ornamentChar} />
              <CornerOrnament position="top-right" color={theme.primaryHex} char={theme.ornamentChar} />
              <CornerOrnament position="bottom-left" color={theme.primaryHex} char={theme.ornamentChar} />
              <CornerOrnament position="bottom-right" color={theme.primaryHex} char={theme.ornamentChar} />

              <form onSubmit={handleSubmit} className="form-stagger space-y-6 text-left">
                {/* ── Guest Name ── */}
                <div>
                  <label
                    className={`${theme.fontLabel} text-xs tracking-widest ${theme.textMuted} block mb-2`}
                  >
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={form.guest_name}
                    onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))}
                    className={`rsvp-input w-full border ${theme.borderAccent} px-4 py-3 ${theme.fontBody} text-sm ${theme.bgPage} ${theme.textDark} focus:outline-none rounded-sm`}
                    style={glowFocus}
                    placeholder="Your full name"
                  />
                </div>

                {/* ── Attendance Toggle ── */}
                <div>
                  <label
                    className={`${theme.fontLabel} text-xs tracking-widest ${theme.textMuted} block mb-2`}
                  >
                    ATTENDANCE
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'hadir', label: 'Attending', icon: '✓' },
                      { val: 'tidak', label: 'Not Attending', icon: '✗' },
                    ].map(({ val, label, icon }) => {
                      const active = form.attendance === val
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, attendance: val as any }))}
                          className={`
                            relative py-3.5 border ${theme.fontLabel} text-xs tracking-widest rounded-sm
                            transition-all duration-300 ease-out
                            ${active
                              ? 'text-white border-transparent shadow-lg scale-[1.02]'
                              : `${theme.borderAccent} ${theme.textMuted} hover:border-opacity-60`
                            }
                          `}
                          style={
                            active
                              ? {
                                  backgroundColor: theme.primaryHex,
                                  boxShadow: `0 4px 16px ${theme.shadowColor}`,
                                }
                              : {}
                          }
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span
                              className={`
                                inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px]
                                transition-all duration-300
                                ${active
                                  ? 'bg-white/20 text-white'
                                  : `border ${theme.borderAccent} ${theme.textMuted}`
                                }
                              `}
                            >
                              {icon}
                            </span>
                            {label}
                          </span>
                          {/* Animated selection indicator */}
                          {active && (
                            <span
                              className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[8px] text-white"
                              style={{ backgroundColor: theme.primaryDark }}
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── Guest Count (conditional) ── */}
                {form.attendance === 'hadir' && (
                  <div className="animate-[staggerIn_0.3s_ease-out_forwards]">
                    <label
                      className={`${theme.fontLabel} text-xs tracking-widest ${theme.textMuted} block mb-2`}
                    >
                      NUMBER OF GUESTS
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={form.guest_count}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, guest_count: parseInt(e.target.value) || 1 }))
                      }
                      className={`rsvp-input w-full border ${theme.borderAccent} px-4 py-3 ${theme.fontBody} text-sm ${theme.bgPage} ${theme.textDark} focus:outline-none rounded-sm`}
                      style={glowFocus}
                    />
                  </div>
                )}

                {/* ── Message ── */}
                <div>
                  <label
                    className={`${theme.fontLabel} text-xs tracking-widest ${theme.textMuted} block mb-2`}
                  >
                    MESSAGE (OPTIONAL)
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className={`rsvp-input w-full border ${theme.borderAccent} px-4 py-3 ${theme.fontBody} text-sm ${theme.bgPage} ${theme.textDark} focus:outline-none resize-none rounded-sm`}
                    style={glowFocus}
                    placeholder="Leave a message for the couple…"
                  />
                </div>

                {/* ── Submit Button ── */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    btn-shimmer w-full py-4 ${theme.fontLabel} text-xs tracking-widest text-white
                    disabled:opacity-60 rounded-sm relative overflow-hidden
                    transition-all duration-300
                    ${loading ? 'cursor-wait' : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}
                  `}
                  style={{
                    backgroundColor: theme.primaryHex,
                    backgroundImage: `linear-gradient(110deg, ${theme.primaryHex} 0%, ${theme.primaryDark} 40%, ${theme.gradientTo} 50%, ${theme.primaryDark} 60%, ${theme.primaryHex} 100%)`,
                    boxShadow: `0 2px 8px ${theme.shadowColor}`,
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        SENDING
                        <SpinnerIcon />
                      </>
                    ) : (
                      <>
                        SEND RSVP
                        <SendIcon color="currentColor" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Bottom Ornament ── */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className={`${theme.textMuted} text-xs tracking-[0.3em]`}>
            {theme.ornamentChar} {theme.ornamentChar} {theme.ornamentChar}
          </span>
        </div>
      </div>
    </section>
  )
}
