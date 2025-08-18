<script lang="ts">
  import ProductCard from './ProductCard.svelte';

  export let items: any[] = [];
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
  {#each items as item (item.id)}
    <ProductCard product={item} />
  {/each}
</div>
