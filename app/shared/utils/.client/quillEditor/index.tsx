import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
import { ImageModal } from "../imageModal";
import { ImageBlot } from "./imageBlot";

// import * as quillCss from "quill/dist/quill.snow.css";
// export const links = () => [{ rel: "stylesheet", href: quillCss }];

export type { Quill };
type quillEditorArgs = {
  setQuill: React.Dispatch<React.SetStateAction<Quill | null>>;
};
export function QuillEditor({ setQuill }: quillEditorArgs) {
  const quillRef = useRef<Quill>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imgValue, setImgValue] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  // Quillを初期化して、stateにセット
  useEffect(() => {
    if (
      editorRef.current &&
      !editorRef.current.hasAttribute("data-quill-init")
    ) {
      // 画像ブロットを登録(未登録の場合のみ)
      if (!Quill.imports["formats/customImage"]) {
        Quill.register(ImageBlot);
      }

      // カスタムアイコンを追加
      const icons = Quill.import("ui/icons") as {
        [key: string]: string;
      };
      icons["customImage"] =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6l96 0 32 0 208 0c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>';

      // Quillを初期化
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ size: ["small", false, "large"] }],
              ["bold", "italic", "underline", "strike"],
              ["link", "customImage"],
              [{ list: "bullet" }, { list: "ordered" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ align: [] }],
              ["clean"],
            ],
            handlers: {
              customImage: () => setIsOpen(true),
            },
          },
        },
      });
      setQuill(quillRef.current);
      editorRef.current.setAttribute("data-quill-init", "true");
    }
  }, [editorRef, quillRef]);

  // モーダルでセットした画像の値をQuillに挿入
  useEffect(() => {
    if (quillRef.current && imgValue) {
      const range = quillRef.current.getSelection();
      if (range) {
        quillRef.current.insertEmbed(range.index, "customImage", {
          url: imgValue.url,
          alt: imgValue.alt,
        });
        quillRef.current.setSelection(range.index + 1);
      }
    }
  }, [imgValue]);

  return typeof window !== "undefined" ? (
    <>
      <div
        className="bg-white border-x-1 border-b-1 border-gray-300"
        ref={editorRef}
      />
      {isOpen && (
        <ImageModal setIsOpen={setIsOpen} setImgValue={setImgValue} />
      )}
    </>
  ) : null;
}
