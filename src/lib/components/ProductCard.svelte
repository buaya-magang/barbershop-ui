<script lang="ts">
  import { cart } from '$lib/stores';
  import type { products } from '$lib/data';

  export let product: (typeof products)[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };
</script>

<button
  class="
    flex flex-col items-center justify-center 
    h-28 
    bg-white 
    border border-slate-200 rounded-lg 
    cursor-pointer 
    transition-all 
    hover:border-violet-500 hover:-translate-y-1 hover:shadow-md 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
  "
  on:click={() => cart.addItem(product)}
>
  <div class="font-semibold text-slate-800">{product.name}</div>
  <div class="text-sm text-slate-500">{formatCurrency(product.price)}</div>
</button>