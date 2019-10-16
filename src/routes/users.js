import { Router } from 'express';

const router = new Router();

/* GET users list */
router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});

export default router;
