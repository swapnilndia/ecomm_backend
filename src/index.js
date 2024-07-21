import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("App not able to listen");
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`App is listening at port`, process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(`MongoDb connection failed !!! :`, err);
  });

/*
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("App not able to listen");
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on PORT: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();
*/
