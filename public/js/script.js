document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const cartCountElement = document.getElementById("cart-count");
  const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
  const cartSummaryElement = document.getElementById("cart-summary");
  const cartTotalElement = document.getElementById("cart-total-modal");

  // Función para actualizar el número de productos en el carrito
  function updateCartCount() {
    let count = 0;
    for (const id in cart) {
      count += cart[id].quantity;
    }
    cartCountElement.textContent = count;
  }

  // Incrementa el número de productos en el carrito cuando se agrega uno nuevo
  document.querySelectorAll("form[action^='/carrito/agregar/']").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const productId = form.getAttribute("action").split("/").pop();
      const productName = form.closest(".card").querySelector(".card-title").textContent;
      const productPrice = parseFloat(
        form.closest(".card").querySelector(".font-weight-bold").textContent.replace("Precio: $", "")
      );

      // Agregar o actualizar el producto en el carrito
      if (cart[productId]) {
        cart[productId].quantity += 1;
      } else {
        cart[productId] = { name: productName, price: productPrice, quantity: 1 };
      }

      saveCart();
      updateCartDisplay();
      updateCartCount();  // Actualizar el contador de productos en el carrito
    });
  });

  // Guarda el carrito en localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Actualiza el contenido del carrito en el DOM
  function updateCartDisplay() {
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = ""; // Limpia el contenido anterior
    let total = 0;

    for (const id in cart) {
      const item = cart[id];
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item", "mb-2");
      cartItem.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">Cantidad: ${item.quantity}</span>
        <span class="item-price">Precio: $${itemTotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-danger" data-id="${id}">Eliminar</button>
      `;
      cartContainer.appendChild(cartItem);
    }

    // Muestra el total
    document.getElementById("cart-total").textContent = `Total: $${total.toFixed(2)}`;

    // Agrega evento de eliminar para cada botón
    cartContainer.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-id");
        delete cart[productId];
        saveCart();
        updateCartDisplay();
        updateCartCount();  // Actualizar el contador tras eliminar un producto
      });
    });
  }

  // Función para actualizar el modal con el resumen del carrito
  function updateCartModal() {
    cartSummaryElement.innerHTML = ""; // Limpiar contenido previo
    let total = 0;

    for (const id in cart) {
      const item = cart[id];
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item", "mb-2");
      cartItem.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">Cantidad: ${item.quantity}</span>
        <span class="item-price">Precio: $${itemTotal.toFixed(2)}</span>
      `;
      cartSummaryElement.appendChild(cartItem);
    }

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  }

  // Muestra el modal cuando se hace clic en el carrito
  document.querySelector("#cart-count").parentElement.addEventListener("click", () => {
    updateCartModal(); // Actualizar el contenido del modal
    cartModal.show(); // Mostrar el modal
  });

  // Botón de "Eliminar Carrito"
  document.getElementById("clear-cart").addEventListener("click", () => {
    for (const id in cart) {
      delete cart[id]; // Eliminar todos los productos del carrito
    }
    saveCart();
    updateCartDisplay();
    updateCartCount();  // Actualizar el contador de productos
    cartModal.hide();  // Cerrar el modal
  });

  // Botón de "Pagar" (puedes agregar la lógica de pago aquí)
  document.getElementById("checkout").addEventListener("click", () => {
    alert("Funcionalidad de pago aún no implementada.");
    cartModal.hide();  // Cerrar el modal
  });

  // Inicializar la vista del carrito al cargar la página
  updateCartDisplay();
  updateCartCount(); // Inicializar el contador de productos
});
