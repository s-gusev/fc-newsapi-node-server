const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { type: String, default: '', trim: true },
  body: { type: String, default: '', trim: true },
  date: { type: Date, default: Date.now }
});

NewsSchema.path('title').required(true, 'News title cannot be blank');
NewsSchema.path('body').required(true, 'News body cannot be blank');

NewsSchema.statics = {
  load: function (_id) {
    return this.findOne({ _id })
      .exec();
  },

  list: function () {
    return this.find()
      .sort({ createdAt: -1 })
      .exec();
  }
};

mongoose.model('News', NewsSchema);

module.exports = {
  News: mongoose.model('News'),
}
