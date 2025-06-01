<script lang="ts">
    import type { Photo } from '$lib/types';
    import { onMount, onDestroy } from 'svelte';

    export let photoList: Photo[] = [];

    let currentIndex = 0;
    let isSlideshow = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let carousel: HTMLElement;
    let showClose = false;
    let closeTimeout: ReturnType<typeof setTimeout> | null = null;
    let zoomedIndex: number | null = null;
    let visibleIndexes: number[] = [];

    function nextSlide() {
        currentIndex = (currentIndex + 1) % photoList.length;
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + photoList.length) % photoList.length;
    }

    function goToSlide(index: number) {
        currentIndex = index;
    }

    function startSlideshow() {
        isSlideshow = true;
        enterFullscreen();
        intervalId = setInterval(() => {
            nextSlide();
        }, 3000);
        showClose = false;
    }

    function stopSlideshow() {
        isSlideshow = false;
        exitFullscreen();
        if (intervalId) clearInterval(intervalId);
        showClose = false;
    }

    function toggleSlideshow() {
        if (isSlideshow) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    }

    function enterFullscreen() {
        if (carousel && carousel.requestFullscreen) {
            carousel.requestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    function handleFullscreenChange() {
        if (!document.fullscreenElement && isSlideshow) {
            stopSlideshow();
        }
    }

    function handleMouseMove() {
        if (!isSlideshow) return;
        showClose = true;
        if (closeTimeout) clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
            showClose = false;
        }, 2000);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (isSlideshow && e.key === 'Escape') {
            stopSlideshow();
        }
        if (zoomedIndex !== null && e.key === 'Escape') {
            zoomedIndex = null;
        }
    }

    function openZoom(index: number) {
        if (!isSlideshow) zoomedIndex = index;
    }
    function closeZoom() {
        zoomedIndex = null;
    }

    onMount(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('keydown', handleKeydown);
    });
    onDestroy(() => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeydown);
        if (intervalId) clearInterval(intervalId);
        if (closeTimeout) clearTimeout(closeTimeout);
    });

    // Pagination logic: show window of 11 (current ±5), always show first/last, ellipsis if needed
    $: {
        const total = photoList.length;
        if (total <= 13) {
            visibleIndexes = Array.from({ length: total }, (_, i) => i);
        } else {
            visibleIndexes = [0];
            let start = Math.max(1, currentIndex - 5);
            let end = Math.min(total - 2, currentIndex + 5);
            if (start > 1) visibleIndexes.push(-1); // -1 for ellipsis
            for (let i = start; i <= end; i++) visibleIndexes.push(i);
            if (end < total - 2) visibleIndexes.push(-2); // -2 for ellipsis
            visibleIndexes.push(total - 1);
        }
    }
</script>

<div class="w-full max-w-4xl mx-auto" bind:this={carousel}>
    {#if isSlideshow}
        <div class="relative w-full h-[600px] flex items-center justify-center bg-black">
            <img
                src={photoList[currentIndex].url}
                class="w-full h-full object-contain"
                alt={photoList[currentIndex].description}
            />
            {#if showClose}
                <button class="absolute top-4 right-4 btn btn-sm btn-circle btn-error z-50" on:click={stopSlideshow}>
                    ✕
                </button>
            {/if}
        </div>
    {:else}
        <div class="carousel w-full h-[600px] rounded-box">
            {#each photoList as photo, i}
                <div
                    id="slide-{i}"
                    class="carousel-item relative w-full"
                    style="display: {i === currentIndex ? 'block' : 'none'}"
                >
                    <button
                        class="w-full h-full bg-transparent border-none p-0 m-0"
                        style="display: block;"
                        aria-label="Zoom photo"
                        tabindex="0"
                        on:click={() => openZoom(i)}
                        on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openZoom(i); }}
                    >
                        <img
                            src={photo.url}
                            class="w-full h-full object-contain cursor-zoom-in"
                            alt={photo.description}
                        />
                    </button>
                </div>
            {/each}
        </div>

        <div class="flex justify-between items-center w-full mt-4">
            <button class="btn btn-circle" on:click={prevSlide}>❮</button>
            <button class="btn btn-accent" on:click={toggleSlideshow}>
                {#if isSlideshow}
                    Stop Slideshow
                {:else}
                    Start Slideshow
                {/if}
            </button>
            <button class="btn btn-circle" on:click={nextSlide}>❯</button>
        </div>

        <div class="flex justify-center w-full py-2 gap-1 flex-wrap">
            {#each visibleIndexes as idx, j}
                {#if idx === -1 || idx === -2}
                    <span class="px-2 text-lg">…</span>
                {:else}
                    <a
                        href={`#slide-${idx}`}
                        class="btn btn-xs"
                        class:btn-secondary={idx === currentIndex}
                        on:click|preventDefault={() => goToSlide(idx)}
                    >
                        {idx + 1}
                    </a>
                {/if}
            {/each}
        </div>
    {/if}

    {#if zoomedIndex !== null}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            on:click={closeZoom}
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeZoom(); }}
        >
            <img
                src={photoList[zoomedIndex].url}
                alt={photoList[zoomedIndex].description}
                class="max-w-full max-h-full object-contain shadow-2xl cursor-zoom-out"
            />
            <button class="absolute top-4 right-4 btn btn-sm btn-circle btn-error z-50" on:click={closeZoom}>
                ✕
            </button>
        </div>
    {/if}
</div> 
