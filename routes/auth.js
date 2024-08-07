import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
    res.json({
        name: 'bharat',
        rno: 21515,
        desc: 'hello from auth'
    });
}
)
export default router;
