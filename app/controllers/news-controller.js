const { NewsRepository } = require('../repository/news-repository');
const { News } = require('../models/news.model');
const newsRepo = new NewsRepository();

class NewsController {
    getById(req, res, next) {
        newsRepo.getById(req.params.id)
            .then(data =>
                res.json(data)
            )
            .catch(err => res.status(500).json(err));
    }

    getAll(req, res, next) {
        newsRepo.getAll()
            .then(data =>
                res.json(data)
            )
            .catch(err => res.status(500).json(err));
    }

    post(req, res, next) {
       newsRepo.post(new News(req.body))
            .then(data => {
               if (data) {
                    res.json(data)
                } else {
                    res.status(500).json("failed to update or create record")
                }
            })
            .catch(err => res.status(500).json(err));
    }

    delete(req, res, next) {
        newsRepo.delete(req.params.id)
            .then(res.json('ok'))
            .catch(err => res.status(500).json(err));
    }
}

module.exports = {
    NewsController: NewsController
}