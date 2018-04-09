import * as http from 'http'
import * as path from 'path'
import { exec } from 'child_process'
import { gatherResponse, ISocketConnector } from './socketConnector'

class GoDepExplorerConn implements ISocketConnector {
  public run() {
    return new Promise((resolve, reject) => {
      const godepexplorerPath = path.join(
        __dirname,
        '../../../static/godepexplorer/godepexplorer-macos'
      )

      exec(godepexplorerPath, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
        resolve()
      })
    })
  }

  public send(data: string, urlPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const PostOpts: http.RequestOptions = {
        headers: {
          'Content-Length': Buffer.byteLength(data),
          'Content-Type': 'application/json'
        },
        host: 'localhost',
        method: 'POST',
        path: urlPath,
        port: '1111'
      }

      const postReq = http.request(PostOpts, gatherResponse(resolve, reject))
      postReq.write(data)
      postReq.end()
    })
  }
}

export default new GoDepExplorerConn()
