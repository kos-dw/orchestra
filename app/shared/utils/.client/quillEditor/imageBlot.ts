import { BlockEmbed } from "quill/blots/block";

class ImageBlot extends BlockEmbed {
  static blotName = "customImage";
  static tagName = "img";

  static create(value: { alt: string; url: string }) {
    const node = super.create();
    (node as HTMLElement).setAttribute("alt", value.alt);
    (node as HTMLElement).setAttribute("src", value.url);
    return node;
  }

  static value(node: HTMLElement) {
    return {
      alt: node.getAttribute("alt"),
      url: node.getAttribute("src"),
    };
  }
}

export { ImageBlot };
