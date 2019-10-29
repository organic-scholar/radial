import {validate} from '../main';
import {length, notBlank, email, notNull, equalTo, alpha} from '../validators';

describe('validate simple objects', ()=>
{
    it('should pass validation of simple object', ()=>
    {
        let object = { id: '', name: 'john', age: 10, email: 'john@example.com', };
        return validate(object, {
            id: [notNull()],
            name: [notBlank(), length(1, 4)],
            age: [notBlank()],
            email: [notBlank(), email()]
        }).then(()=>
        {
            expect(true).toBe(true);
        }).catch((err)=>
        {
            console.log(err.data);
            fail();
        });
    });

    it('should fail validation of simple object', ()=>
    {
        let object = { id: null, name: 'john', age: 10, email: 'blah', password: '' };
        return validate(object, {
            id: [notNull()],
            name: [notBlank(), length(1, 3)],
            age: [notBlank(), equalTo(5)],
            email: [notBlank(), email()],
            password: [notBlank()]
        })
        .then(()=>
        {
            fail('it should not pass');
        })
        .catch((err)=>
        {
            let errors = err.data;
            expect(errors.id).toContain('notNull');
            expect(errors.name).toContain('maxLength');
            expect(errors.age).toContain('equalTo');
            expect(errors.password).toContain('notBlank');
        });
    });

    it.only('should not run validator if value is empty', ()=>
    {
        let object = { name: ''};
        return validate(object, {
            name: [notBlank(), length(1, 3)],
        }).catch((err)=>
        {
            let errors = err.data;
            expect(errors.name).toHaveLength(1);
        });

    });
});



describe('validate complex objects', ()=>
{
    it('should pass validation of complex object', ()=>
    {
        let object = {
            name: 'john',
            post: {
                title: 'SomeTitle',
                body: 'some text'
            }
         };
         return validate(object, {
             'post.title': [notBlank(), alpha()],
             'post.body': [notBlank(), length(1, 10), alpha(true)]
         }).catch((err)=>
         {
             fail('it should pass');
            console.log(err.data);
         });
    });
});