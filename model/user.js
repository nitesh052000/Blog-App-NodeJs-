const { error } = require("console");
const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { use } = require("passport");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/images.jpeg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = "someRandmSalt";
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User was not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");

    if (userProvidedHash !== hashedPassword)
      throw new Error("Incoreect Password");

    const token = createTokenForUser(user);
    return token;
  }
);

userSchema.static.matchPassword = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) throw new Error("User was not found");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (userProvidedHash !== hashedPassword)
    throw new Error("Incoreect Password");
  return { ...user, password: undefined, salt: undefined };
};

const User = model("user", userSchema);

module.exports = { User };
