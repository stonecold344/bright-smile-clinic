import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  images: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};
