import { ActionFunction, LinksFunction, LoaderFunction, redirect } from "remix";
import { supabaseStrategy } from "~/auth.server";
import stylesUrl from "~/styles/add.css";
import { PostForm } from "~/components/post-form";
import { addPost } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
};
export const action: ActionFunction = async ({ request }) => {
  const slug = await addPost(request);

  return redirect(`/posts/${slug}`);
};

export const loader: LoaderFunction = async ({ request }) => {
  await supabaseStrategy.checkSession(request, {
    failureRedirect: "/login",
  });

  return null;
};

export default function AddPost() {
  return <PostForm />;
}
