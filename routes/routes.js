import { Router } from "../deps.js";
import { hello, morning } from "./controllers/helloController.js";

const router = new Router();

router.get('/', hello);
router.post('/', morning);

export { router };