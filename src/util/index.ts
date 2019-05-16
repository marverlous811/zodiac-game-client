export function buildQueryString(objectParam : any){
    let query = Object.keys(objectParam)
                .map(param => param+"="+objectParam[param])
                .join('&');

    return query;
}