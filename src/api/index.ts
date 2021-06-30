import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

import { Link, ListResponse } from './response'
import { Contact, Course, District, Event, Profile, Resource, School, Section, Student, Teacher, Term, User } from './schema'
import { create as createStream, ReadableStream } from './stream'

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
	const apiVer = opts.apiVer || 'v3.0'
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
			list: () => client.list(`/${apiVer}/${resource}`),
			pageThroughData: () => client.pageThroughData(`/${apiVer}/${resource}?limit=5000`)
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
		pageThroughData: async <T = any>(url: string): Promise<T[]> => {
			const tempDataStore: T[] = []
			let response = await client.request({ url, method: 'GET' })
			let nextUrl = getDataAndNextPage(response, tempDataStore)

			// check for next page
			// while next page exists{}
			// getPage(nextPage, dataStore)
			while (nextUrl) {
				console.log(nextUrl)
				response = await client.request({ url: nextUrl, method: 'GET' })
				nextUrl = getDataAndNextPage(response, tempDataStore)
			}

			// at this point you have all data
			return tempDataStore
		},
		getProfile: (ver: string = apiVer) => client.get(`${ver}/me`),
		courses: apis('courses', ['district', 'resources', 'schools', 'sections']),
		districts: apis('districts'),
		resources: apis('resources', ['users', 'users', 'users']),
		schools: apis('schools', ['courses', 'district', 'sections', 'terms', 'terms']),
		sections: apis('sections', ['course', 'district', 'resources', 'school', 'term', 'users']),
		terms: apis('terms', ['district', 'school', 'sections']),
		users: apis('users', [
			'district',
			'mycontacts',
			'mystudents',
			'myteachers',
			'resources',
			'schools',
			'sections'
		]),
		events: apis('events'),
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

const getNext = (links: Link[]) => {
	// return null if no next
	// or return the link to next page
	let nextUri = ''

	links.forEach(function (obj: Link) {
		const rel = obj.rel
		const uri = obj.uri

		if (rel === 'next') {
			nextUri = uri
		}
	})

	return nextUri
}

const getDataAndNextPage = <T>(response: ListResponse<T>, dataStore: T[]) => {
	// get data from page
	const data = response.data
	const links = response.links

	const uri = getNext(links)

	// add to data store
	console.log('LENGTH: ', data.length)

	dataStore.push(...data)

	return uri
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
		resources(id: string): Promise<ListResponse<Resource>>
		schools(id: string): Promise<ListResponse<School>>
		sections(id: string): Promise<ListResponse<Section>>
	}
	districts: {
		get(id: string): Promise<District>
		list(): Promise<ListResponse<District>>
		pageThroughData(): Promise<District[]>
	}
	resources: {
		get(id: string): Promise<Resource>
		list(): Promise<ListResponse<Resource>>
		courses(id: string): Promise<ListResponse<Course>>
		sections(id: string): Promise<ListResponse<Section>>
		users(id: string): Promise<ListResponse<User>>
	}
	schools: {
		get(id: string): Promise<School>
		list(): Promise<ListResponse<School>>
		courses(id: string): Promise<ListResponse<Course>>
		district(id: string): Promise<District>
		sections(id: string): Promise<ListResponse<Section>>
		terms(id: string): Promise<ListResponse<Term>>
		users(id: string): Promise<ListResponse<User>>
		pageThroughData(): Promise<School[]>
	}
	sections: {
		get(id: string): Promise<Section>
		list(): Promise<ListResponse<Section>>
		course(id: string): Promise<Course>
		district(id: string): Promise<District>
		resources(id: string): Promise<ListResponse<Resource>>
		school(id: string): Promise<School>
		term(id: string): Promise<Term>
		users(id: string): Promise<ListResponse<User>>
	}
	terms: {
		get(id: string): Promise<Teacher>
		list(): Promise<ListResponse<Teacher>>
		district(id: string): Promise<District>
		schools(id: string): Promise<ListResponse<School>>
		sections(id: string): Promise<ListResponse<Section>>
	}
	users: {
		get(id: string): Promise<User>
		list(): Promise<ListResponse<User>>
		district(id: string): Promise<District>
		mycontacts(id: string): Promise<ListResponse<Contact>>
		mystudents(id: string): Promise<ListResponse<Student>>
		myteachers(id: string): Promise<ListResponse<Teacher>>
		resources(id: string): Promise<ListResponse<Resource>>
		schools(id: string): Promise<ListResponse<School>>
		sections(id: string): Promise<ListResponse<Section>>
	}
	events: {
		get(id: string): Promise<Event>
		list(): Promise<ListResponse<Event>>
	}
	list<T = any>(url: string): Promise<ListResponse<T>>
	request<T = any>(config: RequestConfig): Promise<T>
	pageThroughData<T = any>(url: string): Promise<T[]>
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
