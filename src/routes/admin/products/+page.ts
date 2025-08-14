import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  if (browser) {
    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch(`${baseUrl}/products/`, { headers });

      if (!response.ok) {
        console.error('Gagal mengambil data produk');
        return { products: [] };
      }

      const products = await response.json();
      return { products }; // Kirim data products ke +page.svelte

    } catch (error) {
      console.error('Error saat fetch data produk:', error);
      return { products: [] };
    }
  }
  return { products: [] };
};