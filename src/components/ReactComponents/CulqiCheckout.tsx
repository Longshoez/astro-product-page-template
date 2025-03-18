import { useEffect, useState } from "react";

interface CulqiToken {
  id: string;
  [key: string]: any;
}

interface CulqiError {
  object: string;
  type: string;
  merchant_message: string;
  user_message: string;
  [key: string]: any;
}

interface CulqiPaymentMethods {
  tarjeta: boolean;
  yape: boolean;
  bancaMovil: boolean;
  agente: boolean;
  billetera: boolean;
}

interface CulqiSettings {
  title: string;
  currency: string;
  amount: number;
  description: string;
}

interface CulqiOptions {
  lang: string;
  installments: boolean;
  paymentMethods: CulqiPaymentMethods;
}

interface CulqiObject {
  publicKey: string;
  token?: CulqiToken;
  error?: CulqiError;
  settings: (options: CulqiSettings) => void;
  options: (options: CulqiOptions) => void;
  open: () => void;
}

// Declaración global para el objeto Culqi en window
declare global {
  interface Window {
    Culqi?: CulqiObject;
    culqi?: () => void;
    _culqiInstance?: CulqiObject;
  }
}

// Props del componente
interface CulqiCheckoutProps {
  title?: string;
  currency?: string;
  amount?: number;
  description?: string;
  onSuccess?: (token: CulqiToken) => void;
  onError?: (error: CulqiError) => void;
}

// Estado del componente
interface CheckoutState {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

const CulqiCheckout: React.FC<CulqiCheckoutProps> = ({
  title = "Producto de ejemplo",
  currency = "PEN",
  amount = 8000,
  description = "Descripción del producto",
  onSuccess = () => {},
  onError = () => {},
}) => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    isReady: false,
    isLoading: true,
    error: null,
  });

  const PUBLIC_KEY = "pk_test_f44fe18f0e6c6d01";

  useEffect(() => {
    // Verificamos si estamos en un entorno de navegador
    if (typeof window === "undefined") return;

    let isMounted = true;

    /**
     * Carga el script de Culqi en el DOM
     */
    const loadCulqiScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Limpiamos cualquier instancia previa
        if (window.Culqi) {
          window.Culqi = undefined;
        }

        // Eliminamos el script si ya existe
        const existingScript = document.getElementById("culqi-script");
        if (existingScript) {
          existingScript.remove();
        }

        // Creamos y configuramos el script
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
    const waitForCulqi = (): Promise<CulqiObject> => {
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
    const configureCulqi = (culqi: CulqiObject): CulqiObject => {
      // Configuración básica
      culqi.publicKey = PUBLIC_KEY;

      // Configuración del producto/servicio
      culqi.settings({
        title,
        currency,
        amount,
        description: description || title,
      });

      // Opciones del checkout
      culqi.options({
        lang: "es",
        installments: true,
        paymentMethods: {
          tarjeta: true,
          yape: true,
          bancaMovil: true,
          agente: true,
          billetera: true,
        },
      });

      // Handler para cuando se completa la transacción
      window.culqi = function () {
        setTimeout(() => {
          // Verificar token en diferentes ubicaciones (compatibilidad con diferentes versiones)
          if (window.Culqi?.token) {
            console.log("Pago exitoso", window.Culqi.token);
            onSuccess(window.Culqi.token);
          } else if (window.culqi && "token" in window.culqi) {
            const token = window.culqi.token as unknown as CulqiToken;
            console.log("Pago exitoso", token);
            onSuccess(token);
          }
          // Verificar errores en diferentes ubicaciones
          else if (window.Culqi?.error) {
            onError(window.Culqi.error);
          } else if (window.culqi && "error" in window.culqi) {
            const error = window.culqi.error as unknown as CulqiError;
            onError(error);
          }
        }, 500); // Pequeño delay para asegurar que todo esté listo
      };

      // Actualizar estado si el componente sigue montado
      if (isMounted) {
        setCheckoutState({
          isReady: true,
          isLoading: false,
          error: null,
        });
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
          setCheckoutState({
            isReady: false,
            isLoading: false,
            error: errorMsg,
          });
        }
      }
    };

    initialize();

    // Limpiar al desmontar
    return () => {
      isMounted = false;
    };
  }, [title, currency, amount, description, onSuccess, onError]);

  /**
   * Maneja el click en el botón de pago
   */
  const handlePayment = (): void => {
    if (!checkoutState.isReady) return;

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

      setCheckoutState((prev) => ({
        ...prev,
        error: errorMsg,
      }));
    }
  };

  return (
    <div
      className="culqi-checkout-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checkoutState.error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "15px" }}
        >
          Error: {checkoutState.error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={!checkoutState.isReady || checkoutState.isLoading}
        style={{
          padding: "8px 12px",
          border: "1px solid #bbb",
          background: `
            radial-gradient(
              41.74% 98.84% at 61.04% 47.01%,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.2) 100%
            ),
            linear-gradient(68.99deg, #084737 10.95%, #0a4c39 60.57%, #0c523b 103.7%),
            #0a4c39
          `,
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500",
          transition: "all 0.3s ease",
          color: "#fff",
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          minWidth: "110px",
          textAlign: "center",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          gap: "15px",
        }}
      >
        {checkoutState.isLoading
          ? "Inicializando pago..."
          : `Pagar ${currency === "PEN" ? "S/." : "$"} ${(amount / 100).toFixed(2)}`}
      </button>

      {checkoutState.isLoading && (
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          <p>Preparando pasarela de pago...</p>
        </div>
      )}
    </div>
  );
};

export default CulqiCheckout;
