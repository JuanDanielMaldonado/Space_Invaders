// Ajusta el tamaño del canvas al tamaño de la ventana
const canvas = document.getElementById('inicio_canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function título(text) {
    ctx.font = '50px Arial';           // Establece la fuente y tamaño del texto
    ctx.fillStyle = 'white';            // Establece el color del texto
    ctx.textAlign = 'right';            // Alinea el texto a la derecha
    ctx.textBaseline = 'top';           // Alinea verticalmente a la parte superior

    ctx.fillText(text, canvas.width - center, 200); // Dibuja el texto (10px de margen)
}

// Definir el botón
const button = {
    x: canvas.width - 150, // Posición en X
    y: 20,                 // Posición en Y
    width: 120,            // Ancho del botón
    height: 40,            // Alto del botón
    text: 'Iniciar Juego', // Texto del botón
};

// Dibujar el botón en el canvas
function drawButton() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
}

// Detectar clic sobre el botón
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Verificar si el clic fue dentro del botón
    if (
        clickX >= button.x &&
        clickX <= button.x + button.width &&
        clickY >= button.y &&
        clickY <= button.y + button.height
    ) {
        console.log('¡Juego Iniciado!');
        // Aquí puedes iniciar el juego o realizar otra acción
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
    título("Space Invaders");
    drawButton(); // Dibujar el botón en cada frame
    gameLoop();
}

gameLoop();