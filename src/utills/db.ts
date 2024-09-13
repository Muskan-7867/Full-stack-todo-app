import mongoose from "mongoose";

const mongoUrl: string =
  "mongodb+srv://muskanloach984:jyDbdxTdwTFWg40E@todo-db.rw123.mongodb.net/?retryWrites=true&w=majority&appName=todo-db";

if (!mongoUrl) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

export async function connect(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const connectWithRetry = () => {
    mongoose
      .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 20000,
        socketTimeoutMS: 45000,
      } as mongoose.ConnectOptions)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        setTimeout(connectWithRetry, 5000);
      });
  };

  connectWithRetry();
}
