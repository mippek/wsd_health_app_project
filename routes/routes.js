import { Router } from "../deps.js";
import { hello, showMorningReport, submitMorningReport } from "./controllers/morningController.js";

const router = new Router();

router.get('/behavior/reporting', hello);
router.get('/behavior/reporting/morning', showMorningReport);
router.post('/behavior/reporting/morning', submitMorningReport);

export { router };