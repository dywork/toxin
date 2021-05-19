import Chart from 'chart.js';

const ctx = document.querySelector('.js-doughnut-chart').getContext('2d');

const yellowGradient = ctx.createLinearGradient(0, 0, 0, 120);
yellowGradient.addColorStop(0, '#FFE39C');
yellowGradient.addColorStop(1, '#FFBA9C');

const purpleGradient = ctx.createLinearGradient(0, 0, 0, 60);
purpleGradient.addColorStop(0, '#BC9CFF');
purpleGradient.addColorStop(1, '#8BA4F9');

const greenGradient = ctx.createLinearGradient(0, 60, 0, 120);
greenGradient.addColorStop(0, '#6FCF97');
greenGradient.addColorStop(1, '#66D2EA');

class PieChart {
  static init() {
    const elements = this._getElements();
    elements.forEach(canvas => this._createPie(canvas, this._getPieData()));
  }

  static _createPie(item, pieData) {
    new Chart(item, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: pieData,
            borderWidth: 3,
            hoverBorderWidth: 0,
            backgroundColor: [purpleGradient, greenGradient, yellowGradient],
          },
        ],
      },
      options: {
        animation: {
          animateScale: false,
          animateRotate: false,
        },
        cutoutPercentage: 85,
        legend: false,
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  static _getPieData() {
    const pieDiagram = document.querySelector('.js-pie-diagram');
    const dataPie = pieDiagram.getAttribute('data-pie');
    return dataPie.split(',').map(item => parseInt(item));
  }

  static _getElements() {
    return document.querySelectorAll('.js-doughnut-chart');
  }
}

export default PieChart;
