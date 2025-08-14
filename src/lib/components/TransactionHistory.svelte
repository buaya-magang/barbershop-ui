<script lang="ts">
  import { slide } from 'svelte/transition';

  export let transactions: any[] = [];

  let openCardId: string | null = null;

  function toggleCard(id: string) {
    openCardId = openCardId === id ? null : id;
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  }

  function formatDate(dateString: string) {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta'
      }).format(new Date(dateString));
    } catch (e) {
      return "Format tanggal salah";
    }
  }
</script>

<div class="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
  <table class="min-w-full text-sm">
    <thead class="bg-slate-50">
      <tr>
        <th class="p-4 text-left font-semibold text-slate-600">ID Transaksi</th>
        <th class="p-4 text-left font-semibold text-slate-600">Tanggal</th>
        <th class="p-4 text-left font-semibold text-slate-600">Total</th>
        <th class="w-12 p-4"></th> </tr>
    </thead>
    <tbody>
      {#if transactions.length > 0}
        {#each transactions as trx (trx.id)}
          <tr class="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" on:click={() => toggleCard(trx.id)}>
            <td class="p-4 font-mono text-slate-700">#{trx.id.substring(0, 8).toUpperCase()}</td>
            <td class="p-4 text-slate-500">{formatDate(trx.transaction_date)}</td>
            <td class="p-4 font-semibold text-slate-800">{formatCurrency(trx.total_bill)}</td>
            <td class="p-4 text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                class="w-5 h-5 text-slate-400 transition-transform duration-200"
                class:rotate-180={openCardId === trx.id}
              >
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </td>
          </tr>

          {#if openCardId === trx.id}
            <tr class="bg-slate-50">
              <td colspan="4" class="p-4" transition:slide={{ duration: 200 }}>
                <h3 class="text-sm font-semibold mb-2 text-slate-600">Detail Item:</h3>
                <ul class="list-disc pl-5 space-y-1 text-slate-600">
                  {#each trx.details as detail}
                    <li>
                      {detail.quantity}x (ID: {detail.service_id || detail.product_id}) @ {formatCurrency(detail.price_at_transaction)}
                    </li>
                  {/each}
                </ul>
              </td>
            </tr>
          {/if}
        {/each}
      {:else}
        <tr>
          <td colspan="4" class="text-center p-16 text-slate-500">
            Belum ada riwayat transaksi.
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>