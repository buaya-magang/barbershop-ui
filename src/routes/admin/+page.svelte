<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let username = "";
  let password = "";
  let errorMessage = "";

  // ambil base url dari .env
  const apiUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL + '/auth/login';

  async function handleLogin() {
    errorMessage = "";
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!res.ok) {
        errorMessage = "Login gagal. Periksa username/password.";
        return;
      }

      const data = await res.json();

      // simpan token ke localStorage
      localStorage.setItem("accessToken", data.access_token);

      // redirect ke halaman dashboard (atau sesuai kebutuhan)
      goto("/dashboard");
    } catch (err) {
      console.error(err);
      errorMessage = "Terjadi kesalahan koneksi ke server.";
    }
  }
</script>

<div class="max-w-sm mx-auto mt-20 p-6 rounded-lg shadow-lg bg-white">
  <h1 class="text-2xl font-bold mb-4">Login</h1>
  {#if errorMessage}
    <p class="text-red-500 mb-2">{errorMessage}</p>
  {/if}
  <form
    on:submit|preventDefault={handleLogin}
    class="flex flex-col space-y-4"
  >
    <input
      type="text"
      placeholder="Username"
      bind:value={username}
      class="border rounded p-2"
    />
    <input
      type="password"
      placeholder="Password"
      bind:value={password}
      class="border rounded p-2"
    />
    <button
      type="submit"
      class="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
    >
      Login
    </button>
  </form>
</div>