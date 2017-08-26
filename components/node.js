class Node extends HTMLElement {
  constructor(nid, contents) {
    super();
    this.name = "node";
    this.nid = nid;
    this.contents = contents;

    this.addEventListener("click", e => {
      console.log("" + this.name + " #" + this.nid + " was clicked");
    })
  }

  print(){
    output = "";
    output = output + this.name + " #" + this.nid + "\n";
    if (this.contents != undefined) {
      output = output + this.contents.print() + "\n";
    }
    return output;
  }
}

window.customElements.define("node", Node);
