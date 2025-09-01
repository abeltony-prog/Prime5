"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Package,
  Star,
  Heart,
  Search,
  Filter,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"

export default function PublicStorePage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<{[key: number]: number}>({})

  // Mock store products
  const products = [
    {
      id: 1,
      name: "Prime5 Home Jersey",
      category: "Jerseys",
      price: 45.00,
      originalPrice: 55.00,
      image: "/placeholder.svg?height=300&width=300&text=Home+Jersey",
      rating: 4.8,
      reviews: 124,
      description: "Official Prime5 League home jersey with premium quality fabric and team colors.",
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Prime5 Away Jersey",
      category: "Jerseys",
      price: 45.00,
      originalPrice: 55.00,
      image: "/placeholder.svg?height=300&width=300&text=Away+Jersey",
      rating: 4.7,
      reviews: 98,
      description: "Official Prime5 League away jersey with modern design and comfortable fit.",
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: "Team Cap",
      category: "Accessories",
      price: 25.00,
      image: "/placeholder.svg?height=300&width=300&text=Team+Cap",
      rating: 4.5,
      reviews: 67,
      description: "Stylish team cap with embroidered Prime5 League logo.",
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: "Match Ball",
      category: "Equipment",
      price: 35.00,
      image: "/placeholder.svg?height=300&width=300&text=Match+Ball",
      rating: 4.9,
      reviews: 89,
      description: "Official match ball used in Prime5 League games.",
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: "Training Shorts",
      category: "Apparel",
      price: 30.00,
      image: "/placeholder.svg?height=300&width=300&text=Training+Shorts",
      rating: 4.6,
      reviews: 45,
      description: "Comfortable training shorts for practice sessions.",
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: "Team Scarf",
      category: "Accessories",
      price: 20.00,
      image: "/placeholder.svg?height=300&width=300&text=Team+Scarf",
      rating: 4.4,
      reviews: 32,
      description: "Warm team scarf perfect for supporting your team in any weather.",
      inStock: false,
      featured: false
    }
  ]

  const categories = ["all", "Jerseys", "Apparel", "Accessories", "Equipment"]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesTab = activeTab === "all" || 
                      (activeTab === "featured" && product.featured) ||
                      (activeTab === "jerseys" && product.category === "Jerseys") ||
                      (activeTab === "accessories" && product.category === "Accessories")
    
    return matchesSearch && matchesCategory && matchesTab
  })

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId] -= 1
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const getCartCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16" style={{
        backgroundImage: 'url(/mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Prime5 Store
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-xl">
              Official merchandise and gear from the Premier Futsal League
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-white/40"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative" style={{
        backgroundImage: 'url(/mainbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="relative z-10 container mx-auto px-6 pb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              All Products
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger 
              value="jerseys" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Jerseys
            </TabsTrigger>
            <TabsTrigger 
              value="accessories" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Accessories
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-white/70">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                      {product.featured && (
                        <Badge className="absolute top-4 left-4 bg-yellow-500/90 text-black font-bold">
                          Featured
                        </Badge>
                      )}
                      {!product.inStock && (
                        <Badge className="absolute top-4 right-4 bg-red-500/90 text-white">
                          Out of Stock
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-4 right-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                        <p className="text-white/80 text-sm mb-3">{product.description}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-white/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white/70 text-sm">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-white/50 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="border-white/30 text-white/90">
                          {product.category}
                        </Badge>
                      </div>

                      {product.inStock ? (
                        <div className="flex items-center gap-2">
                          {cart[product.id] ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(product.id)}
                                className="border-white/30 text-white hover:bg-white/20"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="text-white font-medium px-3">
                                {cart[product.id]}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(product.id)}
                                className="border-white/30 text-white hover:bg-white/20"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(product.id)}
                              className="flex-1 bg-green-600/90 hover:bg-green-700/90 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-white/10 text-white/50 cursor-not-allowed"
                        >
                          Out of Stock
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <section className="mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Free Shipping</h3>
                <p className="text-white/80">Free shipping on orders over $50</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Payment</h3>
                <p className="text-white/80">Safe and secure payment processing</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Easy Returns</h3>
                <p className="text-white/80">30-day return policy on all items</p>
              </CardContent>
            </Card>
          </div>
        </section>
        </div>
      </section>

      {/* Cart Button */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="bg-green-600/90 hover:bg-green-700/90 text-white shadow-2xl rounded-full w-16 h-16"
          >
            <ShoppingBag className="w-6 h-6" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
              {getCartCount()}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  )
}