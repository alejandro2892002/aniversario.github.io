function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");
}

// 🎵 Reproductor
function reproducirCancion(nombreArchivo) {
  const reproductor = document.getElementById("player");
  reproductor.src = `${nombreArchivo}`;
  reproductor.play();
}

// 🎮 Match-3 Game
const canvas = document.getElementById("juegoCanvas");
const ctx = canvas.getContext("2d");
const size = 6;
const tileSize = 50;
let grid = [];
let colores = ["#f06292", "#ba68c8", "#4dd0e1", "#ffd54f"];
let seleccion = null;
let combinaciones = 0;
let jugando = false;
const objetivo = 10;

function initGrid() {
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      grid[i][j] = Math.floor(Math.random() * colores.length);
    }
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      ctx.fillStyle = colores[grid[i][j]];
      ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#fff";
      ctx.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize);
    }
  }

  document.getElementById("progresoJuego").innerText = `Combinaciones: ${combinaciones} / ${objetivo}`;
}

function intercambiar(x1, y1, x2, y2) {
  [grid[y1][x1], grid[y2][x2]] = [grid[y2][x2], grid[y1][x1]];
}

function hayMatch() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - 2; j++) {
      if (grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) return true;
    }
  }
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size - 2; i++) {
      if (grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) return true;
    }
  }
  return false;
}

function eliminarMatches() {
  let eliminados = 0;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - 2; j++) {
      if (grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
        grid[i][j] = grid[i][j + 1] = grid[i][j + 2] = -1;
        eliminados++;
      }
    }
  }

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size - 2; i++) {
      if (grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) {
        grid[i][j] = grid[i + 1][j] = grid[i + 2][j] = -1;
        eliminados++;
      }
    }
  }

  for (let j = 0; j < size; j++) {
    let columna = [];
    for (let i = size - 1; i >= 0; i--) {
      if (grid[i][j] !== -1) columna.push(grid[i][j]);
    }
    while (columna.length < size) {
      columna.push(Math.floor(Math.random() * colores.length));
    }
    for (let i = size - 1; i >= 0; i--) {
      grid[i][j] = columna[size - 1 - i];
    }
  }

  if (eliminados > 0) {
    combinaciones++;
    if (combinaciones >= objetivo) {
      mostrarModal();
    }
  }

  return eliminados > 0;
}

canvas.addEventListener("click", (e) => {
  if (!jugando) jugando = true;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / tileSize);
  const y = Math.floor((e.clientY - rect.top) / tileSize);

  if (!seleccion) {
    seleccion = { x, y };
  } else {
    let dx = Math.abs(seleccion.x - x);
    let dy = Math.abs(seleccion.y - y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      intercambiar(seleccion.x, seleccion.y, x, y);
      if (!hayMatch()) {
        intercambiar(seleccion.x, seleccion.y, x, y);
      } else {
        eliminarMatches();
      }
    }
    seleccion = null;
    drawGrid();
  }
});

function bucleJuego() {
  if (jugando && eliminarMatches()) {
    drawGrid();
  }
}

setInterval(bucleJuego, 800);
initGrid();
drawGrid();

function mostrarModal() {
  document.getElementById("modalRegalo").style.display = "flex";
  document.getElementById("disneySound").play();
  lanzarCorazones();
}

function cerrarModal() {
  document.getElementById("modalRegalo").style.display = "none";
  combinaciones = 0;
  drawGrid();
  
  document.getElementById("videoRegalo").pause();
  document.getElementById("videoRegalo").currentTime = 0;

}

function lanzarCorazones() {
  for (let i = 0; i < 30; i++) {
    const corazon = document.createElement("div");
    corazon.classList.add("corazon");
    corazon.style.left = `${Math.random() * 100}%`;
    corazon.style.top = `${Math.random() * 100}%`;
    document.getElementById("corazones").appendChild(corazon);
    setTimeout(() => corazon.remove(), 2000);
  }
}
