'use client'

import { useState, useCallback, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import toast from 'react-hot-toast'
import { useAnalytics } from '@/hooks/useAnalytics'
import type { ThemeConfig } from '@/themes/config'

/* ─── Types ────────────────────────────────────────────── */

export interface BankAccount {
  bankName:      string
  accountNumber: string
  accountName:   string
}

export interface DigitalWallet {
  name:   string
  number: string
  qrUrl?: string
}

interface GiftRegistryProps {
  theme:           ThemeConfig
  gifts?:          BankAccount[]
  digitalWallets?: DigitalWallet[]
}

/* ─── Demo placeholder data ────────────────────────────── */

const DEMO_BANKS: BankAccount[] = [
  { bankName: 'BCA', accountNumber: '0123456789', accountName: 'Bride & Groom' },
  { bankName: 'Mandiri', accountNumber: '9876543210', accountName: 'Bride & Groom' },
]

const DEMO_WALLETS: DigitalWallet[] = [
  { name: 'GoPay',     number: '0812-3456-7890', qrUrl: undefined },
  { name: 'OVO',       number: '0812-3456-7890', qrUrl: undefined },
  { name: 'DANA',      number: '0812-3456-7890', qrUrl: undefined },
  { name: 'ShopeePay', number: '0812-3456-7890', qrUrl: undefined },
]

/* ─── Wallet icon SVG components ───────────────────────── */

const WalletIcons: Record<string, React.FC<{ className?: string }>> = {
  GoPay: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  OVO: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  ),
  DANA: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1"/>
      <path d="M12 12h9m-4-4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ShopeePay: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
      <path d="M16 12a1 1 0 11-2 0 1 1 0 012 0z"/>
      <path d="M12 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
}

const DefaultWalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 10H18a2 2 0 000 4h4"/>
    <circle cx="18" cy="12" r="1"/>
  </svg>
)

/* ─── Copy button with animated checkmark ──────────────── */

