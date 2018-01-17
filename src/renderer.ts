import * as vis from 'vis'
import * as querystring from 'querystring'
import * as http from 'http'

const visnetwork = document.getElementById('visnetwork')

const postData = {
  pkgName: 'github.com/hyperledger/fabric/peer/chaincode'
}

const postOpts = {
  host: 'localhost',
  port: '1111',
  path: '/dep',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(postData))
  }
}

const postReq = http.request(postOpts, (response) => {
  let resData = ''
  response.setEncoding('utf8')
  response.on('data', (chunk) => {
    resData += chunk
  })
  response.on('end', () => {
    buildGraph(JSON.parse(resData))
  })
})

function buildGraph (resData: any) {
  const nodes = new vis.DataSet(resData.nodes)
  const edges = new vis.DataSet(resData.edges)
  const network = new vis.Network(visnetwork, resData, { layout: {improvedLayout: false} })
}

postReq.write(JSON.stringify(postData))
postReq.end()