<script lang="ts">
    import type { Album } from '$lib/types';
    import { fade } from 'svelte/transition';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    export let album: Album;
    export let delay: number = 0;
    export let numberOfAlbums: number = 1;
    export let allowDownload: boolean = false;
    export let link: string = `/albums/${album.id}`;

    // Fisher-Yates shuffle
    function shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    let shuffledPhotos = album.photoUrls; // Use original order for SSR
    let currentPhotoIndex = 0;
    let intervalId: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;

    onMount(() => {
        // Only shuffle on the client
        shuffledPhotos = shuffleArray(album.photoUrls);

        if (shuffledPhotos.length <= 1) return;
        // Initial delay based on card position
        timeoutId = setTimeout(() => {
            intervalId = setInterval(() => {
                currentPhotoIndex = (currentPhotoIndex + 1) % shuffledPhotos.length;
            }, numberOfAlbums * 1000);
        }, delay * 1000);
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
    });
</script>

<a 
    href={link}
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
    in:fade={{ duration: 300, delay: delay * 100 }}
>
    <figure class="aspect-[4/3] w-full bg-base-300 flex items-center justify-center overflow-hidden">
        {#if shuffledPhotos.length > 0}
            {#if !allowDownload}
                <img 
                    src={shuffledPhotos[currentPhotoIndex]}
                    alt={album.title}
                    class="w-full h-full object-contain transition-all duration-500"
                    draggable="false"
                    on:contextmenu|preventDefault
                />
            {:else}
                <img 
                    src={shuffledPhotos[currentPhotoIndex]}
                    alt={album.title}
                    class="w-full h-full object-contain transition-all duration-500"
                />
            {/if}
        {:else}
            <div class="h-full w-full flex items-center justify-center">
                <span class="text-4xl">📸</span>
            </div>
        {/if}
    </figure>
    <div class="card-body">
        <h2 class="card-title">{album.title}</h2>
        {#if album.description}
            <p>{album.description}</p>
        {/if}
        <div class="card-actions justify-end">
            <div class="badge badge-accent">{album.photoUrls.length} photos</div>
        </div>
    </div>
</a> 
