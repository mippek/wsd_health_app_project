import { assertEquals } from "../../deps.js";
import { bcrypt } from "../../deps.js";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../../app.js";
import { isCorrectPassword, setSession, cleanSession, returnUserIfAuthenticated } from "../../services/userService.js";

Deno.test({
    name: "isCorrectPassword should return true when given a correct password for the hash given as a parameter", 
    async fn() {
        const hash = await bcrypt.hash('secret');
        assertEquals(await isCorrectPassword('secret', hash), true);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "isCorrectPassword should return false when given a wrong password for the hash given as a parameter", 
    async fn() {
        const hash = await bcrypt.hash('random');
        assertEquals(await isCorrectPassword('secret', hash), false);
    },
    sanitizeResources: false,
    sanitizeOps: false
});


