"use client";

import { useActionState } from "react";
import { addCourtReview } from "@/features/courts/actions";

export function ReviewForm({ courtId }: { courtId: string }) {
  const [state, formAction, pending] = useActionState(addCourtReview, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courtId" value={courtId} />
      <div className="space-y-1">
        <label htmlFor="rating" className="text-sm font-medium">
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          required
          defaultValue="5"
          className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm dark:border-white/[.145]"
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} {rating === 1 ? "star" : "stars"}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="comment" className="text-sm font-medium">
          Comment
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          maxLength={2000}
          className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm dark:border-white/[.145]"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags <span className="font-normal text-zinc-500">(comma-separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          maxLength={400}
          placeholder="Well maintained, busy"
          className="w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm dark:border-white/[.145]"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
