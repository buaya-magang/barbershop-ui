<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import '../app.css';
  
  // onMount memastikan kode ini hanya berjalan di browser
  onMount(() => {
    // 1. Ambil token dari localStorage
    const token = localStorage.getItem('accessToken');
  
    // 2. Cek apakah token TIDAK ADA dan kita TIDAK sedang di halaman login
    if (!token && $page.route.id !== '/login') {
      // 3. Jika ya, paksa redirect ke halaman login
      goto('/login');
    }
  });
</script>

<slot />