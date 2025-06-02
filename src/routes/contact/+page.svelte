<script lang="ts">
    let name = '';
    let email = '';
    let message = '';
    let submitted = false;
    let error = '';
    let isSubmitting = false;

    async function handleSubmit() {
        isSubmitting = true;
        error = '';
        
        try {
            // Send the form data to our API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            // Track the form submission event
            if (typeof window !== 'undefined' && 'umami' in window) {
                (window as any).umami.track('contact_form_submit', {
                    name: name,
                    email: email,
                    messageLength: message.length
                });
            }

            submitted = true;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to send message';
            console.error('Error submitting form:', e);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-8">Contact Me</h1>
    
    <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div>
            <h2 class="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p class="mb-4">I'd love to hear from you! Whether you're interested in booking a session, have questions about my services, or just want to say hello, feel free to reach out.</p>
            <div class="space-y-2">
                <p><span class="font-semibold">Email:</span> <a href="mailto:rob@boskind.tech" class="link link-primary">rob@boskind.tech</a></p>
                <p><span class="font-semibold">Location:</span> Derby, VT</p>
            </div>
        </div>

        {#if !submitted}
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                {#if error}
                    <div class="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                {/if}

                <div class="form-control">
                    <label class="label" for="name">
                        <span class="label-text">Name</span>
                    </label>
                    <input type="text" id="name" bind:value={name} class="input input-bordered" required />
                </div>

                <div class="form-control">
                    <label class="label" for="email">
                        <span class="label-text">Email</span>
                    </label>
                    <input type="email" id="email" bind:value={email} class="input input-bordered" required />
                </div>

                <div class="form-control">
                    <label class="label" for="message">
                        <span class="label-text">Message</span>
                    </label>
                    <textarea id="message" bind:value={message} class="textarea textarea-bordered h-32" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-full" disabled={isSubmitting}>
                    {#if isSubmitting}
                        <span class="loading loading-spinner"></span>
                        Sending...
                    {:else}
                        Send Message
                    {/if}
                </button>
            </form>
        {:else}
            <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Thank you for your message! I'll get back to you soon.</span>
            </div>
        {/if}
    </div>
</div> 
