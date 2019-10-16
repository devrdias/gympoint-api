import { Router } from 'express';

const router = new Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});

export default router;
