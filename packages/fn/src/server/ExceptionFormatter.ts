export class ExceptionFormatter
{
    format(error: Error) {
        return {
            message: error.message,
            data: error['data'],
            type: error['type'] || error.name
        };
    }
}
