const request = require('supertest');
const server = require('../server');
const app = require('../app');

const fs = require('fs');
const path = require('path');
const convert = require('xml-js');

const xmlFile = fs.readFileSync(path.resolve(__dirname, '../mockData/radial-tax-request-mock.xml'), 'utf8');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const baseurl = process.env.SFDEMO_URL;
console.log(`Running integration tests using base Url: ${baseurl}`);    

describe('BBW API Integration Test #1 with Jest', () => {

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
  
  it('Tests POC API /pants endpoint', async() => {
    const response = await request(baseurl).get('/pants');
    expect(response.body.productName).toBe("Classic Fit Jean");
    expect(response.body.price).toBe(59);
    expect(response.body.taxData[0][0].TaxClass[0]).toBe("76800");
    expect(response.body.taxData[0][0].Taxes[0].Tax[0].Situs[0]).toBe("ADMINISTRATIVE_ORIGIN");
  });

  it('Tests POC API /dress endpoint', async() => {
    const response = await request(baseurl).get('/dress');
    expect(response.body.productName).toBe("Floral Dress");
    expect(response.body.price).toBe(129);
    expect(response.body.taxData[0][0].TaxClass[0]).toBe("76800");
    expect(response.body.taxData[0][0].Taxes[0].Tax[0].Situs[0]).toBe("ADMINISTRATIVE_ORIGIN");
  });
});