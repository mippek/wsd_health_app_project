import { Router } from "../deps.js";
import { hello, showMorningReport, submitMorningReport, showEveningReport, submitEveningReport } from "./controllers/reportController.js";
import { showSummary, setSummaryWeek, setSummaryMonth } from "./controllers/summaryController.js";
import { showRegistration, register, showLogin, authenticate, logout } from "./controllers/userController.js";
import { returnUserIfAuthenticated } from "../services/userService.js";

import { executeQuery } from "../database/database.js";

const router = new Router();

const getDailyAvg = async(date) => {
    const res = (await executeQuery("SELECT COALESCE(AVG(CAST(mood AS FLOAT)), 0) AS avg_mood FROM health_reports WHERE date = $1", date)).rowsOfObjects();
    return res;
}

const showIndexPage = async({render, session}) => {
    const today = new Date();
    const avg_mood_today = await getDailyAvg(today.toISOString().split('T')[0]);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const avg_mood_yesterday = await getDailyAvg(yesterday.toISOString().split('T')[0]);
    /*console.log(avg_mood_today);
    console.log(avg_mood_yesterday);*/
    render('index.ejs', {
        avg_mood_today: avg_mood_today[0].avg_mood, 
        avg_mood_yesterday: avg_mood_yesterday[0].avg_mood, 
        user: await returnUserIfAuthenticated(session)
    });
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

router.get('/auth/registration', showRegistration);
router.post('/auth/registration', register);
router.get('/auth/login', showLogin);
router.post('/auth/login', authenticate);
router.get('/auth/logout', logout);

export { router };