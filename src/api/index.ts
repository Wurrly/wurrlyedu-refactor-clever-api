import { ReadableStream, create as createStream } from './stream'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ListResponse } from './response'
import {
	Contact,
	Course,
	District,
	DistrictAdmin,
	Event,
	Profile,
	School,
	SchoolAdmin,
	Section,
	Student,
	Teacher,
	Term
} from './schema'

export const DEFAULT_TIMEOUT = 2000

export function createClient(opts: Config): Client {
	const headers = {
		Authorization: `Bearer ${opts.accessToken}`,
		'content-type': 'application/json'
	}
	const instance = Axios.create({
		baseURL: opts.baseUrl || 'https://api.clever.com',
		headers,
		timeout: opts.timeout || DEFAULT_TIMEOUT
	})
	const apiVer = opts.apiVer || 'v2.0'
	instance.interceptors.response.use(async (res) => {
		// console.log(res.data);
		if (res.data && res.data.data) {
			if (Array.isArray(res.data.data)) {
				res.data.data = res.data.data.map((obj: any) => obj.data || obj)
			} else {
				res.data = { _links: res.data.links, ...res.data.data }
			}
		}

		return res
	})
	function apis(resource: string, extra: string[] = []) {
		const obj: any = {
			get: (id: string) => client.get(`/${apiVer}/${resource}/${id}`),
			list: () => client.list(`/${apiVer}/${resource}`)
		}
		for (const api of extra) {
			obj[api] = (id: string) =>
				client.request({ url: `/${apiVer}/${resource}/${id}/${api}`, method: 'GET' })
		}

		return obj
	}
	const client: Client = {
		get: <T = any>(url: string): Promise<T> => {
			return client.request({ url, method: 'GET' })
		},
		list: <T = any>(url: string): Promise<ListResponse<T>> => {
			return client.request({ url, method: 'GET' })
		},
		request: <T = any>(config: RequestConfig): Promise<T> => {
			const cfg: AxiosRequestConfig = { method: 'GET', ...config } as any

			// console.log({cfg});
			return instance.request(cfg).then((result) => result.data)
		},
		getProfile: (ver: string = apiVer) => client.get(`${ver}/me`),
		contacts: apis('contacts', ['district', 'students']),
		courses: apis('courses', ['district', 'sections']),
		districts: apis('districts'),
		events: apis('events'),
		schools: apis('schools', ['district', 'sections', 'students', 'teachers']),
		sections: apis('sections', ['course', 'district', 'school', 'students', 'teacher', 'teachers', 'term']),
		students: apis('students', ['contacts', 'district', 'school', 'schools', 'sections', 'teachers']),
		teachers: apis('teachers', ['district', 'school', 'schools', 'sections', 'students']),
		terms: apis('terms', ['district', 'sections']),
		districtAdmins: apis('district_admins', ['district']),
		schoolAdmins: apis('school_admins', ['district', 'schools']),
		stream: (urlOrList: string | ListResponse) => createStream(urlOrList, client),
		all: (stream: ReadableStream) => {
			const results: any[] = []

			return new Promise((resolve, reject) => {
				stream.on('data', (chunk: any) => {
					if (!chunk) {
						return
					}
					results.push(chunk)
				})
				stream.once('end', () => resolve(results))
				stream.once('error', (err: any) => reject(err))
			})
		},
		_client: instance
	}

	return client
}

export default createClient

export interface Client {
	all<T = any>(stream: ReadableStream<T>): Promise<T[]>
	get<T = any>(url: string): Promise<T>
	getProfile(): Promise<Profile>
	courses: {
		get(id: string): Promise<Course>
		list(): Promise<ListResponse<Course>>
		district(id: string): Promise<District>
		sections(id: string): Promise<ListResponse<Section>>
	}
	contacts: {
		get(id: string): Promise<Contact>
		list(): Promise<ListResponse<Contact>>
		district(id: string): Promise<District>
		students(id: string): Promise<ListResponse<Student>>
	}
	districts: {
		get(id: string): Promise<District>
		list(): Promise<ListResponse<District>>
	}
	events: {
		get(id: string): Promise<Event>
		list(): Promise<ListResponse<Event>>
	}
	schools: {
		get(id: string): Promise<School>
		list(): Promise<ListResponse<School>>
		district(id: string): Promise<District>
		sections(id: string): Promise<ListResponse<Section>>
		students(id: string): Promise<ListResponse<Student>>
		teachers(id: string): Promise<ListResponse<Teacher>>
	}
	sections: {
		get(id: string): Promise<Section>
		list(): Promise<ListResponse<Section>>
		course(id: string): Promise<Course>
		district(id: string): Promise<District>
		school(id: string): Promise<School>
		students(id: string): Promise<ListResponse<Student>>
		teacher(id: string): Promise<Teacher>
		teachers(id: string): Promise<ListResponse<Teacher>>
		term(id: string): Promise<Term>
	}
	students: {
		get(id: string): Promise<Student>
		list(): Promise<ListResponse<Student>>
		contacts(id: string): Promise<ListResponse<Contact>>
		district(id: string): Promise<District>
		school(id: string): Promise<School>
		schools(id: string): Promise<ListResponse<School>>
		sections(id: string): Promise<ListResponse<Section>>
		teachers(id: string): Promise<ListResponse<Teacher>>
	}
	teachers: {
		get(id: string): Promise<Teacher>
		list(): Promise<ListResponse<Teacher>>
		district(id: string): Promise<District>
		school(id: string): Promise<School>
		schools(id: string): Promise<ListResponse<School>>
		sections(id: string): Promise<ListResponse<Section>>
		students(id: string): Promise<ListResponse<Student>>
	}
	terms: {
		get(id: string): Promise<Teacher>
		list(): Promise<ListResponse<Teacher>>
		district(id: string): Promise<District>
		sections(id: string): Promise<ListResponse<Section>>
	}
	districtAdmins: {
		get(id: string): Promise<DistrictAdmin>
		list(): Promise<ListResponse<DistrictAdmin>>
		district(id: string): Promise<District>
	}
	schoolAdmins: {
		get(id: string): Promise<SchoolAdmin>
		list(): Promise<ListResponse<SchoolAdmin>>
		district(id: string): Promise<District>
		schools(id: string): Promise<ListResponse<School>>
	}
	list<T = any>(url: string): Promise<ListResponse<T>>
	request<T = any>(config: RequestConfig): Promise<T>
	stream<T = any>(urlOrList: string | ListResponse<T>): ReadableStream<T>
	_client: AxiosInstance
}

export interface Config {
	accessToken: string
	apiVer?: string
	baseUrl?: string
	timeout?: number
}

export interface RequestConfig {
	url: string
	method?: string
	data?: any
	headers?: any
	params?: any
}
