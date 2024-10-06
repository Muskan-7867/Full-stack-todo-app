import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: MongooseSchema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

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
      ],
      verifyCode: {
        type: String,
        required: false, // Change this to false, as it should be optional after verification
        default: null, // Set default value to null
      },
      
    verifyCodeExpiry: {
      type: Date,
      required: false,
      default: null,
},
    
    isVerified: {
      type: Boolean,
      default: false
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [MessageSchema]
  }
  
);
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
