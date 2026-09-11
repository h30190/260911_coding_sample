import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Bold, Italic, List, ListOrdered, Quote, Image as ImageIcon, Loader2 } from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuButton = ({ onClick, active, children, disabled }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-1.5 rounded transition-colors",
      active ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    {children}
  </button>
);

export default function RichEditor({ content, onChange, placeholder, className }: RichEditorProps) {
  const [uploading, setUploading] = React.useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      // 1. Get Presigned URL
      const res = await fetch('/api/v1/attachments/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          targetType: 'TASK' // or RFI
        })
      });
      const { uploadUrl, downloadKey } = await res.json();

      // 2. Upload to S3 (Mocked here, but in real app would be PUT to uploadUrl)
      console.log('Uploading to:', uploadUrl);
      // await fetch(uploadUrl, { method: 'PUT', body: file });

      // 3. Confirm and get final URL
      // For this demo, we'll just use a local blob URL or a placeholder
      const imageUrl = URL.createObjectURL(file);
      
      // 4. Insert into editor
      // Tiptap image extension would be needed for full support, but we'll simulate for now
      // editor?.chain().focus().setImage({ src: imageUrl }).run();
      
      return imageUrl;
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[120px] px-4 py-3",
          className
        ),
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of Array.from(items)) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file).then(url => {
                if (url) {
                  // Manually insert img tag if image extension not loaded
                  editor?.commands.insertContent(`<img src="${url}" class="rounded-lg border border-slate-200 shadow-sm max-w-full my-2" />`);
                }
              });
              return true;
            }
          }
        }
        return false;
      }
    }
  });

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      <div className="flex items-center gap-1 p-1.5 border-b border-slate-100 bg-slate-50/50">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          active={editor.isActive('blockquote')}
        >
          <Quote className="w-4 h-4" />
        </MenuButton>
        
        {uploading && (
          <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-blue-600 px-3">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>PASTING IMAGE...</span>
          </div>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
