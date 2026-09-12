import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    resumeFile: {
      type: String,
      default: "",
    },

    resumeFileName: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    preferredRole: {
      type: String,
      default: "",
    },

    preferredLocation: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    certifications: {
      type: [String],
      default: [],
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
