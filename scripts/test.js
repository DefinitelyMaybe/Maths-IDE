class TestOne {
  constructor(arg) {
    this.value = "hello world"
    this.arg = arg
  }
  printThings(){
    console.log(this.value);
    console.log(this.arg);
  }
}

module.exports = TestOne;
