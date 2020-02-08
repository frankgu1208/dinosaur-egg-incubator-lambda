import { expect } from 'chai';
import { putSettings, postRun } from '../src/handler';

describe('handler', () => {
    it('should able putSettings', () => {
        expect(putSettings).to.be.a('Function');
    });

    it('should able postRun', () => {
        expect(postRun).to.be.a('Function');
    });
});
