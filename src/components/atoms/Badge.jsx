import React from 'react'

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-glass-hover text-white',
    primary: 'bg-primary/80 text-white',
    accent: 'bg-accent/80 text-white',
    outline: 'border border-glass-border text-white bg-transparent'
  }

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge