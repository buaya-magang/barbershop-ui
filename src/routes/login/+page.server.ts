import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// Sebaiknya gunakan environment variable yang hanya bisa diakses server
const API_BASE_URL = 'https://api-anda.com'; // Ganti dengan URL API Anda

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    // Validasi dasar
    if (!username || !password) {
      return fail(400, { message: 'Username dan password wajib diisi.' });
    }

    const apiFormData = new URLSearchParams();
    apiFormData.append('username', username as string);
    apiFormData.append('password', password as string);

    try {
      // 1. Server SvelteKit menghubungi API backend Anda
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, { message: errorData.detail || 'Username atau password salah.' });
      }

      const data = await response.json();
      const token = data.access_token;
      
      // 2. Jika berhasil, buat cookie yang aman (HttpOnly)
      cookies.set('accessToken', token, {
        path: '/',
        httpOnly: true, // PENTING: Mencegah akses dari JavaScript di browser
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // Hanya pakai HTTPS di produksi
        maxAge: 60 * 60 * 24 * 7, // Masa berlaku cookie (7 hari)
      });
      
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Terjadi masalah pada server. Coba lagi nanti.' });
    }
    
    // 3. Arahkan pengguna ke halaman utama setelah login berhasil
    // Redirector di halaman utama akan menangani sisanya
    throw redirect(303, '/');
  },
};