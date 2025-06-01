<script lang="ts">
    import { onMount } from 'svelte';
    
    let currentTheme = 'autumn';
    
    function updateTheme() {
        currentTheme = document.documentElement.getAttribute('data-theme') || 'autumn';
    }
    
    onMount(() => {
        // Initial theme setup
        updateTheme();
        
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        return () => observer.disconnect();
    });
</script>

<div class="min-h-screen bg-base-100">
    <!-- Navbar -->
    <div class="navbar bg-base-200">
        <div class="flex-1">
            <a class="btn btn-ghost text-xl">NekPics</a>
        </div>
        <div class="flex-none">
            <button 
                data-toggle-theme="autumn,sunset" 
                data-act-class="btn-active"
                class="btn btn-ghost"
            >
                {#if currentTheme === 'sunset'}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                {/if}
            </button>
        </div>
    </div>

    <!-- Hero Section -->
    <div class="hero min-h-[calc(100vh-4rem)] bg-base-200">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold">Welcome to NekPics</h1>
                <p class="py-6">Your ultimate destination for sharing and discovering amazing photos. Join our community of photographers and enthusiasts today!</p>
                <div class="flex gap-4 justify-center">
                    <button class="btn btn-primary">Get Started</button>
                    <button class="btn btn-outline">Learn More</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 px-4">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">Why Choose NekPics?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h3 class="card-title">Easy Sharing</h3>
                        <p>Share your photos with just a few clicks. Our intuitive interface makes it simple.</p>
                    </div>
                </div>
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h3 class="card-title">Community</h3>
                        <p>Join a vibrant community of photographers and enthusiasts.</p>
                    </div>
                </div>
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h3 class="card-title">Advanced Features</h3>
                        <p>Access powerful tools for photo editing and organization.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
            <p>Copyright © 2024 - All rights reserved by NekPics</p>
        </div>
    </footer>
</div>
