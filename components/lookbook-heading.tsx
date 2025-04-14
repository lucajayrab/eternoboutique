import type React from "react"
interface LookbookHeadingProps {
  children: React.ReactNode
  className?: string
}

export default function LookbookHeading({ children, className = "" }: LookbookHeadingProps) {
  return (
    <h2
      className={`font-mulish text-4xl md:text-5xl lg:text-6xl tracking-widest uppercase font-light text-eterno-gray ${className}`}
    >
      {children}
    </h2>
  )
}
