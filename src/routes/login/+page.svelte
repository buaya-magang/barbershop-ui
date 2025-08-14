<script lang="ts">
  import Swal from 'sweetalert2';
  import LoginImage from '$lib/assets/logo-login.png';
  import { viewport } from '$lib/viewport.js';

  let username = '';
  let password = '';
  let isLoading = false;

  const handleLogin = async () => {
    isLoading = true;
    const apiUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL + '/auth/login';
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('accessToken', token);

        // --- BAGIAN INI DIPERBAIKI ---
        // 1. Decode token untuk mendapatkan role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;

        await Swal.fire({
          title: 'Login Berhasil!',
          text: `Anda akan diarahkan ke halaman ${userRole}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        // 2. Arahkan pengguna berdasarkan rolenya secara langsung
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/cashier';
        }
        // --- AKHIR PERBAIKAN ---

      } else {
        const errorData = await response.json();
        await Swal.fire({
          title: 'Login Gagal',
          text: errorData.detail || 'Username atau password salah.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Network Error:', error);
      await Swal.fire({
        title: 'Error Jaringan',
        text: 'Tidak bisa terhubung ke server. Silakan coba lagi nanti.',
        icon: 'error',
      });
    } finally {
      isLoading = false;
    }
  };
</script>
<div class="grid w-full min-h-screen md:grid-cols-2">
  <!-- Kolom kiri -->
  <div class="items-center justify-center hidden bg-violet-50 md:flex">
    <div class="p-8 text-center max-w-md">
      <p use:viewport class="fade-in-up text-4xl font-bold text-violet-800 mb-8 delay-150">
        Barbersh.OP
      </p>

      <!-- Logo melayang -->
      <img
        use:viewport
        src="{LoginImage}"
        alt="Barbershop Illustration"
        class="fade-in-up animate-float w-full max-w-xs mx-auto mb-8 delay-200"
      />

      <p use:viewport class="fade-in-up text-xl font-semibold text-slate-700 delay-300">
        Manajemen barbershop jadi lebih mudah.
      </p>

      <p use:viewport class="fade-in-up mt-4 text-base text-slate-500 delay-[400ms]">
        Kelola jadwal, catat setiap transaksi, dan pantau performa barbershop Anda dalam satu
        aplikasi yang intuitif dan mudah digunakan.
      </p>
    </div>
  </div>

  <!-- Kolom kanan -->
  <div class="flex items-center justify-center p-6 bg-slate-100 md:p-12">
    <div class="w-full max-w-sm md:-mt-16">
      <h2
        use:viewport
        class="fade-in-up mb-8 text-4xl font-bold text-center text-slate-800 delay-[500ms]"
      >
        Welcome Back
      </h2>

      <form class="space-y-6" on:submit|preventDefault={handleLogin}>
        <div use:viewport class="fade-in-up delay-[600ms]">
          <label for="username" class="block mb-2 text-base font-medium text-slate-700">
            Username
          </label>
          <input
            bind:value={username}
            type="text"
            id="username"
            name="username"
            class="w-full px-4 py-3 bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div use:viewport class="fade-in-up delay-[700ms]">
          <label for="password" class="block mb-2 text-base font-medium text-slate-700">
            Password
          </label>
          <input
            bind:value={password}
            type="password"
            id="password"
            name="password"
            class="w-full px-4 py-3 bg-white border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div use:viewport class="fade-in-up pt-4 delay-[800ms]">
          <button
            type="submit"
            class="w-full px-4 py-3 font-semibold text-white transition rounded-lg text-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400"
            disabled={isLoading}
          >
            {#if isLoading}
              <span>Loading...</span>
            {:else}
              <span>Login</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
