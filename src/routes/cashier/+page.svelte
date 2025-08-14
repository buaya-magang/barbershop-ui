<script lang="ts">
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import TransactionCart from '$lib/components/TransactionCart.svelte';
  import type { PageData } from './$types'; // <-- DITAMBAHKAN

  // Menerima 'data' yang dikirim dari load function di +page.ts
  export let data: PageData; // <-- DITAMBAHKAN

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };
</script>

<div class="flex h-screen w-full overflow-hidden">
  <main class="flex flex-grow flex-col p-4 md:p-8">
    <header class="mb-4 flex flex-shrink-0 items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800">Barbersh.OP</h1>
      <nav class="flex items-center gap-6">
        <a href="/cashier" class="border-b-2 border-violet-600 pb-2 font-semibold text-violet-600">
            Produk & Layanan
        </a>
        <a href="/cashier/history" class="pb-2 font-semibold text-slate-500 hover:text-violet-600">
            Riwayat Transaksi
        </a>
        <button
            on:click={handleLogout}
            class="rounded-full bg-red-100 px-6 py-3 font-semibold text-red-600 transition hover:bg-red-200"
        >
            Logout
        </button>
      </nav>
    </header>

    <div class="mb-4 flex-shrink-0">
      <input
        type="text"
        placeholder="Cari produk atau layanan..."
        class="w-full rounded-lg border border-slate-300 bg-white p-4"
      />
    </div>
    <ProductGrid items={data.items} />
  </main>

  <aside class="flex-shrink-0">
    <TransactionCart />
  </aside>
</div>