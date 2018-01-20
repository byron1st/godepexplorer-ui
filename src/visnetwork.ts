import * as vis from 'vis'
import * as visfn from './visfn'
import * as conn from './conn'

let htmlVisnetwork: HTMLElement
let nodes: vis.DataSet<visfn.Node>, edges: vis.DataSet<visfn.Edge>

function getInitDir (pkgName: string) {
  const postData: conn.PostData = { pkgName }

  conn.sendReqToGodepexplorer(postData, conn.Path.DIR)
  .then((rawData: string) => {
    const resData: visfn.ResData = JSON.parse(rawData)
    visfn.buildInitDirGraph(resData)
  })
}

async function getDepsForPkg (params: any) {
  if (params.nodes.length === 0) {
    return
  }

  const id: string = params.nodes[0]
  const pkg = nodes.get(id)
  const postData: conn.PostData = { pkgName: pkg.packagePath }

  const rawData = await conn.sendReqToGodepexplorer(postData, conn.Path.DEP)
  const resData: visfn.ResData = JSON.parse(rawData)
  visfn.addDepsToGraph(resData)
}

export function init (htmlElement: HTMLElement) {
  htmlVisnetwork = htmlElement
  const data = visfn.init()
  nodes = data.nodes
  edges = data.edges

  const visnetwork = new vis.Network(htmlVisnetwork, { nodes, edges }, {})

  visnetwork.on('doubleClick', getDepsForPkg)

  // TEST
  getInitDir('github.com/hyperledger/fabric/peer')
}

