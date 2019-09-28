import { BooleanSerializer } from "../src/serializers/BooleanSerializer";
import {expect} from 'chai';
import { StringSerializer } from "../src/serializers/StringSerializer";
import { NumberSerializer } from "../src/serializers/NumberSerializer";
import { DateSerializer } from "../src/serializers/DateSerializer";

describe('BooleanSerializer', ()=>
{
    let booleanSerializer = new BooleanSerializer();

    it('should derserilize values to boolean', ()=>
    {
        let result = booleanSerializer.deserialize('true');
        expect(result).to.be.true;
        result = booleanSerializer.deserialize('false');
        expect(result).to.be.false;
        result = booleanSerializer.deserialize(null);
        expect(result).to.be.null;
    });
    it('should serialize boolean value', ()=>
    {
        let result = booleanSerializer.serialize(true);
        expect(result).to.be.eq('true')
        result = booleanSerializer.serialize(false);
        expect(result).to.be.eq('false')
    });

});

describe('StringSerializer', ()=>
{
    let stringSerializer = new StringSerializer();

    it('should deserilizer values to string', ()=>
    {
        let result = stringSerializer.deserialize(1);
        expect(result).to.be.eq('1');
        result = stringSerializer.deserialize('abc');
        expect(result).to.be.eq('abc');
        result = stringSerializer.deserialize(null);
    });

});

describe('NumberSerializer', ()=>
{
    let numberSerializer = new NumberSerializer();

    it('should deserilizer values to string', ()=>
    {
        let result = numberSerializer.deserialize("123");
        expect(result).to.be.eq(123);
        expect(result).to.be.a('number');

    });
});

describe('DateSerializer', ()=>
{
    it('shoudl deserilize values to date', ()=>
    {
        let dateSerializer = new DateSerializer();
        let date = new Date();
        let result = dateSerializer.deserialize(date.toISOString());
        expect(result.getTime()).to.be.eq(result.getTime());
    });
});