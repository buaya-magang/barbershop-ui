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
      const response = await fetch(`${baseUrl}/transactions/`, { headers });

      if (!response.ok) {
        console.error('Gagal mengambil data riwayat transaksi');
        return { transactions: [] };
      }

      const transactions = await response.json();
      // Mengurutkan transaksi dari yang paling baru
      transactions.sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
      
      return { transactions };

    } catch (error) {
      console.error('Error saat fetch data riwayat:', error);
      return { transactions: [] };
    }
  }
  return { transactions: [] };
};