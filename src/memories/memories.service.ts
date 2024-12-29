import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateMemoryDto, UpdateMemoryDto } from './dto/memory.dto';

@Injectable()
export class MemoriesService {
  private readonly logger = new Logger(MemoriesService.name);
  private readonly BUCKET_NAME = 'photos'; // Update bucket name to match Supabase

  constructor(private supabase: SupabaseService) {}

  async create(createMemoryDto: CreateMemoryDto, photo: Express.Multer.File) {
    try {
      // Generate a unique filename
      const fileExt = photo.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload photo to Supabase storage
      const { error: uploadError } = await this.supabase.client.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, photo.buffer, {
          contentType: photo.mimetype,
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        this.logger.error('Upload error:', uploadError);
        throw new Error(`Failed to upload photo: ${uploadError.message}`);
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = this.supabase.client.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      // Create memory record in the database
      const { data, error } = await this.supabase.client
        .from('memories')
        .insert({
          ...createMemoryDto,
          photo_url: fileName,
        })
        .select()
        .single();

      if (error) {
        this.logger.error('Database error:', error);
        // If database insert fails, clean up the uploaded file
        await this.supabase.client.storage
          .from(this.BUCKET_NAME)
          .remove([fileName]);
        throw new Error(`Failed to create memory: ${error.message}`);
      }

      return {
        ...data,
        photo_url: publicUrl,
      };
    } catch (error) {
      this.logger.error('Create memory error:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const { data, error } = await this.supabase.client
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Find all memories error:', error);
        throw new Error(`Failed to fetch memories: ${error.message}`);
      }

      // Transform photo_url to public URLs
      return data.map((memory) => ({
        ...memory,
        photo_url: this.supabase.client.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(memory.photo_url).data.publicUrl,
      }));
    } catch (error) {
      this.logger.error('Find all memories error:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const { data, error } = await this.supabase.client
        .from('memories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new NotFoundException('Memory not found');

      return {
        ...data,
        photo_url: this.supabase.client.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(data.photo_url).data.publicUrl,
      };
    } catch (error) {
      this.logger.error('Find one memory error:', error);
      throw error;
    }
  }

  async update(
    id: string,
    updateMemoryDto: UpdateMemoryDto,
    photo?: Express.Multer.File,
  ) {
    try {
      const memory = await this.findOne(id);
      let photoUrl = memory.photo_url;

      if (photo) {
        // Delete old photo if it exists
        await this.supabase.client.storage
          .from(this.BUCKET_NAME)
          .remove([memory.photo_url]);

        // Upload new photo
        const fileExt = photo.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await this.supabase.client.storage
          .from(this.BUCKET_NAME)
          .upload(fileName, photo.buffer, {
            contentType: photo.mimetype,
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError)
          throw new Error(`Failed to upload new photo: ${uploadError.message}`);
        photoUrl = fileName;
      }

      const { data, error } = await this.supabase.client
        .from('memories')
        .update({
          ...updateMemoryDto,
          photo_url: photoUrl,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update memory: ${error.message}`);

      return {
        ...data,
        photo_url: this.supabase.client.storage
          .from(this.BUCKET_NAME)
          .getPublicUrl(data.photo_url).data.publicUrl,
      };
    } catch (error) {
      this.logger.error('Update memory error:', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const memory = await this.findOne(id);

      // Delete photo from storage
      const { error: storageError } = await this.supabase.client.storage
        .from(this.BUCKET_NAME)
        .remove([memory.photo_url]);

      if (storageError) {
        this.logger.error('Storage delete error:', storageError);
      }

      const { error } = await this.supabase.client
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`Failed to delete memory: ${error.message}`);
      return { message: 'Memory deleted successfully' };
    } catch (error) {
      this.logger.error('Remove memory error:', error);
      throw error;
    }
  }
}
