// ================================
// MANEJO GLOBAL DEL CARRITO DE COMPRAS
// ================================

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("nixCarrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("nixCarrito", JSON.stringify(carrito));
}

// Agregar producto
function agregarAlCarrito(nombre, precio, imagen) {
  let carrito = obtenerCarrito();

  const existente = carrito.find(item => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: 1 });
  }

  guardarCarrito(carrito);
  actualizarContadorCarrito();
  alert(`${nombre} fue añadido a tu carrito 🛒`);
}

// Eliminar producto
function eliminarDelCarrito(nombre) {
  let carrito = obtenerCarrito().filter(item => item.nombre !== nombre);
  guardarCarrito(carrito);
  actualizarContadorCarrito();
  mostrarCarrito();
}

// Actualizar cantidad
function actualizarCantidad(nombre, nuevaCantidad) {
  let carrito = obtenerCarrito().map(item => {
    if (item.nombre === nombre) {
      return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
    }
    return item;
  });
  guardarCarrito(carrito);
  mostrarCarrito();
  actualizarContadorCarrito();
}

// Contador global (header)
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = total;
}

// Mostrar carrito (en TuCarrito.html)
function mostrarCarrito() {
  const cont = document.getElementById("carrito-container");
  if (!cont) return;

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    cont.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    return;
  }

  cont.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <img src="${item.imagen}" width="70">
      <div>
        <h3>${item.nombre}</h3>
        <p>💲${item.precio.toLocaleString()} COP</p>
        <p>Cantidad: 
          <input type="number" min="1" value="${item.cantidad}" onchange="actualizarCantidad('${item.nombre}', this.value)">
        </p>
        <button onclick="eliminarDelCarrito('${item.nombre}')">❌ Eliminar</button>
      </div>
    </div>
  `).join("");

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  cont.innerHTML += `<h3>Total: 💲${total.toLocaleString()} COP</h3>`;
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  mostrarCarrito();
});
