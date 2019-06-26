import {expect} from 'chai';
import { type, __TYPES__, Serializer } from "../src/Serializer";
import { User, Role, Policy, Contact } from './TestTypes';

describe('SerializerTest', ()=>
{
    let user = new Serializer().deserialize<User>(User, {

        id: '1',
        firstName: 1,
        contact: null
        ,
        lastName: null,
        roles: [{
            name: 'any',
            policies: [
                { resource: 'r1', permissions: ['23123', '123123'] }
            ]
        }]
    });
    it('should deserialized object', ()=>
    {
        expect(user).to.be.instanceof(User);
    });
    it('should deserialize nested object', ()=>
    {
        expect(user.contact).to.be.instanceof(Contact);
        expect(user.contact.method).to.be.eq('Phone');

    })
    it('should deserialize nested array', ()=>
    {
        expect(user.roles).to.be.instanceof(Array)
        expect(user.roles[0]).to.be.instanceof(Role);
        expect(user.roles[0].policies[0]).instanceof(Policy);
    });
});


describe('TypeAnnotationTest', ()=>
{
    it('should set static property on object', ()=>
    {
        class User
        {
            @type(String)
            name:string;

            @type(String)
            email:string;
        }
        expect(User[__TYPES__]).to.be.a('object');
        expect(User[__TYPES__].name).to.be.eq(String);
        expect(User[__TYPES__].email).to.be.eq(String);
    });
})
