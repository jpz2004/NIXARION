const select = document.getElementById("cryptoSelect");
const resultado = document.getElementById("resultado");

async function cargarLista() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50"
    );

    const data = await res.json();

    data.forEach(coin => {
      const option = document.createElement("option");
      option.value = coin.id;
      option.textContent = coin.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando lista");
  }
}

async function mostrarCrypto(id) {
  if (!id) return;

  resultado.innerHTML = "Cargando...";

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );

    const data = await res.json();

    const precio = data.market_data.current_price.usd;
    const cambio = data.market_data.price_change_percentage_24h;
    const color = cambio >= 0 ? "green" : "red";

    resultado.innerHTML = `
      <div class="crypto-card">

        <div class="crypto-header">
          <img src="${data.image.small}">
          <h2>${data.name}</h2>
        </div>

        <div class="price">$${precio.toLocaleString()}</div>

        <div class="change-box ${color}">
          ${cambio.toFixed(2)}% (24h)
        </div>

        <div class="crypto-extra">
          <p>Ranking: #${data.market_cap_rank}</p>
          <p>Actualizado en tiempo real</p>
        </div>

      </div>
    `;

  } catch (error) {
    resultado.innerHTML = "Error al cargar";
  }
}

select.addEventListener("change", (e) => {
  mostrarCrypto(e.target.value);
});

cargarLista();