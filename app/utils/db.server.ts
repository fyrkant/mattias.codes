import { marked } from "marked";
import invariant from "tiny-invariant";
import { supabaseStrategy } from "~/auth.server";
import { supabaseClient } from "~/supabase.server";
import { Post, Tag } from "~/types";

async function maybeSetSupabaseClientSession(request: Request) {
  const session = await supabaseStrategy.checkSession(request);
  if (session?.access_token) {
    supabaseClient.auth.setAuth(session?.access_token);
  }
}

async function doAddPost(request: Request, prevSlug?: string): Promise<string> {
  const form = await request.formData();
  const title = form.get("title");
  const published = form.get("publish") === "on";
  const slug = form.get("slug");
  const content = form.get("content");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof content === "string", "content must be a string");

  await maybeSetSupabaseClientSession(request);
  const html = marked(content);

  const p = {
    title,
    slug,
    content,
    published,
    html,
  };

  try {
    if (!!prevSlug) {
      console.log({ p, prevSlug });
      const r = await supabaseClient
        .from("post")
        .update(p)
        .match({ slug: prevSlug });
      if (r.error !== null) {
        throw new Error(r.error.message);
      }
    } else {
      const r = await supabaseClient.from("post").insert([p]);
      if (r.error !== null) {
        throw new Error(r.error.message);
      }
    }
  } catch (error) {
    throw error;
  }

  return slug;
}

export const addPost = async (request: Request): Promise<string> => {
  return doAddPost(request);
};

export const editPost = async (
  request: Request,
  prevSlug: string
): Promise<string> => {
  return doAddPost(request, prevSlug);
};

export const getTagFromName = async (
  request: Request,
  name: string
): Promise<Tag | null> => {
  await maybeSetSupabaseClientSession(request);
  const res = await supabaseClient
    .from<Tag>("tags")
    .select("*")
    .eq("name", name)
    .single();

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res.data;
};

export const getTags = async (request: Request): Promise<Tag[]> => {
  await maybeSetSupabaseClientSession(request);
  const res = await supabaseClient.from<Tag>("tags").select("*");

  if (res.error) {
    throw new Error(res.error.message);
  }
  console.log(res.data);
  return res.data || [];
};

export async function getPostsTitleList(
  request: Request
): Promise<{ slug: string; title: string; published: boolean }[]> {
  await maybeSetSupabaseClientSession(request);

  const res = await supabaseClient
    .from<{
      slug: string;
      title: string;
      published: boolean;
      created_at: string;
    }>("post")
    .select("title, slug, published, tags")
    .order("created_at", { ascending: false });

  if (res.error) {
    throw new Error(res.error.message);
  }
  console.log(res.data);

  return res.data || [];
}

export const getPostsWithTag = async (
  request: Request,
  tagName: string
): Promise<Post[]> => {
  await maybeSetSupabaseClientSession(request);

  const res = await supabaseClient
    .from<Post>("post")
    .select("*")
    .contains("tags", [tagName]);

  return res.data || [];
};

export async function getPostFromSlug(
  request: Request,
  slug: string
): Promise<Post | null> {
  await maybeSetSupabaseClientSession(request);
  const data = await supabaseClient
    .from("post")
    .select("*")
    .eq("slug", slug)
    .single();
  const post = data?.body;

  if (!post) return null;

  invariant(typeof post.title === "string", "post.title must be a string");
  invariant(
    typeof post.created_at === "string",
    "post.created_at must be a string"
  );
  invariant(typeof post.slug === "string", "post.slug must be a string");
  invariant(typeof post.content === "string", "post.content must be a string");
  invariant(
    typeof post.published === "boolean",
    "post.published must be a boolean"
  );
  invariant(typeof post.user_id === "string", "post.user_id must be a string");

  return {
    title: post.title,
    slug: post.slug,
    createdAt: post.createdAt,
    content: post.content,
    html: post.html,
    published: post.published,
    userId: post.user_id,
    tags: post.tags,
  };
}
