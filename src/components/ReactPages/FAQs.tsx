import React, { useEffect, useState } from "react";
import Button from "../ReactComponents/Button";
import { SectionLayout } from "../ReactComponents/SectionLayout";
import staticModel from "../../assets/model_static.png";
// import logo from "../../assets/logo.png?url";
import logo from "../../assets/ilumina-logo.svg?url";
import TestimonialCarousel from "../ReactComponents/TestimonialCarousel";
import useResponsiveness from "../../utils/useResponsiveness";
import { Facebook, Mobile, Whatsapp } from "iconsax-react";
import { useMediaQuery } from "react-responsive";

interface LandingProps {
  id: string;
  ref: React.Ref<HTMLDivElement>;
}

const Testimonials = React.forwardRef<HTMLDivElement, LandingProps>(
  (props, ref) => {
    const { handleResponsiveness, mobile } = useResponsiveness();
    let padding = handleResponsiveness(26, 10, 25, 10, undefined);
    const desktop = useMediaQuery({ query: "(min-width: 1920px)" });
    const small = useMediaQuery({ query: "(max-width: 1399px)" });

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    if (!hasMounted) {
      return null;
    }

    const FAQ = ({ title, answer }) => (
      <div
        style={{
          maxWidth: mobile ? "100%" : "calc(50%  - 40px)",
          boxSizing: "border-box",
        }}
      >
        <h4
          style={{
            textWrap: "wrap",
            // fontSize: desktop ? "1.5vw" : "2.4vw",
            fontSize: handleResponsiveness(
              "1.5rem",
              "1.25rem",
              "1.5rem",
              "2rem",
              ""
            ),
            //</div>fontSize: mobile ? "2rem" : small ? "2rem" : "2.4rem",
            fontWeight: "500",
            color: "#c1dc3a",
            margin: 0,
            // lineHeight:  mobile ? "2.5rem" : "auto",
            lineHeight: handleResponsiveness(
              "auto",
              "auto",
              "auto",
              "2rem",
              "auto"
            ),
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontWeight: "200",
            color: "white",
            // lineHeight: "1.75rem",
            lineHeight: handleResponsiveness(
              "auto",
              "auto",
              "auto",
              "2rem",
              "auto"
            ),
            // lineHeight: mobile ? "auto" : "auto",
            fontSize: small ? "1.2rem" : "1.25rem",
          }}
        >
          {answer}
        </p>
      </div>
    );

    const socialButtonStyles = {
      margin: 0,
      display: "flex",
      FlexDirection: "row",
      alignItems: "center",
      gap: "5px",
      color: "white",
      textDecoration: "none",
      opacity: "0.5",
    };

    return (
      <SectionLayout
        id={props.id}
        ref={ref}
        // horizontalPadding={desktop ? "26vw" : "20vw"}
        // horizontalPadding={desktop ? "22vw" : "17vw"}
        horizontalPadding={handleResponsiveness(
          "10rem",
          "15rem",
          "25rem",
          "35rem",
          ""
        )}
        // style={{ position: "absolute" }}
        style={{ display: "flex", flexDirection: "column", height: "auto" }}
      // verticalPadding={"4rem"}
      >
        <div
          style={{
            flexDirection: "column",
            alignContent: "space-around",
            marginTop: "5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              // alignItems: "right",
              // justifyContent: "center",
              justifyContent: "space-evenly",
              gap: "50px",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                fontSize: mobile ? "2rem" : small ? "3vw" : "2.5rem",
                fontWeight: 200,
                color: "white",
                opacity: 1,
              }}
            >
              Preguntas frecuentas
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: mobile ? "column" : "row",
                alignContent: "flex-start",
                flexBasis: "50%",
                gap: "30px",
              }}
            >
              <FAQ
                title={"¿Qué es una microdosis de ayahuasca?"}
                answer={
                  "Es una pequeña cantidad de ayahuasca administrada en forma de gotas sublinguales, diseñada para ofrecer los beneficios terapéuticos de la planta sin los efectos psicoactivos intensos de una dosis completa."
                }
              />
              <FAQ
                title={"¿Hay efectos secundarios?"}
                answer={
                  "Las microdosis están diseñadas para minimizar los efectos secundarios, pero como con cualquier suplemento, algunas personas pueden experimentar sensibilidad o reacciones alérgicas. Es importante comenzar con una dosis baja y ajustar según la respuesta del cuerpo."
                }
              />
              <FAQ
                title={"¿Cuánto tiempo tarda en notarse los efectos?"}
                answer={
                  "Los efectos pueden variar según el individuo, pero generalmente se comienzan a notar mejoras en el estado de ánimo y la claridad mental después de algunas semanas de uso regular."
                }
              />
              <FAQ
                title={"¿Necesito una receta médica para adquirirlas?"}
                answer={
                  "No se requiere receta médica para adquirir microdosis de ayahuasca en muchas regiones, pero siempre es recomendable consultar la legislación local y buscar productos de proveedores confiables y regulados."
                }
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            marginTop: "5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              // position: "absolute",
              // bottom: "2rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "15px",
              width: "92vw",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "fit-content",
                // width: "100%",
                // maxWidth: "100%",
                // minWidth: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: !mobile ? "baseline" : "center",
              }}
            >
              <img
                src={logo}
                width={200}
                style={{
                  margin: "0",
                  filter: "invert(100%)",
                }}
              />
              <h4
                style={{
                  margin: "0",
                  marginTop: mobile ? "1rem" : "0",
                  color: "white",
                  fontWeight: "100",
                  fontSize: mobile ? "15px" : "20px",
                  textAlign: mobile ? "center" : "left",
                  width: "100%",
                  minWidth: "100%",
                  opacity: "0.5",
                }}
              >
                ¿Te gustó la página?
                <a
                  style={{ ...socialButtonStyles }}
                  href="https://wa.me/+51984794603" target="blank">
                  Escríbenos por WhatsApp
                </a>
              </h4>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              // flexDirection: "column",
              alignItems: "center",
              width: "fit-content",
              // paddingRight: desktop ? "5rem" : "6rem",
              gap: "20px",
            }}
          >
            <a
              style={{ ...socialButtonStyles }}
              href="https://wa.me/+51939114496"
              target="blank"
            >
              <Whatsapp size="30" color="white" variant="Bold" />
              +51939114496
            </a>
            <a
              style={{ ...socialButtonStyles }}
              href="https://www.facebook.com/ilumina.cle"
              target="blank"
            >
              <Facebook size="30" color="white" variant="Bold" />
              @ilumina
            </a>
          </div>
        </div>
      </SectionLayout >
    );
  }
);

export default Testimonials;
