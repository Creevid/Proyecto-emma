// Función para mostrar la alerta y redirigir a otro archivo después de un tiempo
function alertaYRedireccion() {
  // Mostrar la alerta
  alert('Solo usuarios autorizados');

  setTimeout(function() {
    window.location.href = '../login/formulario.html';
  }, 100); 
}

const botonIr = document.getElementById('uploadInfo');

botonIr.addEventListener('click', function() {
  alertaYRedireccion();
});


document.getElementById("enlaceArchivo").addEventListener("click", function() {
  // Cambiar la ubicación a tu archivo deseado (por ejemplo, "otras_carpetas/archivo_deseado.html")
  window.location.href = "egresados/egresados.html";
});


document.getElementById("Inicio").addEventListener("click", function() {
  // Cambiar la ubicación a tu archivo deseado (por ejemplo, "otras_carpetas/archivo_deseado.html")
  window.location.href = "index.html";
        });