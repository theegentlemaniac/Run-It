"use client";

import { useActionState } from "react";
import { createGame } from "@/features/games/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

export function GameForm({
  courts,
}: {
  courts: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(createGame, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required maxLength={120} />
      </div>
      <div>
        <Label htmlFor="court_id">Court</Label>
        <Select id="court_id" name="court_id" required defaultValue="">
          <option value="" disabled>Select a court</option>
          {courts.map((court) => (
            <option key={court.id} value={court.id}>{court.name}</option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="start_time">Start time</Label>
          <Input id="start_time" name="start_time" type="datetime-local" required />
        </div>
        <div>
          <Label htmlFor="max_players">Maximum players</Label>
          <Input
            id="max_players"
            name="max_players"
            type="number"
            min={2}
            max={100}
            defaultValue={10}
            required
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select id="visibility" name="visibility">
            <option value="open">Open</option>
            <option value="invite_only">Invite only</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="skill_level">Skill level</Label>
          <Select id="skill_level" name="skill_level" defaultValue="">
            <option value="">Any level</option>
            {["beginner", "intermediate", "advanced", "pro"].map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} maxLength={2000} />
      </div>
      <FormError message={state?.error} />
      <Button type="submit" pending={pending} className="w-full">
        {pending ? "Creating game…" : "Create game"}
      </Button>
    </form>
  );
}

