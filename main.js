class Crawler {
  constructor(rows = 10, cols = rows) {
    this.$root = document.createElement('div');
    this.rows = rows;
    this.cols = cols;
    this.matrix = this.createMatrix();
    this.$root.addEventListener('click', e => {
      if (e.target.hasOwnProperty('cube')) {
        if (this.currentCube) { this.currentCube.getOff(); }
        this.currentCube = e.target.cube;
        this.currentCube.getOn();
      }
    });
  }

  createMatrix() {
    const matrix = [];
    _.times(this.rows, rowIdx => {
	const row = [];
	const DOMrow = document.createElement('div');
	DOMrow.className = 'row';
	_.times(this.cols, colIdx => {
	    const cube = new Cube();
	    if (rowIdx > 0) { cube.bind(matrix[rowIdx - 1][colIdx]); }
	    if (colIdx > 0) { cube.bind(row[colIdx - 1]); }
	    DOMrow.appendChild(cube.el);
	    row.push(cube);
	});
        this.$root.appendChild(DOMrow);
        matrix.push(row);
    });
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
    this.nexts = new Set();
  }
  
  bind(cube) {
    this.nexts.add(cube);
    cube.nexts.add(this);
  }
  
  next() {
    return _.sample([...this.nexts]);
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

const crawler = new Crawler(4);
crawler.bind(document.querySelector('#app'));
document.querySelector('#starter').addEventListener('click', () => {
  if (!crawler.start()) {
    alert('Please set the initial postion of the ant');
  }
});
document.querySelector('#stopper').addEventListener('click', () => crawler.stop());
document.querySelector('#clear').addEventListener('click', () => crawler.clear());

