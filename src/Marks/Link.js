const Mark = require("./Mark");

class Link extends Mark {
  matching() {
    return this.mark.type === "link";
  }

  tag() {
    return [
      {
        tag: "a",
        attrs: {
          href: this.mark.attrs.href,
          target: this.mark.attrs.target,
        },
      },
    ];
  }
}

module.exports = Link;
