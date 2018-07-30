

export interface User {
    
    username:string
    
    password:number
    
    contact:Contact
    
}

export interface Contact {
    
    method:string
    
    value:string[]
    
}



export abstract class GetUsers {

    static args = []

    public abstract invoke():Promise<User[]>
}

export abstract class GetUser {

    static args = ["id"]

    public abstract invoke(id:number):Promise<User>
}

