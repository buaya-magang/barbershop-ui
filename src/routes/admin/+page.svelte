<script lang="ts">
  import { onMount } from "svelte";

  let transactions: any[] = [];
  let errorMessage: string | null = null;

  // base url dari environment variable
  const apiUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

  // ambil token dari localStorage
  let token: string | null = localStorage.getItem("accessToken");

  async function fetchTransactions() {
    if (!token) {
      errorMessage = "Belum login, token tidak ditemukan.";
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/transactions/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Gagal fetch: ${res.status}`);
      }

      transactions = await res.json();
    } catch (err) {
      errorMessage = (err as Error).message;
    }
  }

  onMount(() => {
    fetchTransactions();
  });
</script>

{#if errorMessage}
  <p class="text-red-600">{errorMessage}</p>
{:else if transactions.length === 0}
  <p>Loading transaksi...</p>
{:else}
  <ul>
    {#each transactions as trx}
      <li>{trx.product_name} — {trx.amount}</li>
    {/each}
  </ul>
{/if}


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

    <!-- Daftar transaksi terbaru -->
    <div class="bg-white rounded-2xl shadow border border-slate-200 p-6 mb-8">
      <h2 class="text-xl font-semibold text-slate-800 mb-4">Transaksi Terbaru</h2>
      {#if transactions.length > 0}
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b text-slate-600">
              <th class="py-2">ID</th>
              <th class="py-2">Tanggal</th>
              <th class="py-2">Total</th>
              <th class="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each transactions.slice(0, 5) as trx}
              <tr class="border-b last:border-0 hover:bg-slate-50">
                <td class="py-2">{trx.id}</td>
                <td class="py-2">{new Date(trx.created_at).toLocaleString()}</td>
                <td class="py-2">Rp {trx.total.toLocaleString()}</td>
                <td class="py-2">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold 
                    {trx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                    {trx.status}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <p class="text-slate-500">Belum ada transaksi.</p>
      {/if}
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
