import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";

import { Button, Dropdown, Space, Tooltip } from "antd";
import { AlignCenter, Quote } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import {
  BiAlignJustify,
  BiAlignLeft,
  BiAlignRight,
  BiBold,
  BiCode,
  BiImage,
  BiItalic,
  BiLink,
  BiListOl,
  BiListUl,
  BiMinus,
  BiParagraph,
  BiRedo,
  BiStrikethrough,
  BiTable,
  BiUnderline,
  BiUndo,
  BiVideo,
} from "react-icons/bi";
import GalleryModal from "../data-display/gallery-modal/GalleryModal";

const CustomYoutube = Youtube.configure({
  HTMLAttributes: {
    class: "w-full aspect-video rounded-lg",
  },
});

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },
});

interface TiptapEditorProps {
  name: string;
  error?: string;
  defaultValue?: string;
  label?: string;
}

const Editor: React.FC<TiptapEditorProps> = ({
  name,
  error,
  defaultValue,
  label,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { control, setValue } = useFormContext();

  const editor = useEditor({
    extensions: [
      // Use StarterKit but exclude extensions we want to configure separately
      StarterKit.configure({
        // Disable extensions from StarterKit that we want to configure separately
        heading: false,
        paragraph: false,
        hardBreak: false,
        strike: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      // Configure extensions separately for better control
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      HardBreak,
      ResizableImage,
      CustomYoutube,
      Paragraph.configure({
        HTMLAttributes: {
          class: "mb-2",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border hover:bg-gray-50",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border bg-gray-100 p-2 font-bold text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border p-2",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Strike.configure({
        HTMLAttributes: {
          class: "line-through",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-4 rounded-lg font-mono text-sm my-4",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-4 border-gray-300",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      setValue(name, editor.getHTML(), { shouldDirty: true });
    },
    content: defaultValue || "<p>Please start typing...</p>",
  });

  // Update editor content when defaultValue changes
  useEffect(() => {
    if (editor && defaultValue && editor.getHTML() !== defaultValue) {
      editor.commands.setContent(defaultValue);
    }
  }, [editor, defaultValue]);

  const addImage = (url: string) => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (editor && url) {
      try {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      } catch (error) {
        console.error("Error adding YouTube video:", error);
        alert("Invalid YouTube URL. Please enter a valid YouTube URL.");
      }
    }
  };

  const addLink = () => {
    const selection = editor?.state.selection;
    const selectedText = editor?.state.doc.textBetween(
      selection?.from || 0,
      selection?.to || 0,
    );

    if (!selectedText) {
      alert("Please select some text first to add a link.");
      return;
    }

    const previousUrl = editor?.getAttributes("link").href;
    const url = prompt("Enter URL", previousUrl || "https://");

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    // update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");

    const rowCount = parseInt(rows || "3");
    const colCount = parseInt(cols || "3");

    if (isNaN(rowCount) || isNaN(colCount) || rowCount < 1 || colCount < 1) {
      alert("Please enter valid numbers for rows and columns.");
      return;
    }

    editor
      ?.chain()
      .focus()
      .insertTable({
        rows: Math.min(rowCount, 10), // Limit to max 10 rows
        cols: Math.min(colCount, 10), // Limit to max 10 columns
        withHeaderRow: true,
      })
      .run();
  };

  const MenuBar = () => (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-gray-50">
      {/* Text Formatting */}
      <Space.Compact>
        <Tooltip title="Bold (Ctrl+B)">
          <Button
            type={editor?.isActive("bold") ? "primary" : "default"}
            icon={<BiBold className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Italic (Ctrl+I)">
          <Button
            type={editor?.isActive("italic") ? "primary" : "default"}
            icon={<BiItalic className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Underline (Ctrl+U)">
          <Button
            type={editor?.isActive("underline") ? "primary" : "default"}
            icon={<BiUnderline className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Strike">
          <Button
            type={editor?.isActive("strike") ? "primary" : "default"}
            icon={<BiStrikethrough className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={!editor}
          />
        </Tooltip>
      </Space.Compact>

      {/* Text Alignment */}
      <Space.Compact>
        <Tooltip title="Align Left">
          <Button
            type={
              editor?.isActive({ textAlign: "left" }) ||
              (!editor?.isActive({ textAlign: "center" }) &&
                !editor?.isActive({ textAlign: "right" }) &&
                !editor?.isActive({ textAlign: "justify" }))
                ? "primary"
                : "default"
            }
            icon={<BiAlignLeft className="text-lg" />}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Align Center">
          <Button
            type={
              editor?.isActive({ textAlign: "center" }) ? "primary" : "default"
            }
            icon={<AlignCenter className="text-lg" />}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Align Right">
          <Button
            type={
              editor?.isActive({ textAlign: "right" }) ? "primary" : "default"
            }
            icon={<BiAlignRight className="text-lg" />}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Justify">
          <Button
            type={
              editor?.isActive({ textAlign: "justify" }) ? "primary" : "default"
            }
            icon={<BiAlignJustify className="text-lg" />}
            onClick={() =>
              editor?.chain().focus().setTextAlign("justify").run()
            }
            disabled={!editor}
          />
        </Tooltip>
      </Space.Compact>

      {/* Lists and Blocks */}
      <Space.Compact>
        <Tooltip title="Bullet List">
          <Button
            type={editor?.isActive("bulletList") ? "primary" : "default"}
            icon={<BiListUl className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Numbered List">
          <Button
            type={editor?.isActive("orderedList") ? "primary" : "default"}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor}
          >
            <BiListOl className="text-lg" />
          </Button>
        </Tooltip>

        <Tooltip title="Blockquote">
          <Button
            type={editor?.isActive("blockquote") ? "primary" : "default"}
            icon={<Quote className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Code Block">
          <Button
            type={editor?.isActive("codeBlock") ? "primary" : "default"}
            icon={<BiCode className="text-lg" />}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Horizontal Rule">
          <Button
            icon={<BiMinus className="text-lg" />}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            disabled={!editor}
          />
        </Tooltip>
      </Space.Compact>

      {/* Headings */}
      <Space.Compact>
        <Tooltip title="Paragraph">
          <Button
            type={editor?.isActive("paragraph") ? "primary" : "default"}
            onClick={() => editor?.chain().focus().setParagraph().run()}
            disabled={!editor}
          >
            P
          </Button>
        </Tooltip>

        <Tooltip title="Headings">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              type={
                editor?.isActive("heading", { level }) ? "primary" : "default"
              }
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                  .run()
              }
              disabled={!editor}
            >
              H{level}
            </Button>
          ))}
        </Tooltip>

        <Tooltip title="Line Break">
          <Button
            icon={<BiParagraph className="text-lg" />}
            onClick={() => editor?.chain().focus().setHardBreak().run()}
            disabled={!editor}
          />
        </Tooltip>
      </Space.Compact>

      {/* Media and Links */}
      <Space.Compact>
        <Tooltip title="Add Image">
          <Button
            icon={<BiImage className="text-lg" />}
            onClick={() => setIsGalleryOpen(true)}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Add YouTube Video">
          <Button
            icon={<BiVideo className="text-lg" />}
            onClick={addYoutubeVideo}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Add Link">
          <Button
            type={editor?.isActive("link") ? "primary" : "default"}
            icon={<BiLink className="text-lg" />}
            onClick={addLink}
            disabled={!editor}
          />
        </Tooltip>

        <Tooltip title="Add Table">
          <Button
            icon={<BiTable className="text-lg" />}
            onClick={addTable}
            disabled={!editor}
          />
        </Tooltip>
      </Space.Compact>

      {/* Undo/Redo */}
      <Space.Compact>
        <Tooltip title="Undo (Ctrl+Z)">
          <Button
            icon={<BiUndo className="text-lg" />}
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
          />
        </Tooltip>

        <Tooltip title="Redo (Ctrl+Y)">
          <Button
            icon={<BiRedo className="text-lg" />}
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
          />
        </Tooltip>
      </Space.Compact>

      {/* Table Options - Only show when cursor is in a table */}
      {editor?.isActive("table") && (
        <Space.Compact>
          <Dropdown
            menu={{
              items: [
                {
                  key: "addColumnBefore",
                  label: "Add column before",
                  onClick: () =>
                    editor?.chain().focus().addColumnBefore().run(),
                },
                {
                  key: "addColumnAfter",
                  label: "Add column after",
                  onClick: () => editor?.chain().focus().addColumnAfter().run(),
                },
                {
                  key: "deleteColumn",
                  label: "Delete column",
                  onClick: () => editor?.chain().focus().deleteColumn().run(),
                },
                { type: "divider" },
                {
                  key: "addRowBefore",
                  label: "Add row before",
                  onClick: () => editor?.chain().focus().addRowBefore().run(),
                },
                {
                  key: "addRowAfter",
                  label: "Add row after",
                  onClick: () => editor?.chain().focus().addRowAfter().run(),
                },
                {
                  key: "deleteRow",
                  label: "Delete row",
                  onClick: () => editor?.chain().focus().deleteRow().run(),
                },
                { type: "divider" },
                {
                  key: "mergeCells",
                  label: "Merge cells",
                  onClick: () => editor?.chain().focus().mergeCells().run(),
                },
                {
                  key: "splitCell",
                  label: "Split cell",
                  onClick: () => editor?.chain().focus().splitCell().run(),
                },
                { type: "divider" },
                {
                  key: "toggleHeaderColumn",
                  label: "Toggle header column",
                  onClick: () =>
                    editor?.chain().focus().toggleHeaderColumn().run(),
                },
                {
                  key: "toggleHeaderRow",
                  label: "Toggle header row",
                  onClick: () =>
                    editor?.chain().focus().toggleHeaderRow().run(),
                },
                {
                  key: "toggleHeaderCell",
                  label: "Toggle header cell",
                  onClick: () =>
                    editor?.chain().focus().toggleHeaderCell().run(),
                },
                { type: "divider" },
                {
                  key: "deleteTable",
                  label: "Delete table",
                  onClick: () => editor?.chain().focus().deleteTable().run(),
                  danger: true,
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<BiTable className="text-lg" />} type="dashed">
              Table Options
            </Button>
          </Dropdown>
        </Space.Compact>
      )}
    </div>
  );

  if (!editor) {
    return (
      <div className="border rounded-lg">
        <div className="p-4 text-center text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {label && (
              <label className="block p-2 font-medium text-gray-700">
                {label}
              </label>
            )}
            <MenuBar />
            <EditorContent
              editor={editor}
              className="min-h-[200px] max-h-[500px] overflow-y-auto"
              {...field}
            />
            {error && (
              <div className="p-2 mt-1 text-sm text-red-600 border-t bg-red-50">
                {error}
              </div>
            )}

            <GalleryModal
              open={isGalleryOpen}
              onClose={() => setIsGalleryOpen(false)}
              mode="single"
              selectedImage={null}
              setSelectedImage={(url: string) => {
                addImage(url);
                setIsGalleryOpen(false);
              }}
            />
          </>
        )}
      />
    </div>
  );
};

export default Editor;
