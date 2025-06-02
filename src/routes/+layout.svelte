<script lang="ts">
	import '$lib/app.css';
	import { page } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	const PUBLIC_UMAMI_WEBSITE_ID = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID;

	$: pageTitle = $page.url.pathname === '/' 
		? 'Robert Boskind Photography'
		: `Robert Boskind Photography - ${$page.url.pathname.slice(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	{#if PUBLIC_UMAMI_WEBSITE_ID}
		<script
			defer
			src="https://umami.rboskind.com/script.js"
			data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
		></script>
	{/if}
</svelte:head>

<div class="min-h-screen bg-base-100">
	<Nav />

	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>
