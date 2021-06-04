import { NonEventResource } from '.'
import { Contact } from './contact'
import { Course } from './course'
import { District } from './district'
import { School } from './school'
import { Section } from './section'
import { Student } from './student'
import { Teacher } from './teacher'
import { Term } from './term'

/**
 * Event details
 */
export interface Event<T = NonEventResource, TE = TEvent> {
	id: string
	created: string
	data: Data<T>
	type: TE
}

/**
 * Data attribute format
 */
export interface Data<T = NonEventResource> {
	object: T
	previous_attributes?: Partial<T>
}

export type TCourseEvent = 'courses' | 'courses.created' | 'courses.deleted' | 'courses.updated'
export type TContactEvent = 'contacts' | 'contacts.created' | 'contacts.deleted' | 'contacts.updated'
export type TDistrictEvent = 'districts' | 'districts.created' | 'districts.deleted' | 'districts.updated'
export type TSchoolEvent = 'schools' | 'schools.created' | 'schools.deleted' | 'schools.updated'
export type TSectionEvent = 'sections' | 'sections.created' | 'sections.deleted' | 'sections.updated'
export type TStudentEvent = 'students' | 'students.created' | 'students.deleted' | 'students.updated'
export type TTeacherEvent = 'teachers' | 'teachers.created' | 'teachers.deleted' | 'teachers.updated'
export type TTermEvent = 'terms' | 'terms.created' | 'terms.deleted' | 'terms.updated'

export type TEvent = TCourseEvent | TContactEvent | TDistrictEvent | TSchoolEvent | TStudentEvent

/**
 * Resource specific event types
 */
export type ContactEvent = Event<Contact, TContactEvent>
export type CourseEvent = Event<Course, TCourseEvent>
export type DistrictEvent = Event<District, TDistrictEvent>
export type SchoolEvent = Event<School, TSchoolEvent>
export type SectionEvent = Event<Section, TSectionEvent>
export type StudentEvent = Event<Student, TStudentEvent>
export type TeacherEvent = Event<Teacher, TTeacherEvent>
export type TermEvent = Event<Term, TTermEvent>
