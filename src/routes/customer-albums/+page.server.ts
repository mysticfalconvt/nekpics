import { env } from '$env/dynamic/private';
import type { Album, AlbumResponse } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function getAlbumInfo(albumId: string): Promise<AlbumResponse> {
	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		throw error(500, 'Server configuration error');
	}

	const apiUrl = `${baseImmichUrl}/api/albums/${albumId}`;

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'x-api-key': xApiKey,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw error(response.status, `HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (err) {
		return {
			id: '',
			albumName: 'Error loading album',
			description: '',
			shared: false,
			coverImage: '',
			assets: []
		};
	}
}

async function getCustomerAlbumList(): Promise<Album[]> {
	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		throw error(500, 'Server configuration error');
	}

	const apiUrl = `${baseImmichUrl}/api/albums`;

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'x-api-key': xApiKey,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw error(response.status, `HTTP error! status: ${response.status}`);
		}

		const albums: AlbumResponse[] = await response.json();
		// Only albums with *customer* in the name
		const filteredAlbums = albums.filter(
			(album) => album.shared === true && album.albumName.includes('*customer*')
		);

		// Fetch details for each album
		const albumsWithPhotos = await Promise.all(
			filteredAlbums.map(async (album) => {
				const albumInfo = await getAlbumInfo(album.id);
				const photoUrls =
					albumInfo.assets.map((asset) => `/api/image?photoId=${asset.id}&isThumb=true`) || [];

				return {
					id: album.id,
					title: album.albumName.replace(/\*customer\*/gi, '').trim(),
					description: album.description || '',
					coverImage: albumInfo.assets[0]?.id || '',
					photoUrls
				};
			})
		);

		return albumsWithPhotos;
	} catch (err) {
		throw error(500, 'Failed to fetch albums');
	}
}

export const load: PageServerLoad = async () => {
	const albums = await getCustomerAlbumList();
	return { albums };
};
