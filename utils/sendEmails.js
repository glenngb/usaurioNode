const nodemailer = require('nodemailer');

async function sendEmail(req, purchaseDetails = {
  customerName: "ivanr978@gmail.com",
  email: "ivanr978@gmail.com",
  items: [
    { name: "Monitor LG", quantity: 2, price: 640000 },
    { name: "Producto 2", quantity: 1, price: 570000 },
  ],
  total: 1210000
  
}) {
  try {
    // Validar que el correo esté presente
    if (!purchaseDetails.email) {
      throw new Error("No se proporcionó un email válido para enviar el correo.");
    }

    console.log("Detalles de la compra:", purchaseDetails); // Para debug

    // Configurar el transportador de nodemailer con los datos de Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "8006d7001@smtp-brevo.com",
        pass: "C815qWK294XShTaB"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Configurar el contenido del correo
    const mailOptions = {
      from: "ivanr978@gmail.com",
      to: purchaseDetails.email, // Correo forzado o proporcionado
      subject: "Confirmación de tu compra",
      html: `
        <h1>Gracias por tu compra, ${purchaseDetails.customerName}!</h1>
        <p>Estos son los detalles de tu compra:</p>
        <ul>
          ${purchaseDetails.items
            .map(
              item =>
                `<li>${item.name} (x${item.quantity}): $${item.price.toLocaleString()}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total:</strong> $${purchaseDetails.total.toLocaleString()}</p>
      `
    };

    console.log("Opciones de correo:", mailOptions); // Para debug

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente:", info.messageId);
    return info;

  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
}

module.exports = sendEmail;
