const Simulator = require('./gravity-simulator').GravitySimulator;

describe('Gravity Simulator', () => {
    it('should exist', () => {
        expect(new Simulator()).toBeTruthy();
    });
});