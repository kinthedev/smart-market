"use client";

import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { CommentApiService } from "../api/comment.service";

type CommentFormProps = {
  productId: string;
  onSuccess: () => void;
};

export function CommentForm({ productId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bình luận.");
      return;
    }

    setIsSubmitting(true);
    try {
      await CommentApiService.createComment(productId, content.trim());
      setContent("");
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể gửi bình luận."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Viết bình luận của bạn về sản phẩm..."
        className="w-full resize-y rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
      />

      {error ? (
        <p className="mt-2 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-9 items-center justify-center gap-1.5 rounded-sm bg-primary px-4 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          Gửi bình luận
        </button>
      </div>
    </form>
  );
}
