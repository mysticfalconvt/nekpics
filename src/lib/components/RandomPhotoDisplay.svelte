<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { Photo } from '$lib/types';
    import { browser } from '$app/environment';

    export let photos: Photo[] = [];

    let currentPhoto: Photo | null = null;
    let intervalId: ReturnType<typeof setInterval>;
    let isZoomed = false;

    function getRandomPhoto() {
        if (photos.length === 0) return null;
        return photos[Math.floor(Math.random() * photos.length)];
    }

    function handleKeydown(e: KeyboardEvent) {
        if (isZoomed && e.key === 'Escape') {
            closeZoom();
        }
    }

    function openZoom() {
        if (currentPhoto) {
            isZoomed = true;
        }
    }

    function closeZoom() {
        isZoomed = false;
    }

    onMount(() => {
        currentPhoto = getRandomPhoto();
        
        intervalId = setInterval(() => {
            currentPhoto = getRandomPhoto();
        }, 3000);

        if (browser) {
            document.addEventListener('keydown', handleKeydown);
        }
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
        if (browser) {
            document.removeEventListener('keydown', handleKeydown);
        }
    });
</script>

<div class="w-full max-w-4xl mx-auto aspect-[4/3] bg-base-300 rounded-lg overflow-hidden relative">
    {#if currentPhoto}
        <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-base-300 to-base-200">
            <button
                class="w-full h-full flex items-center justify-center bg-transparent border-none p-0 m-0"
                aria-label="Zoom photo"
                tabindex="0"
                on:click={openZoom}
                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openZoom(); }}
            >
                <img 
                    src={currentPhoto.url} 
                    alt={currentPhoto.description} 
                    class="max-w-full max-h-full object-contain transition-opacity duration-500 cursor-zoom-in"
                />
            </button>
        </div>
    {:else}
        <div class="w-full h-full flex items-center justify-center">
            <span class="text-4xl">📸</span>
        </div>
    {/if}
</div>

{#if isZoomed && currentPhoto}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        on:click={closeZoom}
        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeZoom(); }}
    >
        <img
            src={currentPhoto.url}
            alt={currentPhoto.description}
            class="max-w-full max-h-full object-contain shadow-2xl cursor-zoom-out"
        />
        <button class="absolute top-4 right-4 btn btn-sm btn-circle btn-error z-50" on:click={closeZoom}>
            ✕
        </button>
    </div>
{/if} 
