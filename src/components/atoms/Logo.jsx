import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="p-2 glass-card rounded-lg">
        <ApperIcon name="Coffee" size={24} className="text-accent" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-display font-bold text-white">AromaCraft</span>
        <span className="text-xs text-white/60">Premium Tea & Coffee</span>
      </div>
    </div>
  )
}

export default Logo