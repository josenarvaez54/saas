import express from "express";

import * as EmailController from "../controllers/EmailController";
import isAuth from "../middleware/isAuth";

const routes = express.Router();

routes.post("/saveTemplate", isAuth, EmailController.save);

routes.get("/templates", isAuth, EmailController.templates);

routes.get("/template/:id", isAuth, EmailController.showTemplateById);

routes.delete("/template/:id", isAuth, EmailController.removeTemplate);

routes.put("/template/:id", isAuth, EmailController.updateTemplate);

routes.post("/saveCampaignEmail", isAuth, EmailController.saveCampaignEmail);

routes.get("/emails", isAuth, EmailController.index);

routes.delete("/email/:id", isAuth, EmailController.remove);

routes.put("/email/:id", isAuth, EmailController.update);

routes.get("/email/:id", isAuth, EmailController.show);

routes.post("/email/verify/:id", isAuth, EmailController.VerifyDNS);

routes.post("/keys", isAuth, EmailController.generateKey);

routes.post("/email/send/:id", isAuth, EmailController.sendEmail);




export default routes;
