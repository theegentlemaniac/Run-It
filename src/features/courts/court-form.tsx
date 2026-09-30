"use client";

import { useActionState } from "react";
import { addCourt } from "@/features/courts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

export function CourtForm() {
  const [state, formAction, pending] = useActionState(addCourt, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={120} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" maxLength={250} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="surface">Surface</Label>
          <Select id="surface" name="surface" defaultValue="">
            <option value="">Select a surface</option>
            {["asphalt", "concrete", "wood", "rubber", "other"].map((surface) => (
              <option key={surface} value={surface}>
                {surface.charAt(0).toUpperCase() + surface.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="hoop_count">Number of hoops</Label>
          <Input id="hoop_count" name="hoop_count" type="number" min={1} max={32767} step={1} />
        </div>
      </div>
      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input name="lighting" type="checkbox" className="h-4 w-4 accent-accent" />
          Lighting
        </label>
        <label className="flex items-center gap-2">
          <input name="indoor" type="checkbox" className="h-4 w-4 accent-accent" />
          Indoor
        </label>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} maxLength={2000} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            min={-90}
            max={90}
            step="any"
            required
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            min={-180}
            max={180}
            step="any"
            required
          />
        </div>
      </div>
      <FormError message={state?.error} />
      <Button type="submit" pending={pending} className="w-full">
        {pending ? "Adding court…" : "Add court"}
      </Button>
    </form>
  );
}

