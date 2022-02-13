import React from "react";
import { Link } from "remix";

export const Post: React.FC<{
  slug: string;
  title: string;
  createdAt: string;
  html: string;
  isSameUser?: boolean;
}> = ({ title, createdAt, html, isSameUser, slug }) => {
  return (
    <article>
      {isSameUser ? <Link to={`/posts/${slug}/edit`}>Edit</Link> : null}
      <h2>{title}</h2>
      <time>{createdAt}</time>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};
