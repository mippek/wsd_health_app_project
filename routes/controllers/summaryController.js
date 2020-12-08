import { executeQuery } from "../../database/database.js";
import { validate, required, isDate, isInt, numberBetween } from "../../deps.js";

const weekValidationRules = {
    week_no: [required, isInt, numberBetween(1, 53)]
};
const monthValidationRules = {
    month_no: [required, isInt, numberBetween(1, 12)]
};

const validateData = async(data, isWeek) => {
    if (isWeek) {
        return await validate(data, weekValidationRules);
    } else {
        return await validate(data, monthValidationRules);
    }
}

const getWeekNumber = (date) => {
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
    const current_month = new Date().getMonth() + 1;
    let previous_month = current_month - 1;
    if (current_month === 1) {
        previous_month = 12;
    }

    return previous_month;
}

const getSummaryData = async(request, isWeek) => {
    const data = default_data;

    if (request) {
        const body = request.body();
        const params = await body.value;
        
        if (isWeek) {
            data.week_no = Number(params.get('week'));
        } else {
            data.month_no = Number(params.get('month'));
        }
    }

    return data;
}


/*let default_week = getWeekNumber(new Date());
let default_month = getMonthNumber(new Date());
let default_data = await getSummaryData();*/
let default_data = {
    weekly_average: null, 
    monthly_average: null,
    week_no: getWeekNumber(new Date()),
    month_no: getMonthNumber(new Date()),
    week_errors: null,
    month_errors: null
}

const getWeeklyAvg = async(week) => {
    /*const current_week = getWeekNumber(new Date());
    let previous_week = current_week - 1;*/

    let previous_week = week;

    /*if (week) {
        previous_week = week;
    }*/
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('week', date) = $1 AND user_id = $2 GROUP BY DATE_PART('week', date)", previous_week, 1)).rowsOfObjects();
    return res;
}

const getMonthlyAvg = async(month) => {
    /*const current_month = new Date().getMonth() + 1;
    let previous_month = current_month - 1;*/

    let previous_month = month;
    /*if (month) {
        previous_month = month;
    }*/
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('month', date) = $1 AND user_id = $2 GROUP BY DATE_PART('month', date)", previous_month, 1)).rowsOfObjects();
    return res;
}

const showSummary = async({render}) => {
    /*const weekly_average = await getWeeklyAvg();
    const monthly_average = await getMonthlyAvg();*/
    default_data.weekly_average = (await getWeeklyAvg(default_data.week_no))[0];
    default_data.monthly_average = (await getMonthlyAvg(default_data.month_no))[0];
    
    render('summary.ejs', default_data);
}

const setSummaryData = (data, isWeek) => {
    if (isWeek) {
        data.week_errors = null;
    } else {
        data.month_errors = null;
    }
    default_data = data;
}

const setSummaryWeek = async({request, render, response}) => {
    const data = await getSummaryData(request, true);
    const [passes, errors] = await validateData(data, true);
    
    if (!passes) {
        /*data.weekly_average = default_data.weekly_average;
        data.monthly_average = default_data.monthly_average;*/
        data.week_errors = errors;
        render('summary.ejs', data)
    } else {
        await setSummaryData(data, true);
        response.redirect('/behavior/summary');
    }
    /*const body = request.body();
    const params = await body.value;
    const week = Number(params.get('week'));*/

}

const setSummaryMonth = async({request, render, response}) => {
    /*const body = request.body();
    const params = await body.value;
    const month = Number(params.get('month'));*/
    const data = await getSummaryData(request, false);
    const [passes, errors] = await validateData(data, false);
    
    if (!passes) {
        /*data.weekly_average = default_data.weekly_average;
        data.monthly_average = default_data.monthly_average;*/
        data.month_errors = errors;
        render('summary.ejs', data)
    } else {
        await setSummaryData(data, false);
        response.redirect('/behavior/summary');
    }
}

export { showSummary, setSummaryWeek, setSummaryMonth };