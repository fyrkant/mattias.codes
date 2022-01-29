import { Link, LoaderFunction, useLoaderData } from "remix";
import { supabaseClient } from "~/supabase.server";

type LoaderData = {
  posts: { slug: string; title: string }[];
  error: { message: string } | null;
};

export const loader: LoaderFunction = async () => {
  const data = await supabaseClient.from("post").select("title, slug");

  console.log(data);

  return { posts: data.data };
};

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
