document.querySelector('.btn').addEventListener('click', () => {
  hue = Math.floor(Math.random() * 360); // change hue by 40 degrees each click
  document.body.style.backgroundColor = `hsl(${hue}, 100%, 90%)`;
});

let clickCount = 2;
const button = document.querySelector(".btn");
const canvas = document.getElementById("shapeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawPolygon(x, y, sides, size, color) {
    if (sides < 1) return;
    const angle = (Math.PI * 2) / sides;
    ctx.beginPath();
    ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
    for (let i = 1; i <= sides; i++) {
      ctx.lineTo(x + size * Math.cos(angle * i), y + size * Math.sin(angle * i));
    }
    ctx.closePath();
    
    ctx.fillStyle = color;  // Fill color
    ctx.fill();             // Fill shape
    
    ctx.strokeStyle = "#fff"; // Outline color
    ctx.lineWidth = 5;
    ctx.stroke();
  }

function spawnShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clickCount++;
    const btnRect = button.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2 + window.scrollX;
    const centerY = btnRect.top + btnRect.height / 2 + window.scrollY;

    let sides = clickCount;
    const color = `hsl(${clickCount * 20 % 360}, 30%, 60%)`;

    let size = 10;
    let alpha = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = alpha;
        drawPolygon(centerX, centerY, sides, size, color);
        ctx.globalAlpha = 1;

        size += 10;
        alpha += 0.08;

        if (alpha <= 1) {
            requestAnimationFrame(animate);
        }
    }
    animate();
    drawPolygon(centerX, centerY - 3, sides, 100, color)
}

const shareCard = document.getElementById("shareCard");
const shareImage = document.getElementById("shareImage");
const downloadButton = document.getElementById("downloadButton");
const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");

function polygonName(sides) {
  const names = {
    1: "Monogon", 2: "Digon", 3: "Triangle", 4: "Quadrilateral",
    5: "Pentagon", 6: "Hexagon", 7: "Heptagon", 8: "Octagon",
    9: "Nonagon", 10: "Decagon", 11: "Hendecagon", 12: "Dodecagon"
  };
  return names[sides] || `${sides}-gon`;
}

function drawShareImage(number, sides, color) {
  const shape = polygonName(sides);

  // Clear
  imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  // Background
  hue = Math.floor(Math.random() * 360); // change hue by 40 degrees each click
  let c = `hsl(${number * 20 % 360}, 100%, 90%)`;
  document.getElementById("shareCard").style.backgroundColor = c
  imageCtx.fillStyle = c;
  imageCtx.fillRect(0, 0, imageCanvas.width, imageCanvas.height);

  // Draw Shape
  const centerX = imageCanvas.width / 2;
  const centerY = imageCanvas.height / 2 - 30;
  const size = 100;
  const angle = (Math.PI * 2) / sides;

  imageCtx.beginPath();
  imageCtx.moveTo(centerX + size * Math.cos(0), centerY + size * Math.sin(0));
  for (let i = 1; i <= sides; i++) {
    imageCtx.lineTo(centerX + size * Math.cos(angle * i), centerY + size * Math.sin(angle * i));
  }
  imageCtx.closePath();

  imageCtx.fillStyle = color;
  imageCtx.fill();
  imageCtx.strokeStyle = "#000";
  imageCtx.lineWidth = 4;
  imageCtx.stroke();

  // Add Text
  imageCtx.fillStyle = "#000";
  imageCtx.font = "bold 28px Arial";
  imageCtx.textAlign = "center";
  imageCtx.fillText(`Click #${number}`, centerX, imageCanvas.height - 90);
  imageCtx.font = "20px Arial";
  imageCtx.fillText(`Your shape: ${shape}`, centerX, imageCanvas.height - 60);

  // Export to image
  const dataURL = imageCanvas.toDataURL("image/png");
  shareImage.src = dataURL;
  downloadButton.href = dataURL;
}

function showShareCard(number, sides) {
  const color = `hsl(${number * 20 % 360}, 100%, 60%)`;

  drawShareImage(number, sides, color);

  shareCard.classList.remove("hidden");
  requestAnimationFrame(() => shareCard.classList.add("show"));
}











const scriptUrl = "https://script.google.com/macros/s/AKfycbxofjIFIYO1J8sNcSrBqOe5o41zwCrSYxagLR4h-DSUBO0ndgq1fOaJx0wjjanPyxehAw/exec";

if (localStorage.getItem("hasClicked")) {
  button.disabled = true;
}

button.addEventListener("click", async () => {
  if (localStorage.getItem("hasClicked")) return;

  const res = await fetch(scriptUrl, { method: "POST" });
  const data = await res.json();

  localStorage.setItem("hasClicked", "true");
  button.disabled = true;
  
  spawnShape()
  showShareCard(clickCount, clickCount);
});