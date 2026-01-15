import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Treatment {
  id: string;
  slug: string;
  icon: string;
  title: string;
  short_description: string;
  full_description: string | null;
  features: string[];
  benefits: string[] | null;
  process_steps: string[] | null;
  duration: string | null;
  price_range: string | null;
}

export const useTreatments = () => {
  return useQuery({
    queryKey: ['treatments'],
    queryFn: async (): Promise<Treatment[]> => {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useTreatment = (slug: string) => {
  return useQuery({
    queryKey: ['treatment', slug],
    queryFn: async (): Promise<Treatment | null> => {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};
