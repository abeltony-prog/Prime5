"use client"

import { useState } from "react"
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
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  TrendingUp,
  Award,
  Zap,
  ArrowRight
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
      price: 45000,
      originalPrice: 55000,
      image: "/placeholder.svg?height=600&width=600&text=Home+Jersey",
      rating: 4.8,
      reviews: 124,
      description: "Official Prime5 League home jersey with premium moisture-wicking fabric and high-impact lime accents.",
      inStock: true,
      featured: true,
      tag: "NEW"
    },
    {
      id: 2,
      name: "Prime5 Away Jersey",
      category: "Jerseys",
      price: 45000,
      originalPrice: 55000,
      image: "/placeholder.svg?height=600&width=600&text=Away+Jersey",
      rating: 4.7,
      reviews: 98,
      description: "Stealth charcoal away jersey with forest green details. Engineered for maximum performance.",
      inStock: true,
      featured: true,
      tag: "HOT"
    },
    {
      id: 3,
      name: "Tactical Team Cap",
      category: "Accessories",
      price: 25000,
      image: "/placeholder.svg?height=600&width=600&text=Team+Cap",
      rating: 4.5,
      reviews: 67,
      description: "Premium embroidered cap with adjustable strap and 3D Prime5 logo.",
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: "Pro Elite Match Ball",
      category: "Equipment",
      price: 35000,
      image: "/placeholder.svg?height=600&width=600&text=Match+Ball",
      rating: 4.9,
      reviews: 89,
      description: "FIFA-pro standard futsal ball. Low-rebound engineering for precision and power.",
      inStock: true,
      featured: true,
      tag: "PRO"
    },
    {
      id: 5,
      name: "Performance Shorts",
      category: "Apparel",
      price: 30000,
      image: "/placeholder.svg?height=600&width=600&text=Training+Shorts",
      rating: 4.6,
      reviews: 45,
      description: "Breathable training shorts with reinforced stitching and elasticated waistband.",
      inStock: true,
      featured: false
    },
    {
      id: 6,
      name: "Prime5 Supporters Scarf",
      category: "Accessories",
      price: 20000,
      image: "/placeholder.svg?height=600&width=600&text=Team+Scarf",
      rating: 4.4,
      reviews: 32,
      description: "Heavy-knit supporters scarf. Perfect for showing your colors in the arena.",
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
    <div className="min-h-screen bg-[#0a0f0a] text-white selection:bg-lime-400 selection:text-black">
      <Navigation />

      {/* Decorative Blur Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-400/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-400/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
                Drop One Available
              </Badge>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <TrendingUp size={14} className="text-lime-300" />
                Trending Now
              </div>
            </div>
            <h1 className="text-6xl md:text-9xl font-black font-heading italic uppercase tracking-tighter mb-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
               Gear for the <span className="text-lime-300">Universe.</span>
            </h1>
            <p className="text-xl text-white/40 uppercase font-bold tracking-widest max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              Official Prime5 League Armour. Engineered for the Elite.
            </p>
          </div>
        </section>

        {/* Filters & Tabs Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="flex w-full overflow-x-auto bg-white/5 p-1 rounded-2xl border border-white/5 scrollbar-hide">
                {["all", "featured", "jerseys", "accessories"].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="flex-1 lg:px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all data-[state=active]:bg-lime-300 data-[state=active]:text-black text-white/40 hover:text-white"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
              <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-lime-300 transition-colors" size={18} />
                <Input
                  placeholder="SEARCH THE ARMOURY"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-14 bg-white/5 border-white/10 rounded-2xl pl-16 pr-6 text-white font-black uppercase tracking-widest text-[10px] focus:border-lime-300/50 outline-none transition-all"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-56 h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-white font-black uppercase tracking-widest text-[10px] focus:border-lime-300/50 shadow-none">
                  <SelectValue placeholder="CATEGORY" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f150f] border-white/10 rounded-2xl">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white focus:bg-lime-300 focus:text-black font-black uppercase tracking-widest text-[10px]">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32 glass-dark rounded-[3rem] border border-white/5 animate-pulse">
              <Package className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-xl font-black uppercase tracking-widest text-white/40 mb-2">Armoury Empty</h3>
              <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Adjust your filters to reveal hidden gear</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group relative glass-dark rounded-[3rem] border border-white/10 hover:border-lime-300/30 transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square relative overflow-hidden bg-white/5">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {product.tag && (
                      <Badge className="absolute top-8 left-8 bg-lime-300 text-black px-4 py-1 font-black uppercase tracking-widest text-[8px] italic shadow-lg">
                        {product.tag}
                      </Badge>
                    )}
                    
                    {!product.inStock && (
                      <div className="absolute inset-x-0 bottom-8 px-8">
                        <Badge className="w-full bg-white/10 backdrop-blur-md text-white/40 border-white/5 px-4 py-3 font-black uppercase tracking-widest text-[10px] justify-center">
                          Sold Out
                        </Badge>
                      </div>
                    )}

                    <button className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/10 transition-all group/btn">
                      <Heart size={20} className="group-hover/btn:fill-red-400 group-hover/btn:scale-110 transition-all" />
                    </button>
                  </div>
                  
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">{product.category}</p>
                        <h3 className="text-2xl font-black font-heading italic uppercase tracking-tight text-white mb-2 group-hover:text-lime-300 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-[22px] font-black text-white font-heading italic">
                           RWF {product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                          <div className="text-[10px] text-white/20 line-through font-bold uppercase tracking-widest">
                            RWF {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-4">
                      {product.inStock ? (
                        <>
                          {cart[product.id] ? (
                            <div className="flex items-center gap-2 flex-1 bg-white/5 rounded-2xl p-1 border border-white/10">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFromCart(product.id)}
                                className="w-10 h-10 rounded-xl hover:bg-white/5 text-white/60"
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="flex-1 text-center font-black text-[10px] tracking-widest">
                                {cart[product.id]}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => addToCart(product.id)}
                                className="w-10 h-10 rounded-xl hover:bg-white/5 text-white/60"
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(product.id)}
                              className="flex-1 h-12 bg-lime-300 text-black hover:bg-white rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all"
                            >
                              <ShoppingCart size={14} className="mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          disabled
                          className="flex-1 h-12 bg-white/5 text-white/20 rounded-2xl font-black uppercase tracking-widest text-[9px] border border-white/5"
                        >
                          Out of Stock
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 hover:text-white">
                        <Star size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features/Info Section */}
        <section className="container mx-auto px-4 mt-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="glass-dark rounded-[2.5rem] p-10 border border-white/10 group hover:border-lime-300/30 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-400/20 group-hover:scale-110 transition-transform">
                <Truck className="text-blue-400" size={24} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">Express Delivery</h4>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
                Fast and secure shipping across Rwanda on all official league merchandise.
              </p>
            </div>

            <div className="glass-dark rounded-[2.5rem] p-10 border border-white/10 group hover:border-lime-300/30 transition-all duration-500">
              <div className="w-14 h-14 bg-lime-400/10 rounded-2xl flex items-center justify-center mb-8 border border-lime-400/20 group-hover:scale-110 transition-transform">
                <Shield className="text-lime-400" size={24} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">Secure Gateway</h4>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
                Premium payment processing with full encryption. Momo and card support.
              </p>
            </div>

            <div className="glass-dark rounded-[2.5rem] p-10 border border-white/10 group hover:border-lime-300/30 transition-all duration-500">
              <div className="w-14 h-14 bg-purple-400/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-400/20 group-hover:scale-110 transition-transform">
                <RefreshCw className="text-purple-400" size={24} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-4">Elite Service</h4>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">
                30-day exchange policy on all gear. Quality guaranteed by Prime5.
              </p>
            </div>
          </div>
        </section>

        {/* Promo CTA Section */}
        <section className="container mx-auto px-4 mt-32">
          <div className="glass rounded-[3rem] p-12 md:p-24 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
              <Zap size={400} />
            </div>
            <div className="max-w-2xl relative z-10">
               <Badge className="bg-lime-400/10 text-lime-400 border-lime-400/20 px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                Limited Edition
              </Badge>
              <h2 className="text-4xl md:text-7xl font-black font-heading italic uppercase tracking-tighter mb-8 group-hover:text-lime-300 transition-colors">
                The Universe <span className="block italic">Collection.</span>
              </h2>
              <p className="text-lg text-white/40 font-black uppercase tracking-widest mb-12">
                Exclusive drop for the first Prime5 season. Own a piece of futsal history.
              </p>
              <Button className="h-16 px-12 bg-lime-300 text-black hover:bg-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl hover:shadow-lime-400/20">
                Register for early access <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Cart Button */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-10 right-10 z-50">
          <Button
            size="lg"
            className="w-20 h-20 rounded-[2rem] bg-lime-300 text-black hover:bg-white shadow-[0_20px_40px_rgba(190,242,100,0.3)] border-4 border-[#0a0f0a] transition-all hover:scale-110 active:scale-95 group"
          >
            <div className="relative">
              <ShoppingBag className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-lime-300">
                <span className="text-[10px] font-black text-lime-300">{getCartCount()}</span>
              </div>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}