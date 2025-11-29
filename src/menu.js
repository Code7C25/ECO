function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("menu-hidden");
}
function iniciarTour() {
  introJs().setOptions({
    steps: [
      { intro: "Bienvenido al manual interactivo de ECO" },
      { element: "#boton-menu", intro: "Acá abrís el menú principal" },
      { element: "#boton-volver", intro: "Este es el botón para volver" }
    ]
  }).start();
}