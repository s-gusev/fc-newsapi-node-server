// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
const router = express.Router();
const { NewsController } = require('../controllers/news-controller');
const newsController = new NewsController();
const passport = require('passport');

/* GET news by id. */
router.get('/:id', newsController.getById.bind(newsController));

/* GET news listing. */
router.get('/:source//:pageSize/:pageIndex', newsController.getAll.bind(newsController));
router.get('/:source/:text/:pageSize/:pageIndex', newsController.getAll.bind(newsController));

/* POST news. */
router.post('/', passport.authenticate('jwt', { session: false }), newsController.post.bind(newsController));

/* DELETE news by id. */
router.delete('/:id', passport.authenticate('jwt', { session: false }), newsController.delete.bind(newsController));

module.exports = router;
