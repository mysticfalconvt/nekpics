import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [sveltekit(), tailwindcss()],
		// Expose env variables to the client
		define: {
			'process.env.SMTP_HOST': JSON.stringify(env.SMTP_HOST),
			'process.env.SMTP_PORT': JSON.stringify(env.SMTP_PORT),
			'process.env.SMTP_USER': JSON.stringify(env.SMTP_USER),
			'process.env.SMTP_PASSWORD': JSON.stringify(env.SMTP_PASSWORD),
			'process.env.SMTP_FROM': JSON.stringify(env.SMTP_FROM),
			'import.meta.env.PUBLIC_UMAMI_WEBSITE_ID': JSON.stringify(env.PUBLIC_UMAMI_WEBSITE_ID)
		}
	};
});
