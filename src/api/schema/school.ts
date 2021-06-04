import { Location } from './location'
import { Principal } from './principal'

/**
 * School details
 */
export interface School {
	id: string
	district: string
	high_grade: string
	last_modified: string
	location: Location
	low_grade: string
	mdr_number: string
	name: string
	nces_id: string
	phone: string
	principal: Principal
	school_number: string
	sis_id: string
	state_id: string
}
