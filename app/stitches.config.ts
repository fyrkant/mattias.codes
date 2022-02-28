import { createStitches } from "@stitches/react";

export const { styled, css, getCssText } = createStitches({
  theme: {
    colors: {
      superCool: "green",
    },
  },
});
