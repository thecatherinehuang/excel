const range = require('./range');

test('range of numbers 1 to 50', () => {
    expect(range(1, 2)).toBe([1]);
});