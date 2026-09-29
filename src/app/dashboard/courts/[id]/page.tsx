import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/features/courts/review-form";
import { getCourtById, getCourtReviews } from "@/features/courts/queries";

export default async function CourtDetailPage({
  params,
}: PageProps<"/dashboard/courts/[id]">) {
  const { id } = await params;
  const court = await getCourtById(id);

  if (!court) {
    notFound();
  }

  const reviews = await getCourtReviews(id);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/courts"
          className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400"
        >
          ← All courts
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{court.name}</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {court.address || "Address not provided"}
            </p>
          </div>
          <p className="text-sm font-medium">
            {averageRating === null
              ? "No ratings yet"
              : `${averageRating.toFixed(1)} / 5 (${reviews.length} ${
                  reviews.length === 1 ? "review" : "reviews"
                })`}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-black/[.08] p-5 dark:border-white/[.145]">
        <h2 className="font-medium">Court details</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {court.surface && <span>{court.surface}</span>}
          {court.hoop_count !== null && (
            <span>{court.hoop_count} {court.hoop_count === 1 ? "hoop" : "hoops"}</span>
          )}
          {court.lighting && <span>Lighting</span>}
          {court.indoor && <span>Indoor</span>}
        </div>
        {court.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
            {court.description}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No reviews yet. Be the first to review this court.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-black/[.08] p-5 dark:border-white/[.145]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {review.rating} {review.rating === 1 ? "star" : "stars"}
                  </p>
                  <time
                    dateTime={review.created_at}
                    className="text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    {new Date(review.created_at).toLocaleDateString()}
                  </time>
                </div>
                {review.comment && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
                    {review.comment}
                  </p>
                )}
                {review.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/[.05] px-2.5 py-1 text-xs dark:bg-white/[.08]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-black/[.08] p-5 dark:border-white/[.145]">
        <h2 className="mb-4 font-medium">Leave a review</h2>
        <ReviewForm courtId={court.id} />
      </section>
    </div>
  );
}
