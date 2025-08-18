<script lang="ts">
  import { cart } from '$lib/stores';
  import { invalidateAll } from '$app/navigation';
  import Swal from 'sweetalert2'; // Masih dipakai untuk notifikasi final
  import CheckoutModal from './CheckoutModal.svelte'; // <-- 1. Impor komponen modal baru

  let showModal = false; // <-- 2. Variabel untuk menampilkan/menyembunyikan modal

  $: total = $cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  // 3. Fungsi ini sekarang hanya untuk menampilkan modal
  const handleCheckout = () => {
    if ($cart.length === 0) {
      Swal.fire('Keranjang Kosong', 'Silakan pilih produk atau layanan.', 'error');
      return;
    }
    showModal = true;
  };

  // 4. Logika untuk menyimpan transaksi dipindahkan ke sini
  const handleSaveTransaction = async (event: any) => {
    showModal = false; // Tutup modal
    const formValues = event.detail; // Ambil data dari modal
    
    // Sisa logika untuk mengirim ke API... (sama seperti sebelumnya)
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
        // Tetap gunakan Swal untuk notifikasi final yang simpel
        Swal.fire('Berhasil!', 'Transaksi telah berhasil disimpan.', 'success');
        cart.reset();
        await invalidateAll();
      } else {
        // Logika error tetap sama
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
  };

</script>

{#if showModal}
  <CheckoutModal 
    {cart} 
    {total} 
    on:confirm={handleSaveTransaction} 
    on:cancel={() => (showModal = false)} 
  />
{/if}

<div class="flex h-full flex-col border-l border-slate-200 bg-slate-50 p-4">
  <div class="flex-grow overflow-y-auto pr-2">
    </div>
  <div class="mt-auto border-t border-slate-200 pt-4">
    <button
      class="w-full rounded-lg bg-violet-600 p-4 font-bold text-white transition hover:bg-violet-700 disabled:bg-slate-400"
      on:click={handleCheckout}
      disabled={$cart.length === 0}
    >
      TRANSAKSI
    </button>
  </div>
</div>