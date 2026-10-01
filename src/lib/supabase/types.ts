/**
 * Hand-authored types mirroring `supabase/migrations/0001_initial_schema.sql`.
 *
 * Once a Supabase project is linked, replace this file by running:
 *   supabase gen types typescript --linked > src/lib/supabase/types.ts
 */

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "pro";
export type CourtSurface = "asphalt" | "concrete" | "wood" | "rubber" | "other";
export type MediaType = "photo" | "video";
export type GameVisibility = "open" | "invite_only";
export type GameStatus = "scheduled" | "active" | "completed" | "cancelled";
export type RsvpStatus = "going" | "maybe" | "not_going";
export type LiveGameStatus = "active" | "completed" | "cancelled";
export type ScoreEventType = "point" | "undo" | "foul" | "timeout" | "note";

/**
 * `public.courts.location` is a PostGIS `geography(Point, 4326)` column.
 * PostgREST may represent it as GeoJSON, a WKT/EWKT string, or a
 * hex-encoded WKB string depending on how it's selected. Use
 * `courtLocationToCoordinates` from `@/features/courts/coordinates` to
 * safely normalize any of these into `{ latitude, longitude }`.
 */
export type CourtLocationValue =
  | string
  | { type: string; coordinates: unknown }
  | null;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          position: string | null;
          skill_rating: SkillLevel;
          home_court_id: string | null;
          looking_to_play: boolean;
          looking_to_play_times: unknown | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      courts: {
        Row: {
          id: string;
          name: string;
          location: CourtLocationValue;
          address: string | null;
          surface: CourtSurface | null;
          hoop_count: number | null;
          lighting: boolean;
          indoor: boolean;
          description: string | null;
          source: "user_added" | "google_place_id";
          external_place_id: string | null;
          created_by: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["courts"]["Row"]> & {
          name: string;
          location: string;
        };
        Update: Partial<Database["public"]["Tables"]["courts"]["Row"]>;
        Relationships: [];
      };
      court_media: {
        Row: {
          id: string;
          court_id: string;
          user_id: string | null;
          url: string;
          type: MediaType;
          caption: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["court_media"]["Row"]> & {
          court_id: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["court_media"]["Row"]>;
        Relationships: [];
      };
      court_reviews: {
        Row: {
          id: string;
          court_id: string;
          user_id: string;
          rating: number;
          tags: string[];
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["court_reviews"]["Row"]> & {
          court_id: string;
          user_id: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["court_reviews"]["Row"]>;
        Relationships: [];
      };
      games: {
        Row: {
          id: string;
          court_id: string;
          host_id: string;
          title: string;
          start_time: string;
          end_time: string | null;
          visibility: GameVisibility;
          skill_level: SkillLevel | null;
          max_players: number;
          status: GameStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["games"]["Row"]> & {
          court_id: string;
          host_id: string;
          title: string;
          start_time: string;
        };
        Update: Partial<Database["public"]["Tables"]["games"]["Row"]>;
        Relationships: [];
      };
      game_rsvps: {
        Row: {
          id: string;
          game_id: string;
          user_id: string;
          status: RsvpStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["game_rsvps"]["Row"]> & {
          game_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["game_rsvps"]["Row"]>;
        Relationships: [];
      };
      live_games: {
        Row: {
          id: string;
          court_id: string;
          game_id: string | null;
          started_at: string;
          ended_at: string | null;
          status: LiveGameStatus;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["live_games"]["Row"]> & {
          court_id: string;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["live_games"]["Row"]>;
        Relationships: [];
      };
      live_game_teams: {
        Row: {
          id: string;
          live_game_id: string;
          name: string;
          color: string | null;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["live_game_teams"]["Row"]> & {
          live_game_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["live_game_teams"]["Row"]>;
        Relationships: [];
      };
      live_game_team_players: {
        Row: {
          id: string;
          team_id: string;
          user_id: string | null;
          guest_name: string | null;
          jersey_number: number | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["live_game_team_players"]["Row"]
        > & { team_id: string };
        Update: Partial<
          Database["public"]["Tables"]["live_game_team_players"]["Row"]
        >;
        Relationships: [];
      };
      score_events: {
        Row: {
          id: string;
          live_game_id: string;
          team_id: string;
          player_id: string | null;
          points: number;
          event_type: ScoreEventType;
          created_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["score_events"]["Row"]> & {
          live_game_id: string;
          team_id: string;
          created_by: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      game_rsvp_counts: {
        Args: { _game_ids: string[] };
        Returns: { game_id: string; going_count: number }[];
      };
    };
  };
}
