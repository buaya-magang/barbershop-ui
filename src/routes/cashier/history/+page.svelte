<script lang="ts">
  import TransactionCart from '$lib/components/TransactionCart.svelte';
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
            new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
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
  <div class="flex-grow overflow-y-auto pr-4">
    {#if isLoading}
      <div class="text-center py-16 bg-white rounded-lg shadow-sm border">
        <p class="text-slate-500">Memuat riwayat transaksi...</p>
      </div>
    {:else}
      <TransactionHistory transactions={transactions} />
    {/if}
  </div>

  <aside class="flex-shrink-0">
    <TransactionCart />
  </aside>
</div>
