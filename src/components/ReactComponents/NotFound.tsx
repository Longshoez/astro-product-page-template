import React from "react";

const NotFound = ({ errorType = "error_general", sku = "" }) => {
  // Obtener título y mensaje según el tipo de error
  const getErrorContent = () => {
    switch (errorType) {
      case "sin_stock":
        return {
          title: "Producto temporalmente sin stock",
          message: `Lo sentimos, el producto con código ${sku} está agotado actualmente.`,
          icon: "📦",
        };
      case "no_existe":
        return {
          title: "Producto no encontrado",
          message: `No encontramos ningún producto con el código ${sku} en nuestro catálogo.`,
          icon: "🔍",
        };
      default:
        return {
          title: "Error al cargar el producto",
          message:
            "Ha ocurrido un error al intentar cargar la información del producto.",
          icon: "⚠️",
        };
    }
  };

  const { title, message, icon } = getErrorContent();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#013726",
            padding: "1rem",
            color: "white",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3.75rem",
              marginBottom: "0.5rem",
            }}
          >
            {icon}
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#4b5563",
              marginBottom: "1.5rem",
            }}
          >
            {message}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "500",
                padding: "0.5rem 1.5rem",
                borderRadius: "0.375rem",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#056d52")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#013726")
              }
            >
              <span style={{ marginRight: "0.5rem" }}>←</span>
              Volver a inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
