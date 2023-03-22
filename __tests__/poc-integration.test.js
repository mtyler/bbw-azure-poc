// need to install:
// npm install --save-dev jest@29.5.0
// npm install --save-dev supertest@6.3.3
// npm install --save-dev express@4.18.2
// npm install --save-dev xml-js@1.6.11

// TO TEST EXPRESS API's
// npm i express nodemon 

const request = require('supertest');
const server = require('../server');
const app = require('../app');

const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const xmlFile = fs.readFileSync(path.resolve(__dirname, '../__mockData__/radial-tax-request-mock.xml'), 'utf8');

const baseurl_poc = "https://bbw-poc-radial-api-mock001.azurewebsites.net/api/MattTestHttpTrigger01";
const baseurl_radial = "https://uat01-epapi-na.gsipartners.com";
const radial_post = "/v1.0/stores/BB2US/taxes/quote.xml";

describe('Radial MOCK API Integration Test #1 with Jest', () => {
  afterAll(function(done) {
    console.log('afterAll:')
    server.close(done)
  })

  it('tests MOCK Radial /destinations endpoints', async() => {
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
  
    it('tests Radial /destinations endpoints', async() => {
      // const response = await request(baseurl_radial)
      //                         .post('/v1.0/stores/BB2US/taxes/quote.xml')
      const response = await request(baseurl_radial + radial_post)
                              .post('')
                              .set({
                                'Content-Type': 'application/xml', 
                                'Accept': '*/*', 
                                'Accept-Encoding': 'gzip, deflate, br', 
                                'Connection': 'keep-alive',
                                'apiKey': 'msI2jAGhk4HzwA8s33Q8daK5ReuHuEyU'
                                })
                              .send(xmlFile);
  
      xml = response['text'];
      const obj = convert.xml2js(xml, { compact : true})
      var ItemId = obj.TaxDutyQuoteResponse.Shipping.ShipGroups.ShipGroup.Items.OrderItem.ItemId
      // console.log(`${ItemId._text} - ${ItemId._attributes.type}`)
      // console.log('******************************************************************');
  
      expect(ItemId._text).toBe('020519316');
      expect(ItemId._attributes.type).toBe('VPN');
    }); 
});