<script lang="ts">
    import RandomPhotoDisplay from '$lib/components/RandomPhotoDisplay.svelte';
    import type { Photo } from '$lib/types';

    export let data: {
        photos: Photo[];
    };
</script>

<div class="flex flex-col items-center">
    <h1 class="text-5xl mb-4">NekPics</h1>
    <p class="text-lg text-center max-w-2xl mb-8 px-4">
        Professional portrait and landscape photography services. 
        Specializing in family portraits, senior photos, and wedding photography to create 
        beautiful memories that last a lifetime.
    </p>
    
    <div class="w-full">
        <RandomPhotoDisplay photos={data.photos} />
    </div>
</div>
