import { Router } from "../deps.js";
import { showReporting, showMorningReport, submitMorningReport, showEveningReport, submitEveningReport } from "./controllers/reportController.js";
import { showIndexPageSummary, showSummary, submitSummaryWeek, submitSummaryMonth } from "./controllers/summaryController.js";
import { showRegistration, register, showLogin, authenticate, logout } from "./controllers/userController.js";
import { showSummaryAvgForWeek, showSummaryAvgForDay } from "./apis/summaryApi.js";

const router = new Router();

router.get('/', showIndexPageSummary);

router.get('/behavior/reporting', showReporting);
router.get('/behavior/reporting/morning', showMorningReport);
router.post('/behavior/reporting/morning', submitMorningReport);
router.get('/behavior/reporting/evening', showEveningReport);
router.post('/behavior/reporting/evening', submitEveningReport);

router.get('/behavior/summary', showSummary);
router.post('/behavior/summary/week', submitSummaryWeek);
router.post('/behavior/summary/month', submitSummaryMonth);

router.get('/auth/registration', showRegistration);
router.post('/auth/registration', register);
router.get('/auth/login', showLogin);
router.post('/auth/login', authenticate);
router.get('/auth/logout', logout);

router.get('/api/summary', showSummaryAvgForWeek);
router.get('/api/summary/:year/:month/:day', showSummaryAvgForDay);

export { router };