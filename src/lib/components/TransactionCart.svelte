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
          <button class="text-red-500 hover:text-red-700 font-bold text-xl">&minus;</button>
        </div>
      `
      )
      .join('');

    const { value: formValues } = await Swal.fire({
      width: '50rem',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Done',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'p-8 rounded-2xl',
        confirmButton: 'px-6 py-3 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700',
        cancelButton: 'px-6 py-3 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200',
        actions: 'gap-4 w-full flex justify-end mt-8',
      },
      buttonsStyling: false,
      html: `
        <div class="flex gap-12 text-left">
          <div class="w-1/2">
            ${itemsHtml}
            <hr class="my-4"/>
            <div class="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>
          <div class="w-1/2 flex flex-col gap-6">
            <div class="flex flex-col">
              <label for="swal-payment-method" class="mb-2 font-semibold text-slate-700">Metode Pembayaran</label>
              <select id="swal-payment-method" class="w-full p-3 border rounded-lg border-slate-300">
                <option value="Tunai" selected>Cash</option>
                <option value="QRIS">QRIS</option>
                <option value="Kartu">Card</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="swal-payment-status" class="mb-2 font-semibold text-slate-700">Status Pembayaran</label>
              <select id="swal-payment-status" class="w-full p-3 border rounded-lg border-slate-300">
                <option value="Lunas" selected>Lunas</option>
                <option value="Pending">Belum Lunas</option>
              </select>
            </div>
          </div>
        </div>
      `,
      preConfirm: () => {
        const paymentMethod = (document.getElementById('swal-payment-method') as HTMLSelectElement).value;
        const paymentStatus = (document.getElementById('swal-payment-status') as HTMLSelectElement).value;
        return { paymentMethod, paymentStatus };
      },
    });

    if (formValues) {
      const token = localStorage.getItem('accessToken');
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

      // --- PERBAIKAN UTAMA ADA DI SINI ---

      // 1. Siapkan array item sesuai skema TransactionItemCreate
      const itemsForApi = $cart.map((item: any) => ({
        item_id: String(item.id),
        item_type: item.type,
        quantity: item.quantity
      }));

      // 2. Buat payload dengan NAMA FIELD 'items' YANG BENAR
      const payload = {
        items: itemsForApi, // <-- INI PERBAIKANNYA
        payment_method: formValues.paymentMethod,
        payment_status: formValues.paymentStatus
      };
      
      // --- AKHIR PERBAIKAN ---

      try {
        const response = await fetch(`${baseUrl}/transactions/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await Swal.fire('Berhasil!', 'Transaksi telah berhasil disimpan.', 'success');
          cart.reset();
        } else {
          const errorData = await response.json();
          let errorHtml = 'Gagal menyimpan transaksi.';
          if (errorData.detail && Array.isArray(errorData.detail)) {
              errorHtml = errorData.detail.map((e: any) => `<li>${e.loc.join(' &rarr; ')}: ${e.msg}</li>`).join('');
              errorHtml = `<ul class="text-left text-sm pl-5">${errorHtml}</ul>`;
          } else if (errorData.detail) {
              errorHtml = errorData.detail;
          }
          await Swal.fire({title: 'Gagal Validasi!', html: errorHtml, icon: 'error'});
        }
      } catch (error) {
        await Swal.fire('Error!', 'Terjadi masalah koneksi.', 'error');
      }
    }
  };
</script>

<div class="flex flex-col h-screen w-[350px] bg-slate-50 border-l border-slate-200 p-4">
  <div class="flex items-center justify-between p-4 mb-4 font-semibold bg-white rounded-lg">
    <span>Barberman</span>
    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
  </div>
  <div class="pr-2 overflow-y-auto flex-grow">
    {#if $cart.length === 0}
      <p class="mt-8 text-center text-slate-400">Keranjang masih kosong</p>
    {:else}
      {#each $cart as item (item.id)}
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-col">
            <span class="font-medium text-slate-800">{item.name}</span>
            <span class="text-sm text-slate-500">{item.quantity} x {formatCurrency(item.price)}</span>
          </div>
          <button
            class="flex items-center justify-center w-6 h-6 font-bold text-red-500 transition bg-red-100 rounded-full hover:bg-red-200"
            on:click={() => cart.removeItem(item.id)}
          >
            -
          </button>
        </div>
      {/each}
    {/if}
  </div>
  <div class="pt-4 mt-auto border-t border-slate-200">
    <div class="flex items-center justify-between mb-4">
      <span class="text-lg font-bold text-slate-800">TOTAL</span>
      <span class="text-lg font-bold text-slate-800">{formatCurrency(total)}</span>
    </div>
    <button
      class="w-full p-4 font-bold text-white transition rounded-lg bg-violet-600 hover:bg-violet-700"
      on:click={handleTransaction}
    >
      TRANSAKSI
    </button>
  </div>
</div>

<style>
  :global(.swal2-select) {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
</style>