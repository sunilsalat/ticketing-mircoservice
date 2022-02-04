import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// interface  and making sure email and password is correct
// defining validator sort of thing
interface UserAttrs {
  name: string;
  email: string;
  password: string;
}

// An interface that describe the user properties of build mehtod
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface for metadat like createAt and updateAt
interface UserDoc extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  comparePassword(userPassword: string): boolean;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

UserSchema.pre<UserDoc>("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
