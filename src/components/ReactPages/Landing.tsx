"use client";

import React, { useEffect, useRef } from "react";
import Button from "../ReactComponents/Button";
import { SectionLayout } from "../ReactComponents/SectionLayout";
import { ShoppingCart, ArrowDown2, Whatsapp, Facebook } from "iconsax-react";
import { initializeAnimation } from "../../utils/appleAnimation";
import useResponsiveness from "../../utils/useResponsiveness";
import { useMediaQuery } from "react-responsive";
import staticImage from "../../assets/static-flask.png?url";
import staticImage2 from "../../assets/static-flask2.png?url";
import logo from "../../assets/ilumina-logo.svg?url";

//now that im using react find a library that can do this easily,
// import animationScript from '../../../public/animation.js';

interface LandingProps {
  id: string;
  ref: React.Ref<HTMLDivElement>;
}

const Landing = React.forwardRef<HTMLDivElement, LandingProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobile = useMediaQuery({ orientation: "portrait" });
  const large = useMediaQuery({
    query: "(min-width: 2400px)",
  });

  const desktop = useMediaQuery({
    query: "(min-width: 1920px) and (max-width: 2399px)",
  });

  const medium = useMediaQuery({
    query: "(min-width: 1250px) and (max-width: 1919px)",
  });

  const small = useMediaQuery({
    query: "(max-width: 1370px)",
  });

  //prevents jump but it wond animate fade out
  // if (!desktop) {
  //   return (
  //     <div
  //       style={{ backgroundColor: "#013726", width: "100vw", height: "100vh" }}
  //       className="load-in"
  //     >
  //       .
  //     </div>
  //   );
  // }

  //@ts-ignore
  const responsiveHandler = (s, m, l, xl, mob) => {
    if (small) {
      return s;
    }
    if (medium) return m;
    if (desktop) return l;
    if (large) return xl;
    if (mobile) return mob;
  };

  useEffect(() => {
    if (canvasRef.current) {
      initializeAnimation(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#products") {
      setTimeout(() => {
        const element = document.getElementById("products");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, []);

  const handleClick = (): void => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: 'nearest',
      });
    } else {
      window.location.href = "#products";
    }
  };

  return (
    <SectionLayout
      id={props.id}
      ref={ref}
      horizontalPadding={desktop ? "20vw" : "18vw"}
      style={{ overflow: "hidden" }}
    >
      <div
        style={{
          height: "auto",
          position: "absolute",
          left: mobile ? 0 : "2rem",
          top: mobile ? "0px" : "2rem",
          bottom: "0px !important",
        }}
      >
        <img
          src={logo}
          alt=""
          style={{
            filter: "invert(100%)",
            width: mobile ? "10rem" : "12vw",
          }}
        />
      </div>
      <div className="content fade-in-slide-left">
        {mobile ? (
          <h1>
            Descubre <br /> el poder <br /> sanador de la <br />
            <span className="highlight">
              Ayahuasca <br /> en Microdosis.
            </span>
          </h1>
        ) : (
          <h1>
            Descubre el poder <br /> sanador de la <br />
            <span className="highlight">
              Ayahuasca <br /> en Microdosis.
            </span>
          </h1>
        )}
        <h3>100% ingredientes naturales</h3>
        <Button
          id="toggle-chat"
          label="Comprar ahora"
          //fontSize={30}
          onClick={handleClick}
          padding={small ? 12 : 15}
          styles={{
            backgroundColor: "#C1DC3A",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            alignItems: "center",
            borderRadius: "15px",
            gap: "15px",
            fontSize: mobile ? "1.5rem" : small ? "1.5vw" : "1.25vw",
            color: "#484848",
          }}
          icon={
            <ShoppingCart
              size={mobile ? "1.5rem" : small ? "1.5vw" : "1.25vw"}
              color="#484848"
            />
          }
        />
      </div>
      <div className="image-container">
        {!small ? (
          <canvas id="model-image" ref={canvasRef}></canvas>
        ) : mobile ? (
          <img className="mobileImage" src={staticImage2} />
        ) : (
          <img className="fadeInIMage" src={staticImage} />
        )}
      </div>
      <a
        className="bottom-action"
        href="#about"
        style={{ textDecoration: "none" }}
      >
        <p>Conoce más {!mobile && "sobre la Ayahuasca"} </p>
        <ArrowDown2 size={30} color="white" style={{ opacity: "50%" }} />
      </a>

      <div
        style={{
          position: "absolute",
          bottom: mobile ? "1.5rem" : "2rem",
          left: mobile ? "1.5rem" : "4rem",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Button
          styles={{ backgroundColor: "white" }}
          icon={<Whatsapp size="40" color="#013726" variant="Bold" />}
          padding={10}
          onClick={() => window.open("https://wa.me/+51939114496")}
        />
        <Button
          styles={{ backgroundColor: "white" }}
          icon={<Facebook size="40" color="#013726" variant="Bold" />}
          padding={10}
          onClick={() => window.open("https://www.facebook.com/ilumina.cle")}
        />
      </div>

      <style>
        {`
            *{
          z-index: 2
          }

          .load-in{
           animation: overlayFade 1.5s ease-in forwards;
           opacity: 0;
           display:none;
          }

          @keyframes overlayFade {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }



          .bottom-action{
            position: absolute;
            bottom: ${mobile ? ".5rem" : "2rem"};
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 3 !important;
            }

            .bottom-action > p{
            opacity: 50%;
            font-size: 25px;
            font-weight: 200;
            margin: 0;
            color: white;
            margin-bottom: .5rem;
            }

          .content {
            display: flex;
            position: relative;
            flex-direction: column;
            /* flex:2/3; */
            flexGrow: 1;
            gap: 20px;
            justify-content: ${mobile ? "flex-start" : "center"};
            ${mobile && "transform: translateY(15%);"}
            scroll-snap-align: start;
            scroll-behavior: smooth;
            overflow: hidden !important;
            z-index: 3 !important;
          }

          @keyframes fadeInSlideFromLeftImage {
            0% {
              opacity: 0;
              filter: blur(10px);
            }
            100% {
              opacity: 1;
              filter: blur(0px);
            }
          }

          .fade-in-slide-left {
          transition: .5s ease-in-out !important;

          }

          h1 {
            font-weight: 800;
            font-size: ${mobile ? "10vw" : "4vw"} !important;
            color: white;
            line-height: 98%;
            margin: 0;
          }

          h1 .highlight {
            color: #c1dc3a;
          }

          h3 {
            margin: 0;
            font-size: ${mobile ? "1.75rem" : "30px"};
            font-weight: 200;
            color: white;
            opacity: 0.5;
          }

          .image-container {
            position: ${small ? "relative" : "initial"};
            flex: 1;
            flexGrow: 1;
            right: 0;
            z-index: 1 !important;
          }

          .mobileImage{
          width: auto;
          height: 100%;
          position: absolute;
          transform: translateX(25%);
          filter: blur(6px);
          opacity: 0.5;
          right: 0;
          bottom: 0;
          }

          canvas {
            position: absolute !important;
            bottom: ${responsiveHandler("", "-2rem", "-2rem", "2rem", "0rem")};
            right: ${responsiveHandler("", "-2rem", "7rem", "20rem", "0rem")};
            transform: scale(${mobile ? 7 : responsiveHandler(2.4, 3, 3, 2.7, 7)}) !important;
            max-height: 90vh;
            max-width: 99vw;
            z-index: 2 !important;
          }

          .model-image {
            border: 1px solid white;
            height: 90%;
            position: absolute;
            top: 10% !important;
          }

          .fadeInIMage{
            position: absolute;
            z-index: 4 !important;
            ${small && !mobile && "margin-right: 0rem;"}
            right: 0 !important;
            width: auto;
            height: 100%;
            animation: fadeInSlideFromLeftImage 1.5s ease-in forwards;
          }

          @media only screen and (min-width: 2530px) {
              .content > h1{
                font-size: 3.5rem;
              }
              .content > h3{
                font-size:2rem;
              }
              .bottom-action > p{
                font-size: 2rem
              }
          }

          @media screen and (min-width: 1920px) {
              .content > h1{
                font-size: 4.5rem;
              }
              .content > h3{
                font-size:2rem;
              }
              .bottom-action > p{
                font-size: 2rem
              }
          }
        `}
      </style>
    </SectionLayout>
  );
});

export default Landing;
