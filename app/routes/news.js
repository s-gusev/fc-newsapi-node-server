// import { NewsRepository } from "../repository/news-repository";
const express = require('express');
const router = express.Router();
const { NewsController } = require('../controllers/news-controller');
const newsController = new NewsController();

/* GET news by id. */
router.get('/:id', newsController.getById);

/* GET news listing. */
router.get('/', newsController.getAll);

/* POST news. */
router.post('/', newsController.post);

/* DELETE news by id. */
router.delete('/:id', newsController.delete);

module.exports = router;
