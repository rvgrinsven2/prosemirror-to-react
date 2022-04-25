const Mark = require("./Mark");

class Underline extends Mark {
  matching() {
    return this.mark.type === "underline";
  }

  tag() {
    return "u";
  }
}

module.exports = Underline;
