import { Router } from "../deps.js";
import { hello, morning } from "./controllers/helloController.js";

const router = new Router();

router.get('/behavior/reporting', hello);
router.get('/behavior/reporting/morning', morning);

export { router };