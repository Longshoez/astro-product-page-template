import { useState } from "react";
import { z } from "zod";
import "./ShippingForm.css";

type FormData = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  additionalNotes: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

type TouchedFields = {
  [K in keyof FormData]?: boolean;
};

const shippingSchema = z.object({
  fullName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(5, "La dirección debe ser más detallada"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El departamento/provincia es requerido"),
  zipCode: z.string().regex(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
  phone: z
    .string()
    .regex(
      /^(\+?(\d{1,3}))?[-.\s]?(\(?\d{1,6}\)?)?[-.\s]?(\d{1,6})[-.\s]?(\d{1,6})[-.\s]?(\d{1,6})$/,
      "Ingresa un número de teléfono válido",
    )
    .refine((value) => {
      const digitsOnly = value.replace(/[^\d]/g, "");
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }, "El número debe tener entre 7 y 15 dígitos"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  additionalNotes: z.string().optional(),
});

type SubmitStatus = {
  success: boolean;
  message: string;
} | null;

export default function ShippingForm({ token }: { token: string }) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    additionalNotes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const validateField = (name: keyof FormData, value: string) => {
    try {
      const fieldSchema = z.object({ [name]: shippingSchema.shape[name] });
      fieldSchema.parse({ [name]: value });
      return { valid: true, error: null };
    } catch (error: any) {
      const fieldError = error.errors.find((e: any) => e.path[0] === name);
      return { valid: false, error: fieldError?.message || "Campo inválido" };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof FormData]) {
      const validation = validateField(name as keyof FormData, value);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.valid ? undefined : validation.error,
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateField(name as keyof FormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validation.valid ? undefined : validation.error,
    }));
  };

  const validateAllFields = () => {
    try {
      shippingSchema.parse(formData);
      return true;
    } catch (error: any) {
      const newErrors: FormErrors = {};
      error.errors.forEach((err: any) => {
        newErrors[err.path[0] as keyof FormData] = err.message;
      });
      setErrors(newErrors);
      const allTouched: TouchedFields = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key as keyof FormData] = true;
      });
      setTouched(allTouched);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAllFields()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const response = await fetch("/api/save-shipping-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message:
            "¡Información guardada correctamente! Recibirás tu pedido pronto.",
        });
        setFormData({
          fullName: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          phone: "",
          email: "",
          additionalNotes: "",
        });
        setTouched({});
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          success: false,
          message:
            errorData.message ||
            "Hubo un problema al guardar tu información. Por favor intenta nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setSubmitStatus({
        success: false,
        message:
          "Error de conexión. Verifica tu internet e intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelSubmit = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="page-wrapper">
      <div className="shipping-container">
        <div className="shipping-header">
          <h2>¡Felicitaciones por tu compra exitosa!</h2>
          <p>
            Estamos a un paso de finalizar el proceso. Por favor, proporciona tu
            dirección para realizar el envío de tu pedido.
          </p>
        </div>
        {submitStatus && (
          <div
            className={
              submitStatus.success ? "success-message" : "error-message"
            }
          >
            {submitStatus.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="shipping-form">
          <div className="field-group">
            <label htmlFor="fullName" className="shipping-label">
              Nombre completo *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`shipping-input ${errors.fullName ? "input-error" : ""}`}
              placeholder="Ej. Juan Paredes Quispe"
            />
            {errors.fullName && touched.fullName && (
              <p className="error-text">{errors.fullName}</p>
            )}
          </div>
          <div className="field-group">
            <label htmlFor="address" className="shipping-label">
              Dirección completa *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`shipping-input ${errors.address ? "input-error" : ""}`}
              placeholder="Ej. Av. Arequipa 123, Dpto. 501"
            />
            {errors.address && touched.address && (
              <p className="error-text">{errors.address}</p>
            )}
          </div>
          <div className="form-row">
            <div className="field-group form-col">
              <label htmlFor="city" className="shipping-label">
                Ciudad/Distrito *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`shipping-input ${errors.city ? "input-error" : ""}`}
                placeholder="Ej. Miraflores"
              />
              {errors.city && touched.city && (
                <p className="error-text">{errors.city}</p>
              )}
            </div>
            <div className="field-group form-col">
              <label htmlFor="state" className="shipping-label">
                Departamento/Provincia *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`shipping-input ${errors.state ? "input-error" : ""}`}
                placeholder="Ej. Lima"
              />
              {errors.state && touched.state && (
                <p className="error-text">{errors.state}</p>
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="field-group form-col">
              <label htmlFor="zipCode" className="shipping-label">
                Código postal *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`shipping-input ${errors.zipCode ? "input-error" : ""}`}
                placeholder="Ej. 15046"
              />
              {errors.zipCode && touched.zipCode && (
                <p className="error-text">{errors.zipCode}</p>
              )}
            </div>
            <div className="field-group form-col">
              <label htmlFor="phone" className="shipping-label">
                Teléfono *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`shipping-input ${errors.phone ? "input-error" : ""}`}
                placeholder="Ej. 987654321"
              />
              {errors.phone && touched.phone && (
                <p className="error-text">{errors.phone}</p>
              )}
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email" className="shipping-label">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`shipping-input ${errors.email ? "input-error" : ""}`}
              placeholder="Ej. tu@correo.com"
            />
            {errors.email && touched.email && (
              <p className="error-text">{errors.email}</p>
            )}
          </div>
          <div className="field-group">
            <label htmlFor="additionalNotes" className="shipping-label">
              Notas adicionales
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              className="shipping-textarea"
              placeholder="Instrucciones especiales para la entrega, puntos de referencia, etc."
            />
          </div>
          <div className="button-wrapper">
            <button
              type="submit"
              className={`shipping-button ${
                Object.values(errors).some((error) => error !== undefined)
                  ? "shipping-button-disabled"
                  : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar datos de envío"}
            </button>
          </div>
        </form>
        {/* Modal de Confirmación */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="confirm-modal">
              <div className="modal-header">
                <h3>Confirma tu información de envío</h3>
                <p>
                  Por favor verifica que todos los datos sean correctos antes de
                  continuar.
                </p>
                <p className="warning-text">
                  Una vez enviada, esta información no podrá ser modificada.
                </p>
              </div>
              <div className="modal-body">
                <div className="info-group">
                  <span className="info-label">Nombre completo:</span>
                  <span className="info-value">{formData.fullName}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Dirección:</span>
                  <span className="info-value">{formData.address}</span>
                </div>
                <div className="info-row">
                  <div className="info-col">
                    <span className="info-label">Ciudad/Distrito:</span>
                    <span className="info-value">{formData.city}</span>
                  </div>
                  <div className="info-col">
                    <span className="info-label">Departamento/Provincia:</span>
                    <span className="info-value">{formData.state}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-col">
                    <span className="info-label">Código postal:</span>
                    <span className="info-value">{formData.zipCode}</span>
                  </div>
                  <div className="info-col">
                    <span className="info-label">Teléfono:</span>
                    <span className="info-value">{formData.phone}</span>
                  </div>
                </div>
                <div className="info-group">
                  <span className="info-label">Correo electrónico:</span>
                  <span className="info-value">{formData.email}</span>
                </div>
                {formData.additionalNotes && (
                  <div className="info-group">
                    <span className="info-label">Notas adicionales:</span>
                    <span className="info-value">
                      {formData.additionalNotes}
                    </span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="secondary-button" onClick={cancelSubmit}>
                  Editar información
                </button>
                <button className="primary-button" onClick={confirmSubmit}>
                  Confirmar y enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
