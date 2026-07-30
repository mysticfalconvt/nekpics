import { getAlbumAssets, getAlbumInfo, getAlbumList } from '$lib/server/immich';
import type { AlbumNamesById, AlbumResponse, Photo } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const defaultAlbumId = '78dc32d2-7155-44fb-99bf-5b75bc5d43d0';

function toPhoto(asset: { id: string; localDateTime?: string; description?: string }): Photo {
	return {
		url: `/api/image?photoId=${asset.id}&isWeb=true`,
		thumbnailUrl: `/api/image?photoId=${asset.id}&isThumb=true`,
		title: asset.localDateTime || 'No date',
		description: asset.description || asset.localDateTime || 'No description available'
	};
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
		const resolvedAlbumId = doesAlbumExist ? albumId : defaultAlbumId;
		const [albumInfo, assets] = await Promise.all([
			getAlbumInfo(resolvedAlbumId),
			getAlbumAssets(resolvedAlbumId)
		]);

		return {
			albumInfo: { ...albumInfo, assets },
			photos: assets.map(toPhoto),
			albumNamesById,
			albumId: albumId || defaultAlbumId
		};
	} catch (err) {
		console.error('Error in load function:', err);
		throw error(500, 'Failed to load album');
	}
};
