import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Create User schema
// Fields:
// - name (String, required)
// - email (String, required, unique)
// - password (String, required, minlength 6)
// - createdAt (default Date.now)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: { type: String, required: true, minlength: 6 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password when sending user as JSON
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;