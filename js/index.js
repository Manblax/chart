document.addEventListener('DOMContentLoaded', () => {
  const chartData = [
    {val: 31, color: '#F3722C'}, {val: 80, color: '#219EBC'}, {val: 31, color: '#902cf3'}, {val: 80, color: '#36bc21'},
    {val: 23, color: '#F3722C'}, {val: 54, color: '#83bc21'}, {val: 11, color: '#2cf3dc'}, {val: 44, color: '#2c3483'},
    {val: 78, color: '#33481d'}, {val: 42, color: '#061f25'}, {val: 62, color: '#902cf3'}, {val: 47, color: '#26701a'},
    {val: 78, color: '#481f09'}, {val: 42, color: '#10053f'}, {val: 62, color: '#340c2c'}, {val: 47, color: '#36bc21'},
    {val: 40, color: '#F8961E'}, {val: 20, color: '#90BE6D'}, {val: 42, color: '#277DA1'}
  ];

  new DonutChart(document.getElementById('canvas'), chartData);
});

class DonutChart {
  x = 300;
  y = 300;
  radius = 180;
  arcWidth = 54;
  textMaxWidth = 120;
  text = 'Chart';
  textFont = '44px serif';
  lineWidth = 1;
  lineColor = 'black';
  fontLineVal = 'bold 16px/1.2 serif';

  /**
   * @param {HTMLCanvasElement} canvas - элемент canvas
   * @param {Array<Object>} chartData - список значений графика
   * @description - рисует график ввиде пончика
   */
  constructor(canvas, chartData) {
    this.canvas = canvas;
    this.chartData = TransformChartData.addAngles(TransformChartData.addCoefficient(chartData));
    this.draw();
  }

  /**
   * @description - рисует все элементы графика
   */
  draw() {
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');

      this.drawArcsAndLines(this.ctx, this.x, this.y, this.radius);
      this.drawText(this.ctx, this.x, this.y);
    }
  }

  /**
   * @description - рисует все дуги и линии со значениями
   */
  drawArcsAndLines(ctx, x, y, radius) {
    for (const arc of this.chartData) {
      this.drawArc(ctx, x, y, radius, arc.startAngle, arc.endAngle, arc.color);
      this.drawLineWithVal(ctx, x, y, radius, arc);
    }
  }

  /**
   * @description - рисует дугу и линию со значениям
   */
  drawLineWithVal(ctx, x, y, radius, arc) {
    const [lineX, lineY, lineX2, lineY2, angle] = this.getLineData(arc);

    this.drawLine(ctx, lineX, lineY, lineX2, lineY2);
    this.drawLineVal(ctx, lineX2, lineY2, angle);
  }

  /**
   * @description - рисует линию
   */
  drawLine(ctx, lineX, lineY, lineX2, lineY2) {
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX2, lineY2);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.lineColor;
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * @description - рисует значение рядом с линией
   */
  drawLineVal(ctx, lineX2, lineY2, angle) {
    ctx.font = this.fontLineVal;
    const text = Math.round(angle);
    const [textX, textY] = this.getTextCoords(ctx, lineX2, lineY2, angle, text);
    ctx.fillText(text, textX, textY);
  }

  /**
   * @param {Object} arc - угол дуги от положительной оси X до линии
   * @return {Array<number>} - список координат начала и конца линии, угол
   */
  getLineData(arc) {
    const angle = (arc.endAngle - arc.startAngle) / 2 + arc.startAngle;
    const halfArcWidth = this.arcWidth / 2;

    const lineX = this.x + ((this.radius + halfArcWidth) * Math.cos(this.getRadians(angle)));
    const lineY = this.y + ((this.radius + halfArcWidth) * Math.sin(this.getRadians(angle)));

    const lineX2 = this.x + ((this.radius + this.arcWidth) * Math.cos(this.getRadians(angle)));
    const lineY2 = this.y + ((this.radius + this.arcWidth) * Math.sin(this.getRadians(angle)));
    return [lineX, lineY, lineX2, lineY2, angle];
  }

  /**
   * @description - рисует текст в центре графика
   */
  drawText(ctx, x, y) {
    ctx.font = this.textFont;
    const textMetrics = ctx.measureText(this.text);
    const textWidth = Math.min(textMetrics.width, this.textMaxWidth);
    const textX = x - (textWidth / 2);
    const textY = y + 10; // Сделать автоматический подсчет высоты текста и обрезку текста

    ctx.fillText(this.text, textX, textY, this.textMaxWidth);
  }

  /**
   * @return {Array<number>} - коодинаты текста
   */
  getTextCoords(ctx, x, y, angle, text) {
    const textMetrics = ctx.measureText(text);

    if (angle <= 70) {
      x += 5; // Сделать автоматический подсчет отступов или вынести их в свойства класса
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
      y += 0;
    }

    return [x, y];
  }

  /**
   * @description - рисует дугу
   */
  drawArc(ctx, x, y, radius, startAngle, endAngle, color) {
    ctx.beginPath();
    const startAngleRad = this.getRadians(startAngle);
    const endAngleRad = this.getRadians(endAngle);

    ctx.arc(x, y, radius, startAngleRad, endAngleRad);
    ctx.lineWidth = this.arcWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * @param {number} degrees - угол в градусах
   * @return {number} - угол в радианах
   */
  getRadians(degrees) {
    return Math.PI / 180 * degrees;
  }
}


/**
 * @description - Вспомогательный класс для преобразования данных графика
 */
class TransformChartData {
  static fullCircleDegree = 360;
  /**
   * @param {Array<Object>} chartData - список значений графика
   * @param {number} index - элемент начиная с которого объединять
   * @return {Array<Object>} - измененный список значений графика
   * @description - все элементы после определенного индекса объединяет в один суммируя значения
   */
  static squash(chartData, index = 11) {
    let truncatedData = [...chartData];
    if (chartData.length >= index) {
      truncatedData = chartData.slice(0, index);

      const otherData = chartData.slice(index);
      const totalOtherVal = otherData.reduce((total, current) => total + current.val, 0);

      truncatedData.push({
        val: totalOtherVal,
        color: 'grey',
      });
    }

    return truncatedData;
  }

  /**
   * @param {Array<Object>} chartData - список значений графика
   * @return {Array<Object>} - измененный список значений графика
   * @description - добавляет поле коэффициент во все элементы массива.
   * Коэффициент отношение текущего значения элемента массива к суммарному
   */
  static addCoefficient(chartData) {
    const total = chartData.reduce((total, current) => total + current.val, 0);
    return chartData.map(item => {
      return {
        value: item.val,
        coefficient: item.val / total,
        color: item.color,
      }
    });
  }

  /**
   * @param {Array<Object>} chartData - список значений графика
   * @return {Array<Object>} - измененный список значений графика
   * @description - добавляет поля startAngle и endAngle во все элементы массива
   *                startAngle - угол начала дуги относительно оси X.
   *                endAngle - угол конца дуги относительно оси X.
   */
  static addAngles(chartData) {
    let totalAngle = 0;

    return chartData.map(item => {
      const currentAngle = item.coefficient * TransformChartData.fullCircleDegree;
      const startAngle = totalAngle;

      totalAngle += currentAngle;
      const endAngle = totalAngle;

      item.startAngle = startAngle;
      item.endAngle = endAngle;
      return item;
    });
  }
}
