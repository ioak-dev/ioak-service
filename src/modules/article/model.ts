var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const articleSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    summary: { type: String },
    featuredImage: { type: String },
    tags: { type: Array },
    views: { type: Number },
    likes: { type: Number },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  { timestamps: true }
);

const articleCollection = "article";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { articleSchema, articleCollection };
