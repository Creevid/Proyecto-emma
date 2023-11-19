// Función para mostrar la alerta y redirigir a otro archivo después de un tiempo
function alertaYRedireccion() {
          // Mostrar la alerta
          alert('Solo usuarios autorizados');

          setTimeout(function() {
            window.location.href = '../login/formulario.html';
          }, 100); 
        }
      
        const botonIr = document.getElementById('irAOtroArchivo');
      
        botonIr.addEventListener('click', function() {
          alertaYRedireccion();
        });

        
let hideText_btn = document.getElementById('hideText_btn');

let hideText = document.getElementById('hideText');
        

hideText_btn.addEventListener('click', toggleText);

function toggleText(){
  hideText.classList.toggle('show');

  if(hideText.classList.contains('show')){
    hideText_btn.innerHTML = 'leer menos';
  }

  else{
    hideText_btn.innerHTML = 'leer mas';
  }
}
