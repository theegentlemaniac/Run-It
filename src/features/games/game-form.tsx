"use client";

import { useActionState } from "react";
import { createGame } from "@/features/games/actions";

const fieldClassName =
  "w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]";

export function GameForm({
  courts,
}: {
  courts: Array<{ id: string; name: string }>;
}) {
  const [state, formAction, pending] = useActionState(createGame, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input id="title" name="title" required maxLength={120} className={fieldClassName} />
      </div>
      <div className="space-y-1">
        <label htmlFor="court_id" className="text-sm font-medium">Court</label>
        <select id="court_id" name="court_id" required defaultValue="" className={fieldClassName}>
          <option value="" disabled>Select a court</option>
          {courts.map((court) => (
            <option key={court.id} value={court.id}>{court.name}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="start_time" className="text-sm font-medium">Start time</label>
          <input
            id="start_time"
            name="start_time"
            type="datetime-local"
            required
            className={fieldClassName}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="max_players" className="text-sm font-medium">Maximum players</label>
          <input
            id="max_players"
            name="max_players"
            type="number"
            min={2}
            max={100}
            defaultValue={10}
            required
            className={fieldClassName}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="visibility" className="text-sm font-medium">Visibility</label>
          <select id="visibility" name="visibility" className={fieldClassName}>
            <option value="open">Open</option>
            <option value="invite_only">Invite only</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="skill_level" className="text-sm font-medium">Skill level</label>
          <select id="skill_level" name="skill_level" defaultValue="" className={fieldClassName}>
            <option value="">Any level</option>
            {["beginner", "intermediate", "advanced", "pro"].map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <textarea id="notes" name="notes" rows={4} maxLength={2000} className={fieldClassName} />
      </div>
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
        {pending ? "Creating game…" : "Create game"}
      </button>
    </form>
  );
}
