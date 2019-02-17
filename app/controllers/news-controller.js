const { NewsRepository } = require('../repository/news-repository');
const { News } = require('../models/news.model');
const fetch = require("node-fetch");
const newsRepo = new NewsRepository();

class NewsController {
    constructor() {
        this._requestUrlBase = 'https://newsapi.org/v2/everything';
        this._requestHeaders = { 'x-api-key': '3ea39782e9924d0994765f6f56b589d8' };
        this._uniqueIdIndex = 0;
        this._cache = new Map();
        this._noImagePath = 'http://localhost:3000/images/no-image.svg';
    }

    getById(req, res, next) {
        const id = req.params.id;

        if (this._cache.has(id)) {
            res.json(this._cache.get(id));
        } else {
            newsRepo.getById(id)
                .then(data => {
                    data.source = {
                        'id': 'front-camp-news',
                        'name': 'Front Camp Own News',
                    };
                    if (!this.isUrlValid(data.urlToImage)) {
                        data.urlToImage = this._noImagePath;
                    }
                    res.json(data)
                })
                .catch(err => res.status(500).json(err));
        }
    }

    getAll(req, res, next) {
        const source = decodeURI(req.params.source);
        const searchText = decodeURI(req.params.text || '');
        const pageIndex = +decodeURI(req.params.pageIndex);
        const pageSize = +decodeURI(req.params.pageSize);
        if (source === 'front-camp-news') {
            newsRepo.getAll(source, searchText, pageSize, pageIndex)
                .then(data => {
                    data.forEach(a => {
                        a.source = {
                            'id': 'front-camp-news',
                            'name': 'Front Camp Own News',
                        };
                        if (!this.isUrlValid(a.urlToImage)) {
                            a.urlToImage = this._noImagePath;
                        }
                    })
                    res.status(200).json(data)
                })
                .catch(err => res.status(500).json(err));
        } else {
            this._state = { q: searchText, sources: source, page: pageIndex + 1, pageSize: pageSize };
            const requestUrl = `${this._requestUrlBase}?${this._getRequestParams(this._state)}`;
            const requestOptions = { headers: this._requestHeaders };

            fetch(requestUrl, requestOptions)
                .then(res => res.json())
                .then(data => {
                    if (data.articles) {
                        data.articles.forEach(a => {
                            a._id = this._getNextId();
                            if (!this.isUrlValid(a.urlToImage)) {
                                a.urlToImage = this._noImagePath;
                            }
                            this._cache.set(a._id, a);
                        });
                    }
                    res.json(data.articles);
                })
                .catch(err => res.status(500).json(err));
        }
    }

    _getRequestParams(params) {
        return Object.entries(params).map(([key, value]) => `${key}=${encodeURI(value)}`).join('&');
    }

    _getNextId() {
        return 'napi' + ++this._uniqueIdIndex;
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

    isUrlValid(url) {
        //todo:improve regex; currently just checks that url starts with http:// or https://
        const result = /https?:\/\//.test(url);
        if (!result && url) {
            console.warn('invalid img url:', url);
        }
        return result;
    }
}

module.exports = {
    NewsController: NewsController
}