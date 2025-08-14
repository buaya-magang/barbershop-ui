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
      const [servicesRes, productsRes] = await Promise.all([
        fetch(`${baseUrl}/services/`, { headers }),
        fetch(`${baseUrl}/products/`, { headers })
      ]);

      if (!servicesRes.ok || !productsRes.ok) {
        console.error('Gagal mengambil data dari API');
        return { items: [] };
      }

      const rawServices = await servicesRes.json();
      const rawProducts = await productsRes.json();

      // --- PERBAIKAN: Gunakan nilai bahasa Inggris sesuai API ---
      const services = rawServices.map((service: any) => ({ ...service, type: 'service' })); // Diubah dari 'layanan'
      const products = rawProducts.map((product: any) => ({ ...product, type: 'product' })); // Diubah dari 'produk'
      // --- AKHIR PERBAIKAN ---

      // Gabungkan kedua data yang sudah memiliki 'type'
      const items = [...services, ...products];
      
      return { items };
      
    } catch (error) {
      console.error('Error saat fetch data:', error);
      return { items: [] };
    }
  }

  return { items: [] };
};