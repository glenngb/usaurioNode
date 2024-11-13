const { WebpayPlus } = require("transbank-sdk");
const asyncHandler = require("../utils/asyncHandler");

// Crear Transacción
exports.create = asyncHandler(async function (req, res) {
  let buyOrder = "OrdenDeCompra001"
  let sessionId = "S-010010101";
  let amount = 1000
  let returnUrl = `${req.protocol}://${req.get("host")}/webpay_plus/commit`;

  const createResponse = await new WebpayPlus.Transaction().create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  res.render("webpay_plus/create", {
    token: createResponse.token,
    url: createResponse.url,
    buyOrder,
    sessionId,
    amount,
  });
});

// Confirmar Transacción
exports.commit = asyncHandler(async function (req, res) {
  const token = req.query.token_ws || req.body.token_ws;

  if (!token) {
    return res.status(400).send("Token no recibido");
  }

  // Confirmar la transacción con el token recibido
  const commitResponse = await new WebpayPlus.Transaction().commit(token);
  res.render("webpay_plus/commit", {
    token,
    commitResponse,
  });
});
