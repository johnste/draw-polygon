var c = document.getElementById("canvas");

const paperWidth = localStorage.getItem("width")
  ? parseInt(localStorage.getItem("width"))
  : 800;
const paperHeight = localStorage.getItem("height")
  ? parseInt(localStorage.getItem("height"))
  : 400;
const gridSize = localStorage.getItem("grid")
  ? parseInt(localStorage.getItem("grid"))
  : 10;

const strokes = localStorage.getItem("poly")
  ? JSON.parse(localStorage.getItem("poly"))
  : [];

document.getElementById("width").value = paperWidth;
document.getElementById("height").value = paperHeight;
document.getElementById("grid").value = gridSize;

document
  .getElementById("width")
  .addEventListener("change", e =>
    localStorage.setItem("width", e.target.value)
  );
document
  .getElementById("height")
  .addEventListener("change", e =>
    localStorage.setItem("height", e.target.value)
  );
document
  .getElementById("grid")
  .addEventListener("change", e =>
    localStorage.setItem("grid", e.target.value)
  );

c.width = paperWidth;
c.height = paperHeight;
var ctx = c.getContext("2d");
ctx.strokeStyle = "#aaa";
ctx.lineWidth = 1;

for (let x = 0; x < paperWidth; x += gridSize) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, paperHeight);
  ctx.stroke();
}

for (let y = 0; y < paperHeight; y += gridSize) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(paperWidth, y);
  ctx.stroke();
}

if (strokes.length > 1) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  for (let n = 2; n < strokes.length; n += 2) {
    ctx.beginPath();
    ctx.moveTo(strokes[n - 2], strokes[n - 1]);
    ctx.lineTo(strokes[n], strokes[n + 1]);
    ctx.stroke();
  }
}

let current = undefined;
c.addEventListener("click", event => {
  if (current) {
    let thing = getCursorPosition(c, event);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(thing.x, thing.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }

  current = getCursorPosition(c, event);
  strokes.push(current.x, current.y);
});

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();

  const x = Math.round((event.clientX - rect.left) / gridSize) * gridSize;
  const y = Math.round((event.clientY - rect.top) / gridSize) * gridSize;

  return { x, y };
}

document
  .getElementById("dump")
  .addEventListener("click", event => console.log(strokes));

document.getElementById("reset").addEventListener("click", event => {
  console.log(`reset`);
  localStorage.removeItem("poly");
});

document.getElementById("save").addEventListener("click", event => {
  console.log(`saved ${strokes.length} points`);
  localStorage.setItem("poly", JSON.stringify(strokes));
});
