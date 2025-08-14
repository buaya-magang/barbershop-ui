import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            split: false // opsional, bikin satu file bundle
        }),
        alias: {
            $components: 'src/components',
            $lib: 'src/lib'
        }
    }
};

export default config;
