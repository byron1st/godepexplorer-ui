import * as http from 'http'

export interface ISocketConnector {
  send(data: string, path: string): Promise<string>
}

export function gatherResponse(
  resolve: (data: string) => void,
  reject: (error: string) => void
) {
  return (response: http.IncomingMessage) => {
    let rawData = ''

    response.setEncoding('utf8')
    response.on('data', chunk => (rawData += chunk))
    response.on('end', () => {
      if (response.statusCode === 400) {
        reject(rawData)
      }

      resolve(rawData)
    })
  }
}
