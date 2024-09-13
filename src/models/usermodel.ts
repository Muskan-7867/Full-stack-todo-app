import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';


export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  todos: mongoose.Schema.Types.ObjectId[];
}


const UserSchema: MongooseSchema = new MongooseSchema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Can't be blank"],
      lowercase: true,
      trim: true,
      unique: true,
      
    },
    password: {
      type: String,
      required: [true, "Can't be blank"],
      trim: true
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
        default : []
        
      }
    ]
  }
  
);



const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
