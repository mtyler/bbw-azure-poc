const request = require('supertest');
const server = require('../server');
const app = require('../app')

describe('Get API tests using supertest', () => {
    afterAll(function(done) {
      console.log('afterAll:')
      server.close(done)
    })
  
  it("get should return 200", async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe('get call succeed!');
  });

  it("post/item should return 200", async () => {
    const response = await request(app).post("/item");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe('post call succeed!');
  });
  it("put/item should return 200", async () => {
    const response = await request(app).put("/item");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe('put call succeed!');
  });
  it("delete/item should return 200", async () => {
    const response = await request(app).delete("/item");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe('delete call succeed!');
  });

});

// ////////////   this is a playwright test     ////////////
// //   // @ts-check
// // test.describe("API Test #1 with Playwright", () => {
// //     const baseurl = "https://bbwapim.azure-api.net/apparel";
// //     test("GET API Request with - Valid 200 Response ", async ({ request }) => {
// //         const response = await request.get(`${baseurl}/dress`);
// //         expect(response.status()).toBe(200);
// //         const responseBody = JSON.parse(await response.text());
// //         expect(responseBody.hits[0].productName).toBe("Floral Dress");
// //         expect(responseBody.hits[0].price).toBe(129);
// //     });
// // });