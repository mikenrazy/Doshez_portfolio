import { supabase } from '../lib/supabase';
import type { PortfolioContent, MediaUpload } from '../types/admin';

class PortfolioService {
  async getContent(section?: string): Promise<PortfolioContent[]> {
    try {
      let query = supabase.from('portfolio_content').select('*');
      
      if (section) {
        query = query.eq('section', section);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  }

  async updateContent(id: string, updates: Partial<PortfolioContent>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .update(updates)
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating content:', error);
      return false;
    }
  }

  async createContent(content: Omit<PortfolioContent, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .insert(content);

      return !error;
    } catch (error) {
      console.error('Error creating content:', error);
      return false;
    }
  }

  async deleteContent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .delete()
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error deleting content:', error);
      return false;
    }
  }

  async uploadMedia(file: File, uploadType: 'profile' | 'project' | 'general'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${uploadType}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      // Save media record
      const { error: dbError } = await supabase
        .from('media_uploads')
        .insert({
          filename: fileName,
          original_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          file_path: filePath,
          upload_type: uploadType
        });

      if (dbError) throw dbError;

      return publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  }

  async getMediaUploads(): Promise<MediaUpload[]> {
    try {
      const { data, error } = await supabase
        .from('media_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching media:', error);
      return [];
    }
  }
}

export const portfolioService = new PortfolioService();