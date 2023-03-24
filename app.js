/* Updated by John Luo on March 17, 2023
  Jon Fausey
  20230130
*/
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const createServer = require('./server') // new

// declare a new express app
const app = express()
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

/** JF: Logging utility function for inspecting requests */
const _LOG_REQUEST_INFO = false
const logRequestInfo = function (req, res) {
  // const stackTrace = new Error().stack
  // console.debug(stackTrace)

  if (_LOG_REQUEST_INFO && req) {
    const port = req.port ? `:${req.port}` : ''
    const requestUrl = `${req.protocol}://${req.hostname}${port}${req.path}`
    console.debug(`Request: ${req.method} ${requestUrl}`)
    console.debug('Request headers: ' + JSON.stringify(req.headers))
    console.debug('Request body: ' + JSON.stringify(req.body))
    console.debug('Request params: ' + JSON.stringify(req.params))
    console.debug('Request qSParams: ' + JSON.stringify(req.query))
    // console.debug(req.originalUrl)
    // console.debug(req.subdomains)
  }
}

/** For sfdemo **/
const { Search, Customer, sdkLogger} = require('commerce-sdk')

const SLAS_CLIENT_ID = 'da422690-7800-41d1-8ee4-3ce983961078'
// WARNING: Secret is provided here for convenience only. Do not include secrets in your code!
const SLAS_CLIENT_SECRET = 'D*HHUrgO2%qADp2JTIUi'
// const SLAS_CLIENT_SECRET = process.env.SLAS_CLIENT_SECRET
const ORG_ID = 'f_ecom_zzte_053'
const SHORT_CODE = 'kv7kzm78'
const SITE_ID = 'RefArch'

// Client configuration parameters
const config = {
  headers: {},
  parameters: {
    clientId: SLAS_CLIENT_ID,
    organizationId: ORG_ID,
    shortCode: SHORT_CODE,
    siteId: SITE_ID
  }
}

/**
 * Get the shopper or guest JWT/access token, along with a refresh token, using client credentials
 *
 * @returns guest user authorization token
 */
async function getGuestUserAuthToken () {
  const base64Auth = Buffer.from(`${SLAS_CLIENT_ID}:${SLAS_CLIENT_SECRET}`).toString('base64')
  const headers = { Authorization: `Basic ${base64Auth}` }
  const loginClient = new Customer.ShopperLogin(config)
  try {
    const foo = await loginClient.getAccessToken({
      headers,
      body: { grant_type: 'client_credentials' }
    })
    return foo
  } catch (e) {

  }
}

// Get a JWT to use with Shopper API clients
async function shop (req, res) {
  logRequestInfo(req, res)
  let tokenData
  try {
    tokenData = await getGuestUserAuthToken()
    // console.log(`${JSON.stringify(tokenData)}`)
  } catch (e) {
    console.error(e)
    console.error(await e.response.text())
  }

  // Add the token to the client configuration
  config.headers.authorization = `Bearer ${tokenData.access_token}`

  // Search
  //console.log(`shop: ${JSON.stringify(req.params)}`)
  //console.log(`shop: ${JSON.stringify(req.params[0])}`)
  const queryTerm = req.params[0]
  const searchClient = new Search.ShopperSearch(config)
  const limit = 10
  const searchResults = await searchClient.productSearch({
    parameters: { q: queryTerm, limit }
  })

  if (searchResults.total) {
    console.log(`${searchResults.total} results for ${queryTerm}`)
    for (i = 0; i < limit; i++) {
      const result = searchResults.hits[i]
      if (0 === i) {
      }
    }
  } else {
    console.log('No results for search')
  }
  return searchResults
}

/********************************************************************
 * Query a Radial API that returns XML and parse he response to JSON.
 ********************************************************************/
const xml2js = require('xml2js')
const fetch = require('node-fetch')

async function getTaxes() {
  const parser = new xml2js.Parser()
  parser.on('error', function (err) {
    console.log('Parser error', err)
  })
  let json = ''
  try {
    const res2 = await fetch('https://bbw-poc-radial-api-mock001.azurewebsites.net/api/matttesthttptrigger01')
    if (!res2.ok) {
      throw new Error(`HTTP error: ${res2.status}`)
    }
    const data = await res2.text()
    parser.parseString(data, function (err, result) {
      json = result
      //console.log('json = ', JSON.stringify(json))
    })
  } catch (e) {
    console.error(e)
    console.error(e.response.text())
  }
  return json
}

/**********************
 * Example get method *
 **********************/

app.get('/', function (req, res) {
  // JF: 20230210 - trying to return a 200 for AKS probe health checks
  const build = process.env.BUILD
  res.json({ success: 'get call succeed!', url: req.url, body: req.body })
})

app.get('/sfdemo', function (req, res) {
  const data = shop(req, res)
  res.json(data)
})

const jp = require('jsonpath')
app.get('/sfdemo/*', async function (req, res) {
  // There is no actual relationship between the apparel items in the
  // SF demo Shopper API and order items in the mock Radial API but
  // let's pretend that we're going to retrieve the taxes for the first
  // apparel product in the Shopper API search results and mash them up
  // to create our response object.
  const apparelSearchResults = await shop(req, res)
  //console.log('Apparel search results: ', apparelSearchResults)
  const product = apparelSearchResults.hits[0]

  const extraCosts = await getTaxes()
  //console.log('Extra costs: ', JSON.stringify(extraCosts))
  const taxData = jp.query(extraCosts, '$..TaxData')

  const data = { // Not beautiful, but makes the point.
    productName: product.productName,
    price: product.price,
    taxData: taxData
  }
  //console.log('Response object: \n', JSON.stringify(data, null, 2))

  res.json(data)
})

/****************************
* Example post method *
****************************/
// const fs = require('fs');
// const path = require('path');
// // const convert = require('xml-js');

// const xmlFile = fs.readFileSync(path.resolve(__dirname, './__mockData__/radial-tax-response-mock.xml'), 'utf8');

// app.post('/', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: xmlFile})
// });

app.post('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

app.post('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'post call succeed!', url: req.url, body: req.body })
})

/****************************
* Example put method *
****************************/

app.put('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

app.put('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'put call succeed!', url: req.url, body: req.body })
})

/****************************
* Example delete method *
****************************/

app.delete('/item', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url, body: req.body })
})

app.delete('/item/*', function (req, res) {
  // Add your code here
  res.json({ success: 'delete call succeed!', url: req.url })
})

/****************************
* Healthcheck method *
****************************/

app.get('/healthz', (req, res) => {
  res.status(200).send(process.env.BUILD)
})

// process.on('SIGTERM', () => {
//   server.close(() => {
//   })
// })

module.exports = app