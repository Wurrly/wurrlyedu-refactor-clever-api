/**
 * Section details
 */
export interface Section {
	id: string
	course: string
	created: string
	district: string
	grade: string
	last_modified: string
	name: string
	period: string
	school: string
	section_number: string
	sis_id: string
	students: string[]
	subject: string
	teacher: string // primary teacher
	teachers: string[] // all teachers
	term_id: string
}
