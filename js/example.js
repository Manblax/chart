createArc();

function createArc() {
  const el = document.getElementById('canvas');
  const ctx = el.getContext("2d");
  ctx.beginPath();
  ctx.arc(25, 25, 12, 0, getAngle(43));
  ctx.fillStyle = 'transparent';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#294D9C';
  ctx.stroke();
}

function getAngle(percent) {
  return percent * 2 * Math.PI / 100
}

function drawing(ctx) {
  var sin = Math.sin(Math.PI / 6);
  var cos = Math.cos(Math.PI / 6);
  ctx.translate(100, 100);
  var c = 0;
  for (var i = 0; i <= 12; i++) {
    c = Math.floor(255 / 12 * i);
    ctx.fillStyle = 'rgb(' + c + ', ' + c + ', ' + c + ')';
    ctx.fillRect(0, 0, 100, 10);
    ctx.transform(cos, sin, -sin, cos, 0, 0);
  }

  ctx.setTransform(-1, 0, 0, 1, 100, 100);
  ctx.fillStyle = 'rgba(255, 128, 255, 0.5)';
  ctx.fillRect(0, 50, 100, 100);
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  ctx.stroke();
}