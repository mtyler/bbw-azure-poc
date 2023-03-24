const request = require('supertest');
const server = require('../server');
const app = require('../app');

const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const xmlFile = fs.readFileSync(path.resolve(__dirname, '../__mockData__/radial-tax-request-mock.xml'), 'utf8');

describe('BBW API Integration Test #1 with Jest', () => {
  afterAll(function(done) {
    console.log('afterAll:')
    server.close(done)
  })

  it('tests MOCK Radial /destinations endpoints', async() => {
    const baseurl_poc = "https://bbw-poc-radial-api-mock001.azurewebsites.net/api/MattTestHttpTrigger01";
    const response = await request(baseurl_poc)
                            .post('/')
                            .set({
                              'Content-Type': 'application/xml', 
                              'Accept': '*/*', 
                              'Accept-Encoding': 'gzip, deflate, br', 
                              'Connection': 'keep-alive',
                              'apiKey': 'msI2jAGhk4HzwA8s33Q8daK5ReuHuEyU'
                              })
                            .send(xmlFile);

    xml = response['text'];
    const obj = convert.xml2js(xml, { compact : true});
    var ItemId = obj.TaxDutyQuoteResponse.Shipping.ShipGroups.ShipGroup.Items.OrderItem.ItemId;

    expect(ItemId._text).toBe('020519316');
    expect(ItemId._attributes.type).toBe('VPN');
  }); 
  
  // it('Tests BBW /destinattions endpoints', async() => {
  //   // const baseurl_bbw = "https://bbwapim.azure-api.net/apparel"
  //   const baseurl_bbw = "http://20.62.218.250:8080/sfdemo";
  //   const response = await request(baseurl_bbw).get('/pants');
  //   // console.log('******************************************************************');
  //   // console.log('ests BBW /destinattions endpoints****************' + response['text']);
  //   expect(response.body.hits[0].productName).toBe("Floral Dress");
  //   expect(response.body.hits[0].price).toBe(129);
  //   expect(response.body.limit).toBe(10);
  //   // expect(response.body.productName).toBe("Floral Dress");
  //   // expect(response.body.price).toBe(129);
  // });
});