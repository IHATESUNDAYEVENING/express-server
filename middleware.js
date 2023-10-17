import jwt from "jsonwebtoken"
import dotenv from "dotenv"
export class NotAuthorizedException extends Error {
    constructor(message) {
        super(message);
        this.name = "NotAuthorizedException";
    }
}

const permitUrl = [
    '/login',
    '/members/join',
    '/email-check'
]
dotenv.config()

export const auth = (req, res, next) => {
    try {
        if (permitUrl.includes(req.url)) return next()

        const {authorization} = req.headers
        if (!authorization) {
            return res.status(403).json({
                code: 403,
                message: "권한이 없습니다. 로그인을 해주세요.",
            });
        }

        const key = process.env.SECRET_KEY
        const token = authorization.substring(7, authorization.length)
        req.decode = jwt.verify(token, key)
        const {role} = req.decode
        console.log('req.decode', role)
        return next()

    } catch (error) {
        // 인증 실패
        // 유효시간이 초과된 경우
        if (error.name === "TokenExpiredError") {
            return res.status(419).json({
                code: 419,
                message: "토큰이 만료되었습니다.",
            });
        }

        // 토큰의 비밀키가 일치하지 않는 경우
        else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                code: 401,
                message: "유효하지 않은 토큰입니다.",
            });
        }

        return res.status(403).json({
            code: 403,
            message: "권한이 없습니다. 로그인을 해주세요.",
        });
    }
}

