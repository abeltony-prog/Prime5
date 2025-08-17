'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { ShoppingBag, Star, Heart, Eye, Filter, Search } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const storeItems = [
    {
      id: 1,
      name: "Prime5 League Jersey",
      price: 89.99,
      originalPrice: 119.99,
      image: "/placeholder.svg?height=200&width=200&text=Jersey",
      category: "Apparel",
      rating: 4.8,
      reviews: 124,
      featured: true,
    },
    {
      id: 2,
      name: "Official Match Ball",
      price: 45.99,
      originalPrice: 59.99,
      image: "/placeholder.svg?height=200&width=200&text=Ball",
      category: "Equipment",
      rating: 4.9,
      reviews: 89,
      featured: true,
    },
    {
      id: 3,
      name: "Team Cap",
      price: 24.99,
      image: "/placeholder.svg?height=200&width=200&text=Cap",
      category: "Apparel",
      rating: 4.6,
      reviews: 67,
      featured: false,
    },
    {
      id: 4,
      name: "Training Shorts",
      price: 34.99,
      image: "/placeholder.svg?height=200&width=200&text=Shorts",
      category: "Apparel",
      rating: 4.7,
      reviews: 93,
      featured: false,
    },
    {
      id: 5,
      name: "Goalkeeper Gloves",
      price: 39.99,
      image: "/placeholder.svg?height=200&width=200&text=Gloves",
      category: "Equipment",
      rating: 4.8,
      reviews: 156,
      featured: false,
    },
    {
      id: 6,
      name: "League Scarf",
      price: 19.99,
      image: "/placeholder.svg?height=200&width=200&text=Scarf",
      category: "Accessories",
      rating: 4.5,
      reviews: 78,
      featured: false,
    },
    {
      id: 7,
      name: "Training Jacket",
      price: 69.99,
      image: "/placeholder.svg?height=200&width=200&text=Jacket",
      category: "Apparel",
      rating: 4.7,
      reviews: 112,
      featured: false,
    },
    {
      id: 8,
      name: "Shin Guards",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200&text=Shin+Guards",
      category: "Equipment",
      rating: 4.6,
      reviews: 89,
      featured: false,
    },
  ]

  const categories = ['all', 'Apparel', 'Equipment', 'Accessories']
  
  const filteredItems = storeItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredItems = storeItems.filter(item => item.featured)

  return (
    <div className="min-h-screen relative">
      <Navigation />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">Official Prime5 League Store</h1>
          <p className="text-lg text-white/90 drop-shadow-xl">Premium merchandise and equipment for true fans</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/10 backdrop-blur-xl rounded-lg shadow-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/30 rounded-lg focus:ring-2 focus:ring-green-500/50 focus:border-transparent bg-white/20 backdrop-blur-sm text-white placeholder-white/70"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-green-600/90 backdrop-blur-md text-white shadow-lg' : 'border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md'}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-2xl">Featured Products</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredItems.map((item) => (
              <Card key={item.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-md text-white">
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs bg-white/20 backdrop-blur-sm border-white/30 text-white">
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-white/90">{item.rating}</span>
                      <span className="text-sm text-white/70">({item.reviews})</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{item.name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-green-300 drop-shadow-lg">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-lg text-white/70 line-through">${item.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-2xl">All Products</h2>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-white/90" />
              <span className="text-sm text-white/90">{filteredItems.length} products</span>
            </div>
          </div>
          
          {filteredItems.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">No products found</h3>
                <p className="text-white/80">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-md text-white text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-white/20 backdrop-blur-sm border-white/30 text-white">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-white/90">{item.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-white mb-2 truncate drop-shadow-md">{item.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-green-300 drop-shadow-lg">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-white/70 line-through">${item.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Shopping Cart Preview */}
        <div className="fixed bottom-6 right-6">
          <Button size="lg" className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
            <ShoppingBag className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
} 