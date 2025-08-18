<script lang="ts">
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import TransactionCart from '$lib/components/TransactionCart.svelte';
  import type { PageData } from './$types';

  // Menerima 'data' yang dikirim dari load function di +page.ts
  export let data: PageData;
</script>

<div class="flex h-full w-full flex-row gap-6">
  
  <div class="flex flex-grow flex-col gap-4">
    
    <div class="flex-shrink-0">
      <input
        type="text"
        placeholder="Cari produk atau layanan..."
        class="w-full rounded-lg border border-slate-300 bg-white p-4"
      />
    </div>
    
    <div class="flex-grow overflow-y-auto pr-2">
      <ProductGrid items={data.items} />
    </div>

  </div>

  <aside class="w-[350px] flex-shrink-0">
    <TransactionCart />
  </aside>

</div>