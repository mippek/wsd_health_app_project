import { Router } from "../deps.js";
import { hello, showMorningReport, submitMorningReport, showEveningReport, submitEveningReport } from "./controllers/reportController.js";
import { showSummary, setSummaryWeek, setSummaryMonth } from "./controllers/summaryController.js";

import { executeQuery } from "../database/database.js";

const router = new Router();

const showIndexPage = async({render}) => {
    const today = new Date();
    const avg_mood_today = await getDailyAvg(today.toISOString().split('T')[0]);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const avg_mood_yesterday = await getDailyAvg(yesterday.toISOString().split('T')[0]);
    /*console.log(avg_mood_today);
    console.log(avg_mood_yesterday);*/
    render('index.ejs', {avg_mood_today: avg_mood_today[0].avg_mood, avg_mood_yesterday: avg_mood_yesterday[0].avg_mood});
}

const getDailyAvg = async(date) => {
    console.log(date);
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood FROM health_reports WHERE date = $1 AND user_id = $2", date, 1)).rowsOfObjects();
    console.log(res);
    return res;
}

router.get('/', showIndexPage);

router.get('/behavior/reporting', hello);
router.get('/behavior/reporting/morning', showMorningReport);
router.post('/behavior/reporting/morning', submitMorningReport);
router.get('/behavior/reporting/evening', showEveningReport);
router.post('/behavior/reporting/evening', submitEveningReport);

router.get('/behavior/summary', showSummary);
router.post('/behavior/summary/week', setSummaryWeek);
router.post('/behavior/summary/month', setSummaryMonth);

export { router };