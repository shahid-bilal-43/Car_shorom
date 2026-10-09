import { MediaStorageService } from '../repositories/interfaces';

export class MockMediaStorageService implements MediaStorageService {
  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Selected file must be an image format (JPEG, PNG, WebP).'));
        return;
      }

      // Max size limit check for browser storage (3MB)
      if (file.size > 3 * 1024 * 1024) {
        reject(new Error('Image size should be below 3MB for local browser storage.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file.'));
      };
      reader.readAsDataURL(file);
    });
  }

  async validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!url || typeof url !== 'string') {
        resolve(false);
        return;
      }
      if (url.startsWith('data:image/') || url.startsWith('/src/assets/')) {
        resolve(true);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}

export const mediaStorageService = new MockMediaStorageService();
