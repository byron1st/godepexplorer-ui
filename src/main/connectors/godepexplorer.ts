import * as http from 'http'
import { SocketConnector, gatherResponse } from './socketConnector'

class GoDepExplorerConn implements SocketConnector {
  send(data: string, path: string): Promise<string> {
    return new Promise(resolve => {
      const PostOpts: http.RequestOptions = {
        host: 'localhost',
        port: '1111',
        method: 'POST',
        path: path,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }

      const postReq = http.request(PostOpts, gatherResponse(resolve))
      postReq.write(data)
      postReq.end()
    })
  }
}

export default new GoDepExplorerConn()
