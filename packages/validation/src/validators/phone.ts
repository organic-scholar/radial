export function e164()
{
    return function(val:string)
    {
        let regexp = /^\+?[1-9]\d{1,14}$/;
        let matches = regexp.exec(val);
        if(matches) return;
        return 'e164';
    }
}
