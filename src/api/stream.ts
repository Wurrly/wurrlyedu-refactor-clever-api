/* eslint-disable @typescript-eslint/unified-signatures */
import { Readable } from 'stream'

import { Client } from '.'
import { ListResponse } from './response'

export interface ReadableStream<T = any> {
	pause(): ReadableStream<T>
	resume(): ReadableStream<T>
	isPaused(): boolean

	on(event: 'close', listener: () => void): ReadableStream<T>
	on(event: 'data', listener: (chunk: T) => void): ReadableStream<T>
	on(event: 'end', listener: () => void): ReadableStream<T>
	on(event: 'readable', listener: () => void): ReadableStream<T>
	on(event: 'error', listener: () => void): ReadableStream<T>
	on(event: string | symbol, listener: (...args: any[]) => void): ReadableStream<T>

	once(event: 'close', listener: () => void): ReadableStream<T>
	once(event: 'data', listener: (chunk: T) => void): ReadableStream<T>
	once(event: 'end', listener: () => void): ReadableStream<T>
	once(event: 'readable', listener: () => void): ReadableStream<T>
	once(event: 'error', listener: () => void): ReadableStream<T>
	once(event: string | symbol, listener: (...args: any[]) => void): ReadableStream<T>
}

/**
 * Creates a stream
 *
 * @param urlOrList
 * @param client
 */
export function create<T = any>(urlOrList: string | ListResponse<T>, client: Client): ReadableStream<T> {
	let url = ''
	const readable = new Readable({
		objectMode: true,
		read: () => {
			if (!url) {
				return
			}
			client
				.list(url)
				.then((resp) => {
					url = nextLink(resp)
					for (const data of resp.data) {
						readable.push(data)
					}
					if (!url) {
						readable.push(null)
					}
				})
				.catch((err) => {
					readable.emit('error', err)
					readable.push(null)
				})
		}
	})
	if (typeof urlOrList === 'string') {
		url = urlOrList
	} else {
		for (const data of urlOrList.data) {
			readable.push(data)
		}
		url = nextLink(urlOrList)
		if (!url) {
			readable.push(null)
		}
	}

	return readable
}

/**
 * Return the URI from the `next` link, if present.
 *
 * @param resp
 */
function nextLink(resp: ListResponse): string {
	const next = resp.links.find((l) => l.rel === 'next')

	return next ? next.uri : ''
}
