import createDOMPurify, { type DOMPurify as DOMPurifyType } from "dompurify";
import { JSDOM } from "jsdom";

const DOMPurify = createDOMPurify(new JSDOM("").window);

class DOMPurifyServer {
  private allowed_tags = ["a"];
  private allowed_attr = ["target", "href"];

  constructor(private DOMPurify: DOMPurifyType) {}

  public sanitize(html: string | null | undefined): string {
    if (!html) return "";
    return this.DOMPurify.sanitize(html, {
      ALLOWED_TAGS: this.allowed_tags,
      ALLOWED_ATTR: this.allowed_attr,
    });
  }
}

export const domPurifyServer = new DOMPurifyServer(DOMPurify);
