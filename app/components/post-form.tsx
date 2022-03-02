import { marked } from "marked";
import React from "react";
import { Form } from "remix";
import { Post } from "~/types";

type Props = {
  editingPost?: Post;
};

export function PostForm({ editingPost }: Props) {
  const [md, setMd] = React.useState("");
  const [html, setHtml] = React.useState("");

  React.useEffect(() => {
    setHtml(marked(md));
  }, [md]);

  React.useEffect(() => {
    if (editingPost) {
      setMd(editingPost.content);
    }
  }, [editingPost]);

  return (
    <div className="add-container">
      <section>
        <h2>{editingPost ? "Edit post" : "Add new post"}</h2>
        <Form method="post">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={editingPost?.title}
          />

          <label htmlFor="publish">Publish</label>
          <input
            type="checkbox"
            name="publish"
            id="publish"
            defaultChecked={editingPost?.published}
          />

          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            name="slug"
            id="slug"
            defaultValue={editingPost?.slug}
          />

          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            value={md}
            onChange={(e) => {
              setMd(e.target.value);
            }}
          />

          <button>{editingPost ? "Edit" : "Add"}</button>
        </Form>
      </section>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
}
