const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NewsSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    content: String,
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    publishDate: String,
    readTime: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    featuredImage: String,
    relatedNews: [{
        relatedNews: { type: Schema.Types.ObjectId, ref: "News" },
    }],
  },
  {
    timestamps: true,
  }
);

const NewsModel = model("News", NewsSchema);

module.exports = NewsModel;
