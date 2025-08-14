<script lang="ts">
  import type { PageData } from './$types';
  import Swal from 'sweetalert2';
  import { invalidateAll } from '$app/navigation';

  export let data: PageData;

  // Variabel state untuk form
  let newUsername = '';
  let newPassword = '';
  let newRole = 'barberman'; // Default role
  let isLoading = false;

  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

  const addUser = async () => {
    if (!newUsername || !newPassword || !newRole) {
      Swal.fire('Error', 'Semua kolom harus diisi.', 'error');
      return;
    }
    isLoading = true;

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${baseUrl}/users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      });

      if (response.ok) {
        Swal.fire('Berhasil!', 'Pengguna baru telah ditambahkan.', 'success');
        newUsername = '';
        newPassword = '';
        newRole = 'barberman';
        await invalidateAll();
      } else {
        const errorData = await response.json();
        Swal.fire('Gagal', errorData.detail || 'Gagal menambahkan pengguna.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi masalah koneksi.', 'error');
    } finally {
      isLoading = false;
    }
  };

  const deleteUser = async (userId: number, username: string) => {
    if (username === 'admin') {
        Swal.fire('Tidak Diizinkan', 'Pengguna "admin" tidak dapat dihapus.', 'error');
        return;
    }

    const result = await Swal.fire({
        title: `Anda yakin ingin menghapus "${username}"?`,
        text: "Tindakan ini tidak dapat dibatalkan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${baseUrl}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                await Swal.fire('Dihapus!', `Pengguna "${username}" telah dihapus.`, 'success');
                await invalidateAll();
            } else {
                const errorData = await response.json();
                await Swal.fire('Gagal!', errorData.detail || 'Gagal menghapus pengguna.', 'error');
            }
        } catch (error) {
            await Swal.fire('Error!', 'Terjadi masalah koneksi.', 'error');
        }
    }
  };
</script>

<div class="p-8">
  <h1 class="text-3xl font-bold mb-6 text-slate-800">Manajemen Pengguna</h1>

  <div class="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 class="text-xl font-semibold mb-4">Tambah Pengguna Baru</h2>
    <form class="grid grid-cols-1 md:grid-cols-4 gap-4" on:submit|preventDefault={addUser}>
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input bind:value={newUsername} type="text" id="username" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input bind:value={newPassword} type="password" id="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
      </div>
      <div>
        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
        <select bind:value={newRole} id="role" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2">
            <option value="barberman">Barberman</option>
            <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={isLoading} class="self-end px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-400">
        {#if isLoading}Menyimpan...{:else}Tambah{/if}
      </button>
    </form>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Daftar Pengguna</h2>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each data.users as user (user.id)}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button on:click={() => deleteUser(user.id, user.username)} class="text-red-600 hover:text-red-900">Hapus</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>