import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UploadWrapper = styled.div``;

const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.mutedForeground};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.secondary}80;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  folder?: string;
}

const ImageUpload = ({ images, onChange, multiple = false, folder = 'uploads' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`הקובץ ${file.name} גדול מדי (מקסימום 10MB)`);
          continue;
        }

        const ext = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (error) {
          toast.error(`שגיאה בהעלאת ${file.name}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        newUrls.push(urlData.publicUrl);
      }

      if (multiple) {
        onChange([...images, ...newUrls]);
      } else {
        onChange(newUrls.length > 0 ? [newUrls[0]] : images);
      }
    } catch {
      toast.error('שגיאה בהעלאת התמונות');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <UploadWrapper>
      <DropZone>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
        />
        {uploading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <>
            <Upload size={24} />
            <span style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {multiple ? 'לחצו להעלאת תמונות' : 'לחצו להעלאת תמונה'}
            </span>
          </>
        )}
      </DropZone>

      {images.length > 0 && (
        <PreviewGrid>
          {images.map((url, i) => (
            <PreviewItem key={i}>
              <img src={url} alt={`תמונה ${i + 1}`} />
              <RemoveButton type="button" onClick={() => removeImage(i)}>
                <X size={12} />
              </RemoveButton>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
    </UploadWrapper>
  );
};

export default ImageUpload;
