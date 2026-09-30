"use client";

import { useActionState } from "react";
import { updateProfile } from "@/features/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

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
      <div>
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          maxLength={160}
          defaultValue={profile.full_name ?? ""}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="position">Position</Label>
          <Select id="position" name="position" required defaultValue={profile.position ?? ""}>
            <option value="" disabled>Select a position</option>
            {["PG", "SG", "SF", "PF", "C"].map((position) => (
              <option key={position} value={position}>{position}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="skill_rating">Skill rating</Label>
          <Select id="skill_rating" name="skill_rating" required defaultValue={profile.skill_rating}>
            {["beginner", "intermediate", "advanced", "pro"].map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={2000}
          defaultValue={profile.bio ?? ""}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          name="looking_to_play"
          type="checkbox"
          defaultChecked={profile.looking_to_play}
          className="h-4 w-4 accent-accent"
        />
        Looking to play
      </label>
      <FormError message={state?.error} />
      <Button type="submit" pending={pending} className="w-full">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

