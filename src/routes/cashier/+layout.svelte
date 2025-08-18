<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Variabel untuk menyimpan informasi user yang sedang login
  let loggedInUser: { role: string; sub: string } | null = null;

  // onMount dijalankan setelah komponen dimuat di browser
  onMount(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // Decode token untuk mendapatkan data user (role dan username/sub)
        const payload = JSON.parse(atob(token.split('.')[1]));
        loggedInUser = {
          role: payload.role,
          sub: payload.sub // 'sub' biasanya berisi username atau ID
        };
      } catch (e) {
        console.error('Gagal decode token:', e);
        // Jika token tidak valid, paksa logout
        handleLogout();
      }
    } else {
      // Jika tidak ada token, paksa kembali ke halaman login
      goto('/');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    goto('/');
  };
</script>

<div class="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
  <header class="w-full flex-shrink-0 border-b bg-white p-4 shadow-sm md:px-8">
    <div class="mx-auto flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Barbersh.OP</h1>

      <nav class="hidden items-center gap-6 md:flex">
        <a 
          href="/cashier" 
          class="pb-2 font-semibold transition"
          class:border-b-2={$page.url.pathname === '/cashier'}
          class:border-violet-600={$page.url.pathname === '/cashier'}
          class:text-violet-600={$page.url.pathname === '/cashier'}
          class:text-slate-500={$page.url.pathname !== '/cashier'}
          class:hover:text-violet-600={$page.url.pathname !== '/cashier'}
        >
          Produk & Layanan
        </a>
        <a 
          href="/cashier/history" 
          class="pb-2 font-semibold transition"
          class:border-b-2={$page.url.pathname.startsWith('/cashier/history')}
          class:border-violet-600={$page.url.pathname.startsWith('/cashier/history')}
          class:text-violet-600={$page.url.pathname.startsWith('/cashier/history')}
          class:text-slate-500={!$page.url.pathname.startsWith('/cashier/history')}
          class:hover:text-violet-600={!$page.url.pathname.startsWith('/cashier/history')}
        >
          Riwayat Transaksi
        </a>
      </nav>

      <div class="flex items-center gap-4">
        {#if loggedInUser}
          <div class="flex items-center gap-3 rounded-full bg-white p-2 pr-4 shadow-inner ring-1 ring-slate-200">
            <span class="relative flex h-3 w-3">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <div class="flex flex-col text-right">
              <span class="text-sm font-semibold capitalize text-slate-700">{loggedInUser.sub}</span>
              <span class="text-xs capitalize text-slate-500">{loggedInUser.role}</span>
            </div>
          </div>
        {/if}
        <button
          on:click={handleLogout}
          class="hidden rounded-full bg-red-100 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-200 sm:block"
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <main class="flex-grow overflow-y-auto p-4 md:p-8">
    <slot />
  </main>
</div>