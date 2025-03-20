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
      linear-gradient(
      90deg, 
      rgba(5,0,94,1) 0%,
      rgba(55,55,164,1) 51%, 
      rgba(0,212,255,1) 100%),
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
