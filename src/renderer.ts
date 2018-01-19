import * as visfn from './visfn'
import * as network from './network'

function getInitDir (pkgName: string) {
  const postData: network.PostData = { pkgName }

  network.sendReqToGodepexplorer(postData, network.Path.DIR)
  .then((rawData: string) => {
    const resData: visfn.ResData = JSON.parse(rawData)
    visfn.buildInitDirGraph(resData)
  })
}

function getDepsForPkg (pkgName: string) {
  const postData: network.PostData = { pkgName }

  network.sendReqToGodepexplorer(postData, network.Path.DEP)
  .then((rawData: string) => {
    const resData: visfn.ResData = JSON.parse(rawData)
    visfn.addDepsToGraph(resData)
  })
}

const visnetwork = document.getElementById('visnetwork')
visfn.init(visnetwork)
getInitDir('github.com/hyperledger/fabric/peer')
