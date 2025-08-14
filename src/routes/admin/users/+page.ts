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
      const response = await fetch(`${baseUrl}/users/`, { headers });

      if (!response.ok) {
        console.error('Gagal mengambil data pengguna');
        return { users: [] };
      }

      const users = await response.json();
      return { users }; // Kirim data users ke +page.svelte

    } catch (error) {
      console.error('Error saat fetch data pengguna:', error);
      return { users: [] };
    }
  }
  return { users: [] };
};