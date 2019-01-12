const { News } = require('../models/news.model');

class NewsRepository {
    constructor() {
        this.news = [
            new News(1, '1st Jan News Title', new Date(2018, 1, 1, 0, 0, 0), "Happy New Year!!!"),
            new News(2, '2nd Jan News Title', new Date(2018, 1, 2, 0, 0, 0), "First working day in the Year."),
            new News(3, '3rd Jan News Title', new Date(2018, 1, 3, 0, 0, 0), "Just ordinary working day."),
        ]
    }

    getNews(id) {
        return this.news[this._getNewsIndexById(id)];
    }

    list() {
        return this.news;
    }

    addNews(news) {
        this.news.push(news);
    }

    updateNews(news) {
        this.news.splice(this._getNewsIndexById(news.id), 1, news);
    }

    delete(id) {
        this.news.splice(this._getNewsIndexById(id), 1);
    }

    _getNewsIndexById(id) {
        return this.news.findIndex(n => n.id === +id)
    }
}

module.exports = {
    NewsRepository: NewsRepository
}