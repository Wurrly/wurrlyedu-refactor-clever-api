import { Credentials } from './credentials'
import { Location } from './location'
import { Name } from './name'

/**
 * Student details
 */
export interface Student {
	id: string
	credentials: Credentials
	district: string
	dob: string
	ell_status: string
	email: string
	gender: string
	grade: string
	graduation_year: string
	hispanic_ethnicity: string
	last_modified: string
	location: Location
	name: Name
	race: string
	school: string // primary school association
	schools: string[] // all school associations
	sis_id: string
	state_id: string
	student_number: string
}
