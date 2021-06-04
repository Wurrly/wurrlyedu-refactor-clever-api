import { DistrictAdmin, SchoolAdmin } from './admin'
import { Contact } from './contact'
import { Course } from './course'
import { District } from './district'
import { Event } from './event'
import { School } from './school'
import { Section } from './section'
import { Student } from './student'
import { Teacher } from './teacher'
import { Term } from './term'

export * from './admin'
export * from './contact'
export * from './course'
export * from './credentials'
export * from './district'
export * from './event'
export * from './location'
export * from './name'
export * from './oauth'
export * from './principal'
export * from './profile'
export * from './school'
export * from './student'
export * from './section'
export * from './teacher'
export * from './term'

export type NonEventResource =
	| DistrictAdmin
	| SchoolAdmin
	| Contact
	| Course
	| District
	| School
	| Section
	| Student
	| Teacher
	| Term

export type Resource = NonEventResource | Event
