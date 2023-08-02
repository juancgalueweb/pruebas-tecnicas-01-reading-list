import { useEffect, useRef, useState } from 'react'

export const FadeInSection = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setIsVisible(entry.isIntersecting))
    })
    const { current } = domRef
    observer.observe(current)

    return () => observer.unobserve(current)
  }, [])

  return (
    <div
      className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  )
}
