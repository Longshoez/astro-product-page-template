import React, { useState } from "react";
import "./ProductContainer.css";
import Button from "./Button";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import image1 from "../../assets/still.png?url";
import useResponsiveness from "../../utils/useResponsiveness";

interface ProductContainerProps {
  sku: string;
  link: string;
  imageUrl: string;
  productTitle: string;
  productDetail: string;
  productPrice: string;
  productDeal?: string;
  benefitGeneral?: string;
  tier?: number;
  stock?: boolean;
  purchaseType?: "package" | "subscription";
  inView: boolean;
}

export default function ProductContainer({
  sku,
  link,
  imageUrl,
  productTitle,
  productDetail,
  productPrice,
  productDeal,
  benefitGeneral,
  tier = 0,
  stock = true,
  purchaseType = "package",
  inView,
}: ProductContainerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { mobile, handleResponsiveness } = useResponsiveness();

  const tierStyles = {
    0: "linear-gradient(-72deg, #FDB931, #FEDB37 8%, #FDB931 10.5%, #FEDB37 12%, #9f7928 13.5%, #FDB931 18%, #FEDB37 22.5%, #FEDB37 30%, #FDB931 36%, #FEDB37 40%, #FDB931 42%, #8A6E2F)",
    1: "linear-gradient(-40deg,#dedede,#ffffff 8%,#dedede 10.5%,#ffffff 12%,#454545 13.5%,#dedede 18%,#ffffff 22.5%,#ffffff 30%,#dedede 36%,#ffffff 40%,#dedede 42%,#a1a1a1)",
    2: "linear-gradient(-72deg, #ca7345, #ffdeca 8%, #ca7345 10.5%, #ffdeca 12%, #a14521 13.5%, #ca7345 18%, #ffdeca 22.5%, #ffdeca 30%, #ca7345 36%, #ffdeca 40%, #ca7345 42%, #732100)",
  };

  const dynamicStyles = {
    //@ts-ignore
    background: tierStyles[tier] || "",
    padding: ".5rem",
    borderRadius: "40px",
    maxWidth: "300px",
    // opacity: inView || isHovered ? 1 : 0.5,
    maxHeight: "550px",
    // transform: isHovered ? "translateY(-10px)" : "translateY(0)",
    boxShadow: isHovered
      ? "0px 30px 40px rgba(0, 0, 0, 0.3)"
      : "0px 25px 30px rgba(0, 0, 0, 0.2)",
  };

  const baseText = {
    color: "#2a2a2a",
    fontSize: "1rem",
    fontWeight: 500,
    margin: 0,
  };

  const buttonStyles = {
    background: stock ? "#C1DC3A" : "#ccc",
    cursor: stock ? "pointer" : "not-allowed",
    opacity: stock ? 1 : 0.7,
  };

  const handleClick = () => {
    if (stock) window.location.href = link;
  };

  return (
    <div
      style={dynamicStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          background: "white",
          borderRadius: "30px",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            // alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <img
            // src={imageUrl}
            src={image1}
            alt={productTitle}
            className="product-image"
            style={{
              width: "250px",
              height: "250px",
              margin: "auto",
              // border: "1px solid red",
            }}
          />
          <h4
            style={{
              color: "#1e1e1e",
              fontSize: "1.20rem",
              minHeight: "2.5em",
              maxHeight: "2.5em",
              margin: 0,
              width: "100%",
            }}
          >
            {productTitle}
          </h4>
          <p className="product-detail">
            <s>{productDetail}</s>
          </p>
          <h4
            style={{
              ...baseText,
              fontSize: "1.40rem !important",
            }}
          >
            Ahora: {productPrice}
          </h4>
          <h4 className="product-deal">{productDeal}</h4>
        </div>
        <Button
          disabled={!stock}
          id="toggle-chat"
          label={
            purchaseType === "subscription"
              ? "Suscripción mensual"
              : stock
                ? "Comprar ahora"
                : "Agotado"
          }
          onClick={handleClick}
          //fontSize={30}
          // padding={small ? 12 : 15}
          padding={15}
          styles={{
            backgroundColor: "#C1DC3A",
            paddingLeft: "15px",
            paddingRight: "15px",
            padding: "12px",
            fontWeight: "300",
            alignItems: "center",
            borderRadius: "15px",
            gap: "15px",
            // fontSize: "1.5rem",
            fontSize: "22px",
            color: "#484848",
          }}
          icon={
            <ArrowRight
              // size={mobile ? "1.5rem" : small ? "1.5vw" : "1.25vw"}
              size={"22px"}
              color="#484848"
            />
          }
        />
      </div>
    </div>
  );

  return (
    <div
      className="product-container"
      style={dynamicStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-content">
        <img src={imageUrl} alt={productTitle} className="product-image" />

        <div className="product-info">
          <h3 className="product-title">{productTitle}</h3>
          <p className="benefit-general">{benefitGeneral}</p>
          <p className="product-detail">{productDetail}</p>
          <p className="product-price">Ahora: {productPrice}</p>

          {productDeal && <p className="product-deal">{productDeal}</p>}

          <button
            className="product-button"
            style={buttonStyles}
            onClick={handleClick}
            disabled={!stock}
          >
            {purchaseType === "subscription"
              ? "Suscripción mensual"
              : stock
                ? "Quiero mi kit!"
                : "AGOTADO"}
          </button>
        </div>
      </div>
    </div>
  );
}
