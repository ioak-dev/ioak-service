var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const articleSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    tags: { type: Array },
    views: { type: Number },
    likes: { type: Number }
  },
  { timestamps: true }
);

const articleCollection = "article";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { articleSchema, articleCollection };
