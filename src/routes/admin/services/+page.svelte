<script lang="ts">
  import type { PageData } from './$types';
  import Swal from 'sweetalert2';
  import { invalidateAll } from '$app/navigation';

  export let data: PageData;

  let newServiceName: string = '';
  let newServicePrice: number | null = null;
  let isLoading = false;

  const addService = async () => {
    if (!newServiceName || newServicePrice === null || newServicePrice <= 0) {
      Swal.fire('Error', 'Nama dan harga layanan harus diisi dengan benar.', 'error');
      return;
    }
    isLoading = true;
    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
    try {
      const response = await fetch(`${baseUrl}/services/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newServiceName, price: newServicePrice }),
      });
      if (response.ok) {
        Swal.fire('Berhasil!', 'Layanan baru telah ditambahkan.', 'success');
        newServiceName = '';
        newServicePrice = null;
        await invalidateAll();
      } else {
        const errorData = await response.json();
        Swal.fire('Gagal', errorData.detail || 'Gagal menambahkan layanan.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi masalah koneksi.', 'error');
    } finally {
      isLoading = false;
    }
  };

  const deleteService = async (serviceId: number, serviceName: string) => {
    const result = await Swal.fire({
      title: `Anda yakin ingin menghapus "${serviceName}"?`,
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
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;
      try {
        const response = await fetch(`${baseUrl}/services/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          await Swal.fire(
            'Dihapus!',
            `Layanan "${serviceName}" telah berhasil dihapus.`,
            'success'
          );
          await invalidateAll();
        } else {
          const errorData = await response.json();
          await Swal.fire(
            'Gagal!',
            errorData.detail || 'Gagal menghapus layanan.',
            'error'
          );
        }
      } catch (error) {
        await Swal.fire(
          'Error!',
          'Terjadi masalah koneksi saat mencoba menghapus.',
          'error'
        );
      }
    }
  };

  // --- FUNGSI BARU UNTUK EDIT ---
    const editService = async (service: { id: number; name: string; price: number }) => {
    const { value: formValues } = await Swal.fire({
      title: `Edit Layanan "${service.name}"`,
      width: '45rem',
      
      // --- BAGIAN INI DIPERBAIKI ---
      html: `
        <div class="flex flex-col gap-4 px-4">
          <input 
            id="swal-input-name" 
            class="swal2-input w-full" 
            placeholder="Nama Layanan" 
            value="${service.name}">
          <input 
            id="swal-input-price" 
            class="swal2-input w-full" 
            placeholder="Harga" 
            type="number" 
            value="${service.price}">
        </div>
      `,
      // --- AKHIR PERBAIKAN ---

      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan Perubahan',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
        const price = (document.getElementById('swal-input-price') as HTMLInputElement).value;
        if (!name || !price || +price <= 0) {
          Swal.showValidationMessage(`Nama dan harga harus diisi dengan benar`);
        }
        return { name, price: +price };
      }
    });

    if (formValues) {
      const token = localStorage.getItem('accessToken');
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/services/${service.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: formValues.name, price: formValues.price }),
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
  <h1 class="text-3xl font-bold mb-6 text-slate-800">Manajemen Layanan</h1>

  <div class="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 class="text-xl font-semibold mb-4">Tambah Layanan Baru</h2>
    <form class="flex items-end gap-4" on:submit|preventDefault={addService}>
      <div class="flex-grow">
        <label for="serviceName" class="block text-sm font-medium text-gray-700">Nama Layanan</label>
        <input bind:value={newServiceName} type="text" id="serviceName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2">
      </div>
      <div class="w-1/3">
        <label for="servicePrice" class="block text-sm font-medium text-gray-700">Harga (Rp)</label>
        <input bind:value={newServicePrice} type="number" id="servicePrice" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm p-2">
      </div>
      <button type="submit" disabled={isLoading} class="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400">
        {#if isLoading}Menyimpan...{:else}Tambah{/if}
      </button>
    </form>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Daftar Layanan</h2>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Layanan</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each data.services as service (service.id)}
            <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(service.price)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button on:click={() => editService(service)} class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button on:click={() => deleteService(service.id, service.name)} class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
            </tr>
        {/each}
        </tbody>
    </table>
  </div>
</div>