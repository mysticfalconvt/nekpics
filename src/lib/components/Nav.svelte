<script lang="ts">
    let currentTheme = 'autumn';
    let isDrawerOpen = false;

    function setTheme(theme: string) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        currentTheme = theme;
    }

    function toggleTheme() {
        const newTheme = currentTheme === 'autumn' ? 'sunset' : 'autumn';
        setTheme(newTheme);
    }

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    import { onMount } from 'svelte';

    onMount(() => {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'sunset' : 'autumn');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'sunset' : 'autumn');
            }
        });
    });
</script>

<div class="drawer">
    <input type="checkbox" class="drawer-toggle" bind:checked={isDrawerOpen} />
    <div class="drawer-content flex flex-col">
        <!-- Navbar -->
        <div class="navbar bg-base-200">
            <div class="flex-1">
                <a href="/" class="btn btn-ghost text-xl">NekPics</a>
            </div>
            <div class="flex-none lg:hidden">
                <button class="btn btn-square btn-ghost" on:click={toggleDrawer} aria-label="Toggle menu">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
            <div class="hidden lg:flex lg:flex-none lg:gap-2">
                <a href="/albums" class="btn btn-ghost">Albums</a>
                <a href="/customer-albums" class="btn btn-ghost">Customer Albums</a>
                <a href="/pricing" class="btn btn-ghost">Pricing</a>
                <a href="/contact" class="btn btn-ghost">Contact</a>
                <button class="btn btn-ghost" on:click={toggleTheme}>
                    {#if currentTheme === 'autumn'}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                        </svg>
                    {/if}
                </button>
            </div>
        </div>
    </div>
    <div class="drawer-side z-50">
        <button type="button" class="drawer-overlay" on:click={toggleDrawer} on:keydown={e => e.key === 'Escape' && toggleDrawer()} aria-label="Close menu"></button>
        <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div class="flex justify-between items-center mb-4">
                <button class="btn btn-ghost btn-circle" on:click={toggleDrawer} aria-label="Close menu">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <button class="btn btn-ghost" on:click={toggleTheme}>
                    {#if currentTheme === 'autumn'}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                        </svg>
                    {/if}
                </button>
            </div>
            <ul class="menu menu-lg">
                <li><a href="/" on:click={toggleDrawer}>Home</a></li>
                <li><a href="/albums" on:click={toggleDrawer}>Albums</a></li>
                <li><a href="/customer-albums" on:click={toggleDrawer}>Customer Albums</a></li>
                <li><a href="/pricing" on:click={toggleDrawer}>Pricing</a></li>
                <li><a href="/contact" on:click={toggleDrawer}>Contact</a></li>
            </ul>
        </div>
    </div>
</div> 
