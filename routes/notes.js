import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
    res.json({
        name: 'tanay',
        rno: 21513,
        desc: 'hello from notes'
    });
}
)
export default router;
