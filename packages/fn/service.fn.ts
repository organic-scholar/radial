interface User {
    username: string
    password: number
    contact: Contact
}

interface Contact {
    method: string
    value: string[]
}

export abstract class GetUsers {
    static serviceName = 'GetUsers';

    static args = [];

    public abstract invoke(): Promise<User[]>;
}

export abstract class GetUser {
    static serviceName = 'GetUser';

    static args = [{ "name": "id", "optional": false, "type": "number", "array": false }];

    public abstract invoke(id: number): Promise<User>;
}
