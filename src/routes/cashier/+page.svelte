<script lang="ts">
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import TransactionCart from '$lib/components/TransactionCart.svelte';
  import type { PageData } from './$types';

  // Menerima 'data' yang dikirim dari load function di +page.ts
  export let data: PageData;
</script>

<div class="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
  <div class="flex flex-col gap-4 lg:col-span-2">
    <div class="flex-shrink-0">
      <input
        type="text"
        placeholder="Cari produk atau layanan..."
        class="w-full rounded-lg border border-slate-300 bg-white p-4"
      />
    </div>
    
    <div class="flex-grow overflow-y-auto">
      <ProductGrid items={data.items} />
    </div>
  </div>

  <aside class="flex-shrink-0 lg:col-span-1">
    <TransactionCart />
  </aside>
</div>