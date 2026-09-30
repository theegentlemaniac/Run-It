import { getAge } from "@/lib/date";
import { getProfile } from "@/features/profile/queries";
import { ProfileForm } from "@/features/profile/profile-form";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProfileIcon } from "@/components/ui/icons";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <EmptyState
        icon={<ProfileIcon size={24} />}
        title="Profile not available"
        description="Your profile is not available yet."
      />
    );
  }

  const age = profile.date_of_birth ? getAge(profile.date_of_birth) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide sm:text-3xl">Your profile</h1>
        <p className="text-sm text-muted">Keep your player details up to date.</p>
      </div>
      <Card className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Age</p>
          <p className="font-medium">{age ?? "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Home court</p>
          <p className="font-medium">
            {profile.home_court_name ??
              (profile.home_court_id ? "Court unavailable" : "Not set")}
          </p>
        </div>
      </Card>
      <Card>
        <ProfileForm profile={profile} />
      </Card>
    </div>
  );
}

