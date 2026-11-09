"use client";

import { useState } from "react";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import type { Comment } from "../types/comment.types";

type CommentListProps = {
  comments: Comment[];
  currentUserId?: string;
  onUpdate: (id: string, content: string) => Promise<void>;
  onDelete: (comment: Comment) => void;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function CommentList({
  comments,
  currentUserId,
  onUpdate,
  onDelete,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (comments.length === 0) {
    return (
      <p className="rounded-sm bg-slate-50 px-4 py-6 text-center text-sm text-neutral-500">
        Chưa có bình luận nào cho sản phẩm này.
      </p>
    );
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingValue(comment.content);
  };

  const saveEdit = async (id: string) => {
    if (!editingValue.trim()) {
      window.alert("Nội dung bình luận không được để trống.");
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(id, editingValue.trim());
      setEditingId(null);
      setEditingValue("");
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Không thể cập nhật bình luận."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ul className="divide-y divide-slate-100">
      {comments.map((comment) => {
        const isMine = comment.user.id === currentUserId;
        const isEditing = editingId === comment.id;

        return (
          <li key={comment.id} className="py-3">
            <div className="flex items-start gap-2">
              <Avatar size="sm">
                {comment.user.image ? (
                  <AvatarImage
                    src={comment.user.image}
                    alt={comment.user.name}
                  />
                ) : null}
                <AvatarFallback className="bg-orange-50 text-xs font-bold text-primary">
                  {comment.user.name?.slice(0, 1).toUpperCase() || "K"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-neutral-800">
                    {comment.user.name}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {formatDateTime(comment.createdAt)}
                  </span>
                </div>

                {isEditing ? (
                  <div className="mt-1.5">
                    <textarea
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      rows={3}
                      maxLength={1000}
                      className="w-full resize-y rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(comment.id)}
                        disabled={isSaving}
                        className="flex h-8 items-center gap-1 rounded-sm bg-primary px-3 text-xs font-semibold text-white disabled:opacity-60"
                      >
                        {isSaving && (
                          <LoaderCircle
                            className="size-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        )}
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="h-8 rounded-sm border border-slate-200 px-3 text-xs text-neutral-600"
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1 whitespace-pre-line text-sm leading-5 text-neutral-700">
                    {comment.content}
                  </p>
                )}

                {comment.isHidden ? (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    Bình luận đang bị ẩn
                  </p>
                ) : null}

                {isMine && !isEditing ? (
                  <div className="mt-1.5 flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => startEdit(comment)}
                      className="inline-flex items-center gap-1 text-neutral-500 hover:text-primary"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment)}
                      className="inline-flex items-center gap-1 text-neutral-500 hover:text-red-600"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Xoá
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
