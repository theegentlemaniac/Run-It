"use client";

import { useActionState } from "react";
import { addCourt } from "@/features/courts/actions";

const fieldClassName =
  "w-full rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground dark:border-white/[.145]";

export function CourtForm() {
  const [state, formAction, pending] = useActionState(addCourt, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" required maxLength={120} className={fieldClassName} />
      </div>
      <div className="space-y-1">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <input id="address" name="address" maxLength={250} className={fieldClassName} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="surface" className="text-sm font-medium">
            Surface
          </label>
          <select id="surface" name="surface" defaultValue="" className={fieldClassName}>
            <option value="">Select a surface</option>
            {["asphalt", "concrete", "wood", "rubber", "other"].map((surface) => (
              <option key={surface} value={surface}>
                {surface.charAt(0).toUpperCase() + surface.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="hoop_count" className="text-sm font-medium">
            Number of hoops
          </label>
          <input
            id="hoop_count"
            name="hoop_count"
            type="number"
            min={1}
            max={32767}
            step={1}
            className={fieldClassName}
          />
        </div>
      </div>
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input name="lighting" type="checkbox" className="accent-current" />
          Lighting
        </label>
        <label className="flex items-center gap-2">
          <input name="indoor" type="checkbox" className="accent-current" />
          Indoor
        </label>
      </div>
      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={2000}
          className={fieldClassName}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="latitude" className="text-sm font-medium">
            Latitude
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            min={-90}
            max={90}
            step="any"
            required
            className={fieldClassName}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="longitude" className="text-sm font-medium">
            Longitude
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            min={-180}
            max={180}
            step="any"
            required
            className={fieldClassName}
          />
        </div>
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
        {pending ? "Adding court…" : "Add court"}
      </button>
    </form>
  );
}
