<script lang="ts">
    import AlbumCard from '$lib/components/AlbumCard.svelte';
    import type { Album } from '$lib/types';

    export let data: {
        albums: Album[];
    };
</script>

<div class="flex flex-col items-center">
    <h1 class="text-5xl mb-8">Customer Albums</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each data.albums as album, i}
            <AlbumCard {album} delay={i} numberOfAlbums={data.albums.length} />
        {/each}
    </div>
</div> 
