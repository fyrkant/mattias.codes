import React from "react";
import { Link } from "remix";

export const Post: React.FC<{
  slug: string;
  title: string;
  createdAt: string;
  html: string;
  tags: string[];
  isSameUser?: boolean;
}> = ({ title, createdAt, html, isSameUser, slug, tags }) => {
  return (
    <article>
      {isSameUser ? <Link to={`/posts/${slug}/edit`}>Edit</Link> : null}
      <h2>{title}</h2>
      {tags.map((tag) => (
        <Link key={tag} to={`/tags/${tag}`}>
          {tag}
        </Link>
      ))}
      <time>{createdAt}</time>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};
