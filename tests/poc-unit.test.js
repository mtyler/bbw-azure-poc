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

  it("sfdemo with tax info from Radial", async () => {
    const response = await request(app).get('/sfdemo/dress');
    expect(response.statusCode).toBe(200);
    expect(response.body.productName).toBe("Floral Dress");
    expect(response.body.price).toBe(129);
  });

  it("/healthz should return 200", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(200);
  });
})
