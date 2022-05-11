const { htmlEntities, arrayify } = require("./utils");
const React = require("react");

class Renderer {
  constructor() {
    this.document = undefined;
    this.nodes = [
      require("./Nodes/Blockquote"),
      require("./Nodes/BulletList"),
      require("./Nodes/CodeBlock"),
      require("./Nodes/Heading"),
      require("./Nodes/ListItem"),
      require("./Nodes/OrderedList"),
      require("./Nodes/Paragraph"),
      require("./Nodes/Image"),
      require("./Nodes/HardBreak"),
    ];
    this.marks = [
      require("./Marks/Bold"),
      require("./Marks/Code"),
      require("./Marks/Italic"),
      require("./Marks/Link"),
      require("./Marks/Underline"),
    ];
  }

  setDocument(value) {
    if (typeof value === "string") {
      value = JSON.parse(value);
    } else if (typeof value === "array") {
      value = JSON.parse(JSON.stringify(value));
    }

    this.document = value;
  }

  renderNode(node, key = 0) {
    let renderClass;
    let tag = {};
    let attrs = null;
    for (let i in this.nodes) {
      const NodeClass = this.nodes[i];
      renderClass = new NodeClass(node);

      if (renderClass.matching()) {
        tag = renderClass.tag();
        if (tag.tag) {
          attrs = tag.attrs;
          tag = tag.tag;
        }
        break;
      }
    }

    let children = null;
    if (node.content) {
      children = [];
      for (let i in node.content) {
        const nestedNode = node.content[i];
        children.push(this.renderNode(nestedNode, i));
      }
    } else if (node.text) {
      children = node.text;
      if (!node.marks || Object.values(node.marks).length === 0) {
        return children;
      }
    } else if (renderClass.text()) {
      children = renderClass.text();
      if (!node.marks || Object.values(node.marks).length === 0) {
        return children;
      }
    }
    if (!tag || Object.values(tag).length === 0) {
      if (node.marks) {
        const mark = node.marks[0];
        for (let i in this.marks) {
          const MarkClass = this.marks[i];
          const renderClass = new MarkClass(mark);
          if (renderClass.matching()) {
            tag = renderClass.tag();
            if (tag[0].tag) {
              attrs = tag[0].attrs;
              tag = tag[0].tag;
            }
          }
        }
        if (node.marks.length > 1) {
          children = this.renderNode({
            type: "text",
            marks: node.marks.slice(1),
            text: node.text,
          });
        }
      } else {
        tag = "div";
      }
    }
    if (tag) {
      return React.createElement(tag, {...attrs, key }, children);
    } 
    return null;

    let html = [];

    if (node.marks) {
      node.marks.forEach((mark) => {
        for (let i in this.marks) {
          const MarkClass = this.marks[i];
          const renderClass = new MarkClass(mark);
          if (renderClass.matching()) {
            html.push(this.renderOpeningTag(renderClass.tag()));
          }
        }
      });
    }

    for (let i in this.nodes) {
      const NodeClass = this.nodes[i];
      renderClass = new NodeClass(node);

      if (renderClass.matching()) {
        html.push(this.renderOpeningTag(renderClass.tag()));
        break;
      }
    }

    if (node.content) {
      for (let i in node.content) {
        const nestedNode = node.content[i];
        html.push(this.renderNode(nestedNode));
      }
    } else if (node.text) {
      html.push(htmlEntities(node.text));
    } else if (renderClass.text()) {
      html.push(renderClass.text());
    }

    // renderClass;
    for (let i in this.nodes) {
      let NodeClass = this.nodes[i];
      renderClass = new NodeClass(node);

      if (renderClass.selfClosing()) {
        continue;
      }

      if (renderClass.matching()) {
        html.push(this.renderClosingTag(renderClass.tag()));
      }
    }

    if (node.marks) {
      node.marks
        .slice()
        .reverse()
        .forEach((mark) => {
          for (let i in this.marks) {
            const MarkClass = this.marks[i];
            const renderClass = new MarkClass(mark);

            if (renderClass.matching()) {
              html.push(this.renderClosingTag(renderClass.tag()));
            }
          }
        });
    }

    return html.join("");
  }

  renderOpeningTag(tags) {
    tags = arrayify(tags);

    if (!tags || !tags.length) {
      return null;
    }

    return tags
      .map((item) => {
        if (typeof item === "string") {
          return `<${item}>`;
        }
        let attrs = "";

        if (item.attrs) {
          for (let attribute in item.attrs) {
            const value = item.attrs[attribute];
            if (value) {
              attrs += ` ${attribute}="${value}"`;
            }
          }
        }

        return `<${item.tag}${attrs}>`;
      })
      .join("");
  }

  renderClosingTag(tags) {
    tags = arrayify(tags);
    tags = tags.slice().reverse();

    if (!tags || !tags.length) {
      return null;
    }

    return tags
      .map((item) => {
        if (typeof item === "string") {
          return `</${item}>`;
        }

        return `</${item.tag}>`;
      })
      .join("");
  }

  render(value) {
    this.setDocument(value);

    let html = [];

    for (const i in this.document.content) {
      let node = this.document.content[i];
      html.push(this.renderNode(node, i));
    }

    return html;
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addNodes(nodes) {
    for (const i in nodes) {
      this.addNode(nodes[i]);
    }
  }

  addMark(mark) {
    this.marks.push(mark);
  }

  addMarks(marks) {
    for (const i in marks) {
      this.addMark(marks[i]);
    }
  }
}

module.exports = Renderer;
