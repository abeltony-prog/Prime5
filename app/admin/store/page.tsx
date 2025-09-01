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

export default function StoreManagementPage() {
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
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">Product</TableHead>
                      <TableHead className="text-white">Category</TableHead>
                      <TableHead className="text-white">Price</TableHead>
                      <TableHead className="text-white">Stock</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-white/20">
                        <TableCell className="text-white font-medium">{product.name}</TableCell>
                        <TableCell className="text-white/90">{product.category}</TableCell>
                        <TableCell className="text-white">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-white">{product.stock}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={product.status === "In Stock" 
                              ? "border-green-500/50 text-green-300 bg-green-500/20" 
                              : "border-red-500/50 text-red-300 bg-red-500/20"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-500/20">
                              <Trash2 className="w-4 h-4" />
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
                <p className="text-white/90 drop-shadow-xl">Manage customer orders</p>
              </div>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">Order ID</TableHead>
                      <TableHead className="text-white">Customer</TableHead>
                      <TableHead className="text-white">Items</TableHead>
                      <TableHead className="text-white">Total</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-white/20">
                        <TableCell className="text-white font-medium">{order.id}</TableCell>
                        <TableCell className="text-white/90">{order.customer}</TableCell>
                        <TableCell className="text-white">{order.items}</TableCell>
                        <TableCell className="text-white">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={order.status === "Completed" 
                              ? "border-green-500/50 text-green-300 bg-green-500/20" 
                              : "border-yellow-500/50 text-yellow-300 bg-yellow-500/20"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/90">{order.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                              <Edit className="w-4 h-4" />
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
                <p className="text-white/90 drop-shadow-xl">Track stock levels and manage inventory</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Total Products</h3>
                  <p className="text-3xl font-bold text-green-400">{products.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">In Stock</h3>
                  <p className="text-3xl font-bold text-blue-400">
                    {products.filter(p => p.status === "In Stock").length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Out of Stock</h3>
                  <p className="text-3xl font-bold text-red-400">
                    {products.filter(p => p.status === "Out of Stock").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Stock Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-white">Product</TableHead>
                      <TableHead className="text-white">Current Stock</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-white/20">
                        <TableCell className="text-white font-medium">{product.name}</TableCell>
                        <TableCell className="text-white">{product.stock}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={product.status === "In Stock" 
                              ? "border-green-500/50 text-green-300 bg-green-500/20" 
                              : "border-red-500/50 text-red-300 bg-red-500/20"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                            Update Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-2xl">Analytics</h2>
                <p className="text-white/90 drop-shadow-xl">Store performance and insights</p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Total Revenue</h3>
                  <p className="text-2xl font-bold text-green-400">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Total Orders</h3>
                  <p className="text-2xl font-bold text-blue-400">{orders.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Customers</h3>
                  <p className="text-2xl font-bold text-purple-400">{new Set(orders.map(o => o.customer)).size}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Avg Order</h3>
                  <p className="text-2xl font-bold text-orange-400">
                    ${(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{order.id}</p>
                          <p className="text-white/70 text-sm">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${order.total.toFixed(2)}</p>
                        <Badge 
                          variant="outline" 
                          className={order.status === "Completed" 
                            ? "border-green-500/50 text-green-300 bg-green-500/20" 
                            : "border-yellow-500/50 text-yellow-300 bg-yellow-500/20"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
