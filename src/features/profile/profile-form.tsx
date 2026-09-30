"use client";

import { useActionState } from "react";
import { updateProfile } from "@/features/profile/actions";

const fieldClassName =
  "w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]";

export function ProfileForm({
  profile,
}: {
  profile: {
    full_name: string | null;
    position: string | null;
    skill_rating: string;
    bio: string | null;
    looking_to_play: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="full_name" className="text-sm font-medium">Full name</label>
        <input
          id="full_name"
          name="full_name"
          required
          maxLength={160}
          defaultValue={profile.full_name ?? ""}
          className={fieldClassName}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="position" className="text-sm font-medium">Position</label>
          <select
            id="position"
            name="position"
            required
            defaultValue={profile.position ?? ""}
            className={fieldClassName}
          >
            <option value="" disabled>Select a position</option>
            {["PG", "SG", "SF", "PF", "C"].map((position) => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="skill_rating" className="text-sm font-medium">Skill rating</label>
          <select
            id="skill_rating"
            name="skill_rating"
            required
            defaultValue={profile.skill_rating}
            className={fieldClassName}
          >
            {["beginner", "intermediate", "advanced", "pro"].map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={2000}
          defaultValue={profile.bio ?? ""}
          className={fieldClassName}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          name="looking_to_play"
          type="checkbox"
          defaultChecked={profile.looking_to_play}
          className="accent-current"
        />
        Looking to play
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
