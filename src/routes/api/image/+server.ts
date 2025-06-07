import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const photoId = url.searchParams.get('photoId');
	const isThumb = url.searchParams.get('isThumb') === 'true';
	const fullRes = url.searchParams.get('fullRes') === 'true';

	if (!photoId) {
		throw error(400, 'Missing photoId parameter');
	}

	const baseImmichUrl = env.IMMICH_URL;
	const xApiKey = env.IMMICH_API_KEY;

	if (!baseImmichUrl || !xApiKey) {
		throw error(500, 'Server configuration error');
	}

	// Use different endpoints based on whether we want a thumbnail or full-size image
	const apiUrl = isThumb
		? `${baseImmichUrl}/api/assets/${photoId}/thumbnail`
		: `${baseImmichUrl}/api/assets/${photoId}/original`;

	try {
		const response = await fetch(apiUrl, {
			headers: {
				'x-api-key': xApiKey,
				Accept: 'image/jpeg'
			}
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			console.error('Error fetching image:', errorMessage);
			throw error(response.status, errorMessage);
		}

		// Get the image content
		const imageBuffer = await response.arrayBuffer();
		const buffer: Buffer = Buffer.from(new Uint8Array(imageBuffer));

		// Process the image with Sharp only if not full resolution
		let processedBuffer = buffer;
		if (!isThumb && !fullRes) {
			processedBuffer = await sharp(buffer)
				.resize(1920, 1080, {
					fit: 'inside',
					withoutEnlargement: true
				})
				.jpeg({
					quality: 80,
					mozjpeg: true
				})
				.toBuffer();
		}

		// Return the processed image
		return new Response(processedBuffer, {
			headers: {
				'Content-Type': 'image/jpeg',
				'Cache-Control': 'max-age=604800, immutable',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (err) {
		console.error('Error in image API:', err);
		throw error(500, 'Internal server error');
	}
};
