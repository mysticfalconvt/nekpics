import { getAlbumAssets, getAlbumList } from '$lib/server/immich';
import type { Album } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

async function getCustomerAlbumList(): Promise<Album[]> {
	try {
		const albums = await getAlbumList();
		const filteredAlbums = albums.filter(
			(album) => album.shared === true && album.albumName.includes('*customer*')
		);

		return await Promise.all(
			filteredAlbums.map(async (album) => {
				const assets = await getAlbumAssets(album.id);
				const photoUrls = assets.map((asset) => `/api/image?photoId=${asset.id}&isThumb=true`);
				const coverId = album.albumThumbnailAssetId || assets[0]?.id || '';

				return {
					id: album.id,
					title: album.albumName.replace(/\*customer\*/gi, '').trim(),
					description: album.description || '',
					coverImage: coverId,
					photoUrls
				};
			})
		);
	} catch (err) {
		console.error('Error fetching customer albums:', err);
		throw error(500, 'Failed to fetch albums');
	}
}

export const load: PageServerLoad = async () => {
	const albums = await getCustomerAlbumList();
	return { albums };
};
