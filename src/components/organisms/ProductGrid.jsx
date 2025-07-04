import React from 'react'
import ProductCard from '@/components/molecules/ProductCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const ProductGrid = ({ products, loading, error, onRetry }) => {
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={onRetry} />
  if (!products || products.length === 0) return <Empty />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.Id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid