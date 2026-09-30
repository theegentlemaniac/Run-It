"use client";

import { useActionState } from "react";
import { addCourtReview } from "@/features/courts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

export function ReviewForm({ courtId }: { courtId: string }) {
  const [state, formAction, pending] = useActionState(addCourtReview, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="courtId" value={courtId} />
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select id="rating" name="rating" required defaultValue="5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} {rating === 1 ? "star" : "stars"}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" name="comment" rows={3} maxLength={2000} />
      </div>
      <div>
        <Label htmlFor="tags">
          Tags <span className="font-normal text-muted">(comma-separated)</span>
        </Label>
        <Input id="tags" name="tags" maxLength={400} placeholder="Well maintained, busy" />
      </div>
      <FormError message={state?.error} />
      <Button type="submit" pending={pending}>
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}

