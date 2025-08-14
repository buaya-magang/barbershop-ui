<script lang="ts">
  import TransactionCart from '$lib/components/TransactionCart.svelte';
  // 1. Impor komponen baru kita
  import TransactionHistory from '$lib/components/TransactionHistory.svelte';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  let transactions: any[] = [];
  let isLoading = true;

  onMount(async () => {
    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const response = await fetch(`${baseUrl}/transactions/me/today`, { headers });
      if (response.ok) {
        const data = await response.json();
        transactions = data.sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
      } else {
        transactions = [];
      }
    } catch (error) {
      console.error('Error saat fetch data riwayat:', error);
    } finally {
      isLoading = false;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };
</script>

<div class="flex h-screen w-full overflow-hidden">
  <main class="flex flex-grow flex-col p-4 md:p-8">
    <header class="mb-4 flex flex-shrink-0 items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Barbersh.OP</h1>
      <nav class="flex items-center gap-6">
        <a href="/cashier" class="pb-2 font-semibold text-slate-500 hover:text-violet-600">
          Produk & Layanan
        </a>
        <a href="/cashier/history" class="border-b-2 border-violet-600 pb-2 font-semibold text-violet-600">
          Riwayat Transaksi
        </a>
        <button
          on:click={handleLogout}
          class="rounded-full bg-red-100 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-200"
        >
          Logout
        </button>
      </nav>
    </header>

    <div class="flex flex-grow overflow-hidden mt-6">
      <div class="flex-grow overflow-y-auto pr-4">
        {#if isLoading}
          <div class="text-center py-16 bg-white rounded-lg shadow-sm border">
            <p class="text-slate-500">Memuat riwayat transaksi...</p>
          </div>
        {:else}
          <!-- 2. Panggil komponen baru dan kirim datanya -->
          <TransactionHistory transactions={transactions} />
        {/if}
      </div>
    </div>
  </main>

  <aside class="flex-shrink-0">
    <TransactionCart />
  </aside>
</div>