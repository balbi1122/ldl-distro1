/*
 * LoanService.ts — Supabase service for LiteDOC.LOANS loan leads
 *
 * ─── SQL: Create the loan_leads table ────────────────────────────────────────
 *
 * create table public.loan_leads (
 *   id                    uuid primary key default gen_random_uuid(),
 *   loan_type             text check (loan_type in ('dscr','fix_flip','ground_up')),
 *   full_name             text not null,
 *   email                 text not null,
 *   phone                 text not null,
 *   property_address      text,
 *   property_type         text check (property_type in
 *                           ('single_family','multi_family','condo','commercial','land','other')),
 *   property_state        text,
 *   estimated_value       text,
 *   purchase_price        text,
 *   loan_amount           text,
 *   estimated_ltv         text,
 *   timeline              text check (timeline in
 *                           ('asap','1_month','2_3_months','3_plus_months')),
 *   credit_score_range    text check (credit_score_range in
 *                           ('below_600','600_649','650_699','700_749','750_plus')),
 *   real_estate_experience text check (real_estate_experience in
 *                           ('first_time','1_3_deals','4_10_deals','10_plus_deals')),
 *   monthly_rent          text,
 *   rehab_budget          text,
 *   after_repair_value    text,
 *   lot_owned             boolean,
 *   construction_budget   text,
 *   status                text check (status in
 *                           ('new','contacted','in_progress','closed','lost'))
 *                           default 'new',
 *   notes                 text,
 *   created_at            timestamptz default now(),
 *   contacted_at          timestamptz
 * );
 *
 * -- Enable RLS and allow service role full access
 * alter table public.loan_leads enable row level security;
 * create policy "Service role full access" on public.loan_leads
 *   using (true) with check (true);
 *
 * -- Allow anonymous inserts (for application form submissions)
 * create policy "Anon insert" on public.loan_leads for insert
 *   to anon with check (true);
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoanType = "dscr" | "fix_flip" | "ground_up";

export type LoanLeadStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "closed"
  | "lost";

export interface LoanLeadInput {
  loan_type: LoanType;
  full_name: string;
  email: string;
  phone: string;
  property_address?: string;
  property_type?:
    | "single_family"
    | "multi_family"
    | "condo"
    | "commercial"
    | "land"
    | "other";
  property_state?: string;
  estimated_value?: string;
  purchase_price?: string;
  loan_amount?: string;
  estimated_ltv?: string;
  timeline?: "asap" | "1_month" | "2_3_months" | "3_plus_months";
  credit_score_range?:
    | "below_600"
    | "600_649"
    | "650_699"
    | "700_749"
    | "750_plus";
  real_estate_experience?:
    | "first_time"
    | "1_3_deals"
    | "4_10_deals"
    | "10_plus_deals";
  monthly_rent?: string;
  rehab_budget?: string;
  after_repair_value?: string;
  lot_owned?: boolean;
  construction_budget?: string;
  notes?: string;
}

export interface LoanLead extends LoanLeadInput {
  id: string;
  status: LoanLeadStatus;
  created_at: string;
  contacted_at?: string;
}

// ─── Supabase client helper ───────────────────────────────────────────────────

function getClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
    );
  }

  return createClient(url, key);
}

// ─── Service class ────────────────────────────────────────────────────────────

class LoanService {
  async submit(
    input: LoanLeadInput
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const supabase = getClient();
      const { data, error } = await supabase
        .from("loan_leads")
        .insert([input])
        .select("id")
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, id: data?.id };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  async getAll(): Promise<{
    success: boolean;
    data?: LoanLead[];
    error?: string;
  }> {
    try {
      const supabase = getClient();
      const { data, error } = await supabase
        .from("loan_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return { success: false, error: error.message };
      return { success: true, data: (data as LoanLead[]) ?? [] };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  async updateStatus(
    id: string,
    status: LoanLeadStatus,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getClient();
      const update: Record<string, unknown> = { status };
      if (notes !== undefined) update.notes = notes;
      if (status === "contacted") update.contacted_at = new Date().toISOString();

      const { error } = await supabase
        .from("loan_leads")
        .update(update)
        .eq("id", id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getClient();
      const { error } = await supabase
        .from("loan_leads")
        .delete()
        .eq("id", id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }
}

export const loanService = new LoanService();
