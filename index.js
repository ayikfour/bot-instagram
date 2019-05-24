import express from "express";
import bodyParser from "body-parser";
import config from "./config/config";
import routes from "./routes/index";

const app = express();
app.use(bodyParser.json());

routes(app);

app.get("*", (req, res) => {
   res.status(200).send({
      message: "This ain't it chief. Read the docs first."
   });
});

let port = config.port;
app.listen(port, () => {
   console.log(`you are running on port ${port}`);
});

export default app;
