const Node = require("./Node");

class Paragraph extends Node {
  matching() {
    return this.node.type === "hard_break";
  }

  tag() {
    return "br";
  }

  selfClosing() {
    return true;
  }
}

module.exports = Paragraph;
