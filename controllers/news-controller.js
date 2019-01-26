'use strict';

const { NewsRepository } = require('../repository/news-repository');
const { News } = require('../models/news.model');
const newsRepo = new NewsRepository();

class NewsController {
    getById(req, res, next) {
        newsRepo.getById(req.params.id)
            .then(data =>
                res.json(data)
            );
    }

    getAll(req, res, next) {
        newsRepo.getAll()
            .then(data =>
                res.json(data)
            );
    }

    post(req, res, next) {
        newsRepo.post(new News(req.body))
            .then(data => {
                res.json(data);
            });
    }

    delete(req, res, next) {
        newsRepo.delete(req.params.id)
            .then(res.json())
            .catch(err=> res.json(err));
    }
}

module.exports = {
    NewsController: NewsController
}