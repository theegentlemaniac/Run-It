import { getAge } from "@/lib/date";
import { getProfile } from "@/features/profile/queries";
import { ProfileForm } from "@/features/profile/profile-form";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <div className="rounded-xl border border-dashed border-black/[.08] p-8 text-center dark:border-white/[.145]">
        <p className="text-zinc-500 dark:text-zinc-400">
          Your profile is not available yet.
        </p>
      </div>
    );
  }

  const age = profile.date_of_birth ? getAge(profile.date_of_birth) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Keep your player details up to date.
        </p>
      </div>
      <dl className="grid gap-4 rounded-xl border border-black/[.08] p-5 sm:grid-cols-2 dark:border-white/[.145]">
        <div>
          <dt className="text-sm text-zinc-500 dark:text-zinc-400">Age</dt>
          <dd className="font-medium">{age ?? "Not provided"}</dd>
        </div>
        <div>
          <dt className="text-sm text-zinc-500 dark:text-zinc-400">Home court</dt>
          <dd className="font-medium">
            {profile.home_court_name ??
              (profile.home_court_id ? "Court unavailable" : "Not set")}
          </dd>
        </div>
      </dl>
      <div className="rounded-xl border border-black/[.08] p-6 dark:border-white/[.145]">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
