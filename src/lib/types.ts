export interface Photo {
	url: string;
	thumbnailUrl: string;
	title: string;
	description: string;
}

export interface ImmichAsset {
	id: string;
	localDateTime?: string;
	description?: string;
}

export interface AlbumResponse {
	id: string;
	albumName: string;
	description: string;
	shared: boolean;
	coverImage?: string;
	albumThumbnailAssetId?: string | null;
	assetCount?: number;
	assets?: ImmichAsset[];
}

export interface PhotoDetails extends ImmichAsset {
	exifInfo?: Record<string, unknown>;
}

export interface Album {
	id: string;
	title: string;
	description: string;
	coverImage: string;
	photoUrls: string[];
}

export interface AlbumNamesById {
	[key: string]: string;
}
