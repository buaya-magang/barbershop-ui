import { redirect } from '@sveltejs/kit';
import { decode } from 'jsonwebtoken'; // Atau library JWT lain yang Anda gunakan

export const load = ({ cookies }) => {
  const token = cookies.get('accessToken');

  // 1. Jika tidak ada cookie token, paksa ke halaman login
  if (!token) {
    throw redirect(307, '/login');
  }

  // 2. Jika ada token, baca rolenya
  try {
    const payload = decode(token) as { role: string };
    const userRole = payload.role;

    // 3. Arahkan berdasarkan role
    if (userRole === 'admin') {
      throw redirect(307, '/admin');
    } else {
      throw redirect(307, '/cashier');
    }
  } catch (e) {
    // Jika token tidak valid, paksa login ulang
    cookies.delete('accessToken', { path: '/' });
    throw redirect(307, '/login');
  }
};