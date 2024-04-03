const {Router} = require("express");

const auth = require("./auth");
const task1 = require("./task1");
const task2 = require("./task2");
const task3 = require("./task3");
const task4 = require("./task4");
const task5 = require("./task5");
const task6 = require("./task6");
const task7 = require("./task7");
const task8 = require("./task8");
const task9 = require("./task9");
const task10 = require("./task10");
const task11 = require("./task11");
const task12 = require("./task12");
const task13 = require("./task13");
const task14 = require("./task14");
const task15 = require("./task15");

const router = Router();

router.use('/', auth);
router.use('/task1', task1);
router.use('/task2', task2);
router.use('/task3', task3);
router.use('/task4', task4);
router.use('/task5', task5);
router.use('/task6', task6);
router.use('/task7', task7);
router.use('/task8', task8);
router.use('/task9', task9);
router.use('/task10', task10);
router.use('/task11', task11);
router.use('/task12', task12);
router.use('/task13', task13);
router.use('/task14', task14);
router.use('/task15', task15);

module.exports = router;