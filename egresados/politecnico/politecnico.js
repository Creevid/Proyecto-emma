function redirigirAPagina() {
    
    window.location.href = "./doskdos23/veintitres.html";
}

window.onload = function() {
    var dropdown = document.querySelector('.menuVertical');
    dropdown.addEventListener('click', function() {
        dropdown.classList.toggle('show');
    });
  }
