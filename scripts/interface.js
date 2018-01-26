const graph = require('./graph');

class dataInterface {
  constructor() {
    this.graph = new graph()
  }

  loadGraph(data){
    // assuming the data has already had been through JSON.parse()
    
  }
}

module.exports = dataInterface;
