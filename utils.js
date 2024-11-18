export function seleccionarPreguntasAleatorias(bancoPreguntas, cantidad) {
    return bancoPreguntas.sort(() => 0.5 - Math.random()).slice(0, cantidad);
}

export function calcularMensajeFinal(puntuacion, nombre, nivel) {
    if (puntuacion >= 3) {
        return `¡Felicidades, ${nombre}! Has completado el nivel ${nivel} con éxito. Recolectaste ${puntuacion} estrellas. ¡Sigue así!`;
    } else {
        return `Lo siento, ${nombre}. Obtuviste ${puntuacion} estrellas en el nivel ${nivel}. ¡Inténtalo de nuevo para mejorar!`;
    }
}
