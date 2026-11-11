import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 text-slate-600 hover:text-orange-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
      >
        <ChevronLeft className="size-5" />
      </button>
      
      <span className="text-sm font-medium text-slate-700">
        Trang {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 text-slate-600 hover:text-orange-600 disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
