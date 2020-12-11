import { app } from "../app.js";
import { superoak } from "../deps.js";

Deno.test({
    name: "GET request to / should return the main page", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/")
            .expect(200); 
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /auth/login should return the login page", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/auth/login")
            .expect(200); 
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /auth/registration should return the register page", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/auth/registration")
            .expect(200); 
    },
    sanitizeResources: false,
    sanitizeOps: false
});

