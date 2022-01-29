import { LoaderFunction, useLoaderData } from "remix";
import { supabaseClient } from "~/supabase.server";
import { Post } from "~/types";

type LoaderData = {
  post: Post;
};

export const loader: LoaderFunction = async ({ params }) => {
  const data = await supabaseClient
    .from("post")
    .select("*")
    .eq("slug", params.slug)
    .single();
  const post = data?.body;
  console.log(params);
  console.log(data);

  return {
    post: post,
  };
};

export default function Post() {
  const { post } = useLoaderData<LoaderData>();
  return (
    <article>
      <h2>{post.title}</h2>
    </article>
  );
}
