import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  icon = null,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'glass-button text-white hover:bg-glass-hover',
    secondary: 'glass-panel text-white hover:bg-glass-hover',
    accent: 'bg-gradient-to-r from-accent to-secondary text-white hover:from-secondary hover:to-accent',
    outline: 'border-2 border-glass-border text-white hover:bg-glass-hover',
    ghost: 'text-white hover:bg-glass-hover'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, brightness: 1.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-lg font-medium transition-all duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 justify-center
        ${className}
      `}
      {...props}
    >
      {icon && <ApperIcon name={icon} size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {children}
    </motion.button>
  )
}

export default Button