// controllers/stockController.js

const asyncHandler = require("../utils/asyncHandler");
const inventoryService = require("../services/inventoryService"); // Importa el servicio de inventario
const { WebpayPlus } = require("transbank-sdk");

// Controlador para verificar el estado de la transacción y actualizar el stock
exports.updateStockOnTransaction = asyncHandler(async (req, res) => {
  const { token, productId, quantity } = req.body;

  if (!token || !productId || !quantity) {
    return res.status(400).json({ message: "Faltan parámetros en la solicitud" });
  }

  // Confirmar el estado de la transacción con Transbank
  const commitResponse = await new WebpayPlus.Transaction().commit(token);

  // Verificar que la transacción esté autorizada
  if (commitResponse.status === "AUTHORIZED") {
    try {
      // Descuenta el stock usando el servicio de inventario
      const updatedProduct = await inventoryService.updateStock(productId, quantity);

      res.status(200).json({
        message: `Transacción autorizada y stock actualizado. Stock actual de ${updatedProduct.name}: ${updatedProduct.stock}`,
      });
    } catch (error) {
      console.error("Error al actualizar el stock:", error.message);
      res.status(500).json({ message: "Error al actualizar el stock: " + error.message });
    }
  } else {
    // Si la transacción no está autorizada, no se descuenta el stock
    res.status(400).json({
      message: "Transacción no autorizada, el stock no ha sido modificado.",
    });
  }
});
