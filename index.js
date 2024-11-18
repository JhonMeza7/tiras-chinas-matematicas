import { preguntasFacil } from './preguntasFacil.js';
import { preguntasMedio } from './preguntasMedio.js';
import { preguntasDificil } from './preguntasDificil.js';
import { seleccionarPreguntasAleatorias, calcularMensajeFinal } from './utils.js';

let preguntas = [];
let preguntaActual = 0;
let estrellas = 0; // Contador de estrellas
let strikes = 0; // Contador de strikes
const maxStrikes = 3; // Máximo de strikes permitidos
let preguntasRespondidas = 0; // Contador de preguntas respondidas


const urlParams = new URLSearchParams(window.location.search);
const nivelSeleccionado = urlParams.get('nivel');

if (nivelSeleccionado) {
    cargarBancoPreguntas();
    document.addEventListener('DOMContentLoaded', mostrarPregunta);
}

function cargarBancoPreguntas() {
    console.log("hola",nivelSeleccionado);
    switch (nivelSeleccionado) {
        case 'facil':
            preguntas = seleccionarPreguntasAleatorias(preguntasFacil, 10);
            break;
        case 'medio':
            preguntas = seleccionarPreguntasAleatorias(preguntasMedio, 10);
            break;
        case 'dificil':
            preguntas = seleccionarPreguntasAleatorias(preguntasDificil, 10);
            break;
        default:
            console.error("Nivel no válido");
            return;
    }
}
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function mostrarPregunta() {
    const preguntaContainer = document.getElementById('preguntaContainer');
    const opcionesContainer = document.getElementById('opcionesContainer');
    preguntaContainer.innerHTML = '';
    opcionesContainer.innerHTML = '';

    if (preguntaActual < preguntas.length) {
        const pregunta = preguntas[preguntaActual];
        preguntaContainer.innerHTML = `<h2>${pregunta.texto}</h2>`;

        // Mezcla las opciones de respuesta antes de mostrarlas
        const opcionesMezcladas = mezclarArray([...pregunta.opciones]);

        opcionesMezcladas.forEach((opcion) => {
            const botonOpcion = document.createElement('button');
            botonOpcion.classList.add('opcion');
            botonOpcion.addEventListener('click', () => {
                // Desactiva todas las opciones después de la selección
                document.querySelectorAll('.opcion').forEach(btn => btn.disabled = true);
                
                // Llama a la función validarRespuesta y le pasa el botón seleccionado
                validarRespuesta(opcion.correcta, botonOpcion);
            });

            // Crear el texto con fondo semi-transparente
            const textoOpcion = document.createElement('span');
            textoOpcion.textContent = opcion.texto;
            botonOpcion.appendChild(textoOpcion);

            opcionesContainer.appendChild(botonOpcion);
        });
    } else {
        mostrarMensajeFinal();
    }
}


function validarRespuesta(correcta, botonOpcion) {
    const arcoContainer = document.getElementById('arcoContainer');
    
    // Cambia la imagen del arco al GIF de animación
    arcoContainer.style.backgroundImage = "url('./image/tiro-con-arco-06.gif')";

    // Espera el tiempo del GIF (aproximadamente 2 segundos)
    setTimeout(() => {
        // Restaura la imagen del arco a su estado original
        arcoContainer.style.backgroundImage = "url('./image/arco.png')";

        // Cambia la imagen de fondo de la diana seleccionada
        requestAnimationFrame(() => {
            botonOpcion.classList.add('seleccionado');
        });

        // Incrementa estrellas o strikes según la respuesta
        if (correcta) {
            estrellas++;
        } else {
            strikes++;
            if (strikes >= maxStrikes) {
                mostrarFinDelJuego(); // Termina el juego si se alcanza el máximo de strikes
                return;
            }
        }

        // Incrementa el contador de preguntas respondidas
        preguntasRespondidas++;
        actualizarContadores(); // Actualiza los contadores en pantalla

        // Continua al siguiente paso (aumenta la pregunta)
        preguntaActual++;
        setTimeout(() => mostrarPregunta(), 1500); // Pequeño retraso para mostrar la diana seleccionada
    }, 2000); // Ajusta el tiempo para coincidir con la duración del GIF
}


function mostrarFinDelJuego() {
    const nombre = localStorage.getItem('nombreJugador');
    const finJuegoModal = document.getElementById('finJuegoModal');

    // Actualiza el contenido del modal para mostrar el mensaje de fin del juego
    document.getElementById('tituloModal').textContent = "¡Juego Terminado!";
    document.getElementById('mensajeModal').textContent = `Lo siento, ${nombre}. Practica y vuelve a intentarlo.`;
    document.getElementById('totalEstrellas').textContent = estrellas;

    // Muestra el modal
    finJuegoModal.style.display = 'flex';

    // Oculta el contenedor del arco y de la pregunta
    const arcoContainer = document.getElementById('arcoContainer');
    const preguntaContainer = document.getElementById('preguntaContainer');
    arcoContainer.style.display = 'none';
    preguntaContainer.style.display = 'none';
}


// Evento para reiniciar el juego
document.getElementById('cerrarModal').addEventListener('click', () => {
    const finJuegoModal = document.getElementById('finJuegoModal');
    finJuegoModal.style.display = 'none';
    location.reload(); // Recarga la página para reiniciar el juego
});

// Evento para regresar a la selección de dificultad
document.getElementById('seleccionarDificultad').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirige a la página de selección de dificultad
});




function actualizarContadores() {
    document.getElementById('numeroPreguntas').textContent = `❓ Preguntas: ${preguntasRespondidas}/10`;
    document.getElementById('contadorEstrellas').textContent = `⭐ Estrellas: ${estrellas}`;
    document.getElementById('contadorStrikes').textContent = `❌ Errores: ${strikes}/${maxStrikes}`;
}






function mostrarMensajeFinal() {
    const nombre = localStorage.getItem('nombreJugador');
    const mensaje = calcularMensajeFinal(estrellas, nombre, nivelSeleccionado);
    
    // Actualiza el contenido del modal para mostrar el mensaje final
    document.getElementById('tituloModal').textContent = "¡Felicidades!";
    document.getElementById('mensajeModal').textContent = mensaje;
    document.getElementById('totalEstrellas').textContent = estrellas;

    // Muestra el modal
    const finJuegoModal = document.getElementById('finJuegoModal');
    finJuegoModal.style.display = 'flex';

    // Oculta el contenedor del arco y de la pregunta
    const arcoContainer = document.getElementById('arcoContainer');
    const preguntaContainer = document.getElementById('preguntaContainer');
    arcoContainer.style.display = 'none';
    preguntaContainer.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const nivelSeleccionado = urlParams.get('nivel');
    const headerDificultad = document.getElementById('headerDificultad');
    
    if (nivelSeleccionado) {
        headerDificultad.textContent = `Dificultad: ${nivelSeleccionado.charAt(0).toUpperCase() + nivelSeleccionado.slice(1)}`;
    }
});



