/*
  Jon Fausey
  20230130
*/

const express = require('express')
const bodyParser = require('body-parser')

// declare a new express app
const app = express()
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

/** JF: Logging utility function for inspecting requests */
const _LOG_REQUEST_INFO = false
const logRequestInfo = function(req, res) {
  //const stackTrace = new Error().stack
  //console.debug(stackTrace)

  if (_LOG_REQUEST_INFO && req) {
    let port = req.port ? `:${req.port}` : ''
    let requestUrl = `${req.protocol}://${req.hostname}${port}${req.path}`
    console.debug(`Request: ${req.method} ${requestUrl}`)
    console.debug("Request headers: " + JSON.stringify(req.headers))
    console.debug("Request body: " + JSON.stringify(req.body))
    console.debug("Request params: " + JSON.stringify(req.params))
    console.debug("Request qSParams: " + JSON.stringify(req.query))
    //console.debug(req.originalUrl)
    //console.debug(req.subdomains)
  }
}

/** For sfdemo **/
const {Search, Customer} = require('commerce-sdk')

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
    siteId: SITE_ID,
  },
}

/**
 * Get the shopper or guest JWT/access token, along with a refresh token, using client credentials
 *
 * @returns guest user authorization token
 */
async function getGuestUserAuthToken() {
  const base64Auth = Buffer.from(`${SLAS_CLIENT_ID}:${SLAS_CLIENT_SECRET}`).toString('base64')
  const headers = {Authorization: `Basic ${base64Auth}`}
  const loginClient = new Customer.ShopperLogin(config)
  try {
    const foo = await loginClient.getAccessToken({
      headers,
      body: {grant_type: 'client_credentials'},
    })
    return foo
  } catch (e) {
    return
  }
}

// Get a JWT to use with Shopper API clients
async function shop(req, res) {
  logRequestInfo(req, res)
  let tokenData
  try {
    tokenData = await getGuestUserAuthToken()
    //console.log(`${JSON.stringify(tokenData)}`)
  } catch (e) {
    console.error(e)
    console.error(await e.response.text())
  }

  // Add the token to the client configuration
  config.headers['authorization'] = `Bearer ${tokenData.access_token}`

  // Search
  console.log(`shop: ${JSON.stringify(req.params)}`)
  console.log(`shop: ${JSON.stringify(req.params[0])}`)
  const queryTerm = req.params[0]
  const searchClient = new Search.ShopperSearch(config)
  const limit = 10
  const searchResults = await searchClient.productSearch({
    parameters: {q: queryTerm, limit: limit},
    //parameters: {q: 'pants', limit: limit},
    //parameters: {q: 'shoes', limit: limit},
    //parameters: {q: 'blue', limit: limit},
  })

  if (searchResults.total) {
    for (i = 0; i < limit; i++) {
      const result = searchResults.hits[i]
      console.log(`***** ${result.productId} ${result.productName}`)
    }
  } else {
    console.log('No results for search')
  }
  return searchResults
}


/**********************
 * Example get method *
 **********************/

app.get('/sfdemo', function(req, res) {
  let data = shop(req, res)
  res.json(data)
});

app.get('/sfdemo/*', async function(req, res) {
  const data = await shop(req, res)
  //console.log(data)
  res.json(data)
});

/****************************
* Example post method *
****************************/

app.post('/item', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/item', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/item', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/item/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing.
// Necessary?
module.exports = app
