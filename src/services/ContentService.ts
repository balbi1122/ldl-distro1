/**
 * ContentService — handles all content submission CRUD via Supabase.
 *
 * HOW TO ACTIVATE:
 *   1. Create a `submissions` table in your Supabase dashboard (SQL below).
 *   2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.
 *   3. Replace the mock data in AdminPage.tsx with real calls to this service.
 *
 * ─── Supabase SQL to create the table ───────────────────────────────────────
 *
 * create table public.submissions (
 *   id              uuid default gen_random_uuid() primary key,
 *   title           text not null,
 *   content_type    text not null check (content_type in ('poem','story','video')),
 *   era             text not null,
 *   body            text,
 *   video_url       text,
 *   ai_assisted     boolean default false,
 *   ai_details      text,
 *   is_original     boolean not null default false,
 *   no_copyright    boolean not null default false,
 *   accepts_terms   boolean not null default false,
 *   status          text default 'pending' check (status in ('pending','approved','rejected')),
 *   author_id       uuid references auth.users(id),
 *   author_name     text,
 *   author_email    text,
 *   created_at      timestamptz default now(),
 *   reviewed_at     timestamptz,
 *   reviewed_by     uuid references auth.users(id)
 * );
 *
 * -- Enable Row Level Security
 * alter table public.submissions enable row level security;
 *
 * -- Members can insert their own submissions
 * create policy "members can submit"
 *   on public.submissions for insert
 *   with check (auth.uid() = author_id);
 *
 * -- Members can read approved submissions
 * create policy "public can read approved"
 *   on public.submissions for select
 *   using (status = 'approved');
 *
 * -- Admins (service role) can read and update all submissions
 * -- (handled via the service role key on the server side)
 *
 * ────────────────────────────────────────────────────────────────────────────
 */

import { createClient } from "@supabase/supabase-js";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ContentType = "poem" | "story" | "video";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface SubmissionInput {
  title: string;
  contentType: ContentType;
  era: string;
  body?: string;
  videoUrl?: string;
  aiAssisted: boolean;
  aiDetails?: string;
  isOriginal: boolean;
  noCopyright: boolean;
  acceptsTerms: boolean;
  authorName?: string;
  authorEmail?: string;
}

export interface Submission extends SubmissionInput {
  id: string;
  status: SubmissionStatus;
  authorId?: string;
  createdAt: string;
  reviewedAt?: string;
}

// ─── Supabase client ─────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Client is only created if env vars are present
const getClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
    );
  }
  return createClient(supabaseUrl, supabaseKey);
};

// ─── ContentService ──────────────────────────────────────────────────────────

class ContentService {
  /**
   * Submit a new piece of content.
   * Called from SubmitPage.tsx on form submission.
   */
  async submit(
    input: SubmissionInput
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const supabase = getClient();
      const { data, error } = await supabase
        .from("submissions")
        .insert([
          {
            title: input.title,
            content_type: input.contentType,
            era: input.era,
            body: input.body ?? null,
            video_url: input.videoUrl ?? null,
            ai_assisted: input.aiAssisted,
            ai_details: input.aiDetails ?? null,
            is_original: input.isOriginal,
            no_copyright: input.noCopyright,
            accepts_terms: input.acceptsTerms,
            author_name: input.authorName ?? null,
            author_email: input.authorEmail ?? null,
            status: "pending",
          },
        ])
        .select("id")
        .single();

      if (error) throw error;

      return { success: true, id: data.id };
    } catch (err) {
      console.error("ContentService.submit error:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Fetch all submissions (admin use — requires service role or admin RLS policy).
   */
  async getAll(): Promise<{ success: boolean; data?: Submission[]; error?: string }> {
    try {
      const supabase = getClient();
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: Submission[] = (data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        contentType: row.content_type,
        era: row.era,
        body: row.body,
        videoUrl: row.video_url,
        aiAssisted: row.ai_assisted,
        aiDetails: row.ai_details,
        isOriginal: row.is_original,
        noCopyright: row.no_copyright,
        acceptsTerms: row.accepts_terms,
        status: row.status,
        authorId: row.author_id,
        authorName: row.author_name,
        authorEmail: row.author_email,
        createdAt: row.created_at,
        reviewedAt: row.reviewed_at,
      }));

      return { success: true, data: mapped };
    } catch (err) {
      console.error("ContentService.getAll error:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Fetch all approved submissions (public-facing browse page).
   */
  async getApproved(filters?: {
    era?: string;
    contentType?: ContentType;
  }): Promise<{ success: boolean; data?: Submission[]; error?: string }> {
    try {
      const supabase = getClient();
      let query = supabase
        .from("submissions")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (filters?.era) query = query.eq("era", filters.era);
      if (filters?.contentType) query = query.eq("content_type", filters.contentType);

      const { data, error } = await query;
      if (error) throw error;

      const mapped: Submission[] = (data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        contentType: row.content_type,
        era: row.era,
        body: row.body,
        videoUrl: row.video_url,
        aiAssisted: row.ai_assisted,
        aiDetails: row.ai_details,
        isOriginal: row.is_original,
        noCopyright: row.no_copyright,
        acceptsTerms: row.accepts_terms,
        status: row.status,
        authorName: row.author_name,
        createdAt: row.created_at,
      }));

      return { success: true, data: mapped };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Update the status of a submission (admin action).
   */
  async updateStatus(
    id: string,
    status: SubmissionStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getClient();
      const { error } = await supabase
        .from("submissions")
        .update({ status, reviewed_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  /**
   * Delete a submission (admin only).
   */
  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getClient();
      const { error } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }
}

export const contentService = new ContentService();
export default ContentService;
