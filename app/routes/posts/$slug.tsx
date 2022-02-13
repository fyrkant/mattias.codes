import { marked } from "marked";
import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { Post } from "~/components/post";
import { formatDateString } from "~/utils/extra.server";
import { getPostFromSlug } from "~/utils/db.server";
import { supabaseStrategy } from "~/auth.server";

type LoaderData = {
  isSameUser: boolean;
  slug: string;
  title: string;
  createdAt: string;
  html: string;
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  return data
    ? {
        title: `${data.title} | mattias.codes`,
        description: `Reading post titled ${data.title}`,
      }
    : { title: "No post here :(", description: `You're on a sad page :(` };
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const session = await supabaseStrategy.checkSession(request);
  const post = await getPostFromSlug(request, params?.slug || "");
  if (!post) {
    throw new Response("oh no", { status: 404 });
  }
  return {
    slug: post.slug,
    isSameUser: session?.user?.id === post.userId,
    title: post.title,
    createdAt: formatDateString(post.createdAt),
    html: post.html,
  };
};

export default function PostPage() {
  const { title, createdAt, html, slug, isSameUser } =
    useLoaderData<LoaderData>();
  return (
    <Post
      slug={slug}
      title={title}
      createdAt={createdAt}
      html={html}
      isSameUser={isSameUser}
    />
  );
}
