const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  author: { type: String, trim: true, required: 'author is required' },
  title: { type: String, default: '', trim: true, required: 'title is required' },
  description: { type: String, default: '', trim: true, required: 'description is required' },
  url: { type: String, default: '', trim: true, required: 'url is required' },
  urlToImage: { type: String, default: '', trim: true, required: 'urlToImage is required' },
  content: { type: String, default: '', trim: true, required: 'content is required' },
  publishedAt: { type: Date, default: Date.now, required: 'publishedAt is required' },
  source: { type: Object },
});

NewsSchema.statics = {
  load: function (_id) {
    return this.findOne({ _id })
      .exec();
  },

  list: function (source, text, pageSize, pageIndex) {
    // const searchCriteria = { 'source.id': source };
    const searchCriteria = {};
    if (text) {
      searchCriteria.$or = [
        { 'title': new RegExp(text, "i") },
        { 'content': new RegExp(text, "i") },
        { 'description': new RegExp(text, "i") },
      ];
    }

    return this.find(searchCriteria)
      .sort({ publishedAt: -1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize)
      .exec();
  }
};

mongoose.model('News', NewsSchema);

module.exports = {
  News: mongoose.model('News'),
}
