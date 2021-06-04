import { Teacher } from './teacher'
/**
 * User details
 */
export interface User {
	id: string
	created: string
	district: string
	email: string
	last_modified: string
	name: {
		first: string
		last: string
		middle: string
	}
	roles: {
		teacher?: Teacher
	}
}
