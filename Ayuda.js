document.querySelectorAll(".faq-question").forEach(question => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;

    // Alternar clase activa en la pregunta
    question.classList.toggle("active");

    // Mostrar u ocultar la respuesta con transición
    answer.classList.toggle("show");
  });
});
