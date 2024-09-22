import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

// Define the ITodo interface for TypeScript typing
export interface ITodo extends Document {
  task: string;
  status: 'inprogress' | 'pending' | 'completed';
  createdAt: Date;
  userId: string; 
  user: mongoose.Schema.Types.ObjectId;
}

// Define the Todo schema
const TodoSchema: MongooseSchema = new MongooseSchema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['inprogress', 'pending', 'completed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

);

// Use existing model if available or create a new one
const Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;
