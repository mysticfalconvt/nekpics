import { getAlbumAssets, getAlbumList } from '$lib/server/immich';
import type { Photo } from '$lib/types';
import type { PageServerLoad } from './$types';

function toPhoto(asset: { id: string; localDateTime?: string; description?: string }): Photo {
	return {
		url: `/api/image?photoId=${asset.id}&isWeb=true`,
		thumbnailUrl: `/api/image?photoId=${asset.id}&isThumb=true`,
		title: asset.localDateTime || 'No date',
		description: asset.description || asset.localDateTime || 'No description available'
	};
}

export const load: PageServerLoad = async () => {
	try {
		const albums = await getAlbumList();

		const relevantAlbums = albums.filter(
			(album) =>
				album.albumName.toLowerCase().includes('people') ||
				album.albumName.toLowerCase().includes('landscape')
		);

		const photosArrays = await Promise.all(
			relevantAlbums.map((album) => getAlbumAssets(album.id))
		);
		const allPhotos: Photo[] = photosArrays.flat().map(toPhoto);

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
