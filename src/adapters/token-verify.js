import jwt from 'jsonwebtoken';

export class TokenVerifyafapter {
    execute(token, secret) {
        return jwt.verify(token, secret);
    }
}
