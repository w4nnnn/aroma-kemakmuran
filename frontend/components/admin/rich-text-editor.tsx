"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Deskripsi produk...' })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#D4AF37]/30 rounded-md overflow-hidden bg-[#2A0206] focus-within:border-[#D4AF37] transition-colors">
      <div className="flex items-center gap-1 border-b border-[#D4AF37]/20 p-2 bg-[#3A040A]">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('bold') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('italic') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-[#D4AF37]/20 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('bulletList') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('orderedList') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <ListOrdered size={16} />
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[150px] text-[#FDFBF7] prose prose-invert prose-p:my-2 prose-list:my-2 focus:outline-none max-w-none" 
      />
    </div>
  );
}
