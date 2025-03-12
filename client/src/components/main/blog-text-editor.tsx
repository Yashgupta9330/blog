"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface BlogEditorProps {
  onChange?: (content: string) => void;
  value?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ onChange, value }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Link,
      TextAlign,
    ],
    content: "<p>Start writing your blog...</p>",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value!);
    }
  }, [value, editor]);

  if (!editor) return <p>Loading editor...</p>;

  return (
    <div
      className="border rounded-md p-2"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex gap-2 mb-2 border-b pb-2 flex-wrap">
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("bold")}
          command={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("italic")}
          command={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("underline")}
          command={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("bulletList")}
          command={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("orderedList")}
          command={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("heading", { level: 1 })}
          command={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive("heading", { level: 2 })}
          command={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-4" />
        </ToolbarButton>

        {/* Text Alignment */}
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive({ textAlign: "left" })}
          command={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive({ textAlign: "center" })}
          command={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive({ textAlign: "right" })}
          command={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          editor={editor}
          isActive={editor.isActive({ textAlign: "justify" })}
          command={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
};

/** Toolbar Button Component */
const ToolbarButton = ({
  editor,
  command,
  children,
  isActive,
}: {
  editor: Editor;
  command: () => void;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  if (!editor) return null;

  return (
    <Button
      size="sm"
      className="p-2"
      variant={isActive ? "default" : "outline"}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={command}
    >
      {children}
    </Button>
  );
};

export default BlogEditor;
