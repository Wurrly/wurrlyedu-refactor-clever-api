/**
 * Clever's link entry format.
 */
export interface Link {
	rel: string
	uri: string
}

/**
 * Format of list API responses.
 */
export interface ListResponse<T = any> {
	data: T[]
	links: Link[]
}

/**
 * Clever's Item response format.
 */
export interface RawItemResponse<T = any> {
	data: T
	links: Link[]
}

/**
 * Clever's Response format for a list of items.
 */
export interface RawListResponse<T = any> {
	data: RawListItem<T>[] | T[]
	links: Link[]
}

/**
 * In most cases Clever returns list entries using this format.
 */
export interface RawListItem<T = any> {
	data: T
	uri: string
}
