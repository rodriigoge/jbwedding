import { createClient } from "@supabase/supabase-js";

type RsvpStatus = "confirmed" | "declined" | "pending";

type Database = {
  public: {
    Tables: {
      rsvp_confirmations: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          companions: number;
          status: RsvpStatus;
          notes: string | null;
          total_people: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone?: string | null;
          companions: number;
          status: RsvpStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string | null;
          companions?: number;
          status?: RsvpStatus;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://ziyjazqtbxnumvqhlnte.supabase.co";

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_7aI4jadWFFhEZdHGkaUoTg_TniCXM2M";

let browserClient: ReturnType<typeof createClient<Database, "public">> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient<Database, "public">(
      supabaseUrl,
      supabasePublishableKey,
    );
  }

  return browserClient;
}
