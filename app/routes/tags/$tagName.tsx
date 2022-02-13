import {
  Link,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useParams,
} from "remix";
import { getPostsWithTag, getTagFromName } from "~/utils/db.server";
import { Tag, Post as IPost } from "~/types";

type LoaderData = {
  tag: Tag;
  posts: IPost[];
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  return data
    ? {
        title: `${data.tag.name} | mattias.codes`,
        description: `Reading post titled ${data.tag.name}`,
      }
    : { title: "No tag here :(", description: `You're on a sad page :(` };
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const tag = await getTagFromName(request, params?.tagName || "");
  if (!tag) {
    throw new Response("oh no", { status: 404 });
  }
  const posts = await getPostsWithTag(request, tag.name);
  return {
    tag,
    posts,
  };
};

export default function PostPage() {
  const { tag, posts } = useLoaderData<LoaderData>();
  return (
    <section>
      <h2>{tag.name}</h2>
      Posts tagged with {tag.name}:
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={`/posts/${post.slug}`} prefetch="intent">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CatchBoundary() {
  const params = useParams();
  return (
    <div>
      <h2>We couldn't find that page!</h2>
      <p>
        Seems like there's no tag called <code>"{params.tagName}"</code>!
      </p>
    </div>
  );
}
