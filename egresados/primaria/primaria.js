function redirigirAPagina1() {

    window.location.href = "./inicial/inicial.html";
}

function redirigirAPagina() {

    window.location.href = "./primaria/primaria.html";
}

window.onload = function () {
    var dropdown = document.querySelector('.menuVertical');
    dropdown.addEventListener('click', function () {
        dropdown.classList.toggle('show');
    });
}


// Función para mostrar la alerta y redirigir a otro archivo después de un tiempo
function alertaYRedireccion() {
    // Mostrar la alerta
    alert('Solo usuarios autorizados');

    setTimeout(function () {
        window.location.href = "/login/formulario.html";
    }, 100);
}

const botonIr = document.getElementById('uploadInfo');

botonIr.addEventListener('click', function () {
    alertaYRedireccion();
});