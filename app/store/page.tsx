"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  ShoppingCart,
  Package,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function StorePage() {
  const [activeTab, setActiveTab] = useState("products")

  // Mock data for demonstration
  const products = [
    {
      id: 1,
      name: "Prime5 Jersey",
      category: "Apparel",
      price: 25.00,
      stock: 50,
      status: "In Stock"
    },
    {
      id: 2,
      name: "Team Cap",
      category: "Accessories",
      price: 15.00,
      stock: 30,
      status: "In Stock"
    },
    {
      id: 3,
      name: "Match Ball",
      category: "Equipment",
      price: 35.00,
      stock: 0,
      status: "Out of Stock"
    }
  ]

  const orders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      items: 2,
      total: 40.00,
      status: "Completed",
      date: "2024-01-15"
    },
    {
      id: "ORD-002",
      customer: "Mike Johnson",
      items: 1,
      total: 25.00,
      status: "Pending",
      date: "2024-01-16"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-md">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600/90 to-green-700/90 backdrop-blur-md rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-2xl">Store Management</h1>
                <p className="text-sm text-white/90 drop-shadow-xl">Manage products, orders, and inventory</p>
        </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 data-[state=active]:backdrop-blur-md text-white hover:bg-white/20 hover:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Products</h2>
                <p className="text-white/90 drop-shadow-xl">Manage your store products</p>
              </div>
              <Button className="bg-green-600/90 backdrop-blur-md hover:bg-green-700/90 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
                </Button>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/80">Product</TableHead>
                      <TableHead className="text-white/80">Category</TableHead>
                      <TableHead className="text-white/80">Price</TableHead>
                      <TableHead className="text-white/80">Stock</TableHead>
                      <TableHead className="text-white/80">Status</TableHead>
                      <TableHead className="text-white/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-white/10">
                        <TableCell className="text-white font-medium">{product.name}</TableCell>
                        <TableCell className="text-white/70">{product.category}</TableCell>
                        <TableCell className="text-white">${product.price}</TableCell>
                        <TableCell className="text-white">{product.stock}</TableCell>
                        <TableCell>
                          <Badge 
                            className={product.status === "In Stock" 
                              ? "bg-green-500/20 text-green-300 border-green-500/30" 
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Orders</h2>
                <p className="text-white/90 drop-shadow-xl">Track and manage customer orders</p>
          </div>
        </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-white/80">Order ID</TableHead>
                      <TableHead className="text-white/80">Customer</TableHead>
                      <TableHead className="text-white/80">Items</TableHead>
                      <TableHead className="text-white/80">Total</TableHead>
                      <TableHead className="text-white/80">Status</TableHead>
                      <TableHead className="text-white/80">Date</TableHead>
                      <TableHead className="text-white/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-white/10">
                        <TableCell className="text-white font-medium">{order.id}</TableCell>
                        <TableCell className="text-white">{order.customer}</TableCell>
                        <TableCell className="text-white">{order.items}</TableCell>
                        <TableCell className="text-white">${order.total}</TableCell>
                        <TableCell>
                          <Badge 
                            className={order.status === "Completed" 
                              ? "bg-green-500/20 text-green-300 border-green-500/30" 
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            }
                          >
                            {order.status}
                  </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">{order.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Inventory</h2>
                <p className="text-white/90 drop-shadow-xl">Monitor stock levels and manage inventory</p>
              </div>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-300" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Total Products</p>
                      <p className="text-2xl font-bold text-white">{products.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">In Stock</p>
                      <p className="text-2xl font-bold text-white">
                        {products.filter(p => p.status === "In Stock").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-300" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Out of Stock</p>
                      <p className="text-2xl font-bold text-white">
                        {products.filter(p => p.status === "Out of Stock").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
        <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Store Analytics</h2>
                <p className="text-white/90 drop-shadow-xl">View sales performance and insights</p>
            </div>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <DollarSign className="h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Total Sales</span>
                      <span className="text-white font-bold">$1,250.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Orders</span>
                      <span className="text-white font-bold">{orders.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Average Order</span>
                      <span className="text-white font-bold">$32.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Users className="h-5 w-5" />
                    Customer Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Total Customers</span>
                      <span className="text-white font-bold">24</span>
                      </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">New This Month</span>
                      <span className="text-white font-bold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Repeat Customers</span>
                      <span className="text-white font-bold">16</span>
                    </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 