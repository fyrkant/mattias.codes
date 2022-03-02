import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { supabaseStrategy } from "~/auth.server";
import stylesUrl from "~/styles/add.css";
import { editPost, getPostFromSlug } from "~/utils/db.server";
import { Post } from "~/types";
import { PostForm } from "~/components/post-form";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};
export const action: ActionFunction = async ({ request, params }) => {
  const slug = await editPost(request, params?.slug || "");

  return redirect(`/posts/${slug}`);
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<{ post: Post }> => {
  await supabaseStrategy.checkSession(request, {
    failureRedirect: "/login",
  });

  const post = await getPostFromSlug(request, params?.slug || "");

  if (!post) {
    throw new Response("oh no", { status: 404 });
  }

  return {
    post,
  };
};

export default function EditPost() {
  const { post } = useLoaderData<{ post: Post }>();
  return <PostForm editingPost={post} />;
}
