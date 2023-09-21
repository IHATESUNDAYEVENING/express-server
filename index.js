import express from 'express';
import memberRouter from './routes/member.js'
import boardRouter from './routes/board.js'

import dayjs from 'dayjs'
import bodyParser from "body-parser";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import db from "./database/connect/maria.js";
import {auth} from "./middleware.js";


const app = express();
const PORT = 5100;
dotenv.config()

app.use(express.json())
    .use(auth)
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use('/member', memberRouter)
    .use('/board', boardRouter)


app.listen(PORT, () => {
    console.log(dayjs().format('---------YYYY-MM-DD hh:mm:ss---------'))
    console.log(`       Sever Start At port ${PORT}`)
    console.log('-------------------------------------')
})

app.post('/login', (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) return;

    const key = process.env.SECRET_KEY
    let token = null

    db.query(
        `
            SELECT *
            FROM member
            WHERE email = '${email}'
              and password = '${password}'
        `,
        (err, results) => {

            if (err) {
                console.error('Error querying the database:', err);
                res.status(500).json({error: 'Database error'});
                return;
            }

            token = jwt.sign(
                {
                    type: 'JWT',
                    role: results[0].role === 1 ? 'ROLE_ADMIN' : "ROLE_USER"
                },
                key,
                {
                    expiresIn: "5m" //5분후 만료
                }
            )
            return res.status(200).json({
                code: 200, message: 'token is created',
                token: token
            })
        }
    )
})

