const { News } = require('../models/news.model');

class NewsRepository {
    constructor() {
        this.news = [
            new News(1, '1st Jan News Title', new Date(2018, 1, 1, 0, 0, 0), "Happy New Year!!!"),
            new News(2, '2nd Jan News Title', new Date(2018, 1, 2, 0, 0, 0), "First working day in the Year."),
            new News(3, '3rd Jan News Title', new Date(2018, 1, 3, 0, 0, 0), "Just ordinary working day."),
        ]
    }

    getById(id) {
        if (!Number.isSafeInteger(+id)) {
            throw Error("Invalid Id");
        }

        return this.news[this._getNewsIndexById(id)];
    }

    getAll() {
        return this.news;
    }

    post(news) {
        if (news.id) {
            throw Error("News.Id should be empty for POST method, use PUT method to update news details");
        }
        if (!news.title || !news.body) {
            throw Error("Invalid News model");
        }
        news.id = Math.max(...this.news.map(n => +n.id)) + 1;
        news.date = news.date || new Date();
        this.news.push(news);
        return news;
    }

    put(id, news) {
        const numericId = +id;
        if (!Number.isSafeInteger(numericId)) {
            throw Error("Invalid Id");
        }
        if (news.id && numericId !== +news.id) {
            throw Error("Id in url and body must match");
        }

        news.id = id;
        const newsIndex = this._getNewsIndexById(id);
        if (newsIndex >= 0) {
            Object.assign(this.news[newsIndex], news);
            return true;
        }
        return false;
    }

    delete(id) {
        if (!Number.isSafeInteger(+id)) {
            throw Error("Invalid Id");
        }

        const newsIndex = this._getNewsIndexById(id);
        if (newsIndex >= 0) {
            this.news.splice(newsIndex, 1);
            return true;
        }
        return false;
    }

    _getNewsIndexById(id) {
        return this.news.findIndex(n => +n.id === +id)
    }
}

module.exports = {
    NewsRepository: NewsRepository
}