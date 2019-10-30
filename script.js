var c = document.getElementById("canvas");

const paperWidth = 4400;

const paperHeight = 1200;

const gridSize = 3;

const scale = 4;

const strokes = localStorage.getItem("poly")
  ? JSON.parse(localStorage.getItem("poly"))
  : [];

c.width = paperWidth / scale;
c.height = paperHeight / scale;
var ctx = c.getContext("2d");
ctx.strokeStyle = "#ddd";
ctx.lineWidth = 1;

for (let x = 0; x < paperWidth / scale; x += gridSize) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, paperHeight / scale);
  ctx.stroke();
}

for (let y = 0; y < paperHeight / scale; y += gridSize) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(paperWidth / scale, y);
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

ctx.beginPath();
ctx.strokeStyle = "#aec";
ctx.lineWidth = 2;
ctx.rect(200 / scale, 200 / scale, 4000 / scale, 1000 / scale);
ctx.stroke();
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();

  const x = Math.round((event.clientX - rect.left) / gridSize) * gridSize;
  const y = Math.round((event.clientY - rect.top) / gridSize) * gridSize;

  return { x, y };
}

document.getElementById("dump").addEventListener("click", event => {
  const result = strokes
    .map((v, i) => {
      if (i % 2 == 0) {
        return (v - 50) * scale;
      } else {
        return (v - 50) * scale;
      }
    })
    .join(", ");

  console.log(result);

  document.getElementById("output").innerHTML = result;
});

document.getElementById("reset").addEventListener("click", event => {
  console.log(`reset`);
  localStorage.removeItem("poly");
});

document.getElementById("save").addEventListener("click", event => {
  console.log(`saved ${strokes.length} points`);
  localStorage.setItem("poly", JSON.stringify(strokes));
});
