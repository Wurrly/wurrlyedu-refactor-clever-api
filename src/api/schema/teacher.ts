import { Credentials } from './credentials'
import { Name } from './name'

/**
 * Teacher details
 */
export interface Teacher {
	id: string
	name: Name
	created?: string
	email?: string
	last_modified?: string
	/** only available with district provided data */
	credentials?: Credentials
	/** only available with district provided data */
	district?: string
	/** list of section ids */
	sections?: string[]
	/** only available with district provided data */
	school?: string // primary school association
	/** only available with district provided data */
	schools?: string[]
	/** only available with district provided data */
	sis_id?: string
	/** only available with district provided data */
	state_id?: string
	/** only available with district provided data */
	teacher_number?: string
	/** only available with district provided data */
	title?: string
}
