import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

const IMAGE_FILES = ['Rob 1.jpg', 'Rob 2.jpg'];
const STATIC_DIR = path.resolve('static');

export const GET: RequestHandler = async () => {
	// Randomly select one of the two images
	const selected = IMAGE_FILES[Math.floor(Math.random() * IMAGE_FILES.length)];
	const imagePath = path.join(STATIC_DIR, selected);

	try {
		const imageBuffer = await fs.readFile(imagePath);
		// Optimize: resize to max 600x600, quality 70
		const optimized = await sharp(imageBuffer)
			.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
			.jpeg({ quality: 70, mozjpeg: true })
			.toBuffer();

		return new Response(optimized, {
			headers: {
				'Content-Type': 'image/jpeg',
				'Cache-Control': 'max-age=3600',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (err) {
		console.error('Error processing Rob photo:', err);
		throw error(500, 'Failed to process Rob photo');
	}
};
