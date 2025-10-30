export interface ApiResponse<T = any> {
	data?: T;
	message?: string;
	error?: string;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}

export class ApiException extends Error {
	status?: number;
	code?: string;

	constructor(message: string, status?: number, code?: string) {
		super(message);
		this.name = "ApiException";
		this.status = status;
		this.code = code;
	}
}
