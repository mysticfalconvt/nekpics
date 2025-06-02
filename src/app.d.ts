/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {}
		interface PageData {}
		// interface PageState {}
		interface Platform {}
	}
}

declare module '$env/static/public' {
	export const PUBLIC_UMAMI_WEBSITE_ID: string;
}

export {};
