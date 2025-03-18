import React from "react";
import useResponsiveness from "../../utils/useResponsiveness";
import { useMediaQuery } from "react-responsive";

export const SectionLayout = ({
  id,
  children,
  background,
  height = "100vh",
  ref,
  horizontalPadding,
  verticalPadding,
  style,
}: any) => {
  const gradientBackground = `
      radial-gradient(
        41.74% 98.84% at 61.04% 47.01%,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.2) 100%
      ),
      linear-gradient(
        68.99deg,
        #003325 10.95%,
        #013726 60.57%,
        #013520 103.7%
      ),
      #013726`;
  const mobile = useMediaQuery({ orientation: "portrait" });

  const containerStyle = {
    display: "flex",
    height: height,
    justifyContent: "center",
    // zIndex: 10,
    background: background ? background : gradientBackground,
    paddingLeft: !mobile ? horizontalPadding : "1.5rem",
    paddingRight: !mobile ? horizontalPadding : "1.5rem",
    paddingTop: verticalPadding,
    paddingBottom: verticalPadding,
  };

  return (
    <section
      id={id}
      ref={ref}
      style={{ ...containerStyle, flexDirection: "row", ...style }}
    >
      {children}
    </section>
  );
};
