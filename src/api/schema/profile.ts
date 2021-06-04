/**
 * Profile API data format.
 */
export interface Profile {
	id: string
	type: string
	/** only present on v2.1/me profile response. */
	authorized_by?: string
	/** only present when district provides roster data */
	district?: string
}
