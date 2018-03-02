import * as levelup from 'levelup'
import LevelDown from 'leveldown'
import { TextDecoder } from 'text-encoding'
import * as fs from 'fs'
import DB from './DB'
import { INode, IEdge } from '../../GlobalTypes'

const DB_DIR = 'level-db'

export default class Project {
  public projectName: string
  public nodeDB: DB<INode>
  public edgeDB: DB<IEdge>

  constructor(projectName: string) {
    this.projectName = projectName

    try {
      fs.accessSync(`./${DB_DIR}/${projectName}`)
    } catch (error) {
      fs.mkdirSync(`./${DB_DIR}/${projectName}`)
    }

    this.nodeDB = new DB(`./${DB_DIR}/${projectName}/node-db`)
    this.edgeDB = new DB(`./${DB_DIR}/${projectName}/edge-db`)
  }

  public close() {
    return Promise.all([this.nodeDB.close(), this.edgeDB.close()])
  }
}
