import React, { useState, useEffect } from "react";
import "./CookiesConsent.css";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showCookieReminder, setShowCookieReminder] = useState(false);

  useEffect(() => {
    // Comprobar si el usuario ya ha dado su consentimiento
    const consent = localStorage.getItem("cookieConsent");

    // Verificar si viene de un intento de pago fallido
    const paymentAttempt = sessionStorage.getItem("paymentAttemptFailed");

    if (paymentAttempt === "true") {
      // Mostrar banner inmediatamente si hubo un intento fallido
      setVisible(true);
      setShowCookieReminder(true);
      // Limpiar el flag de intento fallido
      sessionStorage.removeItem("paymentAttemptFailed");
    } else if (!consent) {
      // Si no ha dado consentimiento, mostrar el banner con retraso
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    document.cookie =
      "allow_third_party_cookies=true; path=/; max-age=31536000; SameSite=None; Secure";
    setVisible(false);

    // Si había un intento de pago pendiente, redirigir
    const pendingPaymentUrl = sessionStorage.getItem("pendingPaymentUrl");
    if (pendingPaymentUrl) {
      sessionStorage.removeItem("pendingPaymentUrl");
      window.open(pendingPaymentUrl, "_blank");
    }
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookieConsent", "necessary");
    document.cookie = "allow_necessary_cookies=true; path=/; max-age=31536000";
    setVisible(false);
  };

  const declineAll = () => {
    localStorage.setItem("cookieConsent", "none");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-message">
        {showCookieReminder ? (
          <div className="cookie-alert">
            <strong>⚠️ Se requieren cookies para realizar el pago</strong>
            <p>
              Para poder redirigirte correctamente a la plataforma de pago
              Culqi, necesitamos que aceptes todas las cookies. Sin estas
              cookies, el servicio de pago no funcionará correctamente.
            </p>
          </div>
        ) : (
          "Utilizamos cookies para mejorar tu experiencia y permitir funcionalidades esenciales como los métodos de pago. Algunas cookies de terceros son necesarias para servicios externos como Culqi. Sin estas cookies, algunos servicios pueden no funcionar correctamente."
        )}
      </div>
      <div className="cookie-actions">
        <button onClick={declineAll} className="cookie-btn cookie-btn-decline">
          Rechazar todo
        </button>
        <button
          onClick={acceptNecessary}
          className="cookie-btn cookie-btn-necessary"
        >
          Solo necesarias
        </button>
        <button onClick={acceptAll} className="cookie-btn cookie-btn-accept">
          Aceptar todo
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
