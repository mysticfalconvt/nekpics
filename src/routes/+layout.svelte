<script lang="ts">
	import '$lib/app.css';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	
	onMount(() => {
		// Set default theme if none is set
		if (!localStorage.getItem('theme')) {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.setAttribute('data-theme', prefersDark ? 'sunset' : 'autumn');
		}
		themeChange(false);
	});
</script>

<slot />
