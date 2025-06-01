<script lang="ts">
    import type { PageData } from './$types';
    import AlbumCard from '$lib/components/AlbumCard.svelte';
    
    export let data: PageData;
</script>

<div class="flex flex-col w-full items-center justify-center text-base-content px-4 py-8">
    <h1 class="text-5xl font-bold mb-6">Photography</h1>

    <div class="max-w-3xl text-center mb-12">
        <p class="text-lg mb-4">
            Welcome to my photography collection. Here you'll find a curated
            selection of my favorite shots, organized into themed albums. Each
            album tells its own story through carefully selected images.
        </p>
        <p class="text-lg">
            Feel free to explore the albums below and immerse yourself in the
            visual journey.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[2200px]">
        {#each data.albums as album, index}
            <AlbumCard
                {album}
                delay={index}
                numberOfAlbums={data.albums.length}
            />
        {/each}
    </div>
</div> 
