/**
 * Verifica si las cookies de terceros están habilitadas
 * @returns {boolean} true si están habilitadas, false si no
 */
export const areThirdPartyCookiesEnabled = () => {
  // Verifica si el usuario ha dado consentimiento para cookies de terceros
  const consent = localStorage.getItem("cookieConsent");
  if (consent === "all") {
    return true;
  }
  const cookieExists = document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith("allow_third_party_cookies="));
  return cookieExists;
};

/**
 * Redirige al usuario con verificación de cookies
 * @param {string} url - URL a la que redirigir
 * @param {string} target - Target del enlace (_blank, _self, etc.)
 * @returns {boolean} - true si la redirección fue exitosa, false si no
 */
export const safeRedirect = (url, target = "_self") => {
  if (areThirdPartyCookiesEnabled()) {
    // Si las cookies están habilitadas, redirigir normalmente
    if (target === "_blank") {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
    return true;
  } else {
    sessionStorage.setItem("pendingPaymentUrl", url);
    sessionStorage.setItem("paymentAttemptFailed", "true");

    alert(
      "Para continuar con el pago, es necesario habilitar cookies de terceros. Se mostrará el banner de consentimiento de cookies.",
    );

    localStorage.removeItem("cookieConsent");

    window.location.reload();
    return false;
  }
};

/**
 * Comprueba si una URL de Culqi es válida
 * @param {string} url - URL a verificar
 * @returns {boolean} - true si la URL es válida, false si no
 */
export const isValidCulqiUrl = (url) => {
  return url && url.includes("subscriptions.culqi.com/onboarding");
};
