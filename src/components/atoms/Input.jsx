import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon = null,
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
          <ApperIcon name={icon} size={20} />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 
          ${icon ? 'pl-12' : 'pl-4'}
          glass-panel rounded-lg
          text-white placeholder-white/60
          focus:outline-none focus:ring-2 focus:ring-accent/50
          transition-all duration-300
          ${className}
        `}
        {...props}
      />
    </div>
  )
}

export default Input