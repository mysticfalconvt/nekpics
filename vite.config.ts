import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Environment variables are read through SvelteKit's $env modules
// ($env/dynamic/private for SMTP on the server, $env/static/public for
// Umami), so nothing is inlined here. Don't add SMTP_* to `define`: that
// would bake the values into any bundle that references them.
export default defineConfig({
	plugins: [sveltekit(), tailwindcss()]
});
