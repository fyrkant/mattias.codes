import {
  Link,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
  useParams,
} from "remix";
import { getPostsWithTag } from "~/utils/db.server";
import { Post as IPost } from "~/types";

type LoaderData = {
  tag: string;
  posts: IPost[];
};

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  return data
    ? {
        title: `${data.tag} | mattias.codes`,
        description: `Listing posts tagged with: ${data.tag}`,
      }
    : { title: "No tag here :(", description: `You're on a sad page :(` };
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  const tagName = params?.tagName || "";
  const posts = await getPostsWithTag(request, tagName);
  return {
    tag: tagName,
    posts,
  };
};

export default function PostPage() {
  const { tag, posts } = useLoaderData<LoaderData>();
  return (
    <section>
      <h2>{tag}</h2>
      Posts tagged with {tag}:
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
