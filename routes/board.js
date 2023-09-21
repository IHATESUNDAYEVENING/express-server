import express from 'express'
import db from '../database/connect/maria.js'
import dayjs from "dayjs";
import {pageObject, pageSize} from "../returnObject/pageObject.js"


const router = express.Router()

router.use((req,
            res,
            next
    ) => {
        console.log(`request => url: /board${req.url}, method: ${req.method}`)
        next()
    }
)

router.get(
    '/',
    async (req,
     res
    ) => {
        const {pageNum} = req.query
        if (pageNum) {
            db.query(
                `SELECT *
                 FROM board
                 WHERE deleted = false
                 ORDER BY id DESC LIMIT ${pageSize}
                 OFFSET ${pageSize * (pageNum - 1)}
                `,
                (err, results) => {
                    if (err) {
                        console.error('Error querying the database:', err);
                        res.status(500).json({error: 'Database error'});
                        return;
                    }
                    res.json(
                        new pageObject(
                            results,
                            parseInt(pageNum),
                        )
                    );
                })
        } else {
            res.json([]);
        }
    })

router.get('/:id', (req, res) => {
    const {id} = req.params
    db.query(
        `SELECT *
         FROM board
         WHERE id = ${id}
        `,
        (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                res.status(500).json({error: 'Database error'});
                return;

            }
            res.status(200).json(results);
        }
    )
})

router.post('/', (req, res) => {
    const {content, title} = req.body
    db.query(
        `INSERT INTO board(content,
                           created_at,
                           title)
         VALUES ('${content}',
                 '${dayjs().format('YYYY-MM-DD HH:mm:ss')}',
                 '${title}')`,
        (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                res.status(500).json({error: 'Database error'});
                return;

            }
            res.status(200).json(results);
        })
})

router.patch(`/:id`, (req, res) => {
    const {id} = req.params
    const {content, title} = req.body
    db.query(
        `UPDATE board
         SET content   = '${content}',
             title     = '${title}',
             update_at = '${dayjs().format('YYYY-MM-DD HH:mm:ss')}'
         WHERE id = ${id};
        `,
        (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                res.status(500).json({error: 'Database error'});
                return;

            }
            res.status(200).json(results);
        }
    )
})

router.delete('/:id', (req, res) => {
    const {id} = req.params
    db.query(
        `UPDATE board
         SET deleted = true
         WHERE id = ${id}
           AND deleted = false;
        `,
        (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                res.status(500).json({error: 'Database error'});
                return;

            }
            res.status(200).json(results);
        }
    )
})


export default router;
