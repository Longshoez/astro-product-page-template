import { useMediaQuery } from "react-responsive";
import PlaceHolder from "./PlaceHolder";
import { useEffect, useState } from "react";
import useResponsiveness from "../../utils/useResponsiveness";

interface TestimonialItem {
  name: string;
  review: string;
  isInView?: boolean;
}

export const Testimonial = ({
  name,
  review,
  index,
  isInView,
}: TestimonialItem & { index: number }) => {
  // Very short text for mobile
  const formatText = (text: string, slice: number) => {
    return `${text.slice(0, slice)}`;
  };

  const laptop = useMediaQuery({ query: "(min-width: 1400px)" });
  const smallerLaptop = useMediaQuery({ query: "(min-width: 1366px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const small = useMediaQuery({ query: "(max-width: 1399px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const textLength = isMobile ? 120 : isTablet ? 120 : 180;
  const { mobile, handleResponsiveness } = useResponsiveness();

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        marginRight: "2rem",
        marginLeft: "2rem",
        borderRadius: mobile ? "20px" : "30px",
        backgroundColor: "white",
        height: mobile ? "7rem" : "10rem", //handleResponsiveness("10rem", "10rem", "10rem", "10rem", ""), //!laptop ? (smallerLaptop ? "10rem" : "10rem") : "10rem",
        padding: !laptop ? (smallerLaptop ? ".5rem" : ".5rem") : "1rem", // resp
        opacity: isInView ? 1 : 0.25,
        flexDirection: "row",
      }}
    >
      {/* <div
        style={{
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          maxWidth: "150px",
        }}
      >

        {image ? (
          <img
            src={image}
            alt={`Foto de ${name}`}
            style={{
              height: mobile ? "5rem" : "8rem", //!laptop ? (smallerLaptop ? "8rem" : "8rem") : "8rem", // here respo
              width: mobile ? "5rem" : "8rem", //!laptop ? (smallerLaptop ? "8rem" : "8rem") : "8rem", // here respo
              // width: "100%",
              // height: "100%",
              objectFit: "cover",
              borderRadius: mobile ? "10px" : "20px",
            }}
          />
        ) : (
          <PlaceHolder />
        )}
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginRight: "10px",
          marginLeft: "10px",
          // height: "100%",
          width: mobile ? "auto" : "100%",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            margin: 0,
            textAlign: "left",
            fontStyle: "italic",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: isMobile ? "13px" : isTablet ? "12px" : "16px",
            lineHeight: isMobile ? "1.2" : "1.4",
            color: "#666",
          }}
        >
          {formatText(review, textLength)}
        </p>
        <p
          style={{
            textAlign: "right",
            fontWeight: 600,
            margin: 0,
            marginTop: "0.5rem",
            fontSize: isMobile ? "11px" : isTablet ? "14px" : "16px",
            width: "100%",
            color: "#333",
          }}
        >
          {name}
        </p>
      </div>
    </div >
  );
};
