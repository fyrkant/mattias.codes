import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { authenticator, supabaseStrategy } from "~/auth.server";
import { Tag } from "~/types";
import { getPostsTitleList, getTags } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "." });
};

type LoaderData = {
  posts: { slug: string; title: string; published: boolean }[];
  tags: Tag[];
  authenticated: boolean;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const posts = await getPostsTitleList(request);
  const tags = await getTags(request);
  const session = await supabaseStrategy.checkSession(request);

  return { tags, posts, authenticated: !!session };
};

export default function Index() {
  const { posts, authenticated, tags } = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>Welcome to Remix</h1>
      <section>
        {authenticated ? (
          <Form method="post">
            <button>Log Out</button>
          </Form>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </section>
      <ul>
        Posts:
        {posts.map((post) => {
          return (
            <li key={post.slug}>
              <Link prefetch="intent" to={`/posts/${post.slug}`}>
                {post.title}
                {!post.published ? " (draft)" : null}
              </Link>
            </li>
          );
        })}
        {authenticated ? (
          <li>
            <Link to="/posts/add">Add new post</Link>
          </li>
        ) : null}
      </ul>
      <ul>
        Tags:
        {tags.map((tag) => {
          return (
            <li key={tag.name}>
              <Link prefetch="intent" to={`/tags/${tag.name}`}>
                {tag.name} ({tag.count})
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
