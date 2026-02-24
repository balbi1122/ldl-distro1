import { supabase, isSupabaseConfigured } from "./supabase";
import { Post, Category, Profile } from "../types";
import {
  MOCK_POSTS,
  MOCK_CATEGORIES,
  MOCK_PROFILES,
} from "./mockData";

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export async function fetchFeaturedPosts(limit = 4): Promise<Post[]> {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS.filter((p) => p.is_featured).slice(0, limit);
  }
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*), category:categories(*)")
    .eq("is_approved", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Post[]) ?? [];
}

export async function fetchRecentPosts(limit = 12): Promise<Post[]> {
  if (!isSupabaseConfigured) {
    return [...MOCK_POSTS]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, limit);
  }
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*), category:categories(*)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Post[]) ?? [];
}

export async function fetchPostsByCategory(
  categoryId: string,
  limit = 20,
): Promise<Post[]> {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS.filter((p) => p.category_id === categoryId).slice(
      0,
      limit,
    );
  }
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*), category:categories(*)")
    .eq("category_id", categoryId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Post[]) ?? [];
}

export async function fetchPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS.find((p) => p.id === id) ?? null;
  }
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*), category:categories(*)")
    .eq("id", id)
    .single();

  if (data) {
    // Increment view count
    await supabase.rpc("increment_view_count", { post_id: id });
  }

  return (data as Post) ?? null;
}

export async function fetchAllPostsAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured) return MOCK_POSTS;
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*), category:categories(*)")
    .order("created_at", { ascending: false });
  return (data as Post[]) ?? [];
}

export async function createPost(
  post: Omit<Post, "id" | "created_at" | "updated_at" | "view_count" | "like_count" | "is_approved" | "is_featured">,
): Promise<{ data: Post | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      is_approved: true,
      is_featured: false,
      view_count: 0,
      like_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_POSTS.unshift(newPost);
    return { data: newPost, error: null };
  }
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, is_approved: true, is_featured: false, view_count: 0, like_count: 0 })
    .select()
    .single();
  return { data: data as Post, error: error ? new Error(error.message) : null };
}

export async function updatePostStatus(
  id: string,
  updates: Partial<Pick<Post, "is_approved" | "is_featured">>,
): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = MOCK_POSTS.findIndex((p) => p.id === id);
    if (idx > -1) Object.assign(MOCK_POSTS[idx], updates);
    return;
  }
  await supabase.from("posts").update(updates).eq("id", id);
}

export async function deletePost(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = MOCK_POSTS.findIndex((p) => p.id === id);
    if (idx > -1) MOCK_POSTS.splice(idx, 1);
    return;
  }
  await supabase.from("posts").delete().eq("id", id);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return MOCK_CATEGORIES;
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("name");
  return (data as Category[]) ?? [];
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  if (!isSupabaseConfigured) {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as Category) ?? null;
}

// ---------------------------------------------------------------------------
// Users / Profiles
// ---------------------------------------------------------------------------

export async function fetchAllUsersAdmin(): Promise<Profile[]> {
  if (!isSupabaseConfigured) return MOCK_PROFILES;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Profile[]) ?? [];
}

export async function updateUserTier(
  userId: string,
  tier: string,
): Promise<void> {
  if (!isSupabaseConfigured) {
    const p = MOCK_PROFILES.find((p) => p.id === userId);
    if (p) p.membership_tier = tier as Profile["membership_tier"];
    return;
  }
  await supabase
    .from("profiles")
    .update({ membership_tier: tier })
    .eq("id", userId);
}

export async function fetchUserPosts(userId: string): Promise<Post[]> {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS.filter((p) => p.author_id === userId);
  }
  const { data } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });
  return (data as Post[]) ?? [];
}
