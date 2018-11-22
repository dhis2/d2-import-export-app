import { getMimeType } from './mime'
import { eventEmitter } from 'services'
import { emitLogOnFirstResponse, fetchLog } from 'pages/import/helpers'

export function getUploadXHR(url, upload, type, onResponse, onError) {
    const xhr = new XMLHttpRequest()
    const contentType = getMimeType(upload.name.toLowerCase())

    xhr.withCredentials = true
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.setRequestHeader(
        'Content-Disposition',
        'attachment filename="' + upload.name + '"'
    )

    xhr.onreadystatechange = onReadyStateChange(xhr, type, onResponse, onError)

    return xhr
}

export function onReadyStateChange(xhr, type, onResponse, onError) {
    return async function handleChange(e) {
        const status = Math.floor(xhr.status / 100)
        if (xhr.readyState === 4 && status === 2) {
            eventEmitter.emit('summary.clear')

            const jobId = emitLogOnFirstResponse(xhr, type)
            onResponse()

            eventEmitter.emit('summary.loading')
            await fetchLog(jobId, type)
        } else if ([3, 4, 5].includes(status)) {
            onError(e)
        }
    }
}
