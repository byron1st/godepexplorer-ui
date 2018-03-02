import * as levelup from 'levelup'
import LevelDown from 'leveldown'
import { TextDecoder } from 'text-encoding'

interface IOp {
  type: string
  key: string
  value: string
}

export default class DB<T extends { id: string }> {
  private db: levelup.LevelUpBase<levelup.Batch>

  constructor(location: string) {
    this.db = levelup(
      // @ts-ignore: @types/leveldown is wrong.
      new LevelDown(location)
    )
  }

  public put(id: string, element: T) {
    return new Promise((resolve, reject) => {
      this.db.put(id, JSON.stringify(element), error => {
        if (error) {
          reject(error)
        }

        resolve()
      })
    })
  }

  public putMany(elementList: T[]) {
    const batchOps: IOp[] = elementList.map(element => ({
      type: 'put',
      key: element.id,
      value: convertElementToValue(element)
    }))

    return new Promise((resolve, reject) => {
      this.db.batch(batchOps, (error: any) => {
        if (error) {
          reject(error)
        }

        resolve()
      })
    })
  }

  public get(id: string) {
    return new Promise((resolve, reject) => {
      this.db.get(id, (error, value: Uint8Array) => {
        if (error) {
          if (error.notFound) {
            resolve()
          }
          reject(error)
        }

        try {
          resolve(convertValueToElement(value))
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  public filter(filterFn: (element: any) => boolean) {
    return new Promise((resolve, reject) => {
      const filteredValueList: T[] = []
      this.db
        .createValueStream()
        .on('data', (value: Uint8Array) => {
          const element = JSON.parse(new TextDecoder().decode(value))
          if (filterFn(element)) {
            try {
              filteredValueList.push(JSON.parse(element.value))
            } catch (e) {
              reject(e)
            }
          }
        })
        .on('error', (error: any) => reject(error))
        .on('close', () => resolve(filteredValueList))
        .on('end', () => resolve(filteredValueList))
    })
  }

  public close() {
    return new Promise((resolve, reject) => {
      this.db.close(error => {
        if (error) {
          reject(error)
        }

        resolve()
      })
    })
  }
}

function convertValueToElement(value: Uint8Array) {
  try {
    const element: IOp = JSON.parse(new TextDecoder().decode(value))
    return element
  } catch (e) {
    throw e
  }
}

function convertElementToValue(element: any) {
  return JSON.stringify(element)
}
