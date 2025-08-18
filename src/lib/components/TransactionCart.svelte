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
      // --- PERBAIKAN LEBAR MODAL ---
      width: '36rem', // Mengurangi lebar agar lebih pas untuk 1 kolom
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
      // --- PEROMBAKAN TOTAL LAYOUT HTML ---
      html: `
        <div class="w-full text-left">
          <div>
            ${itemsHtml}
            <hr class="my-4"/>
            <div class="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-4">
              <div>
                <label for="swal-payment-method" class="mb-2 block font-semibold text-slate-700">Metode Pembayaran</label>
                <select id="swal-payment-method" class="w-full p-3 border rounded-lg border-slate-300 swal2-select">
                  <option value="Tunai" selected>Cash</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Kartu">Card</option>
                </select>
              </div>
              <div>
                <label for="swal-payment-status" class="mb-2 block font-semibold text-slate-700">Status Pembayaran</label>
                <select id="swal-payment-status" class="w-full p-3 border rounded-lg border-slate-300 swal2-select">
                  <option value="Lunas" selected>Lunas</option>
                  <option value="Pending">Belum Lunas</option>
                </select>
              </div>
          </div>
        </div>
      `,
      // --- AKHIR PEROMBAKAN ---
      preConfirm: () => {
        const paymentMethod = (document.getElementById('swal-payment-method') as HTMLSelectElement).value;
        const paymentStatus = (document.getElementById('swal-payment-status') as HTMLSelectElement).value;
        return { paymentMethod, paymentStatus };
      },
    });

    if (formValues) {
      // Sisa logika untuk mengirim ke API tetap sama...
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
  </div>

<style>
  /* Style global tidak perlu diubah */
</style>