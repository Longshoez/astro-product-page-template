import React, { useEffect, useState } from "react";
import { SectionLayout } from "../ReactComponents/SectionLayout";
import TestimonialCarousel from "../ReactComponents/TestimonialCarousel";
import { useMediaQuery } from "react-responsive";
import useResponsiveness from "../../utils/useResponsiveness";

interface LandingProps {
  id: string;
  ref: React.Ref<HTMLDivElement>;
}

const Testimonials = React.forwardRef<HTMLDivElement, LandingProps>(
  (props, ref) => {
    const desktop = useMediaQuery({ query: "(min-width: 1080px)" });
    const small = useMediaQuery({ query: "(max-width: 1399px)" });
    const { mobile } = useResponsiveness();

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    if (!hasMounted) {
      return null;
    }

    return (
      <SectionLayout
        id={props.id}
        ref={ref}
        horizontalPadding={0}
        verticalPadding={10}
        height={"auto"}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            padding: "2rem 0",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div
              style={{
                paddingTop: "56.25%",
                position: "relative"
              }}
            >
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none"
                }}
                src="https://www.youtube.com/embed/FgpXYVLzCEs?si=cG0SBXKDw-bf_Vsh"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0.05) 100%)",
                height: "10px",
                width: "100%"
              }}
            />
          </div>
          <TestimonialCarousel />
        </div>
      </SectionLayout>
    );
  }
);

export default Testimonials;
