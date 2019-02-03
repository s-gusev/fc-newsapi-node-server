const { News } = require('../models/news.model');

class NewsRepository {
    getById(id) {
        return News.load(id);
    }

    getAll() {
        return News.list();
    }

    post(news) {
        return News.update({ _id: news._id }, news, { upsert: true }).then(() => news);
    }

    delete(id) {
        return this.getById(id).then(news => news.delete());
    }
}

module.exports = {
    NewsRepository: NewsRepository
}