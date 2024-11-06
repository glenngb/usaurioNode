document.addEventListener('DOMContentLoaded', () => {
    let carrito = []; // Array que contiene los IDs de los productos en el carrito
    let productos = []; // Array donde se almacenan los productos traídos de la API
    const divisa = 'CLP'; // Símbolo de pesos

    // Referencias al DOM
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonPago = document.querySelector('#boton-pago');

    // Función para cargar los productos desde la API
    async function cargarProductos() {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const datos = await response.json();
            productos = datos.map(producto => ({
                ...producto,
                precio: parseFloat(producto.precio)
            }));
            renderizarProductos(productos);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            DOMitems.innerHTML = '<p class="text-danger">No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>';
        }
    }

    // Función para renderizar los productos en el DOM
    function renderizarProductos(productos) {
        DOMitems.innerHTML = ''; // Limpiar el DOM antes de renderizar
        productos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-md-6', 'mb-4');
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid', 'mb-3');
            miNodoImagen.setAttribute('src', info.imagen_url);
            miNodoImagen.setAttribute('alt', info.nombre);
            miNodoImagen.style.maxHeight = '150px';
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio.toLocaleString()} ${divisa}`;
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary', 'mt-auto');
            miNodoBoton.textContent = 'Añadir al carrito';
            miNodoBoton.setAttribute('data-id', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    // Función para añadir productos al carrito
    function anyadirProductoAlCarrito(event) {
        const productoId = event.target.getAttribute('data-id');
        if (!carrito.includes(productoId)) {
            carrito.push(productoId);
            actualizarCarrito();
        } else {
            alert('Este producto ya está en el carrito.');
        }
    }

    // Función para actualizar el carrito en el DOM
    function actualizarCarrito() {
        DOMcarrito.innerHTML = ''; // Limpiar el carrito
        const productosEnCarrito = carrito.map(id => productos.find(producto => producto.id == id));
        productosEnCarrito.forEach(producto => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${producto.nombre} - ${producto.precio.toLocaleString()} ${divisa}`;
            DOMcarrito.appendChild(li);
        });
        actualizarTotal();
    }

    // Función para actualizar el total
    function actualizarTotal() {
        const total = carrito.reduce((acc, id) => {
            const producto = productos.find(p => p.id == id);
            return acc + (producto ? producto.precio : 0);
        }, 0);
        DOMtotal.textContent = `${total.toLocaleString()} ${divisa}`;
    }

    // Evento para vaciar el carrito
    DOMbotonVaciar.addEventListener('click', () => {
        carrito = [];
        actualizarCarrito();
    });

    // Evento para realizar el pago
    DOMbotonPago.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío.');
        } else {
            alert('Pago realizado con éxito. ¡Gracias por su compra!');
            carrito = [];
            actualizarCarrito();
        }
    });

    // Cargar productos al iniciar
    cargarProductos();
});
