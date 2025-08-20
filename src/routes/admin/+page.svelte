<script lang="ts">
  import { onMount } from "svelte";

  let summary: { today_revenue: number; today_transactions_count: number } | null = null;
  let loading = true;
  let error: string | null = null;

  // pakai base URL dari .env
  const apiUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL + "/dashboard/summary";

  onMount(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan, silakan login kembali.");

      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal memuat data dashboard");

      summary = await res.json();
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-8">
  <h1 class="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
  <p class="mt-2 mb-6 text-slate-500">Selamat datang, Admin! Berikut ringkasan hari ini.</p>

  <!-- Status ringkasan -->
  {#if loading}
    <p class="text-slate-500">Memuat data...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if summary}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Card Revenue -->
      <div class="p-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl shadow-md text-white transform hover:scale-105 transition">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold">Pendapatan Hari Ini</h2>
            <p class="text-3xl font-bold mt-2">Rp {summary.today_revenue.toLocaleString()}</p>
          </div>
          <div class="bg-white/20 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Card Transactions -->
      <div class="p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-md text-white transform hover:scale-105 transition">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold">Transaksi Hari Ini</h2>
            <p class="text-3xl font-bold mt-2">{summary.today_transactions_count}</p>
          </div>
          <div class="bg-white/20 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l-1.35 9.45a1 1 0 01-.99.85H7.34a1 1 0 01-.99-.85L5 11z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Menu Navigasi Admin -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <a href="/admin/services" class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition group border border-slate-200">
      <h2 class="text-xl font-semibold text-slate-800 group-hover:text-violet-600">Manajemen Layanan</h2>
      <p class="text-slate-500 mt-2">Tambah, ubah, atau hapus layanan barbershop.</p>
    </a>
    
    <a href="/admin/products" class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition group border border-slate-200">
      <h2 class="text-xl font-semibold text-slate-800 group-hover:text-violet-600">Manajemen Produk</h2>
      <p class="text-slate-500 mt-2">Tambah, ubah, atau hapus produk barbershop.</p>
    </a>

    <a href="/admin/users" class="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition group border border-slate-200">
      <h2 class="text-xl font-semibold text-slate-800 group-hover:text-violet-600">Manajemen Pengguna</h2>
      <p class="text-slate-500 mt-2">Tambah atau hapus akun pengguna.</p>
    </a>
  </div>
</div>