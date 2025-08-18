<script lang="ts">
  import TransactionHistory from '$lib/components/TransactionHistory.svelte';
  import { onMount } from 'svelte';

  let transactions: any[] = [];
  let isLoading = true;

  onMount(async () => {
    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await fetch(`${baseUrl}/transactions/me/today`, { headers });
      if (response.ok) {
        const data = await response.json();
        transactions = data.sort(
          (a: any, b: any) =>
            new Date(b.transaction_date).getTime() -
            new Date(a.transaction_date).getTime()
        );
      } else {
        transactions = [];
      }
    } catch (error) {
      console.error('Error saat fetch data riwayat:', error);
    } finally {
      isLoading = false;
    }
  });
</script>

<!-- Layout.svelte sudah handle header & main wrapper -->
<div class="flex h-full overflow-hidden">
  <div class="flex-grow overflow-y-auto p-4">
    {#if isLoading}
      <div class="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow border border-slate-200">
        <!-- Spinner -->
        <svg class="animate-spin h-8 w-8 text-slate-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p class="text-slate-500">Memuat riwayat transaksi...</p>
      </div>
    {:else}
      <TransactionHistory transactions={transactions} />
    {/if}
  </div>
</div>