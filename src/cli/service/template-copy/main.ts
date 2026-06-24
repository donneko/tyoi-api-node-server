import {
    appTemplateCopy,
    type AppTemplateCopyData,
    type AppTemplateCopyReturn,
} from "./app/app.js";

export default async function main(data: AppTemplateCopyData): Promise<AppTemplateCopyReturn> {
    return await appTemplateCopy(data);
}
