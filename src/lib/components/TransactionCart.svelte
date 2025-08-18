<script lang="ts">
  import { cart } from '$lib/stores';
  import { invalidateAll } from '$app/navigation';
  import Swal from 'sweetalert2';
  import { fade } from 'svelte/transition';

  // --- State untuk Komponen ---
  let showModal = false; // Mengontrol visibilitas modal
  $: total = $cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- State untuk Form di Dalam Modal ---
  let paymentMethod = 'Cash';
  let paymentStatus = 'Lunas';
  let isLoading = false; // State untuk loading saat menyimpan

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Fungsi ini dipanggil oleh tombol "TRANSAKSI" utama
  const openCheckoutModal = () => {
    if ($cart.length === 0) {
      Swal.fire('Keranjang Kosong', 'Silakan pilih produk atau layanan.', 'error');
      return;
    }
    // Reset pilihan setiap kali modal dibuka
    paymentMethod = 'Cash';
    paymentStatus = 'Lunas';
    showModal = true;
  };

  // Fungsi ini dipanggil oleh tombol "Done" di dalam modal
  const handleSaveTransaction = async () => {
    isLoading = true; // Mulai loading

    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

    const itemsForApi = $cart.map((item: any) => ({
      item_id: String(item.id),
      item_type: item.type,
      quantity: item.quantity,
    }));

    const payload = {
      items: itemsForApi,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
    };

    try {
      const response = await fetch(`${baseUrl}/transactions/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showModal = false; // Tutup modal jika berhasil
        Swal.fire('Berhasil!', 'Transaksi telah berhasil disimpan.', 'success');
        cart.reset();
        await invalidateAll();
      } else {
        const errorData = await response.json();
        let errorHtml = 'Gagal menyimpan transaksi.';
        if (errorData.detail && Array.isArray(errorData.detail)) {
          errorHtml = errorData.detail
            .map((e: any) => `<li>${e.loc.join(' &rarr; ')}: ${e.msg}</li>`)
            .join('');
          errorHtml = `<ul class="text-left text-sm pl-5">${errorHtml}</ul>`;
        } else if (errorData.detail) {
          errorHtml = errorData.detail;
        }
        await Swal.fire({ title: 'Gagal Validasi!', html: errorHtml, icon: 'error' });
      }
    } catch (error) {
      await Swal.fire('Error!', 'Terjadi masalah koneksi.', 'error');
    } finally {
      isLoading = false; // Hentikan loading
    }
  };
</script>

{#if showModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    on:click={() => (showModal = false)}
    transition:fade={{ duration: 200 }}
  >
    <div
      class="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl"
      on:click|stopPropagation
      transition:fade={{ duration: 200, y: 20 }}
    >
      <div class="grid grid-cols-2 gap-8">
        <div class="flex flex-col">
          <div class="flex-grow space-y-3 overflow-y-auto pr-4" style="max-height: 300px;">
            {#each $cart as item (item.id)}
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-slate-800">{item.name}</p>
                  <p class="text-sm text-slate-500">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
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
              on:click={() => (showModal = false)}
              class="rounded-lg bg-red-100 px-8 py-3 font-bold text-red-600 transition hover:bg-red-200"
              disabled={isLoading}
            >
              &#x2715; Cancel
            </button>
            <button
              on:click={handleSaveTransaction}
              class="rounded-lg bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-700 disabled:bg-violet-400"
              disabled={isLoading}
            >
              {#if isLoading}
                <span>Menyimpan...</span>
              {:else}
                <span>&#36; Done</span>
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="flex h-full flex-col border-l border-slate-200 bg-slate-50 p-4">
  <div class="flex-grow overflow-y-auto pr-2">
    {#if $cart.length === 0}
      <p class="mt-8 text-center text-slate-400">Keranjang masih kosong</p>
    {:else}
      {#each $cart as item (item.id)}
        <div class="mb-4 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">{item.name}</span>
            <span class="text-sm text-slate-500">{item.quantity} x {formatCurrency(item.price)}</span>
          </div>
          <button
            class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 font-bold text-red-500 transition hover:bg-red-200"
            on:click={() => cart.removeItem(item.id)}
          >
            -
          </button>
        </div>
      {/each}
    {/if}
  </div>
  <div class="mt-auto border-t border-slate-200 pt-4">
    <div class="mb-4 flex items-center justify-between">
      <span class="text-lg font-bold text-slate-800">TOTAL</span>
      <span class="text-lg font-bold text-slate-800">{formatCurrency(total)}</span>
    </div>
    <button
      class="w-full rounded-lg bg-violet-600 p-4 font-bold text-white transition hover:bg-violet-700 disabled:bg-slate-400"
      on:click={openCheckoutModal}
      disabled={$cart.length === 0}
    >
      TRANSAKSI
    </button>
  </div>
</div>