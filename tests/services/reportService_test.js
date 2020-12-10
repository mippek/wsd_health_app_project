import { assertEquals } from "../../deps.js";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../../app.js";
import { validateData, returnNumberIfNumber, getData } from "../../services/reportService.js";

Deno.test({
    name: "validateData for morning data should pass when given correct data", 
    async fn() {
        const data = {
            date: '2020-12-10',
            mood: 3,
            sleep_duration: 8.0,
            sleep_quality: 4
        }
        const [passes, errors] = await validateData(data, true);
        assertEquals(passes, true);
        assertEquals(errors, {});
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "validateData for morning data should fail when given false data and the errors should contain all errors", 
    async fn() {
        const data = {
            date: 2020,
            mood: 6.2,
            sleep_quality: 0
        }
        const [passes, errors] = await validateData(data, true);
        assertEquals(passes, false);
        assertEquals(Object.keys(errors), ['date', 'mood', 'sleep_duration', 'sleep_quality']);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "validateData for evening data should pass when given correct data", 
    async fn() {
        const data = {
            date: '2020-12-10',
            mood: 3,
            exercise_time: 8.0,
            study_time: 4,
            eating_quality: 4
        }
        const [passes, errors] = await validateData(data, false);
        assertEquals(passes, true);
        assertEquals(errors, {});
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "validateData for evening data should fail when given false data and the errors should contain all errors", 
    async fn() {
        const data = {
            date: 2020,
            mood: 6.2,
            exercise_time: '500',
            eating_quality: 0
        }
        const [passes, errors] = await validateData(data, false);
        assertEquals(passes, false);
        assertEquals(Object.keys(errors), ['date', 'mood', 'exercise_time', 'study_time', 'eating_quality']);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "returnNumberIfNumber should return a number when given a string that can be converted to a number", 
    async fn() {
        assertEquals(returnNumberIfNumber('3'), 3);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "returnNumberIfNumber should return the value itself when given a string that can not be converted to a number", 
    async fn() {
        assertEquals(returnNumberIfNumber('random'), 'random');
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "returnNumberIfNumber should return undefined when given a null value", 
    async fn() {
        assertEquals(returnNumberIfNumber(null), undefined);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "getData should return data with default values when given no parameters", 
    async fn() {
        const defaultData = {
            date: null,
            mood: 3,
            sleep_duration: 0,
            sleep_quality: 3,
            exercise_time: 0,
            study_time: 0,
            eating_quality: 3,
            errors: null
        }
        assertEquals(await getData(), defaultData);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

/*Deno.test("getData should update correct fields in the data when given parameters for morning report", async() => {
    const testApp = await superoak(app);
    const data = {
        date: '2020-12-10',
        mood: 4,
        sleep_duration: 9,
        sleep_quality: 5,
        exercise_time: 0,
        study_time: 0,
        eating_quality: 3,
        errors: null
    }

    const get = async(p) => {
        const map = new Map(); 
        map.set('date', '2020-12-10'); 
        map.set('sleep_duration', '9'); 
        map.set('sleep_quality', '5'); 
        map.set('mood', '4');
        return map.get(p);
    }

    const body = async() => {
        const value = async() => {
            return await map
        }
        const map = new Map(); 
        map.set('date', '2020-12-10'); 
        map.set('sleep_duration', '9'); 
        map.set('sleep_quality', '5'); 
        map.set('mood', '4');
        return {
            value: {
                get: await get
            }
        }
    }

    const request = {
        method: 'test',
        body: await body
    }

    const receivedData = await getData(request, true)

    assertEquals(receivedData, data);
})*/