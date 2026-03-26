const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// REDE
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: canvas.height,
    color: "white"
};

// JOGADOR
const user = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "red",
    score: 0
};

// COMPUTADOR
const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "green",
    score: 0
};

// BOLA
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "blue"
};

// DESENHO
const drawRect = (x, y, w, h, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
};

const drawArc = (x, y, r, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
};

const drawText = (text, x, y, color) => {
    context.fillStyle = color;
    context.font = "45px Arial";
    context.fillText(text, x, y);
};

const drawNet = () => {
    drawRect(net.x, net.y, net.width, net.height, net.color);
};

// RENDER
const render = () => {
    drawRect(0, 0, canvas.width, canvas.height, "black");

    drawNet();

    drawText(user.score, canvas.width / 4, canvas.height / 5, "#FFF");
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, "#FFF");

    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);
};

// RESET
const resetBall = () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 5;
};

// COLISÃO
const collision = (b, p) => {
    return b.x - b.radius < p.x + p.width &&
           b.x + b.radius > p.x &&
           b.y - b.radius < p.y + p.height &&
           b.y + b.radius > p.y;
};

// UPDATE
const update = () => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // IA
    computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

    // parede
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? user : computer;

    if (collision(ball, player)) {
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint /= (player.height / 2);

        let angle = collidePoint * Math.PI / 4;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        ball.speed += 0.5;
    }

    // ponto
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
};

// LOOP
const game = () => {
    update();
    render();
};

setInterval(game, 1000 / 60);

// MOUSE
canvas.addEventListener("mousemove", evt => {
    const rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
});