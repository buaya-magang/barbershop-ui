<script lang="ts">
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import TransactionCart from '$lib/components/TransactionCart.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let searchQuery = '';

  // Filter produk sesuai input search
  $: filteredItems = data.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="flex h-full w-full flex-col lg:flex-row gap-6">
  <!-- Kolom Produk -->
  <div class="flex flex-grow flex-col gap-4 px-4">
    <!-- Search -->
    <input
      type="text"
      placeholder="Cari produk atau layanan..."
      bind:value={searchQuery}
      class="w-full rounded-lg border border-slate-300 bg-white p-3"
    />

    <!-- Grid Produk dengan scroll sendiri -->
    <div class="flex-1 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
      <ProductGrid items={filteredItems} />
    </div>
  </div>

  <!-- Sidebar / Cart -->
  <aside class="w-full lg:w-[350px] flex-shrink-0 px-4 lg:px-0">
    <TransactionCart />
  </aside>
</div>