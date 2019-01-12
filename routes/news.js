// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
const router = express.Router();
const { NewsRepository } = require('../repository/news-repository');

const newsRepo = new NewsRepository();

/* GET news by id. */
router.get('/:id', function (req, res, next) {
    console.log('id', req.params.id, newsRepo.getNews(req.params.id))
    res.send(JSON.stringify(newsRepo.getNews(req.params.id)));
});

/* GET news listing. */
router.get('/', function (req, res, next) {
    res.send(JSON.stringify(newsRepo.list()));
});

/* POST news. */
router.post('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* PUT news by id. */
router.put('/:id', function (req, res, next) {
    res.send('respond with a resource');
});

/* DELETE news by id. */
router.delete('/:id', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
