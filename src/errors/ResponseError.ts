export class ResponseError {

	public status : number;
	public code : string;
	public data : Record<string, any>;

	public constructor(status : number, errorCode : string, data : Record<string, any> = {}) {
		this.status = status;
		this.code = errorCode;
		this.data = data;
	}
}

export class BadRequestError extends ResponseError {
	public constructor(errorCode : string = 'bad_request', data ?: Record<string, any>) {
		super(400, errorCode, data);
	}
}

export class UnauthorizedError extends ResponseError {
	public constructor(errorCode : string = 'unauthorised', data ?: Record<string, any>) {
		super(401, errorCode, data);
	}
}

export class PaymentRequiredError extends ResponseError {
	public constructor(errorCode : string = 'payment_required', data ?: Record<string, any>) {
		super(402, errorCode, data);
	}
}

export class ForbiddenError extends ResponseError {
	public constructor(errorCode : string = 'forbidden', data ?: Record<string, any>) {
		super(403, errorCode, data);
	}
}

export class NotFoundError extends ResponseError {
	public constructor(errorCode : string = 'not_found', data ?: Record<string, any>) {
		super(404, errorCode, data);
	}
}

export class MethodNotAllowedError extends ResponseError {
	public constructor(errorCode : string = 'method_not_allowed', data ?: Record<string, any>) {
		super(405, errorCode, data);
	}
}

export class NotAcceptableError extends ResponseError {
	public constructor(errorCode : string = 'not_acceptable', data ?: Record<string, any>) {
		super(406, errorCode, data);
	}
}

export class ProxyAuthenticationRequiredError extends ResponseError {
	public constructor(errorCode : string = 'proxy_authentication_required', data ?: Record<string, any>) {
		super(407, errorCode, data);
	}
}

export class RequestTimeoutError extends ResponseError {
	public constructor(errorCode : string = 'request_timeout', data ?: Record<string, any>) {
		super(408, errorCode, data);
	}
}

export class ConflictError extends ResponseError {
	public constructor(errorCode : string = 'conflict', data ?: Record<string, any>) {
		super(409, errorCode, data);
	}
}

export class GoneError extends ResponseError {
	public constructor(errorCode : string = 'gone', data ?: Record<string, any>) {
		super(410, errorCode, data);
	}
}

export class UnprocessableEntityError extends ResponseError {
	public constructor(errorCode : string = 'unprocessable_entity', data ?: Record<string, any>) {
		super(422, errorCode, data);
	}
}

export class InternalServerError extends ResponseError {
	public constructor(errorCode : string = 'internal_error', data ?: Record<string, any>) {
		super(500, errorCode, data);
	}
}
