import target from "./target";
import user from "./user";
import followers from "./followers";
import { instagram, reload } from "../controller/index";

instagram();

export default function routes(app) {
   app.get("/", (req, res) => {
      res.status(200).send({ message: "An API to retrieve data from scraper" });
   });

   app.get("/reload", async (req, res) => {
      res.send({ message: await reload() });
   });

   app.get("/followers", followers);

   app.post("/add/target", target.add);

   app.post("/add/user", user.add);

   app.post("/remove/user", user.remove);

   app.post("/remove/target", target.remove);
}
