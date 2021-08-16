document.addEventListener('DOMContentLoaded', draw);

function truncateData(dataList) {
  let truncatedData = [...dataList];
  if (dataList.length > 10) {
    truncatedData = dataList.slice(0, 11);
    console.log('truncatedData', truncatedData)
    const otherData = dataList.slice(11);
    console.log('otherData', otherData)
    const totalOtherVal = otherData.reduce((total, current) => total + current.val, 0);
    truncatedData.push({
      val: totalOtherVal,
      color: 'grey',
    });
  }

  return truncatedData;
}

function transformData(dataList) {
  const total = dataList.reduce((total, current) => total + current.val, 0);
  return dataList.map(item => {
    return {
      value: item.val,
      coefficient: item.val / total,
      color: item.color,
    }
  });
}

function transformAngleData(dataList) {
  let totalAngle = 0;

  return dataList.map(item => {
    const currentAngle = item.coefficient * 360;
    const startAngle = totalAngle;
    totalAngle += currentAngle;
    const endAngle = totalAngle;

    item.startAngle = startAngle;
    item.endAngle = endAngle;
    return item;
  });
}


function draw() {
  const canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    const x = 300;
    const y = 300;
    const radius = 180;

    drawArcs(ctx, x, y, radius);

    ctx.font = "44px serif";
    const text = 'Hello world';
    const textMetrics = ctx.measureText(text);
    const textMaxWidth = 120;
    const textWidth = Math.min(textMetrics.width, textMaxWidth);
    const textX = x - (textWidth / 2);
    const textY = y + 10;

    // console.log(textMetrics.width);
    ctx.fillText(text, textX, textY, textMaxWidth);
  }
}

function drawArcs(ctx, x, y, radius) {
  const Arcs = [{val: 40, color: '#F8961E'}, {val: 20, color: '#90BE6D'}, {val: 42, color: '#277DA1'},
    {val: 31, color: '#F3722C'}, {val: 80, color: '#219EBC'}, {val: 31, color: '#902cf3'}, {val: 80, color: '#36bc21'},
    {val: 23, color: '#F3722C'}, {val: 54, color: '#83bc21'}, {val: 11, color: '#2cf3dc'}, {val: 44, color: '#2c3483'},
    {val: 78, color: '#33481d'}, {val: 42, color: '#061f25'}, {val: 62, color: '#902cf3'}, {val: 47, color: '#26701a'},
    {val: 78, color: '#481f09'}, {val: 42, color: '#10053f'}, {val: 62, color: '#340c2c'}, {val: 47, color: '#36bc21'}];

  const ArcsList = transformAngleData(transformData(Arcs));
  console.log('ArcsList', ArcsList)

  for (const arc of ArcsList) {
    drawArc(ctx, x, y, radius, arc.startAngle, arc.endAngle, arc.color);
    drawLine(ctx, x, y, radius, arc);
  }
}

function drawText(ctx, x, y) {
  ctx.font = "48px serif";
  ctx.fillText("Hello world", x, 50);
}

function drawLine(ctx, x, y, radius, arc) {
  const angle = (arc.endAngle - arc.startAngle) / 2 + arc.startAngle;

  const lineX = x + ((radius + 27) * Math.cos(getRadians(angle)));
  const lineY = y + ((radius + 27) * Math.sin(getRadians(angle)));

  const lineX2 = x + ((radius + 54) * Math.cos(getRadians(angle)));
  const lineY2 = y + ((radius + 54) * Math.sin(getRadians(angle)));
  console.log('angle', lineX, lineY, angle)

  ctx.beginPath();
  ctx.moveTo(lineX, lineY);
  ctx.lineTo(lineX2, lineY2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath();

  ctx.font = 'bold 16px/1.2 serif';
  const text = Math.round(angle);
  const [textX, textY] = getTextCoords(ctx, lineX2, lineY2, angle, text);
  ctx.fillText(text, textX, textY);
}

function getTextCoords(ctx, x, y, angle, text) {
  const textMetrics = ctx.measureText(text);

  if (angle <= 70) {
    x += 5;
    y += 5;
  } else if ((angle > 70) && (angle <= 110)) {
    x -= textMetrics.width / 2;
    y += 10 + 5;
  } else if ((angle > 110) && (angle <= 190)) {
    x -= textMetrics.width + 5;
    y += 10;
  } else if ((angle > 190) && (angle <= 250)) {
    x -= textMetrics.width + 5;
  } else if ((angle > 250) && (angle <= 290)) {
    x -= textMetrics.width / 2;
    y -= 10 - 5;
  } else {
    x += 5;
    y += 2;
  }

  return [x, y];
}

function drawArc(ctx, x, y, radius, startAngle, endAngle, color) {
  ctx.beginPath();
  const startAngleRad = getRadians(startAngle);
  const endAngleRad = getRadians(endAngle);

  ctx.arc(x, y, radius, startAngleRad, endAngleRad);
  ctx.lineWidth = 54;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

function getRadians(degrees) {
  return Math.PI / 180 * degrees;
}
