const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Producto");
const sendEmail = require("../utils/sendEmails");

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

  res.json({
    token: createResponse.token,
    url: createResponse.url,
  });
});

// Confirmar Transacción
exports.commit = asyncHandler(async function (req, res) {
  console.log("Datos recibidos en commit:", req.body);
  console.log("Session data:", req.session);
  
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

  // Si la transacción es exitosa
  if (commitResponse.status === "AUTHORIZED") {
    console.log("Estado: AUTHORIZED");
    
    // Verificar que existe la sesión del usuario
    if (!req.session || !req.session.usuario || !req.session.usuario.correo) {
      return res.status(400).json({ error: "No se encontró la sesión del usuario" });
    }

    // Obtener el email del usuario de la sesión
    const userEmail = req.session.usuario.correo;
    
    // Actualizar stock
    try {
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para: ${product.name}`);
        }
        product.stock -= item.quantity;
        await product.save();
      }
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      return res.status(400).json({ error: error.message });
    }

    // Preparar detalles de la compra para el correo
    const purchaseDetails = {
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: items.reduce((total, item) => total + (item.price * item.quantity), 0),
      customerEmail: userEmail, // Usar el email de la sesión
      customerName: req.session.usuario.nombre || "Cliente" // Si hay un nombre en la sesión, usarlo
    };

    console.log("Detalles de compra para correo:", purchaseDetails);

    try {
      // Enviar el correo con los detalles de la compra
      await sendEmail(purchaseDetails);
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      // No devolvemos error al cliente ya que la compra fue exitosa
    }
  } else {
    console.log("Transacción no autorizada");
    return res.status(400).json({ error: "Transacción no autorizada" });
  }

  // Renderiza la vista de confirmación
  res.render("webpay_plus/commit", {
    token,
    commitResponse,
  });
});