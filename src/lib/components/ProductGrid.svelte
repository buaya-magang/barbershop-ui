<script lang="ts">
  import ProductCard from './ProductCard.svelte';

  export let items: any[] = [];
  export let searchQuery: string = '';
</script>

<div class="flex flex-col gap-4">
  <!-- Search -->
  <input
    type="text"
    placeholder="Cari produk atau layanan..."
    bind:value={searchQuery}
    class="w-full rounded-lg border border-slate-300 bg-white p-3"
  />

  <!-- Grid Produk -->
  <div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
    {#each items as item (item.id)}
      <ProductCard product={item} />
    {/each}
  </div>
</div>
