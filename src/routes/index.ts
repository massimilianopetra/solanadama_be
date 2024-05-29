import { Request, Response, NextFunction, Router } from 'express';

const router = Router();
const timeLog = (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    console.log(`[${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] - connect`);
    next();
}

router.use(timeLog);
router.get("/", (req, res) => {
    res.send("Access denied. How about trying a Sudoku puzzle instead?");
});

export default router;