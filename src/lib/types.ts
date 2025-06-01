export interface Photo {
	url: string;
	thumbnailUrl: string;
	title: string;
	description: string;
}

export interface AlbumResponse {
	id: string;
	albumName: string;
	description: string;
	shared: boolean;
	coverImage: string;
	assets: Array<{
		id: string;
		localDateTime: string;
		description: string;
	}>;
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
