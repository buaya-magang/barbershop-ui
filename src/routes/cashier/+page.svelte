<script lang="ts">
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import TransactionCart from '$lib/components/TransactionCart.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let searchQuery = '';

  $: filteredItems = data.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="flex h-full w-full flex-col lg:flex-row gap-6">
  
  <!-- Kolom Produk -->
  <div class="flex flex-grow flex-col gap-4">
    
    <div class="flex-shrink-0">
      <input
        type="text"
        placeholder="Cari produk atau layanan..."
        bind:value={searchQuery}
        class="w-full rounded-lg border border-slate-300 bg-white p-4"
      />
    </div>
    
    <div class="flex-grow overflow-y-auto pr-2">
      <ProductGrid items={filteredItems} />
    </div>

  </div>

  <!-- Sidebar / Cart -->
  <aside class="w-full lg:w-[350px] flex-shrink-0">
    <TransactionCart />
  </aside>

</div>
