import { test, expect } from '@playwright/test';

// @ts-check
test.describe("API Test #1 with Playwright", () => {
    const baseurl = "https://bbwapim.azure-api.net/apparel";
    test("GET API Request with - Valid 200 Response ", async ({ request }) => {
        const response = await request.get(`${baseurl}/dress`);
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.hits[0].productName).toBe("Modern Dress Shirt");
        expect(responseBody.hits[0].price).toBe(135);
    });
});