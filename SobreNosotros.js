const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const cerrarBtn = document.querySelector('.cerrar');

const textos = {
  historia: `
    <h2>Nuestra Historia</h2>
    <p>
      Nixarion nació de un sueño: transformar la moda en un lienzo donde cada persona pueda escribir su propia historia.
      Desde nuestros primeros bocetos entendimos que no queríamos ser solo una marca de ropa, sino un movimiento que conecta autenticidad, estilo y valentía.
      Cada prenda es el reflejo de esa visión: piezas creadas para quienes se atreven a marcar la diferencia.
    </p>
  `,
  mision: `
    <h2>Nuestra Misión</h2>
    <p>
      Nuestra misión es ofrecer prendas únicas que transmitan seguridad, carácter y autenticidad.
      Queremos inspirar a cada persona a conquistar sus propios retos, llevando ropa que no solo se viste, sino que impulsa y motiva.
    </p>
  `,
  valores: `
    <h2>Nuestros Valores</h2>
    <ul>
      <li><strong>Creatividad:</strong> dar vida a diseños únicos.</li>
      <li><strong>Calidad:</strong> materiales premium en cada prenda.</li>
      <li><strong>Pasión:</strong> ponemos el alma en lo que hacemos.</li>
      <li><strong>Compromiso:</strong> nuestra prioridad son nuestros clientes.</li>
    </ul>
  `,
  filosofia: `
    <h2>Nuestra Filosofía</h2>
    <p>
      Creemos que la moda no se trata de seguir tendencias, sino de crearlas.
      Autenticidad sobre perfección, valentía sobre conformismo: esa es la esencia de Nixarion.
    </p>
  `
};

cards.forEach(card => {
  card.addEventListener('click', () => {
    const tipo = card.getAttribute('data-card');
    modalText.innerHTML = textos[tipo];
    modal.style.display = 'flex';
  });
});

cerrarBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
