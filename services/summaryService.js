import { executeQuery } from "../database/database.js";
import { validate, required, isDate, isInt, numberBetween } from "../deps.js";
import { returnNumberIfNumber } from "./reportService.js";

const weekValidationRules = {
    week_no: [required, isInt, numberBetween(1, 52)],
    week_year: [required, isInt, numberBetween(2017, 2020)]
};
const monthValidationRules = {
    month_no: [required, isInt, numberBetween(1, 12)],
    month_year: [required, isInt, numberBetween(2017, 2020)]
};

const validateData = async(data, isWeek) => {
    if (isWeek) {
        return await validate(data, weekValidationRules);
    } else {
        return await validate(data, monthValidationRules);
    }
}

const getWeekNumber = (date) => {
    if (isNaN(date)) {
        return undefined;
    }
    const dt = new Date(date.valueOf());
    dt.setDate(dt.getDate() - 7);
    const dayn = (date.getDay() + 6) % 7;
    dt.setDate(dt.getDate() - dayn + 3);
    const firstThursday = dt.valueOf();
    dt.setMonth(0, 1);
    if (dt.getDay() !== 4) {
      dt.setMonth(0, 1 + ((4 - dt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - dt) / 604800000);
}

const getMonthNumber = (date) => {
    if (isNaN(date)) {
        return undefined;
    }
    const current_month = date.getMonth() + 1;
    let previous_month = current_month - 1;
    if (current_month === 1) {
        previous_month = 12;
    }

    return previous_month;
    
}

let default_data = {
    weekly_average: null, 
    monthly_average: null,
    week_no: getWeekNumber(new Date()),
    month_no: getMonthNumber(new Date()),
    week_year: new Date().getFullYear(),
    month_year: new Date().getFullYear(),
    week_errors: null,
    month_errors: null
}

const getSummaryData = async(request, isWeek) => {
    const data = default_data;

    if (request) {
        const body = request.body();
        const params = await body.value;
        if (params.get('year')) {
            const year = params.get('year');
            if (isWeek) {
                const week = params.get('week');
                data.week_no = returnNumberIfNumber(week);
                data.week_year = returnNumberIfNumber(year);
            } else {
                const month = params.get('month');
                data.month_no = returnNumberIfNumber(month);
                data.month_year = returnNumberIfNumber(year);
            }
        } else if (isWeek) {
                let year = undefined;
                let week = undefined;
                if (params.get('default_week')) {
                    year = params.get('default_week').split('-')[0];
                    week = params.get('default_week').split('W')[1];
                } else if (params.get('week')) {
                    week = params.get('week');
                }
                data.week_no = returnNumberIfNumber(week);
                data.week_year = returnNumberIfNumber(year);
        } else {
                let year = undefined;
                let month = undefined;
                if (params.get('default_month')) {
                    year = params.get('default_month').split('-')[0];
                    month = params.get('default_month').split('-')[1];
                } else if (params.get('month')) {
                    month = params.get('month');
                }
                data.month_no = returnNumberIfNumber(month);
                data.month_year = returnNumberIfNumber(year);
        }
    }

    return data;
}

const setSummaryData = (data, isWeek) => {
    if (!data.week_no && !data.month_no) {
        default_data.weekly_average = data.weekly_average;
        default_data.monthly_average = data.monthly_average;
        default_data.user = data.user;
    } else if (isWeek) {
        data.week_errors = null;
        default_data = data;
    } else {
        data.month_errors = null;
        default_data = data;
    }
}

const getDailyAvg = async(date) => {
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood FROM health_reports WHERE date = $1", date)).rowsOfObjects();
    return res;
}

const getWeeklyAvg = async(week, userId) => {
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('week', date) = $1 AND user_id = $2 GROUP BY DATE_PART('week', date)", week, userId)).rowsOfObjects();
    return res;
}

const getMonthlyAvg = async(month, userId) => {
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('month', date) = $1 AND user_id = $2 GROUP BY DATE_PART('month', date)", month, userId)).rowsOfObjects();
    return res;
}

export { validateData, getWeekNumber, getMonthNumber, getSummaryData, setSummaryData, getDailyAvg, getWeeklyAvg, getMonthlyAvg };