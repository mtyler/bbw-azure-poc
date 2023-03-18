// need to install:
// npm install --save-dev jest@29.5.0
// npm install --save-dev jest-fetch-mock@2.1.2
// npm install --save-dev supertest@6.3.3
// npm install --save-dev cross-fetch@3.1.5

const request = require('supertest');

const baseurl = "https://bbwapim.azure-api.net/apparel"

describe('API Integration Test #1 with Jest', () => {
  it('tests /destinations endpoints', async() => {
    const response = await request(`${baseurl}`).get('/dress');
    console.log(response.body);
    expect(response.body.hits[0].productName).toBe("Floral Dress");
    expect(response.body.hits[0].price).toBe(129);
    expect(response.body.limit).toBe(10);
  });
});

////////////   this is a playwright test     ////////////
//   // @ts-check
// test.describe("API Test #1 with Playwright", () => {
//     const baseurl = "https://bbwapim.azure-api.net/apparel";
//     test("GET API Request with - Valid 200 Response ", async ({ request }) => {
//         const response = await request.get(`${baseurl}/dress`);
//         expect(response.status()).toBe(200);
//         const responseBody = JSON.parse(await response.text());
//         expect(responseBody.hits[0].productName).toBe("Floral Dress");
//         expect(responseBody.hits[0].price).toBe(129);
//     });
// });