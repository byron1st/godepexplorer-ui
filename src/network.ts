import * as http from 'http'
import * as visfn from './visfn'

export interface PostData {
  pkgName: string
}

export enum Path {
  DEP = '/dep',
  DIR = '/dir'
}

const POSTOPTS = {
  host: 'localhost',
  port: '1111',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

export function sendReqToGodepexplorer (postData: PostData, path: Path): Promise<string> {
  return new Promise((resolve) => {
    const contentLength = Buffer.byteLength(JSON.stringify(postData))
    const postOpts: http.RequestOptions = {
      ...POSTOPTS,
      path: path
    }
    postOpts.headers['Content-Length'] = contentLength

    const postReq = http.request(postOpts, (response) => {
      let rawData = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => {
        rawData += chunk
      })
      response.on('end', () => resolve(rawData))
    })

    postReq.write(JSON.stringify(postData))
    postReq.end()
  })
}
