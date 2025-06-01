<script lang="ts">
    import PhotoCarousel from '$lib/components/PhotoCarousel.svelte';
    import type { AlbumNamesById, Photo, AlbumResponse } from '$lib/types';

    export let data: {
        albumInfo: AlbumResponse;
        photos: Photo[];
        albumNamesById: AlbumNamesById;
        albumId: string;
    };

    const albumName = data.albumNamesById[data.albumId] || 'default';
</script>

<div class="flex flex-col w-full items-center justify-center text-base-content">
    <h1 class="text-5xl m-5">{albumName}</h1>
    <div class="mt-4 w-full flex items-center justify-center">
        <PhotoCarousel photoList={data.photos} albumName={albumName} />
    </div>
</div> 
