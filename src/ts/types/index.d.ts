export type EpMaskToken = {
	pattern?: RegExp;
	transform?: (v: string) => string;
	escape?: boolean;
}

export type EpMaskTokens = {
	[token: string]: EpMaskToken;
}

export type XhrParams = {
	method?: string;
	url: string;
	type?: string;
	params?: any;
	headers?: string;
}