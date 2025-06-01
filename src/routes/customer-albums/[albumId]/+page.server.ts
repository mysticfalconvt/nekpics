import { env } from '$env/dynamic/private';
import type { AlbumNamesById, AlbumResponse, Photo, PhotoDetails } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const defaultAlbumId = '78dc32d2-7155-44fb-99bf-5b75bc5d43d0';

async function getAlbumInfo(albumId: string): Promise<AlbumResponse> {
	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		throw error(500, 'Server configuration error');
	}

	const queryAlbumId = albumId && albumId !== '1' ? albumId : defaultAlbumId;
	const apiUrl = `${baseImmichUrl}/api/albums/${queryAlbumId}`;

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

async function getAlbumList(): Promise<AlbumResponse[]> {
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

async function getPhotoDetails(photoId: string): Promise<PhotoDetails | null> {
	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		throw error(500, 'Server configuration error');
	}

	const apiUrl = `${baseImmichUrl}/api/assets/${photoId}`;

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
		console.error('Error fetching photo details:', err);
		return null;
	}
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		const albumId = params.albumId || defaultAlbumId;
		const albumList = await getAlbumList();
		const albumNamesById: AlbumNamesById = {};

		albumList.forEach((album: AlbumResponse) => {
			if (
				album.shared === true &&
				(album.albumName.includes('**') || album.albumName.includes('*customer*'))
			) {
				albumNamesById[album.id] = album.albumName
					.replace(/\*\*/g, '')
					.replace(/\*customer\*/gi, '')
					.trim();
			}
		});

		const doesAlbumExist = albumId && albumNamesById[albumId];
		const albumInfo = await getAlbumInfo(doesAlbumExist ? albumId : defaultAlbumId);
		const photoIds = albumInfo.assets.map((photo) => photo.id);

		// Fetch details for each photo
		const photoDetails = await Promise.all(photoIds.map((id: string) => getPhotoDetails(id)));

		const photoList: Photo[] = photoDetails
			.filter((photo): photo is PhotoDetails => photo !== null)
			.map((photo) => ({
				url: `/api/image?photoId=${photo.id}&isWeb=true`,
				thumbnailUrl: `/api/image?photoId=${photo.id}&isThumb=true`,
				title: photo.localDateTime || 'No date',
				description: photo.description || photo.localDateTime || 'No description available'
			}));

		return {
			albumInfo,
			photos: photoList,
			albumNamesById,
			albumId: albumId || defaultAlbumId
		};
	} catch (err) {
		console.error('Error in load function:', err);
		throw error(500, 'Failed to load album');
	}
};
