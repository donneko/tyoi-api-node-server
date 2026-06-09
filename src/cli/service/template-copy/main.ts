import { appTemplateCopy, type AppTemplateCopyData } from "./app/app.js";

export default async function main(data:AppTemplateCopyData){
    await appTemplateCopy(data);
}