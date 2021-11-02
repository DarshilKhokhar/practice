import "reflect-metadata";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import initRoute from "./routes";
import connectMongoDB from "./utils/db/mongo.db";
import { responseFormatter } from "./middleware/responseFormattor";

class Server {
  public app: express.Application = express();

  constructor() {
    this.app.use(json());
    this.app.use(cors());

    // add custom middleware
    this.app.use(responseFormatter());

    initRoute(this.app);

    this.config();
    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private config() {
    connectMongoDB();
  }
}

export default new Server().app;
