import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export function load() {
  if (browser) { // Pastikan kode ini hanya berjalan di browser
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;

        if (userRole === 'admin') {
          throw redirect(307, '/admin');
        } else {
          throw redirect(307, '/cashier');
        }
      } catch (e) {
        // Jika token tidak valid, arahkan ke login
        throw redirect(307, '/login');
      }
    }
  }
  // Jika tidak ada token, biarkan layout guard yang mengarahkan ke /login
}