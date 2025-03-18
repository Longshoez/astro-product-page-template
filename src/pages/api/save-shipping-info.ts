import type { APIRoute } from "astro";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      token,
      fullName,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      additionalNotes,
    } = data;
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Token no proporcionado",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const requiredFields = [
      "fullName",
      "address",
      "city",
      "state",
      "zipCode",
      "phone",
      "email",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Faltan campos requeridos: " + missingFields.join(", "),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
    const orderId = uuidv4();
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      token,
      fullName,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      additionalNotes || "-",
      orderId,
    ];
    try {
      //@ts-ignore
      await appendToSheet(import.meta.env.GOOGLE_SHEET_ID, rowData);

      //@ts-ignore
      const resend = new Resend(import.meta.env.RESEND_API_KEY);

      await sendCustomerEmail(resend, {
        fullName,
        email,
        orderId,
        timestamp,
      });

      await sendAdminEmail(resend, {
        fullName,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        additionalNotes: additionalNotes || "-",
        orderId,
        timestamp,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Orden generada correctamente",
          data: {
            token,
            orderId,
            timestamp,
            fullName,
            address,
            city,
            state,
            zipCode,
            phone,
            email,
            additionalNotes: additionalNotes || "-",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (sheetError) {
      console.error("Error al guardar en Google Sheets:", sheetError);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error al guardar en Google Sheets",
          error: sheetError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error al procesar la solicitud",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

async function appendToSheet(spreadsheetId: string, rowData: any) {
  const credentials = {
    //@ts-ignore
    email: import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //@ts-ignore
    key: import.meta.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  };
  if (!credentials.key || !credentials.email) {
    throw new Error("Credenciales de Google no configuradas correctamente");
  }
  const auth = new JWT(
    credentials.email,
    null,
    credentials.key,
    credentials.scopes,
  );
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties",
    });
    let sheetExists = false;
    if (response.data.sheets) {
      for (const sheet of response.data.sheets) {
        if (sheet.properties?.title === "ordenes") {
          sheetExists = true;
          break;
        }
      }
    }
    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: "ordenes",
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 11,
                  },
                },
              },
            },
          ],
        },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "ordenes!A1:K1",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              "Timestamp",
              "Token",
              "Nombre Completo",
              "Dirección",
              "Ciudad",
              "Estado",
              "Código Postal",
              "Teléfono",
              "Email",
              "Notas Adicionales",
              "Order ID",
            ],
          ],
        },
      });
    }
    return sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "ordenes!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowData],
      },
    });
  } catch (error) {
    console.error("Error al verificar/crear la hoja:", error);
    throw error;
  }
}

async function sendCustomerEmail(
  resend: any,
  { fullName, email, orderId, timestamp },
) {
  try {
    await resend.emails.send({
      from: "Tu Tienda <notificaciones@tudominio.com>",
      to: [email],
      subject: "Confirmación de pedido",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>¡Gracias por tu pedido, ${fullName}!</h2>
          <p>Hemos recibido correctamente tu pedido con el número: <strong>${orderId}</strong></p>
          <p>Fecha y hora del pedido: ${new Date(timestamp).toLocaleString("es-ES")}</p>
          <p>Nos pondremos en contacto contigo pronto para confirmar los detalles de la entrega.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>Saludos cordiales,<br>El equipo de Tu Tienda</p>
        </div>
      `,
    });
    console.log("Email de confirmación enviado al cliente");
  } catch (error) {
    console.error("Error al enviar email al cliente:", error);
  }
}

async function sendAdminEmail(resend: any, orderData: any) {
  try {
    await resend.emails.send({
      from: "Sistema de Pedidos <notificaciones@tudominio.com>",
      to: ["lucasan.videla@gmail.com"],
      subject: `Nuevo pedido recibido: ${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuevo pedido recibido</h2>
          <p><strong>ID del pedido:</strong> ${orderData.orderId}</p>
          <p><strong>Fecha y hora:</strong> ${new Date(orderData.timestamp).toLocaleString("es-ES")}</p>
          <h3>Datos del cliente:</h3>
          <ul>
            <li><strong>Nombre:</strong> ${orderData.fullName}</li>
            <li><strong>Email:</strong> ${orderData.email}</li>
            <li><strong>Teléfono:</strong> ${orderData.phone}</li>
          </ul>
          <h3>Dirección de envío:</h3>
          <ul>
            <li><strong>Dirección:</strong> ${orderData.address}</li>
            <li><strong>Ciudad:</strong> ${orderData.city}</li>
            <li><strong>Estado:</strong> ${orderData.state}</li>
            <li><strong>Código Postal:</strong> ${orderData.zipCode}</li>
          </ul>
          <h3>Notas adicionales:</h3>
          <p>${orderData.additionalNotes}</p>
        </div>
      `,
    });
    console.log("Email de notificación enviado al administrador");
  } catch (error) {
    console.error("Error al enviar email al administrador:", error);
  }
}
