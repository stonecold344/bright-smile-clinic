import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const EditorWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.secondary}80;
`;

const ToolButton = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.foreground};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primaryForeground};
  }
`;

const ContentArea = styled.div`
  min-height: 250px;
  padding: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.foreground};
  background: ${({ theme }) => theme.colors.background};
  direction: rtl;
  line-height: 1.7;
  outline: none;

  &:focus {
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  h1 { font-size: 1.75rem; font-weight: 700; margin: 1rem 0 0.5rem; }
  h2 { font-size: 1.375rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
  p { margin: 0.5rem 0; }
  ul, ol { padding-right: 1.5rem; margin: 0.5rem 0; }
  li { margin: 0.25rem 0; }
`;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const tools = [
    { icon: <Bold size={16} />, command: 'bold', title: 'מודגש' },
    { icon: <Italic size={16} />, command: 'italic', title: 'נטוי' },
    { icon: <Underline size={16} />, command: 'underline', title: 'קו תחתון' },
    { icon: <Heading1 size={16} />, command: 'formatBlock', value: 'h1', title: 'כותרת 1' },
    { icon: <Heading2 size={16} />, command: 'formatBlock', value: 'h2', title: 'כותרת 2' },
    { icon: <List size={16} />, command: 'insertUnorderedList', title: 'רשימה' },
    { icon: <ListOrdered size={16} />, command: 'insertOrderedList', title: 'רשימה ממוספרת' },
    { icon: <AlignRight size={16} />, command: 'justifyRight', title: 'יישור ימין' },
    { icon: <AlignCenter size={16} />, command: 'justifyCenter', title: 'יישור מרכז' },
    { icon: <AlignLeft size={16} />, command: 'justifyLeft', title: 'יישור שמאל' },
  ];

  return (
    <EditorWrapper>
      <Toolbar>
        {tools.map((tool, i) => (
          <ToolButton
            key={i}
            type="button"
            title={tool.title}
            onMouseDown={(e) => {
              e.preventDefault();
              execCommand(tool.command, tool.value);
            }}
          >
            {tool.icon}
          </ToolButton>
        ))}
      </Toolbar>
      <ContentArea
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </EditorWrapper>
  );
};

export default RichTextEditor;
