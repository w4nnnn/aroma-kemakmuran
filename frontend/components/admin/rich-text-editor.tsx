"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Link as LinkIcon, 
  Quote, 
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo
} from 'lucide-react';
import { useCallback } from 'react';

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Placeholder.configure({ placeholder: 'Deskripsi produk atau konten artikel...' }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D4AF37] underline decoration-[#D4AF37]/50 underline-offset-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'min-h-[250px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, isActive = false, icon: Icon, disabled = false, title 
  }: { 
    onClick: () => void, isActive?: boolean, icon: any, disabled?: boolean, title: string 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 md:p-2 rounded transition-colors flex items-center justify-center
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#D4AF37]/10'} 
        ${isActive ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}
    >
      <Icon size={16} />
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-[#D4AF37]/20 mx-1 hidden sm:block" />;

  return (
    <div className="border border-[#D4AF37]/30 rounded-md overflow-hidden bg-[#2A0206] focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/50 transition-all">
      <div className="flex flex-wrap items-center gap-y-2 gap-x-1 border-b border-[#D4AF37]/20 p-2 bg-[#3A040A] sticky top-0 z-10">
        
        <div className="flex items-center">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={Undo} title="Undo" />
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={Redo} title="Redo" />
        </div>
        
        <Divider />

        <div className="flex items-center">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
        </div>

        <Divider />

        <div className="flex items-center">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
        </div>

        <Divider />

        <div className="flex items-center">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
        </div>

        <Divider />

        <div className="flex items-center">
          <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Add/Edit Link" />
        </div>

      </div>
      
      <div 
        className="p-4 min-h-[250px] cursor-text"
        onClick={() => {
          if (editor && !editor.isFocused) {
            editor.chain().focus().run();
          }
        }}
      >
        <EditorContent 
          editor={editor} 
          className="text-[#FDFBF7] prose prose-invert prose-p:my-2 prose-ul:list-disc prose-ol:list-decimal prose-ul:ml-6 prose-ol:ml-6 prose-li:my-1 prose-headings:text-[#D4AF37] prose-headings:font-serif prose-a:text-[#D4AF37] prose-blockquote:border-l-4 prose-blockquote:border-[#D4AF37] prose-blockquote:bg-[#3A040A]/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-blockquote:text-[#FDFBF7]/90 max-w-none [&_.is-editor-empty]:before:text-white/30 outline-none" 
        />
      </div>
    </div>
  );
}
