"use client"

import * as React from "react"
import { Plus, Trash2, Image as ImageIcon, Loader2, FolderPlus } from "lucide-react"
import { Button } from "@/src/features/dashboard/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/src/components/ui/card"
import { ProductApiService } from "../api/product.service"
import type { Category, Product, ProductFormData, ProductStatus } from "../types/product.types"

interface ProductFormProps {
    initialData?: Product | null
    categories: Category[]
    onSubmit: (data: ProductFormData) => Promise<void>
    onCancel: () => void
    isLoading: boolean
    onCategoryCreated?: (newCategory: Category) => void
}

export function ProductForm({
    initialData,
    categories,
    onSubmit,
    onCancel,
    isLoading,
    onCategoryCreated,
}: ProductFormProps) {
    const [sku, setSku] = React.useState(initialData?.sku || "")
    const [name, setName] = React.useState(initialData?.name || "")
    const [description, setDescription] = React.useState(initialData?.description || "")
    const [price, setPrice] = React.useState<number>(initialData?.price || 0)
    const [salePrice, setSalePrice] = React.useState<number | "">(
        initialData?.salePrice !== undefined && initialData?.salePrice !== null
            ? initialData.salePrice
            : ""
    )
    const [categoryId, setCategoryId] = React.useState<string>(initialData?.categoryId || "")
    const [status, setStatus] = React.useState<ProductStatus>(initialData?.status || "ACTIVE")

    // Quản lý tạo nhanh danh mục
    const [isCreatingCategory, setIsCreatingCategory] = React.useState(false)
    const [newCategoryName, setNewCategoryName] = React.useState("")
    const [isSubmittingCat, setIsSubmittingCat] = React.useState(false)

    // Multi-image URLs state
    const [images, setImages] = React.useState<Array<{ url: string; altText?: string }>>(
        initialData?.images?.map((img) => ({ url: img.url, altText: img.altText || "" })) || [
            { url: "", altText: "" },
        ]
    )

    // Variants state (Kích thước, Màu sắc, Số lượng tồn kho)
    const [variants, setVariants] = React.useState<
        Array<{ size: string; color: string; stock: number }>
    >(
        initialData?.variants?.map((v) => ({
            size: v.size || "",
            color: v.color || "",
            stock: v.stock || 0,
        })) || [{ size: "", color: "", stock: 10 }]
    )

    const [errorMsg, setErrorMsg] = React.useState("")
    const [isUploading, setIsUploading] = React.useState<number | null>(null) // Đánh dấu đang upload ảnh nào

    const handleFileUpload = async (index: number, file: File) => {
        setIsUploading(index)
        const formData = new FormData()
        formData.append("image", file)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/upload`, {
                method: "POST",
                body: formData,
                credentials: "include", // Quan trọng để gửi kèm Session Cookie
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Upload ảnh thất bại")
            }
            
            const data = await response.json()
            handleImageChange(index, "url", data.url)
        } catch (err: any) {
            console.error(err)
            alert(err?.message || "Lỗi khi tải ảnh lên server!")
        } finally {
            setIsUploading(null)
        }
    }

    const handleAddImage = () => {
        setImages([...images, { url: "", altText: "" }])
    }

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleImageChange = (index: number, field: "url" | "altText", value: string) => {
        const next = [...images]
        next[index][field] = value
        setImages(next)
    }

    const handleAddVariant = () => {
        setVariants([...variants, { size: "", color: "", stock: 0 }])
    }

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    const handleVariantChange = (
        index: number,
        field: "size" | "color" | "stock",
        value: string | number
    ) => {
        const next = [...variants]
        if (field === "stock") {
            next[index].stock = Math.max(0, Number(value) || 0)
        } else {
            next[index][field] = String(value)
        }
        setVariants(next)
    }

    const handleCreateQuickCategory = async () => {
        if (!newCategoryName.trim()) return
        setIsSubmittingCat(true)
        try {
            const created = await ProductApiService.createCategory({ name: newCategoryName.trim() })
            onCategoryCreated?.(created)
            setCategoryId(created.id)
            setNewCategoryName("")
            setIsCreatingCategory(false)
        } catch (err: any) {
            alert(err.message || "Không thể tạo danh mục mới")
        } finally {
            setIsSubmittingCat(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")

        if (!name.trim()) {
            setErrorMsg("Vui lòng nhập tên sản phẩm.")
            return
        }
        if (!sku.trim()) {
            setErrorMsg("Vui lòng nhập mã sản phẩm (SKU).")
            return
        }
        if (price < 0) {
            setErrorMsg("Giá bán không hợp lệ.")
            return
        }

        const validImages = images
            .filter((img) => img.url.trim().length > 0)
            .map((img, idx) => ({
                url: img.url.trim(),
                altText: img.altText?.trim() || name,
                order: idx,
            }))

        const validVariants = variants
            .filter((v) => v.size?.trim() || v.color?.trim() || v.stock > 0)
            .map((v) => ({
                size: v.size.trim() || undefined,
                color: v.color.trim() || undefined,
                stock: v.stock,
            }))

        try {
            await onSubmit({
                sku: sku.trim(),
                name: name.trim(),
                description: description.trim() || undefined,
                price: Number(price),
                salePrice: salePrice === "" ? null : Number(salePrice),
                categoryId: categoryId || undefined,
                status,
                images: validImages,
                variants: validVariants,
            })
        } catch (err: any) {
            setErrorMsg(err.message || "Đã xảy ra lỗi khi lưu sản phẩm.")
        }
    }

    return (
        <Card className="max-w-4xl border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <CardTitle className="text-xl font-bold text-slate-800">
                    {initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </CardTitle>
                <p className="text-sm text-slate-500">
                    Điền đầy đủ thông tin chi tiết, hình ảnh và phân loại kích thước, màu sắc của sản phẩm.
                </p>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-6">
                    {errorMsg && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            {errorMsg}
                        </div>
                    )}

                    {/* Nhóm 1: Thông tin cơ bản */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="product-name" className="text-sm font-semibold text-slate-700">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="product-name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    if (!sku && !initialData) {
                                        // Gợi ý SKU tự động
                                        setSku(
                                            e.target.value
                                                .toLowerCase()
                                                .slice(0, 4)
                                                .toUpperCase() +
                                                "-" +
                                                Math.floor(1000 + Math.random() * 9000)
                                        )
                                    }
                                }}
                                placeholder="Ví dụ: Áo Thun Nam Thể Thao Cao Cấp..."
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="product-sku" className="text-sm font-semibold text-slate-700">
                                Mã sản phẩm (SKU) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="product-sku"
                                value={sku}
                                onChange={(e) => setSku(e.target.value.toUpperCase())}
                                placeholder="SP-1001"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="product-category" className="text-sm font-semibold text-slate-700">
                                    Danh mục sản phẩm
                                </Label>
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                                    className="flex items-center gap-1 text-xs font-medium text-[#5b5bd6] hover:underline"
                                >
                                    <FolderPlus size={13} />
                                    {isCreatingCategory ? "Hủy tạo" : "+ Thêm danh mục mới"}
                                </button>
                            </div>

                            {isCreatingCategory ? (
                                <div className="flex items-center gap-2 pt-1">
                                    <Input
                                        placeholder="Nhập tên danh mục mới..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="h-10 text-xs"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateQuickCategory}
                                        disabled={isSubmittingCat || !newCategoryName.trim()}
                                        className="nut-chinh"
                                        style={{ height: '38px', padding: '0 12px', whiteSpace: 'nowrap' }}
                                    >
                                        {isSubmittingCat ? "Đang lưu..." : "Lưu"}
                                    </button>
                                </div>
                            ) : (
                                <Select
                                    id="product-category"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="product-price" className="text-sm font-semibold text-slate-700">
                                Giá niêm yết (₫) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="product-price"
                                type="number"
                                min={0}
                                step="any"
                                value={price || ""}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                placeholder="250000"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="product-sale-price" className="text-sm font-semibold text-slate-700">
                                Giá khuyến mãi (₫) (Tùy chọn)
                            </Label>
                            <Input
                                id="product-sale-price"
                                type="number"
                                min={0}
                                step="any"
                                value={salePrice}
                                onChange={(e) =>
                                    setSalePrice(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                placeholder="199000"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="product-status" className="text-sm font-semibold text-slate-700">
                                Trạng thái kinh doanh
                            </Label>
                            <Select
                                id="product-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                            >
                                <option value="ACTIVE">Đang bán (ACTIVE)</option>
                                <option value="INACTIVE">Ngừng bán (INACTIVE)</option>
                                <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
                            </Select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="product-desc" className="text-sm font-semibold text-slate-700">
                                Mô tả chi tiết sản phẩm
                            </Label>
                            <Textarea
                                id="product-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Nhập chất liệu, hướng dẫn chọn size, thông số kỹ thuật..."
                            />
                        </div>
                    </div>

                    {/* Nhóm 2: Hình ảnh sản phẩm (Nhiều ảnh) */}
                    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/40 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <ImageIcon className="size-4 text-emerald-600" />
                                    Hình ảnh sản phẩm (URLs)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Thêm liên kết ảnh trực tiếp (Unsplash, Cloudinary, CDN...). Ảnh đầu tiên sẽ là ảnh chính.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddImage}
                                className="h-8 gap-1.5 text-xs font-medium"
                            >
                                <Plus className="size-3.5" /> Thêm ảnh
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-100">
                                        {img.url ? (
                                            <img
                                                src={img.url}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    ;(e.target as any).src = "https://placehold.co/40x40?text=Err"
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400">#{idx + 1}</span>
                                        )}
                                    </div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleFileUpload(idx, file)
                                        }}
                                        disabled={isUploading === idx}
                                        className="flex-1"
                                    />
                                    {isUploading === idx && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    {images.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="h-10 text-slate-400 hover:text-red-600"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nhóm 3: Phân loại biến thể (Kích thước, Màu sắc, Tồn kho) */}
                    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/40 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">
                                    Phân loại biến thể (Kích thước & Màu sắc)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Quản lý các biến thể kích cỡ (S, M, L, XL...), màu sắc và số lượng tồn kho tương ứng.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddVariant}
                                className="h-8 gap-1.5 text-xs font-medium"
                            >
                                <Plus className="size-3.5" /> Thêm biến thể
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {variants.map((v, idx) => (
                                <div key={idx} className="flex flex-wrap items-center gap-2 md:flex-nowrap">
                                    <div className="w-full md:w-1/3">
                                        <Input
                                            value={v.size}
                                            onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                                            placeholder="Kích thước (VD: M, L, 42...)"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <Input
                                            value={v.color}
                                            onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                                            placeholder="Màu sắc (VD: Đen, Trắng, Xanh...)"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/4">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={v.stock}
                                            onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                                            placeholder="Số lượng kho"
                                        />
                                    </div>
                                    {variants.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveVariant(idx)}
                                            className="h-10 text-slate-400 hover:text-red-600"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="nut-loc"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="nut-chinh"
                    >
                        {isLoading && <Loader2 className="mr-1 size-4 animate-spin" />}
                        {initialData ? "Lưu cập nhật" : "Tạo sản phẩm"}
                    </button>
                </CardFooter>
            </form>
        </Card>
    )
}
