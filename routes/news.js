// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
const router = express.Router();
const { NewsRepository } = require('../repository/news-repository');

const newsRepo = new NewsRepository();

/* GET news by id. */
router.get('/:id', function (req, res, next) {
    res.json(newsRepo.getById(req.params.id));
});

/* GET news listing. */
router.get('/', function (req, res, next) {
    res.json(newsRepo.getAll());
});

/* POST news. */
router.post('/', function (req, res, next) {
    res.json(newsRepo.post(req.body));
});

/* PUT news by id. */
router.put('/:id', function (req, res, next) {
    res.json(newsRepo.put(req.params.id, req.body));
});

/* DELETE news by id. */
router.delete('/:id', function (req, res, next) {
    res.json(newsRepo.delete(req.params.id));
});

module.exports = router;
