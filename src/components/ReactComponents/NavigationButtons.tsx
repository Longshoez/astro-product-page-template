"use client";

import React, { useEffect, useState, useRef, type ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import useResponsiveness from "../../utils/useResponsiveness";

type NavLink = {
  href: string;
  label: string | ReactNode;
  target: string;
  transitionName?: string;
};

const NavigationButtons: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMobile = useMediaQuery({ orientation: "portrait" });
  // const [isMobile, setIsMobile] = useState(false);

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1400px)" }) ?? true;
  const observersRef = useRef<IntersectionObserver[]>([]);
  const { handleResponsiveness } = useResponsiveness();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const formatText = (text: string, slice: number) => {
    return `${text.slice(0, slice)}...`;
  };

  const navLinks: NavLink[] = [
    { href: "#inicio", label: "Inicio", target: "inicio" },
    {
      href: "#about",
      label: "¿Qué es?",
      target: "about",
      transitionName: "about-nav-link",
    },
    {
      href: "#testimonios",
      label: "Testimonios",
      target: "testimonios",
      transitionName: "testimonios-nav-link",
    },
    {
      href: "#products",
      label: "Productos",
      target: "products",
      transitionName: "products-nav-link",
    },
    {
      href: "#frequently-asked-questions",
      label: (
        <>
          Preguntas
          <br />
          frecuentes
        </>
      ),
      target: "frequently-asked-questions",
      transitionName: "faqs-nav-link",
    },
  ];

  useEffect(() => {
    if (observersRef.current.length > 0) {
      observersRef.current.forEach((observer) => observer.disconnect());
      observersRef.current = [];
    }
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
    navLinks.forEach((link) => {
      const sectionId = link.href.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(link.target);
            }
          });
        }, options);
        observer.observe(section);
        observersRef.current.push(observer);
      }
    });
    return () => {
      observersRef.current.forEach((observer) => observer.disconnect());
    };
  }, [navLinks, hasMounted]);

  if (!hasMounted) return null;

  // Mejorado el estilo base para todos los enlaces de navegación
  const aStyling = {
    textDecoration: "none",
    color: "white",
    textShadow: "0px 0px 4px rgba(0, 0, 0, 0.9)", // Sombra más fuerte para mejor visibilidad
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    const href = e.currentTarget.getAttribute("href");
    if (href?.includes(target)) {
      setActive(target);
    } else {
      setActive(null);
    }
    // Cerrar el menú móvil cuando se hace clic en un enlace
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mejorada la función para resaltar el enlace activo
  const handleSelect = (value: string) => {
    let dark =
      "-.5px -.5px 0 #171717, .5px -.5px 0 #171717, -.5px .5px 0 #171717, .5px .5px 0 #171717";
    let light =
      "-.5px -.5px 0 #f2b130, .5px -.5px 0 #f2b130, -.5px .5px 0 #f2b130, .5px .5px 0 #f2b130";

    if (active === value) {
      return light;
    } else {
      return undefined;
    }
  };

  if (!hasMounted) {
    return null; // or return a loading spinner or placeholder
  }

  const MenuIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f2b130"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.8))" }}
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f2b130"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.8))" }}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const renderNavLinks = () => (
    <>
      {navLinks.map((link) => (
        <a
          key={link.target}
          href={link.href}
          {...(link.transitionName
            ? { "data-transition-name": link.transitionName }
            : {})}
          onClick={(e) => handleClick(e, link.target)}
          style={{
            ...aStyling,
            textShadow: handleSelect(link.target),
            // fontW/eight: handleSelect(link.target),
            opacity: active === link.target ? 1 : 0.5,
            transition: ".25s ease-in-out",
            color: "#f2b130",

            ...(isMobile
              ? {
                  fontSize: "20px",
                  padding: "10px 0",
                  textAlign: "center",
                  width: "100%",
                }
              : {}),
          }}
        >
          {link.label}
        </a>
      ))}
    </>
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 1100,
            cursor: "pointer",
            // backgroundColor: "rgba(0, 0, 0, 0.3)",
            // borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
          }}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
        {isMobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(1, 55, 38, 0.95)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              zIndex: 1000,
            }}
          >
            {renderNavLinks()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="navigation"
      style={{
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        color: "white",
        zIndex: 12,
        gap: "20px",
        right: "3rem",
        top: "5rem",
        // fontSize: isLargeScreen ? "1.9vw" : "1.8vw",
        fontSize: handleResponsiveness(
          "1.5rem",
          "1.25rem",
          "1.5rem",
          "2rem",
          ""
        ),
        //isLargeScreen ? "1.9vw" : "1.8vw",
        fontFamily: "Inter",
        fontWeight: "300", // Cambiado a 300 para mejor legibilidad
        textAlign: "right",
      }}
    >
      {renderNavLinks()}
      <style>
        {`
          .navigation > a {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .navigation > a:hover {
            opacity: 1 !important;
            transition: opacity .2s ease-in-out !important;
            /* text-shadow: 0px 0px 6px rgba(0, 0, 0, 1) !important; */
          }
        `}
      </style>
    </div>
  );
};
export default NavigationButtons;
