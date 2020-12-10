import { assertEquals } from "../../deps.js";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { app } from "../../app.js";
import { validateData, getWeekNumber, getMonthNumber, getSummaryData, setSummaryData } from "../../services/summaryService.js";

Deno.test({
    name: "validateData for weekly data should pass when given correct data", 
    async fn() {
        const data = {
            week_no: 50,
            week_year: 2020
        }
        const [passes, errors] = await validateData(data, true);
        assertEquals(passes, true);
        assertEquals(errors, {});
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "validateData for weekly data should fail when given false data and the errors should contain all errors", 
    async fn() {
        const data = {
            week_no: 500.0
        }
        const [passes, errors] = await validateData(data, true);
        assertEquals(passes, false);
        assertEquals(Object.keys(errors), ['week_no', 'week_year']);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "validateData for monthly data should pass when given correct data", 
    async fn() {
        const data = {
            month_no: 12,
            month_year: 2020
        }
        const [passes, errors] = await validateData(data, false);
        assertEquals(passes, true);
        assertEquals(errors, {});
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "validateData for monthly data should fail when given false data and the errors should contain all errors", 
    async fn() {
        const data = {
            year_no: '2020'
        }
        const [passes, errors] = await validateData(data, false);
        assertEquals(passes, false);
        assertEquals(Object.keys(errors), ['month_no', 'month_year']);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "getWeekNumber should return correct week number, the number of the previous week, when given a correctly formatted date", 
    async fn() {
        const date = new Date(2020, 11, 10); // the date is now 2020-12-10
        const weekNo = getWeekNumber(date);
        assertEquals(weekNo, 49);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "getWeekNumber should return undefined when given a false date", 
    async fn() {
        const date = '2020-twelve-ten';
        const weekNo = getWeekNumber(date);
        assertEquals(weekNo, undefined);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "getMonthNumber should return correct month number, the number of the previous month, when given a correctly formatted date", 
    async fn() {
        const date = new Date(2020, 11, 10); // the date is now 2020-12-10
        const monthNo = getMonthNumber(date);
        assertEquals(monthNo, 11);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "getMonthNumber should return undefined when given a false date", 
    async fn() {
        const date = '2020-twelve-ten';
        const monthNo = getMonthNumber(date);
        assertEquals(monthNo, undefined);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "getSummaryData should return data with default values when given no parameters", 
    async fn() {
        const defaultData = {
            weekly_average: null, 
            monthly_average: null,
            week_no: getWeekNumber(new Date()),
            month_no: getMonthNumber(new Date()),
            week_year: new Date().getFullYear(),
            month_year: new Date().getFullYear(),
            week_errors: null,
            month_errors: null
        }
        assertEquals(await getSummaryData(), defaultData);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "setSummaryData should only update the averages of the data when given an object with no week number and no month number", 
    async fn() {
        const weeklyAvg = {
            avg_mood: 4, 
            avg_sleep_duration: 8, 
            avg_sleep_quality: 4, 
            avg_exercise_time: 3,
            avg_study_time: 4
        }
        const monthlyAvg = weeklyAvg;
        const user = {
            id: 1,
            email: 'test@email.com'
        }
        const data = {
            weekly_average: weeklyAvg,
            monthly_average: monthlyAvg,
            user: user
        }
        const receivedData = {
            weekly_average: weeklyAvg, 
            monthly_average: monthlyAvg,
            week_no: getWeekNumber(new Date()),
            month_no: getMonthNumber(new Date()),
            week_year: new Date().getFullYear(),
            month_year: new Date().getFullYear(),
            week_errors: null,
            month_errors: null,
            user: user
        }
        setSummaryData(data);
        assertEquals(await getSummaryData(), receivedData);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "setSummaryData should update the default data to the data it takes as a parameter and update the week errors to null when given an object with week and month numbers and true as the second parameter", 
    async fn() {
        const weeklyAvg = {
            avg_mood: 4, 
            avg_sleep_duration: 8, 
            avg_sleep_quality: 4, 
            avg_exercise_time: 3,
            avg_study_time: 4
        }
        const monthlyAvg = weeklyAvg;
        const user = {
            id: 1,
            email: 'test@email.com'
        }
        const data = {
            weekly_average: weeklyAvg,
            monthly_average: monthlyAvg,
            week_no: 15,
            month_no: 10,
            week_year: 2020,
            month_year: 2020,
            week_errors: { week_no: 'is required' },
            month_errors: { month_no: 'is required' },
            user: user
        }
        const receivedData = {
            weekly_average: weeklyAvg, 
            monthly_average: monthlyAvg,
            week_no: 15,
            month_no: 10,
            week_year: 2020,
            month_year: 2020,
            week_errors: null,
            month_errors: { month_no: 'is required' },
            user: user
        }
        setSummaryData(data, true);
        assertEquals(await getSummaryData(), receivedData);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "setSummaryData should update the default data to the data it takes as a parameter and update the month errors to null when given an object with week and month numbers and false as the second parameter", 
    async fn() {
        const weeklyAvg = {
            avg_mood: 4, 
            avg_sleep_duration: 8, 
            avg_sleep_quality: 4, 
            avg_exercise_time: 3,
            avg_study_time: 4
        }
        const monthlyAvg = weeklyAvg;
        const user = {
            id: 1,
            email: 'test@email.com'
        }
        const data = {
            weekly_average: weeklyAvg,
            monthly_average: monthlyAvg,
            week_no: 15,
            month_no: 10,
            week_year: 2020,
            month_year: 2020,
            week_errors: { week_no: 'is required' },
            month_errors: { month_no: 'is required' },
            user: user
        }
        const receivedData = {
            weekly_average: weeklyAvg, 
            monthly_average: monthlyAvg,
            week_no: 15,
            month_no: 10,
            week_year: 2020,
            month_year: 2020,
            week_errors: { week_no: 'is required' },
            month_errors: null,
            user: user
        }
        setSummaryData(data, false);
        assertEquals(await getSummaryData(), receivedData);
    },
    sanitizeResources: false,
    sanitizeOps: false
});