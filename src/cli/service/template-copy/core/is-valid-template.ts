export function isValidTemplate(
    templateName:string | undefined,
    templateFiles:string[]
):boolean
{
    return templateName?
    templateFiles.includes(templateName):
    false;
}