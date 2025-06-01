import { env } from '$env/dynamic/private';
import type { Album, AlbumResponse } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function getAlbumInfo(albumId: string): Promise<AlbumResponse> {
	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		console.error('Missing environment variables:', { baseImmichUrl, xApiKey });
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
		console.error('Error fetching album info:', err);
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

async function getAlbumList(): Promise<Album[]> {
	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		console.error('Missing environment variables:', { baseImmichUrl, xApiKey });
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
		const filteredAlbums = albums.filter(
			(album) => album.shared === true && album.albumName.includes('**')
		);

		// Fetch details for each album
		const albumsWithPhotos = await Promise.all(
			filteredAlbums.map(async (album) => {
				const albumInfo = await getAlbumInfo(album.id);
				const photoUrls =
					albumInfo.assets.map((asset) => `/api/image?photoId=${asset.id}&isThumb=true`) || [];

				return {
					id: album.id,
					title: album.albumName.replace(/\*\*/g, ''),
					description: album.description || '',
					coverImage: albumInfo.assets[0]?.id || '',
					photoUrls
				};
			})
		);

		return albumsWithPhotos;
	} catch (err) {
		console.error('Error fetching album list:', err);
		throw error(500, 'Failed to fetch albums');
	}
}

export const load: PageServerLoad = async () => {
	const albums = await getAlbumList();

	return {
		albums
	};
};
