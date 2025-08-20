<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let loggedInUser: { role: string; sub: string } | null = null;

  onMount(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        loggedInUser = {
          role: payload.role,
          sub: payload.sub
        };
      } catch (e) {
        console.error('Gagal decode token:', e);
        handleLogout();
      }
    } else {
      goto('/login');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    goto('/login');
  };
</script>

<div class="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
  <header class="w-full flex-shrink-0 bg-white p-4 shadow-sm md:px-8">
    <div class="mx-auto flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Barbersh.OP</h1>

      <!-- Menu Admin -->
      <nav class="hidden items-center gap-6 md:flex">
        <a 
          href="/admin/services" 
          class="pb-2 font-semibold transition"
          class:border-b-2={$page.url.pathname.startsWith('/admin/services')}
          class:border-violet-600={$page.url.pathname.startsWith('/admin/services')}
          class:text-violet-600={$page.url.pathname.startsWith('/admin/services')}
          class:text-slate-500={!$page.url.pathname.startsWith('/admin/services')}
          class:hover:text-violet-600={!$page.url.pathname.startsWith('/admin/services')}
        >
          Dashboard Layanan
        </a>

        <a 
          href="/admin/products" 
          class="pb-2 font-semibold transition"
          class:border-b-2={$page.url.pathname.startsWith('/admin/products')}
          class:border-violet-600={$page.url.pathname.startsWith('/admin/products')}
          class:text-violet-600={$page.url.pathname.startsWith('/admin/products')}
          class:text-slate-500={!$page.url.pathname.startsWith('/admin/products')}
          class:hover:text-violet-600={!$page.url.pathname.startsWith('/admin/products')}
        >
          Dashboard Produk
        </a>

        <a 
          href="/admin/users" 
          class="pb-2 font-semibold transition"
          class:border-b-2={$page.url.pathname.startsWith('/admin/users')}
          class:border-violet-600={$page.url.pathname.startsWith('/admin/users')}
          class:text-violet-600={$page.url.pathname.startsWith('/admin/users')}
          class:text-slate-500={!$page.url.pathname.startsWith('/admin/users')}
          class:hover:text-violet-600={!$page.url.pathname.startsWith('/admin/users')}
        >
          Dashboard Pengguna
        </a>
      </nav>

      <!-- Profil + Logout -->
      <div class="flex items-center gap-4">
        {#if loggedInUser}
          <div class="flex items-center gap-3 rounded-full bg-white p-2 pr-4 shadow-inner ring-1 ring-slate-200">
            <span class="relative flex h-3 w-3">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <div class="flex flex-col text-right">
              <span class="text-sm font-semibold capitalize text-slate-700">{loggedInUser.sub}</span>
            </div>
          </div>
        {/if}
        <button
          on:click={handleLogout}
          class="hidden rounded-full bg-red-100 px-6 py-2 font-semibold text-red-600 transition hover:bg-red-200 sm:block"
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