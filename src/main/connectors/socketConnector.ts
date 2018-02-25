import * as http from 'http'

export interface ISocketConnector {
  send(data: string, path: string): Promise<string>
}

export function gatherResponse(callback: (data: string) => void) {
  return (response: http.IncomingMessage) => {
    let rawData = ''
    response.setEncoding('utf8')
    response.on('data', chunk => (rawData += chunk))
    response.on('end', () => callback(rawData))
  }
}
