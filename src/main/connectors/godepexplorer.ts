import * as http from 'http'
import { gatherResponse, ISocketConnector } from './socketConnector'

class GoDepExplorerConn implements ISocketConnector {
  public send(data: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const PostOpts: http.RequestOptions = {
        headers: {
          'Content-Length': Buffer.byteLength(data),
          'Content-Type': 'application/json'
        },
        host: 'localhost',
        method: 'POST',
        path,
        port: '1111'
      }

      const postReq = http.request(PostOpts, gatherResponse(resolve, reject))
      postReq.write(data)
      postReq.end()
    })
  }
}

export default new GoDepExplorerConn()
