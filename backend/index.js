import { app } from "./app.js";
import connectDB from "./db/index.js";


connectDB()
.then(()=>{
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
  });
})
.catch((error)=>{
  console.error("Failed to connect to the database. Server not started.", error);
});




// const mongoUrl = process.env.MONGO_URL;
// if (!mongoUrl) {
//   console.error(
//     "MONGO_URL not set. Create a .env file with MONGO_URL=mongodb://..."
//   );
//   process.exit(1);
// }

// (async () => {
//   try {
//     await mongoose.connect(mongoUrl);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Database connection error:", error);
//     throw error;
//   }
// })();
