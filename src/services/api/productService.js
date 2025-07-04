import mockData from '@/services/mockData/products.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const productService = {
  async getAll() {
    await delay(300)
    return [...mockData]
  },

  async getById(id) {
    await delay(250)
    const product = mockData.find(p => p.Id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  },

  async getByType(type) {
    await delay(300)
    return mockData.filter(p => p.type === type).map(p => ({ ...p }))
  },

  async search(query) {
    await delay(350)
    const searchTerm = query.toLowerCase()
    return mockData.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.origin.toLowerCase().includes(searchTerm) ||
      product.aromaProfile.some(aroma => aroma.toLowerCase().includes(searchTerm)) ||
      product.flavorNotes.some(note => note.toLowerCase().includes(searchTerm)) ||
      product.essence.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }))
  },

  async create(product) {
    await delay(400)
    const newId = Math.max(...mockData.map(p => p.Id)) + 1
    const newProduct = { ...product, Id: newId }
    mockData.push(newProduct)
    return { ...newProduct }
  },

  async update(id, updates) {
    await delay(400)
    const index = mockData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    mockData[index] = { ...mockData[index], ...updates }
    return { ...mockData[index] }
  },

  async delete(id) {
    await delay(350)
    const index = mockData.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    mockData.splice(index, 1)
    return { success: true }
  }
}