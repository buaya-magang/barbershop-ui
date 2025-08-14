import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  if (browser) {
    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(`${baseUrl}/services/`, { headers });

      if (!response.ok) {
        console.error('Gagal mengambil data layanan');
        return { services: [] };
      }

      const services = await response.json();
      return { services }; // Kirim data services ke +page.svelte

    } catch (error) {
      console.error('Error saat fetch data layanan:', error);
      return { services: [] };
    }
  }
  return { services: [] };
};