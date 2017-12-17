class Crawler {
  constructor(n = 10) {
    this.$root = document.createElement('div');
    this.matrix = this.createMatrix(n);
    this.$root.addEventListener('click', e => {
      if (e.target.hasOwnProperty('cube')) {
        if (this.currentCube) { this.currentCube.getOff(); }
        this.currentCube = e.target.cube;
        this.currentCube.getOn();
      }
    });
  }

  createMatrix(n) {
    const matrix = [];
    for (let rowIdx = 0; rowIdx < n; rowIdx++) {
      const row = [];
      const DOMrow = document.createElement('div');
      DOMrow.className = 'row';
      for (let colIdx = 0; colIdx < n; colIdx++) {
        const cube = new Cube();
        if (rowIdx > 0) { cube.bind(matrix[rowIdx - 1][colIdx]); }
        if (colIdx > 0) { cube.bind(row[colIdx - 1]); }
        row.push(cube);
        DOMrow.appendChild(cube.el);
      }
      matrix.push(row);
      this.$root.appendChild(DOMrow);
    }
    return matrix;
  }

  bind(element) {
    element.appendChild(this.$root);
  }
  
  start() {
    if (!this.currentCube) { 
      return false; 
    }
    this.stop();
    this.interval = setInterval(() => {
      this.currentCube.getOff();
      this.currentCube = this.currentCube.next();
      this.currentCube.getOn();
    }, 20);
    return this.interval;
  }
  
  stop() {
    return this.interval ? clearInterval(this.interval) : false;
  }
  
  clear() {
    this.currentCube = null;
    this.matrix.forEach(item => {
      item.forEach(cube => {
        cube.clear();
      })
    })
  }
}

class Cube {
  constructor() {
    this.el = document.createElement('div');
    this.el.classList.add('cube');
    this.el.cube = this;
    this.nexts = [];
  }
  
  bind(cube) {
    this.nexts.push(cube);
    cube.nexts.push(this);
  }
  
  next() {
    const n = this.nexts.length;
    const idx = Math.floor(Math.random() * n);
    return this.nexts[idx];
  }
  
  getOn() {
    this.el.classList.add('current');
    this.el.classList.toggle('black');
  }
  
  getOff() {
    this.el.classList.remove('current');
  }
  
  clear() {
    this.el.classList.remove('current');
    this.el.classList.remove('black');
  }
}

const crawler = new Crawler(25);
crawler.bind(document.querySelector('#app'));
document.querySelector('#starter').addEventListener('click', () => { 
  if (!crawler.start()) {
    alert('Please set the initial postion of the ant');
  }
});
document.querySelector('#stopper').addEventListener('click', () => crawler.stop());
document.querySelector('#clear').addEventListener('click', () => crawler.clear());

