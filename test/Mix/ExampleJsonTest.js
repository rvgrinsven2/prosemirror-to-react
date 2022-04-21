const assert = require("assert");

const Renderer = require("../../src/Renderer");

describe("ExampleJson Test", function () {
  it("Nested Long JSON", function () {
    let json = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Export HTML or JSON" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "You are able to export your data as " },
            { type: "text", marks: [{ type: "code" }], text: "HTML" },
            { type: "text", text: " or " },
            { type: "text", marks: [{ type: "code" }], text: "JSON" },
            { type: "text", text: ". To pass " },
            { type: "text", marks: [{ type: "code" }], text: "HTML" },
            { type: "text", text: " to the editor use the " },
            { type: "text", marks: [{ type: "code" }], text: "content" },
            { type: "text", text: " slot. To pass " },
            { type: "text", marks: [{ type: "code" }], text: "JSON" },
            { type: "text", text: " to the editor use the " },
            { type: "text", marks: [{ type: "code" }], text: "doc" },
            { type: "text", text: " prop." },
          ],
        },
      ],
    };

    let html =
      "<h2>Export HTML or JSON</h2><p>You are able to export your data as <code>HTML</code> or <code>JSON</code>. To pass <code>HTML</code> to the editor use the <code>content</code> slot. To pass <code>JSON</code> to the editor use the <code>doc</code> prop.</p>";

    const renderer = new Renderer();
    assert.deepEqual(html, renderer.render(json));
  });
});
