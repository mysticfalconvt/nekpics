import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { AlbumResponse, ImmichAsset } from '$lib/types';

function getImmichConfig() {
	const baseUrl = env.IMMICH_URL;
	const apiKey = env.IMMICH_API_KEY;

	if (!baseUrl || !apiKey) {
		throw error(500, 'Server configuration error');
	}

	return { baseUrl, apiKey };
}

function immichHeaders(apiKey: string): HeadersInit {
	return {
		'x-api-key': apiKey,
		'Content-Type': 'application/json',
		Accept: 'application/json'
	};
}

export async function getAlbumList(): Promise<AlbumResponse[]> {
	const { baseUrl, apiKey } = getImmichConfig();

	const response = await fetch(`${baseUrl}/api/albums`, {
		method: 'GET',
		headers: immichHeaders(apiKey)
	});

	if (!response.ok) {
		throw error(response.status, `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

export async function getAlbumInfo(albumId: string): Promise<AlbumResponse> {
	const { baseUrl, apiKey } = getImmichConfig();

	const response = await fetch(`${baseUrl}/api/albums/${albumId}`, {
		method: 'GET',
		headers: immichHeaders(apiKey)
	});

	if (!response.ok) {
		throw error(response.status, `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * Immich v3 removed assets from album responses.
 * Fetch album assets via POST /api/search/metadata instead.
 */
export async function getAlbumAssets(albumId: string): Promise<ImmichAsset[]> {
	const { baseUrl, apiKey } = getImmichConfig();
	const assets: ImmichAsset[] = [];
	let page: number | string | null = 1;

	while (page !== null) {
		const response = await fetch(`${baseUrl}/api/search/metadata`, {
			method: 'POST',
			headers: immichHeaders(apiKey),
			body: JSON.stringify({
				albumIds: [albumId],
				size: 1000,
				page: typeof page === 'string' ? Number(page) : page
			})
		});

		if (!response.ok) {
			throw error(response.status, `HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		const pageAssets = data?.assets?.items ?? [];
		assets.push(...pageAssets);
		page = data?.assets?.nextPage ?? null;
	}

	return assets;
}
