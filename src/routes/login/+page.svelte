<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import LoginImage from '$lib/assets/logo-login.png';
  import { viewport } from '$lib/viewport.js';
  
  // 'form' akan otomatis diisi oleh SvelteKit jika action mengembalikan 'fail'
  export let form: ActionData;
  
  // State untuk loading saat form disubmit
  let isLoading = false;
</script>

<div class="flex items-center justify-center p-6 bg-slate-100 md:p-12">
  <div class="w-full max-w-sm md:-mt-16">
    <form 
      method="POST" 
      use:enhance={() => {
        isLoading = true; // Set loading saat form mulai disubmit
        return async ({ update }) => {
          await update(); // Tunggu respons dari server
          isLoading = false; // Set loading selesai setelah ada respons
        };
      }}
      class="space-y-6"
    >
      <div use:viewport class="fade-in-up delay-[600ms]">
        <label for="username">...</label>
        <input type="text" id="username" name="username" required />
      </div>

      <div use:viewport class="fade-in-up delay-[700ms]">
        <label for="password">...</label>
        <input type="password" id="password" name="password" required />
      </div>

      {#if form?.message}
        <div use:viewport class="fade-in-up ... text-red-600">
          {form.message}
        </div>
      {/if}

      <div use:viewport class="fade-in-up pt-4 delay-[800ms]">
        <button type="submit" disabled={isLoading} class="...">
          {#if isLoading}
            <span>Loading...</span>
          {:else}
            <span>Login</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>