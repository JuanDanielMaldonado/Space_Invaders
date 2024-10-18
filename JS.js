// Ajusta el tamaño del canvas al tamaño de la ventana
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// *****************************************************************JUGADOR***************************************************************//

// Configuración del jugador
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 70,
    height: 70,
    speed: 5,
    image: new Image(), // Imagen del jugador
};

// Establece la ruta de la imagen del personaje
player.image.src = 'jugador.png'; // Asegúrate que la ruta sea correcta

// Dibujar al jugador con su imagen una vez que se carga
player.image.onload = function () {
    gameLoop(); // Inicia el ciclo del juego solo cuando la imagen esté lista
};

// Eventos de teclado para movimiento
window.addEventListener('keydown', (e) => {
    keyState[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keyState[e.key] = false;
});

// Actualizar la posición del jugador
function updatePlayerPosition() {
    if (keyState['ArrowUp'] || keyState['w']) {
        player.y -= player.speed;
    }
    if (keyState['ArrowDown'] || keyState['s']) {
        player.y += player.speed;
    }
    if (keyState['ArrowLeft'] || keyState['a']) {
        player.x -= player.speed;
    }
    if (keyState['ArrowRight'] || keyState['d']) {
        player.x += player.speed;
    }
    // Verifica si el jugador sale del lado izquierdo
    if (player.x + player.width < 0) {
        player.x = canvas.width; // Reaparece en el lado derecho
    }
    
    // Verifica si el jugador sale del lado derecho
    if (player.x > canvas.width) {
        player.x = -player.width; // Reaparece en el lado izquierdo
    }
}

// Dibujar al jugador con su imagen
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// Control de teclas
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true; // Marca la tecla como presionada
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false; // Marca la tecla como no presionada
});

// Ciclo de animación
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    drawPlayer(); // Dibuja al jugador
    updatePlayerPosition(); // Actualiza la posición del jugador
    requestAnimationFrame(gameLoop); // Llama de nuevo a gameLoop
}

// ****************************************************************DISPAROS****************************************************************//

// Array para almacenar las balas
const bullets = [];

class Bullet {
    constructor(x, y) {
        this.x = x; // Posición inicial en X
        this.y = y; // Posición inicial en Y
        this.width = 5; // Ancho de la bala
        this.height = 10; // Alto de la bala
        this.speed = 11; // Velocidad de la bala
    }

    // Método para actualizar la posición de la bala
    update() {
        this.y -= this.speed; // Mueve la bala hacia arriba
    }

    // Método para dibujar la bala
    draw() {
        ctx.fillStyle = 'yellow '; // Color de la bala
        ctx.save(); // Guarda el estado actual del canvas

        // Configurar sombra para el efecto neón
        ctx.shadowBlur = 50; // Intensidad del resplandor
        ctx.shadowColor = 'rgba(255, 255, 0, 0.7)'; // Color del resplandor

        ctx.fillRect(this.x + player.width / 2 - 2.5, this.y, 5, 10); // Dibuja la bala
        ctx.restore(); // Restaura el estado del canvas
    }
}

const keyState ={};

// Escuchar la tecla Espacio para disparar
window.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === ' ' ) {
        if (teclaup === false) {
            // Crea una nueva bala en la posición del jugador
            bullets.push(new Bullet(player.x, player.y));
            teclaup = true;
        }
    }
});

window.addEventListener('keyup', (e) => {
    teclaup = false;
});
puntos = 0;
// Actualizar balas en el ciclo de juego
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update(); // Actualiza la posición de la bala
        if (bullets[i].y < 0) {
            bullets.splice(i, 1); // Elimina la bala si sale del canvas
        } else {
            // Verificar colisiones con los enemigos
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (isColliding(bullets[i], enemies[j])) {
                    bullets.splice(i, 1); // Elimina la bala
                    enemies[j].lives -= 1; // Resta una vida al enemigo
                    // Elimina al enemigo si sus vidas llegan a 0
                    if (enemies[j].lives <= 0) {
                        enemies.splice(j, 1); 
                        puntos += 100;
                    }
                    break; // Salir del bucle de enemigos
                }
            }
        }
    }
}

// Dibujar balas en el ciclo de juego
function drawBullets() {
    for (let bullet of bullets) {
        bullet.draw(); // Dibuja cada bala
    }
}

// *****************************************************************ENEMIGOS***************************************************************//

const enemyImages = [
    'Allien1.png',
    'Allien2.png',
    'Allien3.png',
    "AllienBoss.png"
]

contador = 0;
// Clase de enemigo
class Enemy {
    constructor() {
        this.x = Math.random() * (canvas.width - 50); // Posición aleatoria en X
        this.y = 0; // Comienza desde la parte superior
        this.width = 90; // Ancho del enemigo
        this.height = 90; // Alto del enemigo
        this.speed = 1; // Velocidad del enemigo
        this.image = new Image(); // Imagen del enemigo

        // Selecciona una imagen aleatoria
        const randomIndex = Math.floor(Math.random() * enemyImages.length);
        this.image.src = enemyImages[randomIndex]; // Asigna la imagen aleatoria

        // Asignar vidas según el enemigo seleccionado
        this.lives = randomIndex + 1; // Alien 1: 1 vida, Alien 2: 2 vidas, Alien 3: 3 vidas
    }

    // Método para actualizar la posición del enemigo
    update() {
        this.y += this.speed; // Mueve el enemigo hacia abajo
    }

    // Método para dibujar el enemigo
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Dibuja la imagen del enemigo
        
    }
}

// Array para almacenar enemigos
const enemies = [];

// Función para crear enemigos
function spawnEnemy() {
    enemies.push(new Enemy());
}

// Actualizar enemigos en el ciclo de juego
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update(); // Actualiza la posición del enemigo
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1); // Elimina el enemigo si sale del canvas
            alert("PERDISTE :(")
        }
        // Verificar si colisiona con el jugador
        if (isColliding(enemies[i], player)) {
            alert('¡Colisión detectada!');
            
        }
        
    }
}

// Dibujar enemigos en el ciclo de juego
function drawEnemies() {
    for (let enemy of enemies) {
        enemy.draw(); // Dibuja cada enemigo
    }
}


// Generar enemigos a intervalos regulares
setInterval(spawnEnemy, 2000); // Genera un nuevo enemigo cada segundo

//******************************************************COLISIONES************************************************************//

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
    
}
//******************************************************PUNTUACIÓN Y VIDAS*******************************************************//

function drawTextInTopRight(text) {
    ctx.font = '20px Arial';           // Establece la fuente y tamaño del texto
    ctx.fillStyle = 'white';            // Establece el color del texto
    ctx.textAlign = 'right';            // Alinea el texto a la derecha
    ctx.textBaseline = 'top';           // Alinea verticalmente a la parte superior

    ctx.fillText(text, canvas.width - 50, 50); // Dibuja el texto (10px de margen)
}



//**********************************************************JUEGO LOOPd**********************************************************//
// Modificar el ciclo de juego para incluir balas
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    drawPlayer(); // Dibuja al jugador
    updatePlayerPosition(); // Actualiza la posición del jugador
    updateBullets(); // Actualiza las balas y verifica colisiones
    drawBullets(); // Dibuja las balas
    updateEnemies(); // Actualiza los enemigos
    drawEnemies(); // Dibuja los enemigos
    requestAnimationFrame(gameLoop); // Llama de nuevo a gameLoop
    drawTextInTopRight("Puntuación: " + puntos);
     updatePlayerPosition();
     requestAnimationFrame(gameLoop);
}
       
// Iniciar el juego
gameLoop();
