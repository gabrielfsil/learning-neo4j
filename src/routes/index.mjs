import { Router } from "express";
import { CreateLotController } from "../controllers/CreateLotController.mjs";
import { CreateThrowController } from "../controllers/CreateThrowController.mjs";
import { CreateUserController } from "../controllers/CreateUserController.mjs";

const routes = Router();

const createLotController = new CreateLotController();
const createUserController = new CreateUserController();
const createThrowController = new CreateThrowController();

routes.post("/lots", createLotController.create);
routes.post("/users", createUserController.create);
routes.post("/throws", createThrowController.create);

export { routes };
