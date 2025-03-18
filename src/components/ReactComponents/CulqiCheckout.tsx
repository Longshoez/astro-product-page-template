import { useEffect, useState } from "react";

interface CulqiCheckoutProps {
  title: string;
  amount: number;
  currency: string;
  description: string;
  onSuccess: (token: any) => void;
  onError: (error: any) => void;
  productType?: "package" | "subscription";
}

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
    _culqiInstance?: any;
  }
}

const CulqiCheckout = ({
  title = "Producto de ejemplo",
  amount = 8000,
  currency = "PEN",
  description = "Descripción del producto",
  onSuccess = () => {},
  onError = () => {},
  productType = "package",
}: CulqiCheckoutProps) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("tipo", productType);
  // Usar una referencia directa a la clave pública
  // Si estás usando variables de entorno, asegúrate de que esté disponible en build time
  const PUBLIC_KEY =
    import.meta.env.PUBLIC_CULQI_PUBLIC_KEY || "pk_test_f44fe18f0e6c6d01";

  useEffect(() => {
    // Verificamos si estamos en un entorno de navegador
    if (typeof window === "undefined") return;

    let isMounted = true;

    /**
     * Carga el script de Culqi en el DOM
     */
    const loadCulqiScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (window.Culqi) {
          window.Culqi = undefined;
        }
        const existingScript = document.getElementById("culqi-script");
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement("script");
        script.src = "https://checkout.culqi.com/js/v4";
        script.id = "culqi-script";
        script.async = true;

        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("No se pudo cargar el script de Culqi"));

        document.head.appendChild(script);
      });
    };

    /**
     * Espera a que el objeto Culqi esté disponible en window
     */
    const waitForCulqi = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 30;
        const checkInterval = 200;

        const check = () => {
          attempts++;
          if (window.Culqi) {
            resolve(window.Culqi);
          } else if (attempts < maxAttempts) {
            setTimeout(check, checkInterval);
          } else {
            reject(new Error("Tiempo de espera agotado para objeto Culqi"));
          }
        };

        check();
      });
    };

    /**
     * Configura el objeto Culqi con los parámetros del checkout
     */
    const configureCulqi = (culqi: any): any => {
      culqi.publicKey = PUBLIC_KEY;

      console.log("Configurando Culqi con clave:", PUBLIC_KEY);

      culqi.settings({
        title,
        currency,
        amount: productType === "subscription" ? 0 : amount,
        description: description || title,
        ...(productType !== "subscription" && {
          order: "ord_live_0CJjgZYJIc3Ywp",
        }),
        publicKey: PUBLIC_KEY,
      });

      culqi.options({
        lang: "es",
        installments: productType !== "subscription",
        paymentMethods: {
          tarjeta: true,
          yape: productType !== "subscription",
          bancaMovil: productType !== "subscription",
          agente: productType !== "subscription",
          billetera: productType !== "subscription",
        },
        customButton: productType === "subscription" ? "Suscribirse" : "Pagar",
        style: {
          bannerColor: productType === "subscription" ? "#7063e3" : "#0ec1c1",
          buttonText: productType === "subscription" ? "Suscribirse" : "Pagar",
          buttonTextColor: "#ffffff",
          buttonBackground:
            productType === "subscription" ? "#7063e3" : "#0ec1c1",
        },
      });

      // Handler para cuando se completa la transacción
      window.culqi = function () {
        setTimeout(() => {
          if (window.Culqi.token) {
            console.log("Pago exitoso", window.Culqi.token);
            onSuccess({
              ...window.Culqi.token,
              isSubscription: productType === "subscription",
            });
          } else if (window.Culqi.error) {
            console.log("Error en pago", window.Culqi.error);
            onError(window.Culqi.error);
          }
        }, 500); // Pequeño delay para asegurar que todo esté listo
      };

      // Actualizar estado si el componente sigue montado
      if (isMounted) {
        setIsReady(true);
        setIsLoading(false);
        setError(null);
      }

      return culqi;
    };

    /**
     * Inicialización completa del checkout
     */
    const initialize = async (): Promise<void> => {
      try {
        await loadCulqiScript();
        const culqiInstance = await waitForCulqi();
        const configured = configureCulqi(culqiInstance);
        window._culqiInstance = configured;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Error en la inicialización de Culqi";

        if (isMounted) {
          setIsReady(false);
          setIsLoading(false);
          setError(errorMsg);
        }
      }
    };

    initialize();

    // Limpiar al desmontar
    return () => {
      isMounted = false;
    };
  }, [
    title,
    currency,
    amount,
    description,
    onSuccess,
    onError,
    productType,
    PUBLIC_KEY,
  ]);

  /**
   * Maneja el click en el botón de pago
   */
  const handlePayment = (): void => {
    if (!isReady) return;

    try {
      const culqi = window._culqiInstance || window.Culqi;
      if (!culqi) {
        throw new Error("No se encontró la instancia de Culqi");
      }

      culqi.open();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al abrir ventana de pago";

      setError(errorMsg);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        className="culqi-button"
        onClick={handlePayment}
        disabled={!isReady}
        style={{
          padding: "8px 12px",
          background:
            productType === "subscription"
              ? "linear-gradient(68.99deg, #5040b2 10.95%, #6050c9 60.57%, #7063e3 103.7%)"
              : "linear-gradient(68.99deg, #084737 10.95%, #0a4c39 60.57%, #0c523b 103.7%)",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "1.1rem",
          border: "none",
          cursor: isReady ? "pointer" : "not-allowed",
          opacity: isReady ? 1 : 0.7,
          transition: "all 0.3s ease",
        }}
      >
        {isLoading ? (
          "Inicializando..."
        ) : (
          <>
            {productType === "subscription" ? "Suscribirse" : "Pagar"}{" "}
            {currency === "PEN" ? "S/." : "$"} {(amount / 100).toFixed(2)}
          </>
        )}
      </button>
    </div>
  );
};

export default CulqiCheckout;
