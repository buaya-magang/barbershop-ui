<script lang="ts">
  import { slide } from 'svelte/transition';

  export let transactions: any[] = [];

  let openCardId: string | null = null;

  function toggleCard(id: string) {
    openCardId = openCardId === id ? null : id;
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  }

  function formatDate(dateString: string) {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta"
      }).format(new Date(dateString));
    } catch (e) {
      return "Format tanggal salah";
    }
  }
</script>

<div class="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
  <table class="min-w-full text-sm">
    <thead class="bg-slate-100 border-b border-slate-200">
      <tr>
        <th class="p-4 text-left font-semibold text-slate-700 uppercase text-xs">ID Transaksi</th>
        <th class="p-4 text-left font-semibold text-slate-700 uppercase text-xs">Tanggal</th>
        <th class="p-4 text-left font-semibold text-slate-700 uppercase text-xs">Total</th>
        <th class="w-12 p-4"></th>
      </tr>
    </thead>
    <tbody>
      {#if transactions.length > 0}
        {#each transactions as trx (trx.id)}
          <tr 
            class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
            on:click={() => toggleCard(trx.id)}
          >
            <td class="p-4 font-mono text-slate-800">#{trx.id.substring(0, 8).toUpperCase()}</td>
            <td class="p-4 text-slate-500">{formatDate(trx.transaction_date)}</td>
            <td class="p-4 font-semibold text-slate-800">{formatCurrency(trx.total_bill)}</td>
            <td class="p-4 text-center">
              <div class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  class="w-5 h-5 text-slate-500 transition-transform duration-200"
                  class:rotate-180={openCardId === trx.id}
                >
                  <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </div>
            </td>
          </tr>

          {#if openCardId === trx.id}
            <tr class="bg-slate-50">
              <td colspan="4" class="p-4" transition:slide={{ duration: 200 }}>
                <h3 class="text-sm font-semibold mb-3 text-slate-700">Detail Item</h3>
                <div class="grid gap-2">
                  {#each trx.details as detail}
                    <div class="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm border text-slate-700">
                      <span>{detail.quantity}x (ID: {detail.service_id || detail.product_id})</span>
                      <span class="font-medium">{formatCurrency(detail.price_at_transaction)}</span>
                    </div>
                  {/each}
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      {:else}
        <tr>
          <td colspan="4" class="text-center py-16 text-slate-500">
            <div class="flex flex-col items-center space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 118 0v2m-6 4h4" />
              </svg>
              <p class="font-medium">Belum ada riwayat transaksi</p>
            </div>
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
