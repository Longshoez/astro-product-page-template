import { useState, useEffect } from "react";
import "./PaymentOptions.css";
import {
  DISTRICTS,
  DEPARTMENTS,
  DISTRICT_SHIPPING_RATES,
  DEPARTMENT_SHIPPING_RATES,
} from "../../utils/shipping";
import CulqiCheckout from "./CulqiCheckout";

interface PaymentOptionsProps {
  basePrice: number;
  title: string;
  packageId: string;
}

const PaymentOptions = ({
  basePrice,
  title,
  packageId,
}: PaymentOptionsProps) => {
  const [shippingType, setShippingType] = useState<
    "distrito" | "departamento" | "internacional" | "local" | null
  >(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [shippingCost, setShippingCost] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      !selectedLocation ||
      shippingType === "internacional" ||
      shippingType === "local"
    ) {
      return;
    }

    let calculatedCost = 0;
    if (shippingType === "distrito") {
      calculatedCost = DISTRICT_SHIPPING_RATES[selectedLocation] || 15.0;
    } else if (shippingType === "departamento") {
      calculatedCost = DEPARTMENT_SHIPPING_RATES[selectedLocation] || 30.0;
    }

    setShippingCost(calculatedCost);
    setTotalPrice(basePrice + calculatedCost);
  }, [selectedLocation, basePrice, shippingType]);

  useEffect(() => {
    if (shippingType === "local") {
      setShippingCost(0);
      setTotalPrice(basePrice);
      setSelectedLocation("local");
    }
  }, [shippingType, basePrice]);

  const handleLocationTypeChange = (
    type: "distrito" | "departamento" | "internacional" | "local",
  ) => {
    setShippingType(type);
    setSelectedLocation(type === "local" ? "local" : "");
    setShippingCost(0);
    setError("");
    if (type !== "local") {
      setTotalPrice(basePrice);
    }
  };

  const handleCulqiSuccess = (token: any) => {
    console.log("Pago exitoso", token);
    window.location.href = `/complete-your-details?token=${token.id}`;
  };

  const handleCulqiError = (error: any) => {
    console.error("Error en el pago", error);
    setError(
      error.user_message || "Error en el proceso de pago vuelve a intentarlo",
    );
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en comprar ${title} con envío internacional. ¿Podrían darme más información?`,
    );
    const whatsappUrl = `https://wa.me/+51939114496?text=${message}`;
    window.open(whatsappUrl, "_blank");

    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "international_inquiry", {
          event_category: "contact",
          event_label: "international_shipping",
          value: basePrice,
        });
      }
    } catch (e) {
      console.error("Error registrando evento de analítica", e);
    }
  };

  const storeInfo = {
    name: "Tienda Principal - Barranco",
    address: "JR. Tumbes Nr. 279, URB. San Ignacio",
    city: "Lima",
    zipCode: "15047",
    phone: "+51939114496",
    hours: "Lunes a Viernes: 9:00 AM - 6:00 PM | Sábados: 10:00 AM - 2:00 PM",
    reference: "Barranco, Lima, Perú",
  };

  return (
    <div className="payment-section">
      <h2>Método de Pago</h2>

      <div className="shipping-selector">
        <div className="location-type-buttons">
          <button
            className={`location-type-btn ${shippingType === "local" ? "active" : ""}`}
            onClick={() => handleLocationTypeChange("local")}
          >
            Retiro Local
          </button>
          <button
            className={`location-type-btn ${shippingType === "distrito" ? "active" : ""}`}
            onClick={() => handleLocationTypeChange("distrito")}
          >
            Envío Distrito Lima
          </button>
          <button
            className={`location-type-btn ${shippingType === "departamento" ? "active" : ""}`}
            onClick={() => handleLocationTypeChange("departamento")}
          >
            Envío Departamento
          </button>
          <button
            className={`location-type-btn ${shippingType === "internacional" ? "active" : ""}`}
            onClick={() => handleLocationTypeChange("internacional")}
          >
            Envío Internacional
          </button>
        </div>

        {shippingType === "local" ? (
          <div className="local-pickup-info">
            <p>
              Puede retirar su producto en nuestra tienda. No hay costo
              adicional de envío.
            </p>
            <div className="store-address-container">
              <div className="store-details">
                <h4>{storeInfo.name}</h4>
                <p>{storeInfo.address}</p>
                <p>
                  {storeInfo.city}, {storeInfo.zipCode}
                </p>
                <p>
                  <strong>Teléfono:</strong> {storeInfo.phone}
                </p>
                <p>
                  <strong>Horario:</strong> {storeInfo.hours}
                </p>
                <p>
                  <strong>Referencia:</strong> {storeInfo.reference}
                </p>
              </div>
            </div>
          </div>
        ) : shippingType === "internacional" ? (
          <div className="international-shipping-info">
            <p>
              Para envíos internacionales, por favor contáctenos directamente:
            </p>
            <button className="contact-button" onClick={handleWhatsAppContact}>
              <span>Consultar por WhatsApp</span>
              <img
                src="/icons/whatsapp_icon.svg"
                width="20px"
                height="20px"
                alt="WhatsApp"
                style={{ marginLeft: "8px" }}
              />
            </button>
          </div>
        ) : (
          shippingType && (
            <div className="location-selector">
              <label>
                {shippingType === "distrito"
                  ? "Seleccione su distrito:"
                  : "Seleccione su departamento:"}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">
                  {shippingType === "distrito"
                    ? "Seleccione distrito"
                    : "Seleccione departamento"}
                </option>
                {(shippingType === "distrito" ? DISTRICTS : DEPARTMENTS).map(
                  (location) => (
                    <option key={location.code} value={location.code}>
                      {location.name}
                    </option>
                  ),
                )}
              </select>
            </div>
          )
        )}

        {shippingCost > 0 &&
          shippingType !== "internacional" &&
          shippingType !== "local" && (
            <div className="shipping-cost">
              Costo de envío: S/. {shippingCost.toFixed(2)}
            </div>
          )}

        {selectedLocation &&
          (shippingType === "distrito" ||
            shippingType === "departamento" ||
            shippingType === "local") && (
            <div className="total-price-display">
              Precio total: S/. {totalPrice.toFixed(2)}
            </div>
          )}
      </div>

      {shippingType !== "internacional" && selectedLocation && (
        <div className="payment-container">
          <CulqiCheckout
            title={title}
            currency="PEN"
            amount={Math.round(totalPrice * 100)}
            description={`${title} - ${
              shippingType === "local"
                ? "Retiro local"
                : shippingType === "distrito"
                  ? `Envío a distrito: ${DISTRICTS.find((d) => d.code === selectedLocation)?.name}`
                  : `Envío a departamento: ${DEPARTMENTS.find((d) => d.code === selectedLocation)?.name}`
            }`}
            onSuccess={handleCulqiSuccess}
            onError={handleCulqiError}
          />

          {error && <div className="error-message">{error}</div>}

          <div className="security-info">
            <span className="lock-icon">🔒</span>
            <span>Protegido por encriptación SSL de 256-bits</span>
          </div>
          <div className="cookies-info">
            <small>
              Este método de pago requiere cookies de terceros. Al hacer clic en
              "Pagar", aceptas el uso de cookies necesarias para procesar el
              pago.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
