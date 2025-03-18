"use client";

import React, { useEffect, useState } from "react";
import ProductContainer from "../../components/ReactComponents/ProductContainer";
import { SectionLayout } from "../ReactComponents/SectionLayout";
import useResponsiveness from "../../utils/useResponsiveness";
import { useMediaQuery } from "react-responsive";
import { Carousel } from "react-responsive-carousel";

interface Product {
  sku: string;
  title: string;
  productDetail: string;
  productPrice: string;
  benefitGeneral: string;
  stock: boolean;
  productDeal: string;
  tipo: string;
  tier: number;
}

interface ProductsPageProps {
  products: Product[];
  id: string;
  horizontalPadding?: string | number;
  productsError?: boolean;
  ref: React.Ref<HTMLDivElement>;
}

const Products = React.forwardRef<HTMLDivElement, ProductsPageProps>(
  (props, ref) => {
    console.log("props", props.id);
    const { mobile, handleResponsiveness } = useResponsiveness();
    let padding = handleResponsiveness(16, 15, 25, 15, undefined);
    const small = useMediaQuery({ query: "(min-width: 1366px)" });
    const [opacityIndex, setOpacityIndex] = useState<number>();
    let headerPadding = handleResponsiveness(
      "10rem",
      "15rem",
      "25rem",
      "35rem",
      "",
    );

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
      setHasMounted(true);
    }, []);

    if (!hasMounted) {
      return null;
    }

    const handleChange = (index: number) => {
      setOpacityIndex(index);
    };

    return (
      <SectionLayout
        id={props.id}
        ref={ref}
        background="white"
        // horizontalPadding={padding}
        verticalPadding={"2rem"}
        height="auto"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "2rem 1rem",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <h3
            style={{
              fontSize: small ? "3vw" : "2.5rem",
              fontWeight: 200,
              color: "black",
              opacity: 1,
              // width: "100vw",
              width: "55%",
              paddingRight: headerPadding,
              paddingLeft: headerPadding,
            }}
          >
            Productos y paquetes
          </h3>

          {props.productsError ? (
            <div
              style={{
                width: "100%",
                padding: "2rem",
                backgroundColor: "#f8f8f8",
                borderRadius: "8px",
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              <h4
                style={{
                  color: "#e74c3c",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                }}
              >
                Productos no encontrados
              </h4>
              <p style={{ fontSize: "1rem", color: "#555" }}>
                Lo sentimos, no se pudieron cargar los productos. Por favor,
                intente nuevamente más tarde.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "30px",
                maxWidth: "1200px",
                width: "100%",
              }}
            >
              {props.products.map((product: Product) => (
                <ProductContainer
                  sku={product.sku}
                  link={"microdosis-package/" + product.sku}
                  imageUrl={"products/" + product.sku + "-card.svg"}
                  productTitle={product.title}
                  productDetail={product.productDetail}
                  benefitGeneral={product.benefitGeneral}
                  productPrice={product.productPrice}
                  productDeal={product.productDeal}
                  stock={product.stock}
                  purchaseType={product.tipo as any}
                  tier={product.tier}
                  inView={true}
                />
              ))}
            </div>
          )}
        </div>
      </SectionLayout>
    );
  },
);

export default Products;
