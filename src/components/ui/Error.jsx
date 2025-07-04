import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="glass-card rounded-xl p-8 text-center max-w-md">
        <div className="p-4 glass-panel rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={40} className="text-red-400" />
        </div>
        
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-white/80 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="accent"
            icon="RefreshCw"
            className="mx-auto"
          >
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Error