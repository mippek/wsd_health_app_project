import { Router } from "../deps.js";
import { hello, showMorningReport, submitMorningReport, showEveningReport, submitEveningReport } from "./controllers/reportController.js";
import { showSummary, setSummaryWeek, setSummaryMonth } from "./controllers/summaryController.js";

const router = new Router();

router.get('/behavior/reporting', hello);
router.get('/behavior/reporting/morning', showMorningReport);
router.post('/behavior/reporting/morning', submitMorningReport);
router.get('/behavior/reporting/evening', showEveningReport);
router.post('/behavior/reporting/evening', submitEveningReport);

router.get('/behavior/summary', showSummary);
router.post('/behavior/summary/week', setSummaryWeek);
router.post('/behavior/summary/month', setSummaryMonth);

export { router };