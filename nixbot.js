// ==========================
// NIXBOT INTERACTIVO 🧥
// ==========================

const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

let etapa = 0;
let datosUsuario = {};

// Mostrar / Ocultar chat
chatToggle.addEventListener("click", () => {
  chatBox.style.display = chatBox.style.display === "none" ? "block" : "none";
});

sendBtn.addEventListener("click", manejarEntrada);
userInput.addEventListener("keypress", (e) => e.key === "Enter" && manejarEntrada());

function manejarEntrada() {
  const mensaje = userInput.value.trim();
  if (!mensaje) return;
  agregarMensaje(mensaje, "user");
  userInput.value = "";

  mostrarEscribiendo();
  setTimeout(() => {
    eliminarEscribiendo();

    switch (etapa) {
      case 0:
        agregarMensaje("¡Hola! 👋 Soy <b>NixBot</b>, tu asistente de moda futurista. ¿Cuál es tu edad?", "bot");
        etapa++;
        break;
      case 1:
        datosUsuario.edad = mensaje;
        agregarMensaje("Perfecto. ¿Eres hombre o mujer?", "bot");
        etapa++;
        break;
      case 2:
        datosUsuario.genero = mensaje.toLowerCase();
        agregarMensaje("Genial 😎 ¿Cómo describirías tu estilo? (casual, elegante, deportivo...)", "bot");
        etapa++;
        break;
      case 3:
        datosUsuario.estilo = mensaje.toLowerCase();
        agregarMensaje("Estoy analizando tu mejor estilo... 🧠✨", "bot");
        setTimeout(() => recomendarPrenda(), 1200);
        etapa++;
        break;
      default:
        if (mensaje.toLowerCase() === "reiniciar") {
          etapa = 0;
          datosUsuario = {};
          agregarMensaje("Reiniciemos 👗 ¿Cuál es tu edad?", "bot");
        } else {
          agregarMensaje("Escribe <b>reiniciar</b> si quieres una nueva recomendación.", "bot");
        }
    }
  }, 1000);
}

// --- Animación "escribiendo" ---
function mostrarEscribiendo() {
  const typing = document.createElement("div");
  typing.classList.add("typing");
  typing.textContent = "NixBot está escribiendo...";
  typing.id = "typing-msg";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function eliminarEscribiendo() {
  const t = document.getElementById("typing-msg");
  if (t) t.remove();
}

// --- Mostrar mensaje ---
function agregarMensaje(texto, tipo) {
  const msg = document.createElement("p");
  msg.classList.add(tipo === "bot" ? "mensaje-bot" : "mensaje-user");
  msg.innerHTML = texto;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Recomendar producto ---
function recomendarPrenda() {
  const { genero, estilo } = datosUsuario;
  const productos = [
    { nombre: "Camiseta Futurista", genero: "hombre", estilo: "casual", precio: 80000, imagen: "camiseta1.png" },
    { nombre: "Camiseta Premium", genero: "hombre", estilo: "deportivo", precio: 100000, imagen: "camiseta2.png" },
    { nombre: "Camiseta Edición Polo", genero: "hombre", estilo: "elegante", precio: 150000, imagen: "camisa_nix.png" },
    { nombre: "Camiseta Futurista Mujer", genero: "mujer", estilo: "casual", precio: 90000, imagen: "camiseta5.png" },
    { nombre: "Camiseta Premium Mujer", genero: "mujer", estilo: "deportivo", precio: 110000, imagen: "camiseta6.png" },
    { nombre: "Camiseta Polo Mujer", genero: "mujer", estilo: "elegante", precio: 160000, imagen: "camiseta8.png" },
  ];

  const prenda = productos.find(p => p.genero === genero && estilo.includes(p.estilo)) || productos[Math.floor(Math.random() * productos.length)];

  const card = document.createElement("div");
  card.classList.add("nixbot-card");
  card.innerHTML = `
    <p><strong>✨ Según tu estilo, te recomiendo:</strong></p>
    <img src="${prenda.imagen}" alt="${prenda.nombre}" class="nixbot-img">
    <p><b>${prenda.nombre}</b><br>💲${prenda.precio.toLocaleString()} COP</p>
    <button class="add-btn">🛒 Añadir al carrito</button>
  `;
  chatMessages.appendChild(card);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const addBtn = card.querySelector(".add-btn");
  addBtn.addEventListener("click", () => {
    agregarAlCarrito(prenda.nombre, prenda.precio, prenda.imagen);
    agregarMensaje(`✅ <b>${prenda.nombre}</b> fue añadido a tu carrito.<br><button class="ver-carrito-btn">🛍 Ver mi carrito</button>`, "bot");

    const verBtn = chatMessages.querySelector(".ver-carrito-btn");
    verBtn.addEventListener("click", () => window.location.href = "TuCarrito.html");
  });
}
