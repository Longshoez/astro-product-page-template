import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useMediaQuery } from "react-responsive";
import { Testimonial } from "./Testimonial";
import useResponsiveness from "../../utils/useResponsiveness";

interface TestimonialItem {
  name: string;
  review: string;
  image?: string;
}

const TestimonialCarousel = () => {
  const [opacityIndex, setOpacityIndex] = useState(0);
  const { handleResponsiveness } = useResponsiveness();

  const handleChange = (index: number) => {
    setOpacityIndex(index);
  };

  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const small = useMediaQuery({ query: "(max-width: 1399px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const TestTestimonials: TestimonialItem[] = [
    {
      name: "Sofia P.",
      review:
        "Las microdosis de ayahuasca me han dado una nueva perspectiva. Ahora me siento más conectada con mi alegría y con los demás. Es como encontrar la llave de mi felicidad.",
      image: "/assets/user1.png",
    },
    {
      name: "Carlos M",
      review:
        "Desde que uso microdosis, mi mente está más clara. Pienso mejor, resuelvo problemas rápido y rindo más en el trabajo. Ha mejorado mucho mi vida.",
      image: "/assets/user1.png",
    },
    {
      name: "Elena Q",
      review:
        "Las microdosis me ayudaron a calmar mi ansiedad. Ahora enfrento el estrés con tranquilidad, algo que antes no creía posible.",
      image: "/assets/user1.png",
    },
    {
      name: "Tomás R",
      review:
        "Como atleta, las microdosis mejoraron mi concentración y recuperación. Ahora entreno y compito mejor. Es un cambio total para mí.",
      image: "/assets/user1.png",
    },
  ];

  return (
    <div
      style={{
        width: isMobile ? "100vw !important" : "100vw !important",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // border: "10px solid blue",
      }}
    >
      <p
        style={{
          // fontSize: isMobile ? "24px" : isTablet ? "34px" : "50px",
          fontSize: isMobile ? "2rem" : small ? "3vw" : "2.5rem",
          fontWeight: 200,
          color: "#c1dc3a",
          textAlign: "center",
          margin: isMobile ? "1rem" : "2rem",
        }}
      >
        Opiniones de nuestros clientes
      </p>
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        interval={5000}
        // centerSlidePercentage={isMobile ? 90 : isTablet ? 70 : 50}
        centerSlidePercentage={
          isMobile ? 100 : handleResponsiveness("50", "40", "30", "30", "")
        }
        showThumbs={false}
        showArrows={true}
        showIndicators={isMobile}
        showStatus={false}
        centerMode={true}
        onChange={(e) => handleChange(e)}
        emulateTouch={false}
        swipeScrollTolerance={5}
        width={"100vw"}
        swipeable={true}
      >
        {TestTestimonials.map((testimonial, index) => (
          <Testimonial
            name={testimonial.name}
            review={testimonial.review}
            isInView={opacityIndex == index}
            index={index}
            key={index}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
