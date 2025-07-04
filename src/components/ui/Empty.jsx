import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No products found",
  description = "We couldn't find any products matching your criteria. Try adjusting your filters or browse our full collection.",
  actionText = "Browse All Products",
  actionLink = "/"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="glass-card rounded-xl p-8 text-center max-w-md">
        <div className="p-4 glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="Coffee" size={40} className="text-accent" />
        </div>
        
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-white/80 mb-6">
          {description}
        </p>
        
        <Link to={actionLink}>
          <Button
            variant="accent"
            icon="Coffee"
            className="mx-auto"
          >
            {actionText}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

export default Empty