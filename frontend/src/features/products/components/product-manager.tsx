"use client"

import * as React from "react"
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
} from "lucide-react"
import { Button } from "@/src/features/dashboard/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"
import { ProductApiService } from "../api/product.service"
import { ProductForm } from "./product-form"
import type { Category, Product, ProductFormData } from "../types/product.types"

export function ProductManager() {
    const [products, setProducts] = React.useState<Product[]>([])
    const [categories, setCategories] = React.useState<Category[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSaving, setIsSaving] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [message, setMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null)

    // View state: 'list' | 'create' | 'edit'
    const [viewMode, setViewMode] = React.useState<"list" | "create" | "edit">("list")
    const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)

    const loadData = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const [catRes, prodRes] = await Promise.all([
                ProductApiService.getCategories(),
                ProductApiService.getProducts({ search: searchTerm }),
            ])
            setCategories(catRes)
            setProducts(prodRes.items)
        } catch (err: any) {
            setMessage({ text: "Lỗi nạp dữ liệu: " + err.message, type: "error" })
        } finally {
            setIsLoading(false)
        }
    }, [searchTerm])

    React.useEffect(() => {
        loadData()
    }, [loadData])

    const handleCreate = async (data: ProductFormData) => {
        setIsSaving(true)
        setMessage(null)
        try {
            await ProductApiService.createProduct(data)
            setMessage({ text: "Đã tạo sản phẩm mới thành công!", type: "success" })
            setViewMode("list")
            await loadData()
        } catch (err: any) {
            throw err
        } finally {
            setIsSaving(false)
        }
    }

    const handleUpdate = async (data: ProductFormData) => {
        if (!editingProduct) return
        setIsSaving(true)
        setMessage(null)
        try {
            await ProductApiService.updateProduct(editingProduct.id, data)
            setMessage({ text: "Cập nhật sản phẩm thành công!", type: "success" })
            setViewMode("list")
            setEditingProduct(null)
            await loadData()
        } catch (err: any) {
            throw err
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return
        try {
            await ProductApiService.deleteProduct(id)
            setMessage({ text: `Đã xóa sản phẩm "${name}" thành công!`, type: "success" })
            await loadData()
        } catch (err: any) {
            setMessage({ text: "Lỗi xóa sản phẩm: " + err.message, type: "error" })
        }
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)
    }

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Đang bán</Badge>
            case "INACTIVE":
                return <Badge className="bg-slate-100 text-slate-700 border-slate-200">Ngừng bán</Badge>
            case "OUT_OF_STOCK":
                return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Hết hàng</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            {/* Header thông báo */}
            {message && (
                <div
                    className={`flex items-center gap-2 rounded-lg border p-4 text-sm font-medium ${
                        message.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-red-200 bg-red-50 text-red-800"
                    }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                    ) : (
                        <AlertCircle className="size-5 shrink-0 text-red-600" />
                    )}
                    <span>{message.text}</span>
                </div>
            )}

            {viewMode === "create" ? (
                <ProductForm
                    categories={categories}
                    onSubmit={handleCreate}
                    onCancel={() => setViewMode("list")}
                    isLoading={isSaving}
                    onCategoryCreated={(newCat) => setCategories((prev) => [...prev, newCat])}
                />
            ) : viewMode === "edit" ? (
                <ProductForm
                    initialData={editingProduct}
                    categories={categories}
                    onSubmit={handleUpdate}
                    onCancel={() => {
                        setViewMode("list")
                        setEditingProduct(null)
                    }}
                    isLoading={isSaving}
                    onCategoryCreated={(newCat) => setCategories((prev) => [...prev, newCat])}
                />
            ) : (
                <>
                    <div className="tieu-de-trang">
                        <div>
                            <p className="loi-chao">Quản lý bán hàng</p>
                            <h1>Sản phẩm</h1>
                            <p className="mo-ta">Quản lý danh mục, giá bán và tình trạng tồn kho.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="nut-loc"
                                onClick={loadData}
                                disabled={isLoading}
                            >
                                <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                                Làm mới
                            </button>
                            <button
                                type="button"
                                className="nut-chinh"
                                onClick={() => setViewMode("create")}
                            >
                                <Plus size={17} />
                                Thêm sản phẩm
                            </button>
                        </div>
                    </div>

                    <div className="the-noi-dung bang-du-lieu space-y-4">
                        {/* Thanh tìm kiếm */}
                        <div className="relative max-w-sm">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Tìm theo tên sản phẩm, mã SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Danh sách bảng sản phẩm */}
                        {isLoading ? (
                            <div className="flex h-64 items-center justify-center">
                                <RefreshCw className="size-8 animate-spin text-[#5b5bd6]" />
                            </div>
                        ) : products.length === 0 ? (
                            <section className="trang-rong">
                                <div className="icon-trang-rong">
                                    <Package size={32} />
                                </div>
                                <h2>Không gian quản lý sản phẩm</h2>
                                <p>Cửa hàng hiện chưa có sản phẩm thực tế trong cơ sở dữ liệu. Nhấn nút &quot;Thêm sản phẩm&quot; để bắt đầu đưa sản phẩm lên kệ.</p>
                                <button
                                    type="button"
                                    className="nut-chinh"
                                    onClick={() => setViewMode("create")}
                                >
                                    <Plus size={17} />
                                    Thêm sản phẩm mới
                                </button>
                            </section>
                        ) : (
                            <div className="bang-cuon">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Ảnh</th>
                                            <th>Sản phẩm / SKU</th>
                                            <th>Danh mục</th>
                                            <th>Giá bán</th>
                                            <th>Biến thể</th>
                                            <th>Trạng thái</th>
                                            <th style={{ textAlign: 'right' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((prod) => {
                                            const firstImg = prod.images?.[0]?.url
                                            const totalStock = prod.variants?.reduce(
                                                (sum, v) => sum + (v.stock || 0),
                                                0
                                            )

                                            return (
                                                <tr key={prod.id}>
                                                    <td>
                                                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                                                            {firstImg ? (
                                                                <img
                                                                    src={firstImg}
                                                                    alt={prod.name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        ;(e.target as any).src =
                                                                            "https://placehold.co/48x48?text=SP"
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Package className="size-5 text-slate-400" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <strong style={{ fontSize: '13px', color: '#1e293b' }}>{prod.name}</strong>
                                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Mã: {prod.sku}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span>{prod.category?.name || "Chưa phân loại"}</span>
                                                    </td>
                                                    <td>
                                                        <strong style={{ color: '#5b5bd6' }}>
                                                            {formatCurrency(prod.price)}
                                                        </strong>
                                                        {prod.salePrice ? (
                                                            <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                                                                {formatCurrency(prod.salePrice)}
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        {prod.variants?.length ? (
                                                            <div>
                                                                <span>{prod.variants.length} phân loại</span>
                                                                <span style={{ marginLeft: '4px', color: '#94a3b8' }}>
                                                                    (Kho: {totalStock})
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span style={{ color: '#94a3b8' }}>Không có biến thể</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {renderStatusBadge(prod.status)}
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingProduct(prod)
                                                                    setViewMode("edit")
                                                                }}
                                                                className="nut-loc"
                                                                style={{ height: '30px', padding: '0 8px' }}
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit2 size={13} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(prod.id, prod.name)}
                                                                className="nut-loc"
                                                                style={{ height: '30px', padding: '0 8px', color: '#ef4444' }}
                                                                title="Xóa sản phẩm"
                                                            >
                                                                <Trash2 size={13} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
