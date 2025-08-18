<script lang="ts">
  import { cart } from '$lib/stores';
  import Swal from 'sweetalert2';
  import { invalidateAll } from '$app/navigation';

  $: total = $cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleTransaction = async () => {
    if ($cart.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Keranjang Kosong',
        text: 'Silakan pilih produk atau layanan.',
      });
      return;
    }

    const itemsHtml = $cart
      .map(
        (item: any) => `
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="font-semibold text-slate-800">${item.name}</p>
            <p class="text-sm text-slate-500">${item.quantity} x ${formatCurrency(item.price)}</p>
          </div>
        </div>
      `
      )
      .join('');

      const { value: formValues } = await Swal.fire({
          width: '42rem',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Done',
          cancelButtonText: 'Cancel',
          customClass: {
              popup: 'p-8 rounded-2xl shadow-lg',
              // Memberi jarak atas dari garis pemisah
              actions: 'gap-4 w-full flex justify-center pt-6', 
              confirmButton:
                  'px-8 py-3 text-sm font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700',
              cancelButton:
                  'px-8 py-3 text-sm font-bold text-red-600 bg-red-100 rounded-lg hover:bg-red-200'
          },
          buttonsStyling: false,
          // --- PERBAIKAN UTAMA PADA STRUKTUR HTML ---
          html: `
              <div class="border-b border-slate-200 pb-6">
                  <div class="grid grid-cols-2 gap-8 text-left">
                      <div class="flex flex-col">
                          <div class="flex-grow space-y-3 pr-4" style="max-height: 250px; overflow-y: auto;">
                              ${itemsHtml}
                          </div>
                          <hr class="my-4"/>
                          <div class="flex justify-between text-lg font-bold text-slate-800">
                              <span>TOTAL</span>
                              <span>${formatCurrency(total)}</span>
                          </div>
                      </div>

                      <div class="flex flex-col gap-6 pt-1">
                          <div>
                              <label for="swal-payment-method" class="mb-2 block font-semibold text-slate-700">Metode Pembayaran</label>
                              <select id="swal-payment-method" class="w-full rounded-lg border border-slate-300 p-3 swal2-select">
                                  <option value="Cash" selected>Cash</option>
                                  <option value="QRIS">QRIS</option>
                                  <option value="Card">Card</option>
                              </select>
                          </div>
                          <div>
                              <label for="swal-payment-status" class="mb-2 block font-semibold text-slate-700">Status Pembayaran</label>
                              <select id="swal-payment-status" class="w-full rounded-lg border border-slate-300 p-3 swal2-select">
                                  <option value="Lunas" selected>Lunas</option>
                                  <option value="Pending">Belum Lunas</option>
                              </select>
                          </div>
                      </div>
                  </div>
              </div>
            `,
          // --- AKHIR PERBAIKAN ---
          preConfirm: () => {
              const paymentMethod = (document.getElementById('swal-payment-method') as HTMLSelectElement)
                  .value;
              const paymentStatus = (document.getElementById('swal-payment-status') as HTMLSelectElement)
                  .value;
              return { paymentMethod, paymentStatus };
          }
      });

    if (formValues) {
      const token = localStorage.getItem('accessToken');
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

      const itemsForApi = $cart.map((item: any) => ({
        item_id: String(item.id),
        item_type: item.type,
        quantity: item.quantity,
      }));

      const payload = {
        items: itemsForApi,
        payment_method: formValues.paymentMethod,
        payment_status: formValues.paymentStatus,
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
      }
    }
  };
</script>

<div class="flex h-full flex-col border-l border-slate-200 bg-slate-50 p-4">
  <div class="flex-grow overflow-y-auto pr-2">
    {#if $cart.length === 0}
      <p class="mt-8 text-center text-slate-400">Keranjang masih kosong</p>
    {:else}
      {#each $cart as item (item.id)}
        <div class="mb-4 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">{item.name}</span>
            <span class="text-sm text-slate-500"
              >{item.quantity} x {formatCurrency(item.price)}</span
            >
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
      on:click={handleTransaction}
      disabled={$cart.length === 0}
    >
      TRANSAKSI
    </button>
  </div>
</div>

<style>
  :global(.swal2-select) {
    /* Menghilangkan tampilan default browser yang kaku */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    /* Memberi gaya yang konsisten dengan input lain di aplikasi Anda */
    background-color: #ffffff; /* bg-white */
    font-size: 1rem; /* text-base */
    line-height: 1.5rem;
    color: #334155; /* text-slate-700 */
    
    /* Menambahkan ikon panah kustom (ini sudah Anda miliki) */
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem; /* Memberi ruang untuk ikon panah */

    /* Menambahkan transisi agar lebih mulus */
    transition: all 0.2s ease-in-out;
  }

  /* Efek saat dropdown di-klik (fokus) */
  :global(.swal2-select:focus) {
    outline: 2px solid transparent;
    outline-offset: 2px;
    /* Memberi efek cincin ungu yang sama seperti input login Anda */
    border-color: #8b5cf6; /* a violet color */
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.4); 
  }
</style>