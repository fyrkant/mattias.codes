import { LoaderFunction } from "remix";
import { getCssText } from "~/stitches.config";

export const loader: LoaderFunction = () => {
  const cssText = getCssText();
  console.log({ cssText });
  return new Response(cssText, {
    headers: { "Content-Type": "text/css" },
  });
};
