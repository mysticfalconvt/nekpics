import { env } from '$env/dynamic/private';
import type { Photo } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function getAlbumList() {
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

		return await response.json();
	} catch (err) {
		console.error('Error fetching album list:', err);
		return [];
	}
}

async function getAlbumPhotos(albumId: string) {
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

		const albumData = await response.json();
		return albumData.assets.map((asset: any) => ({
			url: `/api/image?photoId=${asset.id}&isWeb=true`,
			thumbnailUrl: `/api/image?photoId=${asset.id}&isThumb=true`,
			title: asset.localDateTime || 'No date',
			description: asset.description || asset.localDateTime || 'No description available'
		}));
	} catch (err) {
		console.error('Error fetching album photos:', err);
		return [];
	}
}

export const load: PageServerLoad = async () => {
	try {
		const albums = await getAlbumList();

		// Filter albums that contain 'people' or 'landscape' in their title
		const relevantAlbums = albums.filter(
			(album: any) =>
				album.albumName.toLowerCase().includes('people') ||
				album.albumName.toLowerCase().includes('landscape')
		);

		// Fetch photos from each relevant album
		const photoPromises = relevantAlbums.map((album: any) => getAlbumPhotos(album.id));
		const photosArrays = await Promise.all(photoPromises);
		const allPhotos: Photo[] = photosArrays.flat();

		return {
			photos: allPhotos
		};
	} catch (err) {
		console.error('Error in load function:', err);
		return {
			photos: []
		};
	}
};
