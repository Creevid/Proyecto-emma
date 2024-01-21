function redirigirAPagina1() {
    
    window.location.href = "./inicial/inicial.html";
}

function redirigirAPagina() {
    
    window.location.href = "./primaria/primaria.html";
}

window.onload = function() {
    var dropdown = document.querySelector('.menuVertical');
    dropdown.addEventListener('click', function() {
        dropdown.classList.toggle('show');
    });
  }
