'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip'
  | 'none'

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: AnimationType
  /** Delay in ms before animation starts (after entering viewport) */
  delay?: number
  /** Duration of the animation in ms */
  duration?: number
  /** Intersection observer threshold (0-1) */
  threshold?: number
  /** Only animate once (default true) */
  once?: boolean
  className?: string
  style?: React.CSSProperties
  /** HTML element tag to render */
  as?: keyof React.JSX.IntrinsicElements
}

// ─────────────────────────────────────────────────────────────
// Animation style maps
// ─────────────────────────────────────────────────────────────
function getInitialState(animation: AnimationType): React.CSSProperties {
  switch (animation) {
    case 'fade-up':
      return { opacity: 0, transform: 'translateY(40px)' }
    case 'fade-down':
      return { opacity: 0, transform: 'translateY(-40px)' }
    case 'fade-left':
      return { opacity: 0, transform: 'translateX(-40px)' }
    case 'fade-right':
      return { opacity: 0, transform: 'translateX(40px)' }
    case 'zoom-in':
      return { opacity: 0, transform: 'scale(0.85)' }
    case 'zoom-out':
      return { opacity: 0, transform: 'scale(1.15)' }
    case 'flip':
      return { opacity: 0, transform: 'perspective(600px) rotateX(25deg)' }
    case 'none':
    default:
      return {}
  }
}

function getVisibleState(animation: AnimationType): React.CSSProperties {
  switch (animation) {
    case 'fade-up':
    case 'fade-down':
    case 'fade-left':
    case 'fade-right':
      return { opacity: 1, transform: 'translate(0, 0)' }
    case 'zoom-in':
    case 'zoom-out':
      return { opacity: 1, transform: 'scale(1)' }
    case 'flip':
      return { opacity: 1, transform: 'perspective(600px) rotateX(0deg)' }
    case 'none':
    default:
      return {}
  }
}

// ─────────────────────────────────────────────────────────────
// AnimateOnScroll — single element animation wrapper
// ─────────────────────────────────────────────────────────────
const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.15,
  once = true,
  className = '',
  style,
  as: Tag = 'div',
}) => {
  const [hasAnimated, setHasAnimated] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  })

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [inView, hasAnimated])

  const isVisible = once ? hasAnimated : inView

  const transitionStyle: React.CSSProperties = {
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  }

  const currentStyle: React.CSSProperties = {
    ...transitionStyle,
    ...(isVisible ? getVisibleState(animation) : getInitialState(animation)),
    ...style,
  }

  // Use a dynamic element
  return React.createElement(
    Tag as string,
    {
      ref,
      className,
      style: currentStyle,
    },
    children
  )
}

// ─────────────────────────────────────────────────────────────
// StaggerChildren — automatically staggers direct children
// ─────────────────────────────────────────────────────────────
interface StaggerChildrenProps {
  children: React.ReactNode
  /** Base animation for each child */
  animation?: AnimationType
  /** Stagger delay between children in ms */
  staggerDelay?: number
  /** Base duration for each child's animation */
  duration?: number
  /** Intersection threshold */
  threshold?: number
  /** Only animate once */
  once?: boolean
  className?: string
  style?: React.CSSProperties
  /** Additional per-child delay offset in ms */
  baseDelay?: number
}

const StaggerChildren: React.FC<StaggerChildrenProps> = ({
  children,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 600,
  threshold = 0.1,
  once = true,
  className = '',
  style,
  baseDelay = 0,
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [inView, hasAnimated])

  const isVisible = once ? hasAnimated : inView

  const childrenArray = React.Children.toArray(children)

  return (
    <div ref={ref} className={className} style={style}>
      {childrenArray.map((child, index) => {
        const delay = baseDelay + index * staggerDelay
        const transitionStyle: React.CSSProperties = {
          transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          willChange: 'opacity, transform',
        }

        const animStyle: React.CSSProperties = {
          ...transitionStyle,
          ...(isVisible ? getVisibleState(animation) : getInitialState(animation)),
        }

        return (
          <div key={index} style={animStyle}>
            {child}
          </div>
        )
      })}
    </div>
  )
}

export default AnimateOnScroll
export { AnimateOnScroll, StaggerChildren }
export type { AnimateOnScrollProps, StaggerChildrenProps, AnimationType }
