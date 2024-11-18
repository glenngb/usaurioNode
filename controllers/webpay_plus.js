const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Producto"); // Asegúrate de importar tu modelo de producto
const sendEmail = require("../utils/sendEmails"); // Asegúrate de que esta función esté configurada para enviar correos

// Crear Transacción
exports.create = asyncHandler(async function (req, res) {
  let buyOrder = "OrdenDeCompra001";
  let sessionId = "S-010010101";
  let amount = req.body.amount;
  let returnUrl = `${req.protocol}://${req.get("host")}/webpay_plus/commit`;

  const createResponse = await new WebpayPlus.Transaction().create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  // Responde con JSON en lugar de renderizar una vista
  res.json({
    token: createResponse.token,
    url: createResponse.url,
  });
});

// Confirmar Transacción
exports.commit = asyncHandler(async function (req, res) {
  console.log(req.body);
  const token = req.query.token_ws || req.body.token_ws;

  if (!token) {
    return res.status(400).send("Token no recibido");
  }

  // Confirmar la transacción con el token recibido
  const commitResponse = await new WebpayPlus.Transaction().commit(token);

  // Verifica si `items` está en `req.body` y es un array
  const items = req.body.items || [];
  if (!Array.isArray(items)) {
    return res.status(400).json({
      error: "La lista de productos no se ha recibido correctamente",
    });
  }

  // Si la transacción es exitosa, descontar el stock
  if (commitResponse.status === "AUTHORIZED") {
    console.log("Estado: AUTHORIZED");
    for (const item of items) {
      // Encuentra el producto en la base de datos y descuenta el stock
      const product = await Product.findById(item.productId);

      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        return res.status(400).json({
          error: `Stock insuficiente para el producto con ID ${item.productId}`,
        });
      }
    }

    // Detalles de la compra
    const purchaseDetails = {
      email: req.body.email, // Correo del usuario
      customerName: req.body.customerName || "Cliente", // Nombre del cliente (si está disponible)
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: items.reduce((total, item) => total + (item.price * item.quantity), 0)
    };

    try {
      // Enviar el correo con los detalles de la compra
      await sendEmail(purchaseDetails);  // Llamar la función de envío de correo
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }

  // Renderiza la vista de confirmación de la transacción
  res.render("webpay_plus/commit", {
    token,
    commitResponse,
  });
});

async function realizarCompra(detalles) {
  // ... lógica para realizar la compra ...
  
  // Ejemplo de detalles de la compra
  const detalleCompra = `
      Gracias por tu compra. Aquí están los detalles:

      - Producto: ${detalles.productoNombre}
      - Cantidad: ${detalles.cantidad}
      - Precio: $${detalles.precio}
      - Total: $${detalles.total}
      - Fecha de compra: ${new Date().toLocaleDateString()}

      Si tienes alguna pregunta, no dudes en contactarnos.
  `;

  const correoUsuario = detalles.correoUsuario; // Aquí deberías obtener el correo del usuario

  // Enviar el correo con el detalle de la compra
  await enviarCorreo(detalleCompra, correoUsuario);
}

async function manejarRespuesta(respuesta) {
  if (respuesta.estado === 'AUTHORIZED') {
      // Aquí se maneja la lógica después de la autorización
      const detallesCompra = {
          productoNombre: 'Nombre del producto',
          cantidad: 2,
          precio: 20.00,
          total: 40.00,
          correoUsuario: 'usuario@ejemplo.com', // Aquí deberías obtener el correo del usuario
      };

      // Crear el mensaje de detalle de compra
      const detalleCompra = `
          Gracias por tu compra. Aquí están los detalles:
          - Producto: ${detallesCompra.productoNombre}
          - Cantidad: ${detallesCompra.cantidad}
          - Precio: $${detallesCompra.precio}
          - Total: $${detallesCompra.total}
          - Fecha de compra: ${new Date().toLocaleDateString()}
          Si tienes alguna pregunta, no dudes en contactarnos.
      `;

      try {
          // Enviar el correo con el detalle de la compra
          await enviarCorreo(detalleCompra, detallesCompra.correoUsuario);
          console.log('Correo enviado exitosamente a:', detallesCompra.correoUsuario);
      } catch (error) {
          console.error('Error al enviar el correo:', error);
      }
  }
}

// Esta función enviaría el correo de los detalles de la compra
async function enviarCorreo(detalleCompra, correoUsuario) {
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    service: 'smtp-relay.brevo.com', // O el servicio de correo que estés usando
    auth: {
      user: 'ivanr978@gmail.com', // Reemplaza con tu correo
      pass: 'C815qWK294XShTaB' // Reemplaza con tu contraseña o una app password
    }
  });

  const mailOptions = {
    from: 'tu-correo@gmail.com',
    to: correoUsuario,
    subject: 'Detalles de tu compra',
    text: detalleCompra
  };

  await transporter.sendMail(mailOptions);
  console.log('Correo enviado con éxito');
}
