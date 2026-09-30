import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/features/courts/review-form";
import { getCourtById, getCourtReviews } from "@/features/courts/queries";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StarIcon, LightbulbIcon, BuildingIcon } from "@/components/ui/icons";

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
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All courts
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl tracking-wide sm:text-3xl">{court.name}</h1>
            <p className="mt-1 text-sm text-muted">{court.address || "Address not provided"}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <StarIcon size={16} className="text-accent" />
            {averageRating === null
              ? "No ratings yet"
              : `${averageRating.toFixed(1)} / 5 (${reviews.length} ${
                  reviews.length === 1 ? "review" : "reviews"
                })`}
          </div>
        </div>
      </div>

      <Card>
        <CardTitle>Court details</CardTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {court.surface && <Badge>{court.surface}</Badge>}
          {court.hoop_count !== null && (
            <Badge>{court.hoop_count} {court.hoop_count === 1 ? "hoop" : "hoops"}</Badge>
          )}
          {court.lighting && (
            <Badge>
              <LightbulbIcon size={13} />
              Lighting
            </Badge>
          )}
          {court.indoor && (
            <Badge>
              <BuildingIcon size={13} />
              Indoor
            </Badge>
          )}
        </div>
        {court.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">
            {court.description}
          </p>
        )}
      </Card>

      <section className="space-y-4">
        <h2 className="font-display text-lg tracking-wide">Reviews</h2>
        {reviews.length === 0 ? (
          <EmptyState
            icon={<StarIcon size={22} />}
            title="No reviews yet"
            description="Be the first to review this court."
          />
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-1.5 font-medium">
                    <StarIcon size={15} className="text-accent" />
                    {review.rating} {review.rating === 1 ? "star" : "stars"}
                  </p>
                  <time dateTime={review.created_at} className="text-xs text-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </time>
                </div>
                {review.comment && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">
                    {review.comment}
                  </p>
                )}
                {review.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card>
        <CardTitle className="mb-4">Leave a review</CardTitle>
        <ReviewForm courtId={court.id} />
      </Card>
    </div>
  );
}

