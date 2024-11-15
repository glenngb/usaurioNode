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
        // Mostrar los productos y cantidades del carrito cada vez que se agrega un producto
      console.log("Carrito actualizado:", getCartItemsWithQuantities());
    });
  });

// Borrar el carrito
function clearCart() {
  localStorage.removeItem("cart");
  console.log("Carrito borrado.");
}

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
        <span class="item-price">Precio: $${itemTotal.toFixed(0)}</span>
        <button class="btn btn-sm btn-danger" data-id="${id}">Eliminar</button>
      `;
      cartContainer.appendChild(cartItem);
    }

    // Muestra el total
    document.getElementById("cart-total").textContent = `Total: $${total.toFixed(0)}`;

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

  // Función para aumentar la cantidad de un producto
  function increaseQuantity(id) {
    cart[id].quantity += 1;
    saveCart();
    updateCartDisplay();
    updateCartCount(); // Actualizar el contador
  }

  // Función para disminuir la cantidad de un producto
  function decreaseQuantity(id) {
    if (cart[id].quantity > 1) {
      cart[id].quantity -= 1;
    } else {
      delete cart[id]; // Eliminar el producto si la cantidad llega a 0
    }
    saveCart();
    updateCartDisplay();
    updateCartCount(); // Actualizar el contador
  }

  // Función para actualizar el modal con el resumen del carrito
  function updateCartModal() {
    cartSummaryElement.innerHTML = ""; // Limpiar contenido previo
    let total = 0;

    // Iterar sobre los productos del carrito
    for (const id in cart) {
      const item = cart[id];
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      // Crear el contenedor para cada ítem en el carrito
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item", "mb-2");
      cartItem.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">Cantidad: <span id="quantity-${id}">${item.quantity}</span></span>
        <span class="item-price">Precio: $${itemTotal.toFixed(0)}</span>
        <div class="item-controls">
          <button class="btn btn-sm btn-secondary" id="decrease-${id}" data-id="${id}">-</button>
          <button class="btn btn-sm btn-secondary" id="increase-${id}" data-id="${id}">+</button>
          <button class="btn btn-sm btn-danger" id="remove-${id}" data-id="${id}">Eliminar</button>
        </div>
      `;
      cartSummaryElement.appendChild(cartItem);

      // Evento para disminuir la cantidad
      document.getElementById(`decrease-${id}`).addEventListener("click", () => {
        if (cart[id].quantity > 1) {
          cart[id].quantity--;
          saveCart();
          updateCartModal();  // Actualizar el carrito
        }
      });

      // Evento para aumentar la cantidad
      document.getElementById(`increase-${id}`).addEventListener("click", () => {
        cart[id].quantity++;
        saveCart();
        updateCartModal();  // Actualizar el carrito
      });

      // Evento para eliminar el producto del carrito
      document.getElementById(`remove-${id}`).addEventListener("click", () => {
        delete cart[id];
        saveCart();
        updateCartModal();  // Actualizar el carrito
      });
    }

    // Actualizar el total
    cartTotalElement.textContent = `Total: $${total.toFixed(0)}`;
  }

  // Muestra el modal cuando se hace clic en el carrito
  document.querySelector("#cart-count").parentElement.addEventListener("click", () => {
    updateCartModal(); // Actualizar el contenido del modal
    cartModal.show(); // Mostrar el modal
  });



//integración botón webpay


// Función para obtener los artículos con su id y cantidad
function getCartItemsWithQuantities() {
  const items = [];

  // Recorremos el carrito y creamos el array con los productos
  for (const id in cart) {
    const item = cart[id];
    items.push({
      id: id,
      quantity: item.quantity
    });
    console.log(`Producto ID: ${id}, Cantidad: ${item.quantity}`); // Log para verificar que está correcto
  }

  return items;
}


 // Función para calcular el monto total del carrito
function calculateTotalAmount() {
  let total = 0;
  for (const id in cart) {
      total += cart[id].price * cart[id].quantity;
  }
  return total;
}

// Botón de "Pagar"
document.getElementById("checkout").addEventListener("click", () => {
  const amount = calculateTotalAmount();
  const items = getCartItemsWithQuantities(); // Obtener los productos y cantidades

  fetch("/webpay_plus/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,
      items: items, // Envía los productos con sus cantidades
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.url && data.token) {
      window.location.href = `${data.url}?token_ws=${data.token}`;
    } else {
      console.error("Error al crear la transacción", data);
      alert("Hubo un problema al procesar el pago. Por favor, intenta nuevamente.");
    }
  })
  .catch(error => {
    console.error("Error en la solicitud POST:", error);
    alert("Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.");
  });

  cartModal.hide();
  clearCart();
});



// FIN integración botón webpay

  // Inicializar la vista del carrito al cargar la página
  updateCartDisplay();
  updateCartCount(); // Inicializar el contador de productos

});


script.
  $('#editarUsuarioModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Botón que activó el modal
    var id = button.data('id');
    var nombre = button.data('nombre');
    var rut = button.data('rut');
    var correo = button.data('correo');
    var rol = button.data('rol');

    var modal = $(this);
    modal.find('.modal-body #editar-id').val(id);
    modal.find('.modal-body #editar-nombre').val(nombre);
    modal.find('.modal-body #editar-rut').val(rut);
    modal.find('.modal-body #editar-correo').val(correo);
    modal.find('.modal-body #editar-rol').val(rol);

    // Cambiar la acción del formulario para que apunte a la ruta de actualización del usuario
    modal.find('form').attr('action', `/usuarios/${id}/actualizar`);
  });

script.
  document.addEventListener('DOMContentLoaded', function () {
    const eliminarBtns = document.querySelectorAll('.btn-eliminar');

    eliminarBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const userId = this.getAttribute('data-id'); // Obtener el ID del usuario

        // Mostrar la alerta de confirmación
        Swal.fire({
          title: '¿Estás seguro?',
          text: "No podrás revertir esta acción",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // Si el usuario confirma, hacer la petición de eliminación
            fetch(`/usuarios/${userId}/eliminar`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  Swal.fire(
                    'Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                  );
                  location.reload();
                } else {
                  Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
                }
              })
              .catch(error => {
                Swal.fire('Error', 'Hubo un problema al eliminar el usuario.', 'error');
              });
          }
        });
      });
    });
  });