function CopyButton({
  theme,
  text,
  label,
  onCopy,
  size = 'md',
}: {
  theme: ThemeConfig
  text: string
  label: string
  onCopy: (text: string, label: string) => Promise<void>
  size?: 'sm' | 'md'
}) {
  const [copied, setCopied] = useState(false)

  // Wire copy tracking via the onCopy prop — GiftRegistry passes handleCopy down
  const handleCopy = useCallback(async () => {
    await onCopy(text, label)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text, label, onCopy])

  const sizeClasses = size === 'sm'
    ? 'px-2 py-1 text-[9px] gap-1'
    : 'px-3 py-1.5 text-[10px] gap-1.5'

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center ${sizeClasses} rounded-md border ${theme.borderAccent}
        ${theme.textAccent} ${theme.fontLabel} tracking-[0.15em] uppercase
        transition-all duration-300 relative overflow-hidden
        ${copied
          ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
          : `hover:opacity-70 active:scale-95 hover:shadow-sm`
        }
      `}
      style={!copied ? { background: `${theme.primaryHex}08` } : undefined}
    >
      <span className={`transition-all duration-300 ${copied ? 'scale-0 w-0' : 'scale-100'}`}>
        <svg className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </span>
      <span className={`transition-all duration-300 ${copied ? 'scale-0 w-0' : 'scale-100'}`}>
        Copy
      </span>
      <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <svg className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        <span>Copied!</span>
      </span>
    </button>
  )
}

/* ─── Main component ───────────────────────────────────── */

export default function GiftRegistry({ theme, gifts, digitalWallets }: GiftRegistryProps) {
  const banks   = gifts && gifts.length > 0          ? gifts          : DEMO_BANKS
  const wallets = digitalWallets && digitalWallets.length > 0 ? digitalWallets : DEMO_WALLETS
  const isDemo  = (!gifts || gifts.length === 0) || (!digitalWallets || digitalWallets.length === 0)

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const { trackViewed, track } = useAnalytics('gift_registry')

  // Intersection observer for staggered animations
  const { ref: sectionRef, inView: sectionVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Track section viewed when it enters viewport
  useEffect(() => { trackViewed(sectionVisible) }, [sectionVisible, trackViewed])

  const { ref: banksRef, inView: banksVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: walletsRef, inView: walletsVisible } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const toggle = (idx: number) => setOpenIdx(prev => prev === idx ? null : idx)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      track('gift_account_copied', { label })
      toast.success(`${label} number copied`, {
        style: {
          background: theme.bgDark,
          color: '#ffffff',
          border: `1px solid ${theme.primaryHex}`,
        },
        iconTheme: { primary: theme.primaryHex, secondary: '#fff' },
      })
    } catch {
      toast.error('Failed to copy. Please copy manually.')
    }
  }

  return (
    <>
      {/* Inject keyframes for all animations */}
      <style jsx global>{`
        @keyframes gift-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer-x {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes accordion-open {
          0%   { opacity: 0; max-height: 0; }
          100% { opacity: 1; max-height: 320px; }
        }
        @keyframes fadeSlideUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideScale {
          0%   { opacity: 0; transform: translateY(16px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes drawUnderline {
          0%   { width: 0; }
          100% { width: 100%; }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.7; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-45deg); }
          60%  { transform: scale(1.2) rotate(0deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, ${theme.primaryHex}33, transparent);
          background-size: 200% 100%;
          animation: shimmer-x 3s linear infinite;
        }
        .accordion-content {
          animation: accordion-open 0.4s ease-out forwards;
          overflow: hidden;
        }
        .stagger-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeSlideUp 0.6s ease-out forwards;
        }
        .stagger-fade-scale {
          opacity: 0;
          transform: translateY(16px) scale(0.95);
          animation: fadeSlideScale 0.5s ease-out forwards;
        }
        .gift-card-gradient {
          background: linear-gradient(135deg, ${theme.gradientFrom} 0%, white 50%, ${theme.gradientTo} 100%);
        }
        .gift-card-gradient-dark {
          background: linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.bgSection2 === 'bg-stone-50' ? '#f5f5f4' : theme.gradientTo} 50%, ${theme.gradientTo} 100%);
        }
        .wallet-hover-glow {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wallet-hover-glow:hover {
          box-shadow: 0 8px 25px -5px ${theme.shadowColor}, 0 4px 10px -5px ${theme.shadowColor};
          transform: translateY(-4px);
        }
        .bank-gradient-card {
          background: linear-gradient(135deg,
            ${theme.primaryHex}06 0%,
            white 30%,
            ${theme.primaryHex}04 70%,
            ${theme.gradientFrom} 100%
          );
        }
        .decorative-frame {
          background-image:
            radial-gradient(circle at 20% 20%, ${theme.primaryHex}08 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${theme.primaryHex}08 0%, transparent 50%);
        }
        .pattern-overlay {
          background-image:
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              ${theme.primaryHex}${Math.round(theme.patternOpacity * 255).toString(16).padStart(2, '0')} 20px,
              ${theme.primaryHex}${Math.round(theme.patternOpacity * 255).toString(16).padStart(2, '0')} 21px
            );
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`relative py-20 px-6 overflow-hidden ${theme.bgSection1}`}
      >
        {/* Subtle background pattern overlay */}
        <div className="pattern-overlay absolute inset-0 pointer-events-none" />

        {/* Decorative corner ornaments */}
        <div className="absolute top-4 left-4 opacity-20">
          <span className={`${theme.textAccent} text-2xl`}>{theme.ornamentChar}</span>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <span className={`${theme.textAccent} text-2xl`}>{theme.ornamentChar}</span>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20 rotate-180">
          <span className={`${theme.textAccent} text-2xl`}>{theme.ornamentChar}</span>
        </div>
        <div className="absolute bottom-4 right-4 opacity-20 rotate-180">
          <span className={`${theme.textAccent} text-2xl`}>{theme.ornamentChar}</span>
        </div>

        {/* ─── Section header with decorative underline ─── */}
        <div className={`transition-all duration-1000 ${sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {/* Top ornamental flourish */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className={`h-px w-16 border-t ${theme.borderAccent}`} />
            <span
              className={`${theme.textAccent} opacity-60`}
              style={{ fontSize: 14, animation: 'subtlePulse 3s ease-in-out infinite' }}
            >
              {theme.ornamentChar}
            </span>
            <span className={`h-px w-16 border-t ${theme.borderAccent}`} />
          </div>

          {/* Label */}
          <p className={`text-center ${theme.fontLabel} text-xs tracking-[0.4em] ${theme.textAccent} uppercase mb-2`}>
            Gift Registry
          </p>

          {/* Main heading */}
          <h2 className={`text-center ${theme.fontHeading} text-3xl md:text-4xl ${theme.textDark} mb-3`}>
            With Gratitude
          </h2>

          {/* Decorative underline below heading */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div
                className="h-[2px] rounded-full"
                style={{
                  width: sectionVisible ? '120px' : '0px',
                  background: `linear-gradient(90deg, transparent, ${theme.primaryHex}, transparent)`,
                  transition: 'width 0.8s ease-out 0.3s',
                }}
              />
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <span
                  className={`${theme.textAccent} text-xs opacity-60`}
                  style={{ fontSize: 10 }}
                >
                  {theme.ornamentChar}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className={`text-center ${theme.fontBody} text-sm ${theme.textMuted} max-w-md mx-auto mb-10`}>
            Your presence is the greatest gift. For those who wish to send something extra, we&apos;ve prepared the details below.
          </p>
        </div>

        {isDemo && (
          <p className={`text-center ${theme.fontBody} text-xs ${theme.textMuted} italic opacity-60 mb-8`}>
            ✨ Demo placeholder data — connect real account details to go live.
          </p>
        )}

        {/* ─── Main content with decorative frame ──────── */}
        <div className="max-w-2xl mx-auto relative">
          {/* Decorative frame border */}
          <div
            className="decorative-frame relative rounded-2xl p-6 md:p-10"
            style={{
              border: `1px solid ${theme.primaryHex}20`,
              boxShadow: `0 0 40px -10px ${theme.shadowColor}`,
            }}
          >
            {/* Frame corner ornaments */}
            <div className="absolute -top-2 -left-2">
              <span className={`${theme.textAccent} opacity-30 text-lg`}>{theme.ornamentChar}</span>
            </div>
            <div className="absolute -top-2 -right-2">
              <span className={`${theme.textAccent} opacity-30 text-lg`}>{theme.ornamentChar}</span>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <span className={`${theme.textAccent} opacity-30 text-lg`}>{theme.ornamentChar}</span>
            </div>
            <div className="absolute -bottom-2 -right-2">
              <span className={`${theme.textAccent} opacity-30 text-lg`}>{theme.ornamentChar}</span>
            </div>

            <div className="space-y-10">
              {/* ─── Bank Accounts ──────────────────────────── */}
              <div ref={banksRef}>
                <h3 className={`${theme.fontLabel} text-sm tracking-[0.3em] ${theme.textAccent} uppercase mb-5 flex items-center gap-2`}>
                  <span style={{ fontSize: 16 }}>{theme.ornamentChar}</span>
                  Bank Transfer
                  <span className={`flex-1 h-px ml-3 ${theme.borderAccent} border-t`} />
                </h3>

                <div className="space-y-3">
                  {banks.map((bank, idx) => {
                    const open = openIdx === idx
                    const delay = idx * 150

                    return (
                      <div
                        key={`${bank.bankName}-${idx}`}
                        className={`
                          rounded-xl overflow-hidden transition-all duration-500
                          ${banksVisible ? 'stagger-fade-up' : 'opacity-0'}
                        `}
                        style={{
                          animationDelay: `${delay}ms`,
                          boxShadow: open
                            ? `0 4px 20px -4px ${theme.shadowColor}`
                            : `0 2px 8px -2px ${theme.shadowColor}`,
                        }}
                      >
                        {/* Bank card with gradient background */}
                        <div
                          className={`
                            bank-gradient-card border ${theme.borderAccent}
                            rounded-xl transition-all duration-300
                            ${open ? 'border-opacity-100' : 'border-opacity-50 hover:border-opacity-80'}
                          `}
                        >
                          {/* Accordion header */}
                          <button
                            onClick={() => toggle(idx)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors group"
                            aria-expanded={open}
                          >
                            <div className="flex items-center gap-3">
                              {/* Enhanced bank icon with gradient */}
                              <div
                                className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                                style={{
                                  background: `linear-gradient(135deg, ${theme.primaryHex}20, ${theme.primaryHex}08)`,
                                  border: `1px solid ${theme.primaryHex}30`,
                                  boxShadow: `0 2px 8px -2px ${theme.shadowColor}`,
                                }}
                              >
                                <span className={`${theme.textAccent} ${theme.fontHeading} text-sm font-bold`}>
                                  {bank.bankName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className={`${theme.fontHeading} text-base ${theme.textDark} leading-tight font-semibold`}>
                                  {bank.bankName}
                                </p>
                                <p className={`${theme.fontBody} text-xs ${theme.textMuted} mt-0.5`}>
                                  ••••{bank.accountNumber.slice(-4)}
                                </p>
                              </div>
                            </div>

                            {/* Animated chevron */}
                            <div
                              className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                transition-all duration-300
                                ${open
                                  ? `rotate-180`
                                  : ''
                                }
                              `}
                              style={{
                                background: open ? `${theme.primaryHex}15` : 'transparent',
                              }}
                            >
                              <svg
                                className={`w-4 h-4 ${theme.textAccent} transition-colors duration-300`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>

                          {/* Accordion content with enhanced design */}
                          {open && (
                            <div className="accordion-content">
                              <div className="px-5 pb-5 pt-1">
                                {/* Decorative separator */}
                                <div className="relative py-3">
                                  <div className={`h-px ${theme.borderAccent} border-t`} />
                                  <div className="absolute left-1/2 -translate-x-1/2 -top-1.5">
                                    <span className={`${theme.textAccent} opacity-40 text-[10px]`}>{theme.ornamentChar}</span>
                                  </div>
                                </div>

                                <div className="mt-3 space-y-4">
                                  {/* Account number with copy button */}
                                  <div>
                                    <p className={`${theme.fontLabel} text-[10px] tracking-[0.2em] ${theme.textMuted} uppercase mb-2`}>
                                      Account Number
                                    </p>
                                    <div className="flex items-center justify-between gap-3">
                                      <p
                                        className={`${theme.fontBody} text-lg ${theme.textDark} font-mono tracking-wider`}
                                        style={{ letterSpacing: '0.15em' }}
                                      >
                                        {bank.accountNumber}
                                      </p>
                                      <CopyButton
                                        theme={theme}
                                        text={bank.accountNumber}
                                        label={bank.bankName}
                                        onCopy={copyToClipboard}
                                      />
                                    </div>
                                  </div>

                                  {/* Account holder */}
                                  <div>
                                    <p className={`${theme.fontLabel} text-[10px] tracking-[0.2em] ${theme.textMuted} uppercase mb-2`}>
                                      Account Holder
                                    </p>
                                    <p className={`${theme.fontBody} text-sm ${theme.textDark} font-medium`}>
                                      {bank.accountName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ─── Digital Wallets ───────────────────────── */}
              <div ref={walletsRef}>
                <h3 className={`${theme.fontLabel} text-sm tracking-[0.3em] ${theme.textAccent} uppercase mb-5 flex items-center gap-2`}>
                  <span style={{ fontSize: 16 }}>{theme.ornamentChar}</span>
                  Digital Wallet
                  <span className={`flex-1 h-px ml-3 ${theme.borderAccent} border-t`} />
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {wallets.map((wallet, idx) => {
                    const delay = idx * 120
                    const IconComponent = WalletIcons[wallet.name] || DefaultWalletIcon

                    return (
                      <div
                        key={`${wallet.name}-${idx}`}
                        className={`
                          wallet-hover-glow rounded-xl border ${theme.borderAccent}
                          p-5 text-center cursor-default relative overflow-hidden
                          ${walletsVisible ? 'stagger-fade-scale' : 'opacity-0'}
                        `}
                        style={{
                          animationDelay: `${delay}ms`,
                          background: `linear-gradient(180deg, ${theme.gradientFrom} 0%, white 100%)`,
                        }}
                      >
                        {/* Hover gradient overlay */}
                        <div
                          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at center, ${theme.primaryHex}08 0%, transparent 70%)`,
                          }}
                        />

                        {/* Wallet icon */}
                        <div className="flex justify-center mb-3 relative z-10">
                          {wallet.qrUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={wallet.qrUrl}
                              alt={`${wallet.name} QR`}
                              className={`w-16 h-16 rounded-lg object-contain border ${theme.borderAccent} transition-transform duration-300 hover:scale-105`}
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                              style={{
                                background: `linear-gradient(135deg, ${theme.primaryHex}15, ${theme.primaryHex}05)`,
                                border: `1px solid ${theme.primaryHex}25`,
                              }}
                            >
                              <IconComponent
                                className={`w-7 h-7 ${theme.textAccent}`}
                              />
                            </div>
                          )}
                        </div>

                        {/* Wallet name */}
                        <p className={`${theme.fontHeading} text-sm ${theme.textDark} mb-1 font-semibold relative z-10`}>
                          {wallet.name}
                        </p>

                        {/* Wallet number */}
                        <p className={`${theme.fontBody} text-xs ${theme.textMuted} font-mono mb-3 relative z-10`}>
                          {wallet.number}
                        </p>

                        {/* Copy button */}
                        <div className="relative z-10">
                          <CopyButton
                            theme={theme}
                            text={wallet.number}
                            label={wallet.name}
                            onCopy={copyToClipboard}
                            size="sm"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ─── Closing note ──────────────────────────── */}
              <div className="text-center pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className={`h-px w-10 ${theme.borderAccent} border-t`} />
                  <span
                    className={`${theme.textAccent} opacity-50`}
                    style={{ fontSize: 12, animation: 'subtlePulse 3s ease-in-out infinite' }}
                  >
                    {theme.ornamentChar}
                  </span>
                  <span className={`h-px w-10 ${theme.borderAccent} border-t`} />
                </div>
                <p className={`${theme.fontBody} text-xs ${theme.textMuted} italic max-w-sm mx-auto leading-relaxed`}>
                  Thank you for your love, prayers, and generosity. Every gift, big or small, means the world to us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─── QR Placeholder sub-component ──────────────────────── */

function QRPlaceholder({ theme, label }: { theme: ThemeConfig; label: string }) {
  // Generate a pseudo-random QR-like grid pattern (deterministic per label)
  const cells: boolean[] = []
  let seed = 0
  for (let i = 0; i < label.length; i++) seed = (seed * 31 + label.charCodeAt(i)) % 2147483647
  for (let i = 0; i < 49; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483647
    cells.push((seed >> 16) % 2 === 0)
  }

  return (
    <div
      className="w-16 h-16 rounded-lg p-1.5 transition-transform duration-300 hover:scale-105"
      style={{
        background: 'white',
        border: `1px solid ${theme.primaryHex}30`,
        boxShadow: `0 2px 8px -2px ${theme.shadowColor}`,
      }}
      aria-label={`${label} QR placeholder`}
    >
      <div className="grid grid-cols-7 gap-[1px] w-full h-full">
        {cells.map((on, i) => (
          <div
            key={i}
            className="rounded-[1px]"
            style={{ backgroundColor: on ? theme.primaryHex : 'transparent' }}
          />
        ))}
      </div>
    </div>
  )
}
