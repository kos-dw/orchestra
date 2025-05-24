import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import type { Editor } from "@milkdown/kit/core";
import { getHTML, getMarkdown } from "@milkdown/kit/utils";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";

const defaultValue = `# Milkdown React Crepe

> You're scared of a world where you're needed.

This is a demo for using Crepe with **React**.`;

const CrepeEditor = ({
  setEditor,
}: {
  setEditor: React.Dispatch<React.SetStateAction<Editor | undefined>>;
}) => {
  const { get, loading } = useEditor((root) => {
    const crepe = new Crepe({
      root,
      defaultValue: defaultValue,
    });
    return crepe;
  }, []);

  const editor = get();

  if (editor && !loading) {
    setEditor(editor);
  }
  return <Milkdown />;
};

function MilkdownEditor({
  setEditor,
}: {
  setEditor: React.Dispatch<React.SetStateAction<Editor | undefined>>;
}) {
  return (
    <MilkdownProvider>
      <CrepeEditor setEditor={setEditor} />
    </MilkdownProvider>
  );
}

export { getHTML, getMarkdown, MilkdownEditor };
export type { Editor };
