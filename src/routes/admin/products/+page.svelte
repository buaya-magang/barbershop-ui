<script lang="ts">
  import type { PageData } from './$types';
  import Swal from 'sweetalert2';
  import { invalidateAll } from '$app/navigation';

  export let data: PageData;

  // Variabel state untuk form tambah produk
  let newProductName: string = '';
  let newProductPrice: number | null = null;
  let newProductStock: number | null = null;
  let isLoading = false;

  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

  const addProduct = async () => {
    if (!newProductName || !newProductPrice || !newProductStock || newProductPrice <= 0 || newProductStock < 0) {
      Swal.fire('Error', 'Nama, harga, dan stok produk harus diisi dengan benar.', 'error');
      return;
    }
    isLoading = true;

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${baseUrl}/products/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProductName, price: newProductPrice, stock: newProductStock }),
      });

      if (response.ok) {
        Swal.fire('Berhasil!', 'Produk baru telah ditambahkan.', 'success');
        newProductName = '';
        newProductPrice = null;
        newProductStock = null;
        await invalidateAll();
      } else {
        const errorData = await response.json();
        Swal.fire('Gagal', errorData.detail || 'Gagal menambahkan produk.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi masalah koneksi.', 'error');
    } finally {
      isLoading = false;
    }
  };

  const deleteProduct = async (productId: number, productName: string) => {
    const result = await Swal.fire({
        title: `Anda yakin ingin menghapus "${productName}"?`,
        text: "Tindakan ini tidak dapat dibatalkan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus saja!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${baseUrl}/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                await Swal.fire('Dihapus!', `Produk "${productName}" telah dihapus.`, 'success');
                await invalidateAll();
            } else {
                const errorData = await response.json();
                await Swal.fire('Gagal!', errorData.detail || 'Gagal menghapus produk.', 'error');
            }
        } catch (error) {
            await Swal.fire('Error!', 'Terjadi masalah koneksi.', 'error');
        }
    }
  };

  const editProduct = async (product: { id: number; name: string; price: number; stock: number }) => {
    const { value: formValues } = await Swal.fire({
        title: `Edit Produk "${product.name}"`,
        width: '45rem',
        html: `
            <div class="flex flex-col gap-4 px-4">
                <input id="swal-input-name" class="swal2-input w-full" placeholder="Nama Produk" value="${product.name}">
                <input id="swal-input-price" class="swal2-input w-full" placeholder="Harga" type="number" value="${product.price}">
                <input id="swal-input-stock" class="swal2-input w-full" placeholder="Stok" type="number" value="${product.stock}">
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Simpan Perubahan',
        cancelButtonText: 'Batal',
        preConfirm: () => {
            const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
            const price = (document.getElementById('swal-input-price') as HTMLInputElement).value;
            const stock = (document.getElementById('swal-input-stock') as HTMLInputElement).value;
            if (!name || !price || !stock || +price <= 0 || +stock < 0) {
                Swal.showValidationMessage(`Nama, harga, dan stok harus diisi dengan benar`);
            }
            return { name, price: +price, stock: +stock };
        }
    });

    if (formValues) {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${baseUrl}/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });
            if (response.ok) {
                await Swal.fire('Tersimpan!', 'Perubahan telah disimpan.', 'success');
                await invalidateAll();
            } else {
                const errorData = await response.json();
                await Swal.fire('Gagal!', errorData.detail || 'Gagal menyimpan perubahan.', 'error');
            }
        } catch (error) {
            await Swal.fire('Error!', 'Terjadi masalah koneksi.', 'error');
        }
    }
  };
</script>

<div class="p-8">
  <h1 class="text-3xl font-bold mb-6 text-slate-800">Manajemen Produk</h1>

  <div class="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 class="text-xl font-semibold mb-4">Tambah Produk Baru</h2>
    <form class="flex items-end gap-4" on:submit|preventDefault={addProduct}>
      <div class="flex-grow">
        <label for="productName" class="block text-sm font-medium text-gray-700">Nama Produk</label>
        <input bind:value={newProductName} type="text" id="productName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
      </div>
      <div class="w-1/4">
        <label for="productPrice" class="block text-sm font-medium text-gray-700">Harga (Rp)</label>
        <input bind:value={newProductPrice} type="number" id="productPrice" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
      </div>
       <div class="w-1/6">
        <label for="productStock" class="block text-sm font-medium text-gray-700">Stok</label>
        <input bind:value={newProductStock} type="number" id="productStock" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
      </div>
      <button type="submit" disabled={isLoading} class="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400">
        {#if isLoading}Menyimpan...{:else}Tambah{/if}
      </button>
    </form>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Daftar Produk</h2>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each data.products as product (product.id)}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button on:click={() => editProduct(product)} class="text-indigo-600 hover:text-indigo-900">Edit</button>
              <button on:click={() => deleteProduct(product.id, product.name)} class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>