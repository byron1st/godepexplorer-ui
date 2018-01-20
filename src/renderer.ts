import * as visfn from './visfn'
import * as conn from './conn'

function getInitDir (pkgName: string) {
  const postData: conn.PostData = { pkgName }

  conn.sendReqToGodepexplorer(postData, conn.Path.DIR)
  .then((rawData: string) => {
    const resData: visfn.ResData = JSON.parse(rawData)
    visfn.buildInitDirGraph(resData)
  })
}

function getDepsForPkg (pkgName: string) {
  const postData: conn.PostData = { pkgName }

  conn.sendReqToGodepexplorer(postData, conn.Path.DEP)
  .then((rawData: string) => {
    const resData: visfn.ResData = JSON.parse(rawData)
    visfn.addDepsToGraph(resData)
  })
}

const visnetwork = document.getElementById('visnetwork')
visfn.init(visnetwork, getDepsForPkg)
getInitDir('github.com/hyperledger/fabric/peer')
