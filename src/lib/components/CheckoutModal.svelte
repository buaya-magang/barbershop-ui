<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  // Menerima data dari komponen induk
  export let cart: any[];
  export let total: number;

  // Variabel lokal untuk menyimpan pilihan
  let paymentMethod = 'Cash'; // Nilai default
  let paymentStatus = 'Lunas'; // Nilai default

  const dispatch = createEventDispatcher();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  // Fungsi ini akan dijalankan saat tombol "Done" diklik
  const handleConfirm = () => {
    // Kirim data pilihan kembali ke komponen induk
    dispatch('confirm', {
      paymentMethod,
      paymentStatus,
    });
  };
  
  // Fungsi ini akan dijalankan saat tombol "Cancel" atau area luar diklik
  const handleCancel = () => {
    dispatch('cancel');
  };
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  on:click={handleCancel}
  transition:fade={{ duration: 200 }}
>
  <div
    class="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl"
    on:click|stopPropagation
    transition:fade={{ duration: 200, y: 20 }}
  >
    <div class="grid grid-cols-2 gap-8">
      <div class="flex flex-col">
        <div class="flex-grow space-y-3 overflow-y-auto pr-4">
          {#each cart as item (item.id)}
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-slate-800">{item.name}</p>
                <p class="text-sm text-slate-500">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <button class="text-lg font-bold text-red-400 hover:text-red-600">&minus;</button>
            </div>
          {/each}
        </div>
        <hr class="my-4" />
        <div class="flex justify-between text-lg font-bold text-slate-800">
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <div class="space-y-6">
          <div>
            <label class="mb-2 block font-semibold text-slate-700">Metode Pembayaran</label>
            <select bind:value={paymentMethod} class="w-full rounded-lg border border-slate-300 p-3">
              <option value="Cash">Cash</option>
              <option value="QRIS">QRIS</option>
              <option value="Card">Card</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block font-semibold text-slate-700">Status Pembayaran</label>
            <select bind:value={paymentStatus} class="w-full rounded-lg border border-slate-300 p-3">
              <option value="Lunas">Lunas</option>
              <option value="Pending">Belum Lunas</option>
            </select>
          </div>
        </div>
        
        <div class="mt-8 flex justify-end gap-4">
          <button
            on:click={handleCancel}
            class="rounded-lg bg-red-100 px-8 py-3 font-bold text-red-600 transition hover:bg-red-200"
          >
            &#x2715; Cancel
          </button>
          <button
            on:click={handleConfirm}
            class="rounded-lg bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-700"
          >
            &#36; Done
          </button>
        </div>
      </div>
    </div>
  </div>
</div>