const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Producto"); // Asegúrate de importar tu modelo de producto

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
  }

  // Renderiza la vista de confirmación de la transacción
  res.render("webpay_plus/commit", {
    token,
    commitResponse,
  });
});
