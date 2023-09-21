import express from 'express'
import bcrypt from "bcrypt"

const router = express.Router()


router.use((req, res, next) => {
    console.log('/members/**')
    next()
})

router.get('/', (req, res) => {
    res.status(201).send('GET: /post')
})

router.post('/join', (req, res) => {
    console.log("request : ", req.body)

    res.json('ok')
    // console.log("request JSON : ", JSON.stringify(bodyParser(req.body)))
})

export default router;
