// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
const router = express.Router();
const { NewsController } = require('../controllers/news-controller');
const newsController = new NewsController();
const passport = require('passport');

/* GET news by id. */
router.get('/:id', newsController.getById);

/* GET news listing. */
router.get('/', newsController.getAll);

/* POST news. */
router.post('/', passport.authenticate('jwt', { session: false }), newsController.post);

/* DELETE news by id. */
router.delete('/:id', passport.authenticate('jwt', { session: false }), newsController.delete);

module.exports = router;
