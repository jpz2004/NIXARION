// ==========================
// VARIABLES GLOBALES
// ==========================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let compraActual = null;       // copia de los items que se compran
let infoEnvioActual = null;    // datos de envío capturados


// ==========================
// FUNCIONES DE CARRITO
// ==========================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = carrito.length;
}

function agregarAlCarrito(nombre, precio, imagen) {
  const producto = { nombre, precio, imagen };
  carrito.push(producto);
  guardarCarrito();
  alert(`${nombre} añadido al carrito ✅`);
}

function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalPrecio = document.getElementById("total-precio");

  if (!lista || !totalPrecio) return;

  lista.innerHTML = "";
  if (carrito.length === 0) {
    lista.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
    totalPrecio.textContent = "$0 COP";
    return;
  }

  let total = 0;
  carrito.forEach((producto, index) => {
    total += producto.precio;

    const item = document.createElement("div");
    item.classList.add("item-carrito");
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" width="60">
      <span title="${producto.nombre}">${producto.nombre}</span>
      <span>$${producto.precio.toLocaleString("es-CO")} COP</span>
      <button onclick="eliminarDelCarrito(${index})">❌</button>
    `;
    lista.appendChild(item);
  });

  totalPrecio.textContent = `$${total.toLocaleString("es-CO")} COP`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}


// ==========================
// FUNCIONES DE PROCESO DE PAGO
// ==========================
function iniciarProcesoPago(numTarjeta) {
  const loaderEnvio = document.getElementById("loader-envio");
  const mensajeEnvio = document.getElementById("mensaje-envio");
  const barraCont = document.getElementById("barra-container");
  const barra = document.getElementById("barra");
  const mensaje = document.getElementById("mensaje-final");

  // Mostrar loader y resetear barra
  loaderEnvio.style.display = "flex";
  barraCont.style.display = "block";
  barra.style.width = "0%";
  mensaje.textContent = "Procesando tu pago y preparando el envío...";

  let progreso = 0;
  const intervalo = setInterval(() => {
    progreso += 12;
    if (progreso > 100) progreso = 100;
    barra.style.width = progreso + "%";

    if (progreso === 36) mensaje.textContent = "Autenticando tarjeta... 🔒";
    if (progreso === 64) mensaje.textContent = "Confirmando items y dirección... 📦";

    if (progreso >= 100) {
      clearInterval(intervalo);
      loaderEnvio.style.display = "none";
      mensaje.textContent = "🎉 ¡Gracias por tu compra en NIXARION! ✨";

      mostrarRecibo(numTarjeta);

      // limpiar carrito
      carrito = [];
      guardarCarrito();
      mostrarCarrito();
    }
  }, 400);
}

function mostrarRecibo(numTarjeta) {
  const reciboCont = document.getElementById("recibo-container");
  if (!reciboCont || !compraActual || !infoEnvioActual) return;

  // Obtener últimos 4 dígitos
  const digits = numTarjeta.replace(/\D/g, "");
  const ultimos4 = digits.slice(-4) || "----";
  const tarjetaMask = `**** **** **** ${ultimos4}`;

  // Calcular total
  let total = 0;
  compraActual.forEach(p => total += p.precio);

  // Plantilla HTML
  reciboCont.innerHTML = `
    <h3>Recibo de compra</h3>
    <p><strong>Cliente:</strong> ${infoEnvioActual.nombreEnvio}</p>
    <p><strong>Dirección:</strong> ${infoEnvioActual.direccion}, ${infoEnvioActual.ciudad} - ${infoEnvioActual.departamento}</p>
    <p><strong>Teléfono:</strong> ${infoEnvioActual.telefono}</p>
    <hr>
    <div>
      ${compraActual.map(p => `
        <div class="recibo-item">
          <div style="display:flex; gap:10px; align-items:center;">
            <img src="${p.imagen}" alt="${p.nombre}" width="40" style="border-radius:6px;"/>
            <div>${p.nombre}</div>
          </div>
          <div>$${p.precio.toLocaleString("es-CO")} COP</div>
        </div>
      `).join("")}
    </div>
    <hr>
    <div style="display:flex;justify-content:space-between; font-weight:700;">
      <div>Total</div>
      <div>$${total.toLocaleString("es-CO")} COP</div>
    </div>
    <p style="margin-top:12px;"><strong>Método de pago:</strong> Tarjeta ${tarjetaMask}</p>
    <p style="font-size:0.95rem; color:#555; margin-top:12px;">
      Nota: Este es un recibo simulado para el MVP. No se realizó ninguna transacción real.
    </p>
  `;

  reciboCont.style.display = "block";

  // limpiar variables temporales
  compraActual = null;
  infoEnvioActual = null;
}

// ==========================
// EVENTOS INICIALES
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  // Botón vaciar carrito
  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (!confirm("¿Estás seguro que quieres vaciar el carrito?")) return;
      carrito = [];
      guardarCarrito();
      mostrarCarrito();
    });
  }

  // Formulario de pago + dirección
  const formPago = document.getElementById("form-pago");
  if (formPago) {
    formPago.addEventListener("submit", (e) => {
      e.preventDefault();

      if (carrito.length === 0) {
        alert("Tu carrito está vacío 🛒");
        return;
      }

      // Obtener datos de envío
      const nombreEnvio = document.getElementById("nombre-envio").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const ciudad = document.getElementById("ciudad").value.trim();
      const departamento = document.getElementById("departamento").value.trim();
      const telefono = document.getElementById("telefono").value.trim();

      // Datos de tarjeta (simulados)
      const numTarjeta = document.getElementById("num-tarjeta").value.trim();
      const nombreTitular = document.getElementById("nombre-titular").value.trim();
      const fechaExp = document.getElementById("fecha-exp").value.trim();
      const cvc = document.getElementById("cvc").value.trim();

      // Validación mínima
      if (!nombreEnvio || !direccion || !ciudad || !departamento || !telefono) {
        alert("Por favor completa todos los datos de envío.");
        return;
      }
      if (!numTarjeta || !nombreTitular || !fechaExp || !cvc) {
        alert("Por favor completa todos los datos de la tarjeta.");
        return;
      }

      // Guardar datos actuales para generar recibo después
      compraActual = carrito.slice(); 
      infoEnvioActual = { nombreEnvio, direccion, ciudad, departamento, telefono };

      // iniciar simulación de pago y envío
      iniciarProcesoPago(numTarjeta);
    });
  }

  // Mostrar carrito al inicio
  mostrarCarrito();
  actualizarContador();
});
