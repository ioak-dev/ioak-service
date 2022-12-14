var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const memberSchema = new Schema(
  {
    code: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    email: { type: String },
    telephone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    jobTitle: { type: String },
    about: { type: String },
    profilePic: { type: String },
    experienceSince: { type: Date },
    status: { type: String },
    memberId: { type: Number },
    starred: { type: Boolean }
  },
  { timestamps: true }
);

const memberCollection = "member";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { memberSchema, memberCollection };
