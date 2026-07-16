export type ApiError = {
    ok: false;
    error: {
        code: string;
        message: string;
    };
};

export function fail(code: string, message: string): ApiError {
    return { ok: false, error: { code, message } };
}
