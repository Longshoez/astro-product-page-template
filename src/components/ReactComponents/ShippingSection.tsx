import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./ShippingSection.css";

interface ShippingProps {
  paymentId: string;
  merchantOrderId: string;
}

const shippingSchema = z.object({
  name: z
    .string()
    .nonempty("Obligatorio")
    .min(2, { message: "Mín. 2 caracteres" })
    .max(100),
  email: z.string().email({ message: "Email inválido" }).max(100),
  phone: z
    .string()
    .min(7, { message: "Mín. 7 dígitos" })
    .max(20)
    .regex(/^[+]?[\d\s()-]{7,20}$/, {
      message: "Formato inválido",
    }),
  address: z.string().min(5, { message: "Mín. 5 caracteres" }).max(200),
  city: z.string().min(2, { message: "Mín. 2 caracteres" }).max(100),
  state: z.string().min(2, { message: "Mín. 2 caracteres" }).max(100),
  zipCode: z.string().min(3, { message: "Mín. 3 caracteres" }).max(20),
  country: z.string().min(2, { message: "Mín. 2 caracteres" }).max(100),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

type FormStatus = "editing" | "submitting" | "success" | "error" | "confirming";

const ShippingSection: React.FC<ShippingProps> = ({
  paymentId,
  merchantOrderId,
}) => {
  const [formStatus, setFormStatus] = useState<FormStatus>("editing");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ShippingFormData | null>(null);
  const STORAGE_KEY = `shipping_${paymentId}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "completed") {
      setFormStatus("success");
      // Intentamos recuperar los datos guardados para mostrarlos en la pantalla de éxito
      try {
        const savedData = localStorage.getItem(`${STORAGE_KEY}_data`);
        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.shippingAddress) {
            setFormData(data.shippingAddress);
          }
        }
      } catch (e) {
        console.error("Error al recuperar datos guardados:", e);
      }
      return;
    }

    // Si no está completado, cargamos los datos guardados en el formulario
    try {
      const savedData = localStorage.getItem(`${STORAGE_KEY}_data`);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.shippingAddress) {
          reset(data.shippingAddress);
        }
      }
    } catch (e) {
      console.error("Error al recuperar datos guardados:", e);
    }
  }, [STORAGE_KEY, reset]);

  const onPreSubmit = (data: ShippingFormData) => {
    setFormData(data);
    setFormStatus("confirming");
  };

  const onConfirmSubmit = async () => {
    if (!formData) return;

    setFormStatus("submitting");

    const backupData = {
      timestamp: new Date().toISOString(),
      paymentId,
      merchantOrderId,
      shippingAddress: formData,
    };
    localStorage.setItem(`${STORAGE_KEY}_data`, JSON.stringify(backupData));

    try {
      const response = await fetch("/api/save-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          status: "completed",
          merchantOrderId,
          shippingAddress: formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem(STORAGE_KEY, "completed");
        setFormStatus("success");
      } else {
        setErrorMessage(result.error || "Error al guardar los datos");
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setErrorMessage(
        "Error de conexión. Verifica tu conexión e intenta nuevamente.",
      );
      setFormStatus("error");
    }
  };

  const handleCancelConfirm = () => {
    setFormStatus("editing");
  };

  const handleRetry = () => {
    setFormStatus("editing");
    setErrorMessage("");
  };

  return (
    <div className="shipping-section">
      <h2 className="shipping-title">Información de envío</h2>

      {formStatus === "submitting" && (
        <div className="shipping-loading">
          <div className="shipping-spinner"></div>
          <p className="shipping-message">Procesando información...</p>
        </div>
      )}

      {formStatus === "editing" && (
        <form onSubmit={handleSubmit(onPreSubmit)} className="shipping-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre completo *</label>
              <input
                id="name"
                placeholder="Tu nombre completo"
                className={errors.name ? "input-error" : ""}
                {...register("name")}
              />
              {errors.name && (
                <span className="error-tooltip">{errors.name.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                className={errors.email ? "input-error" : ""}
                {...register("email")}
              />
              {errors.email && (
                <span className="error-tooltip">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                id="phone"
                type="tel"
                placeholder="+XX XXXX XXXX"
                className={errors.phone ? "input-error" : ""}
                {...register("phone")}
              />
              {errors.phone && (
                <span className="error-tooltip">{errors.phone.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address">Dirección *</label>
              <input
                id="address"
                placeholder="Calle, número, piso, depto."
                className={errors.address ? "input-error" : ""}
                {...register("address")}
              />
              {errors.address && (
                <span className="error-tooltip">{errors.address.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="city">Ciudad *</label>
              <input
                id="city"
                placeholder="Ciudad"
                className={errors.city ? "input-error" : ""}
                {...register("city")}
              />
              {errors.city && (
                <span className="error-tooltip">{errors.city.message}</span>
              )}
            </div>
            <div className="form-group half">
              <label htmlFor="state">Estado/Provincia *</label>
              <input
                id="state"
                placeholder="Provincia"
                className={errors.state ? "input-error" : ""}
                {...register("state")}
              />
              {errors.state && (
                <span className="error-tooltip">{errors.state.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="zipCode">Código Postal *</label>
              <input
                id="zipCode"
                placeholder="CP"
                className={errors.zipCode ? "input-error" : ""}
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <span className="error-tooltip">{errors.zipCode.message}</span>
              )}
            </div>
            <div className="form-group half">
              <label htmlFor="country">País *</label>
              <input
                id="country"
                placeholder="País"
                className={errors.country ? "input-error" : ""}
                {...register("country")}
              />
              {errors.country && (
                <span className="error-tooltip">{errors.country.message}</span>
              )}
            </div>
          </div>

          <div className="form-controls">
            <button type="submit" className="btn-primary">
              Confirmar dirección
            </button>
          </div>

          <div className="form-disclaimer">
            Tus datos se utilizarán únicamente para el envío de tu pedido.
          </div>
        </form>
      )}

      {formStatus === "confirming" && formData && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirma tus datos</h3>
            <p className="confirmation-warning">
              <span className="warning-icon">⚠️</span> Esta información se
              enviará a nuestro sistema y{" "}
              <strong>no podrá ser modificada después</strong>.
            </p>

            <div className="confirmation-data">
              <div className="data-row">
                <strong>Nombre:</strong> {formData.name}
              </div>
              <div className="data-row">
                <strong>Email:</strong> {formData.email}
              </div>
              <div className="data-row">
                <strong>Teléfono:</strong> {formData.phone}
              </div>
              <div className="data-row">
                <strong>Dirección:</strong> {formData.address}
              </div>
              <div className="data-row">
                <strong>Ciudad:</strong> {formData.city}
              </div>
              <div className="data-row">
                <strong>Estado/Provincia:</strong> {formData.state}
              </div>
              <div className="data-row">
                <strong>Código Postal:</strong> {formData.zipCode}
              </div>
              <div className="data-row">
                <strong>País:</strong> {formData.country}
              </div>
            </div>

            <div className="confirmation-actions">
              <button onClick={handleCancelConfirm} className="btn-secondary">
                Editar
              </button>
              <button onClick={onConfirmSubmit} className="btn-primary">
                Confirmar y enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {formStatus === "success" && (
        <div className="shipping-success">
          <div className="success-icon">✓</div>
          <h3>¡Datos registrados con éxito!</h3>
          <p>Tu información de envío ha sido procesada correctamente.</p>

          {formData && (
            <div className="success-data">
              <div className="data-summary">
                <div>
                  <strong>Nombre:</strong> {formData.name}
                </div>
                <div>
                  <strong>Email:</strong> {formData.email}
                </div>
                <div>
                  <strong>Dirección:</strong> {formData.address}
                </div>
                <div>
                  <strong>Ciudad:</strong> {formData.city}, {formData.state}
                </div>
              </div>
            </div>
          )}

          <div className="payment-info">ID de Pago: {paymentId}</div>
          <div className="form-note">
            <div className="note-icon">ℹ️</div>
            <p>
              La información enviada no puede ser modificada, pues ya ha sido
              registrada en nuestro sistema.
            </p>
          </div>
        </div>
      )}

      {formStatus === "error" && (
        <div className="shipping-error">
          <div className="error-icon">!</div>
          <h3>Ha ocurrido un error</h3>
          <p>
            {errorMessage ||
              "No pudimos procesar tu información. Por favor intenta nuevamente."}
          </p>
          <button onClick={handleRetry} className="btn-secondary">
            Intentar nuevamente
          </button>
        </div>
      )}
    </div>
  );
};

export default ShippingSection;
