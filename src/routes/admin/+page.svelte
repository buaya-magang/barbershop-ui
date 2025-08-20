<script lang="ts">
  import { onMount } from "svelte";

  let summary: { today_revenue: number; today_transactions_count: number } | null = null;
  let counts: { services: number; products: number; users: number } | null = null;
  let loading = true;
  let error: string | null = null;

  const apiUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL + "/dashboard/summary";
  const countsUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL + "/dashboard/counts";

  onMount(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token tidak ditemukan, silakan login kembali.");

      const [summaryRes, countsRes] = await Promise.all([
        fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(countsUrl, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!summaryRes.ok) throw new Error("Gagal memuat data dashboard");
      if (!countsRes.ok) throw new Error("Gagal memuat data jumlah");

      summary = await summaryRes.json();
      counts = await countsRes.json();
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

  <!-- Card Statistik Jumlah -->
  {#if counts}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Card Jumlah Layanan -->
      <a href="/admin/services" class="p-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl shadow-md text-white transform hover:scale-105 transition flex flex-col justify-between border border-violet-100">
        <div>
          <h2 class="text-lg font-semibold">Jumlah Layanan</h2>
          <p class="text-3xl font-bold mt-2">{counts.services}</p>
        </div>
        <div class="bg-white/20 p-3 rounded-xl mt-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 00-8 0v4M5 11h14l-1.35 9.45a1 1 0 01-.99.85H7.34a1 1 0 01-.99-.85L5 11z" />
          </svg>
        </div>
      </a>
      <!-- Card Jumlah Produk -->
      <a href="/admin/products" class="p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-md text-white transform hover:scale-105 transition flex flex-col justify-between border border-emerald-100">
        <div>
          <h2 class="text-lg font-semibold">Jumlah Produk</h2>
          <p class="text-3xl font-bold mt-2">{counts.products}</p>
        </div>
        <div class="bg-white/20 p-3 rounded-xl mt-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v4" />
          </svg>
        </div>
      </a>
      <!-- Card Jumlah Pengguna -->
      <a href="/admin/users" class="p-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-md text-white transform hover:scale-105 transition flex flex-col justify-between border border-pink-100">
        <div>
          <h2 class="text-lg font-semibold">Jumlah Pengguna</h2>
          <p class="text-3xl font-bold mt-2">{counts.users}</p>
        </div>
        <div class="bg-white/20 p-3 rounded-xl mt-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M12 4a4 4 0 014 4v4a4 4 0 01-8 0V8a4 4 0 014-4z" />
          </svg>
        </div>
      </a>
    </div>
  {/if}
</div>