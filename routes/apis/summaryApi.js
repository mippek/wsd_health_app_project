import { executeQuery } from "../../database/database.js";

const showSummaryAvgForWeek = async({response}) => {
    const today = new Date().toISOString().split('T')[0];

    let weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo = weekAgo.toISOString().split('T')[0];

    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE date >= $1 AND date <= $2", weekAgo, today)).rowsOfObjects();

    response.body = {averagesForOneWeek: res};
}

const showSummaryAvgForDay = async({params, response}) => {
    const year = params.year;
    const month = params.month;
    const day = params.day;

    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood, COALESCE(AVG(sleep_duration), 0) AS avg_sleep_duration, COALESCE(AVG(CAST(sleep_quality AS FLOAT)), 0) AS avg_sleep_quality, COALESCE(AVG(exercise_time), 0) AS avg_exercise_time, COALESCE(AVG(study_time), 0) AS avg_study_time FROM health_reports WHERE DATE_PART('year', date) = $1 AND DATE_PART('month', date) = $2 AND DATE_PART('day', date) = $3", year, month, day)).rowsOfObjects();

    response.body = {averagesForOneDay: res};
}

export { showSummaryAvgForWeek, showSummaryAvgForDay };