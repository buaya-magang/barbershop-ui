import { redirect } from '@sveltejs/kit';
import { decode } from 'jsonwebtoken';

export const load = ({ cookies, url }) => {
  const token = cookies.get('accessToken');
  
  // Jika tidak ada token
  if (!token) {
    // Dan pengguna tidak sedang mencoba mengakses halaman login
    if (url.pathname !== '/login') {
      // Arahkan mereka ke halaman login
      throw redirect(307, '/login');
    }
    return { user: null }; // Izinkan akses ke /login
  }

  // Jika ada token, verifikasi dan teruskan data pengguna
  try {
    const payload = decode(token) as { sub: string, role: string }; // Ganti sesuai payload token Anda
    const user = {
      id: payload.sub,
      role: payload.role,
    };
    return { user }; // Data 'user' ini akan tersedia di semua halaman
  } catch (e) {
    // Jika token tidak valid, paksa login ulang
    if (url.pathname !== '/login') {
      cookies.delete('accessToken', { path: '/' });
      throw redirect(307, '/login');
    }
    return { user: null };
  }
};