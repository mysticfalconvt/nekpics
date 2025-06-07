<script lang="ts">
    import RandomPhotoDisplay from '$lib/components/RandomPhotoDisplay.svelte';
    import type { Photo } from '$lib/types';

    export let data: {
        photos: Photo[];
    };
</script>

<div class="flex flex-col items-center">
    <div class="flex flex-col md:flex-row items-center md:items-start mb-8 w-full max-w-3xl">
        <img
            src="/api/robphoto"
            alt="Rob Boskind, owner and photographer"
            class="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover mb-4 md:mb-0 md:mr-8 shadow-lg border border-gray-300 dark:border-gray-700"
            loading="lazy"
        />
        <div class="flex-1 text-center md:text-left">
            <h1 class="text-5xl mb-4">NekPics</h1>
            <p class="text-lg max-w-2xl px-4">
                Professional portrait and landscape photography services. 
                Specializing in family portraits, senior photos, and wedding photography to create 
                beautiful memories that last a lifetime.
            </p>
        </div>
    </div>
    <div class="w-full">
        <RandomPhotoDisplay photos={data.photos} />
    </div>
</div>
