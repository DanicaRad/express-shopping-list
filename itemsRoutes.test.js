process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");

let items = require("./fakeDb.js");

let item = {name: "cheese", price: 3.99}

beforeEach(function() {
    items.push(item)
});

afterEach(async() => {
    items.length = 0;
});

describe("GET /items", function() {
    test("Gets list of all items", async function() {
        const resp = await request(app).get(`/items`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([{"name":"cheese","price":3.99}]);
    });
});

describe("GET /items/:name", function() {
    test("Gets item by name", async function() {
        const resp = await request(app).get(`/items/cheese`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"name": "cheese", "price": 3.99});
    });

    test("Responds with 404 if item not found", async function() {
        const resp = await request(app).get(`/items/cake`);

        expect(resp.statusCode).toBe(404);
        expect(resp.body.error).toEqual("Not Found");
    });
});

describe("POST /items", function() {
    test("Add item to items", async function() {
        const resp = await request(app).post(`/items`).send({
            name: "cake",
            price: 30
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body.added).toHaveProperty("name");
        expect(resp.body.added).toHaveProperty("price");
        expect(resp.body).toEqual({"added": {"name": "cake", "price": 30}});
        expect(resp.body.added.name).toEqual("cake");
        expect(resp.body.added.price).toEqual(30);
    });
});

describe("PATCH /items/:name", function() {
    test("Update item", async function() {
        const resp = await request(app).patch(`/items/cheese`).send({
            name: "cheese",
            price: 2.99
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body.updated).toHaveProperty("name");
        expect(resp.body.updated).toHaveProperty("price");
        expect(resp.body.updated.price).toEqual(2.99);
        expect(items.length).toEqual(1);
        expect(resp.body).toEqual({"updated": {"name": "cheese", "price": 2.99}});
    });

    test("Responds with 404 if item not found", async function() {
        const resp = await request(app).patch(`/items/cake`).send({
            "name": "cake",
            "price": 0
        });

        expect(resp.statusCode).toBe(404);
        expect(resp.body.error).toEqual("Not Found");
    });
});

describe("DELETE /items/:name", function() {
    test("Responds with 404 if item not found", async function() {
        const resp = await request(app).delete(`/items/cake`);

        expect(resp.statusCode).toBe(404);
        expect(resp.body.error).toEqual("Not Found");
        expect(items.length).toEqual(1);
    });

    test("Delete item", async function() {
        const resp = await request(app).delete(`/items/${item.name}`);

        expect(resp.statusCode).toEqual(200);
        expect(items.length).toEqual(0);
        expect(resp.body).toEqual({"message": "Deleted"});
    });
});