import CustomError from './custom.error';

// Error for when the environment variable for the template is missing
export class MissingEnv extends CustomError {
    constructor() {
        super(404, 'Message template not found!');
    }
}

// Error for invalid placeholders in the template
export class InvalidPlaceholder extends CustomError {
    constructor(placeholder: string) {
        super(400, `Invalid placeholder: ${placeholder}`);
    }
}

// Error for issues during navigation in the data object
export class NavigationError extends CustomError {
    constructor(message: string) {
        super(500, message);
    }
}

// General error for unexpected issues
export class GeneralError extends CustomError {
    constructor(message: string) {
        super(500, message);
    }
}
