export class EmailAlreadyIsUserError extends Error {
    constructor(email) {
        super(`The provided e-mail ${email} is already in use.`);
        this.name = 'EmailAlreadyIsUserError';
    }
}

export class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User with id ${userId} not fount.`);
        this.name = 'UserNotFoundError';
    }
}
