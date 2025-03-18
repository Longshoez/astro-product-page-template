import { z } from "zod";

const shippingAddressSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100),
  email: z.string().email({ message: "Email inválido" }).max(100),
  phone: z
    .string()
    .min(7, { message: "Número de teléfono demasiado corto" })
    .max(20)
    .regex(/^[+]?[\d\s()-]{7,20}$/, {
      message: "Formato de teléfono inválido",
    }),
  address: z
    .string()
    .min(5, { message: "La dirección es demasiado corta" })
    .max(200),
  city: z.string().min(2, { message: "La ciudad es demasiado corta" }).max(100),
  state: z
    .string()
    .min(2, { message: "La provincia/estado es demasiado corta" })
    .max(100),
  zipCode: z.string().min(3, { message: "Código postal inválido" }).max(20),
  country: z.string().min(2, { message: "País inválido" }).max(100),
});

export const paymentDataSchema = z.object({
  paymentId: z.string().min(3, { message: "ID de pago inválido" }),
  status: z.enum(["pending", "completed", "failed", "processing"], {
    errorMap: () => ({ message: "Estado de pago inválido" }),
  }),
  merchantOrderId: z.string().min(3, { message: "ID de orden inválido" }),
  shippingAddress: shippingAddressSchema,
});

export type PaymentData = z.infer<typeof paymentDataSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export function validatePartialPaymentData(data: unknown) {
  return paymentDataSchema.partial().safeParse(data);
}

export function validateShippingAddress(data: unknown) {
  return shippingAddressSchema.safeParse(data);
}
