import { ERROR_CODE_1XX } from "./error-code-1xx.js";
import { ERROR_CODE_2XX } from "./error-code-2xx.js";
import { ERROR_CODE_3XX } from "./error-code-3xx.js";
import { ERROR_CODE_4XX } from "./error-code-4xx.js";
import { ERROR_CODE_5XX } from "./error-code-5xx.js";

export const HTTP_ERROR_CODE = [
    ...ERROR_CODE_1XX,
    ...ERROR_CODE_2XX,
    ...ERROR_CODE_3XX,
    ...ERROR_CODE_4XX,
    ...ERROR_CODE_5XX,
] as const;
