import { Credentials } from './credentials'
import { Name } from './name'

/**
 * DistrictAdmin details
 */
export interface DistrictAdmin {
	id: string
	district: string
	name: Name
	title: string
}

/**
 * SchoolAdmin details
 */
export interface SchoolAdmin {
	id: string
	credentials: Credentials
	district: string
	email: string
	name: Name
	schools: string[]
	staff_id: string
	title: string
}
