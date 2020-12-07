import { executeQuery } from "../../database/database.js";

const getWeeklyAvg = async() => {
    const current_week = (await executeQuery("SELECT DATE_PART('week',NOW()) AS week")).rowsOfObjects()[0].week;
    let previous_week = current_week - 1;
    if (current_week === 1) {
        previous_week = 52;
    }
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('week', date) = $1 AND user_id = $2 GROUP BY DATE_PART('week', date)", previous_week, 1)).rowsOfObjects();
    return res;
}

const getMonthlyAvg = async() => {
    const current_month = (await executeQuery("SELECT DATE_PART('month',NOW()) AS month")).rowsOfObjects()[0].month;
    let previous_month = current_month - 1;
    if (current_month === 1) {
        previous_month = 12;
    }
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('month', date) = $1 AND user_id = $2 GROUP BY DATE_PART('month', date)", previous_month, 1)).rowsOfObjects();
    return res;
}

const showSummary = async({render}) => {
    const weekly_average = await getWeeklyAvg();
    const monthly_average = await getMonthlyAvg();
    console.log(monthly_average);
    render('summary.ejs', {weekly_average: weekly_average[0], monthly_average: monthly_average[0]});
}

/*const showSummary = ({render}) => {
    const today = new Date();
    render('summary.ejs');
}*/

export { showSummary };