/**
 * Application token data.
 */
export interface ApplicationToken {
	id: string
	access_token: string
	created: string
	owner: { id: string; type: 'district' }
	scopes: string[]
}

/**
 * User access token.
 */
export interface UserToken {
	access_token: string
	type: 'bearer'
}

/**
 * Data returned from the `tokeninfo` endpoint.
 *
 * @property {string} client_id application client ID associated with the token
 * @property {string[]} scopes scope of data that can be accessed
 */
export interface OAuthTokenInfo {
	client_id: string
	scopes: string[]
}
