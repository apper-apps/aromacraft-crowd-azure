import React from 'react'
import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="shimmer">
            <div className="h-48 bg-gradient-to-r from-glass to-glass-hover"></div>
          </div>
          <div className="p-6 space-y-3">
            <div className="shimmer">
              <div className="h-6 bg-gradient-to-r from-glass to-glass-hover rounded"></div>
            </div>
            <div className="shimmer">
              <div className="h-4 bg-gradient-to-r from-glass to-glass-hover rounded w-3/4"></div>
            </div>
            <div className="flex gap-2">
              <div className="shimmer">
                <div className="h-6 w-16 bg-gradient-to-r from-glass to-glass-hover rounded-full"></div>
              </div>
              <div className="shimmer">
                <div className="h-6 w-20 bg-gradient-to-r from-glass to-glass-hover rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="shimmer">
                <div className="h-8 w-24 bg-gradient-to-r from-glass to-glass-hover rounded"></div>
              </div>
              <div className="shimmer">
                <div className="h-8 w-20 bg-gradient-to-r from-glass to-glass-hover rounded"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Loading