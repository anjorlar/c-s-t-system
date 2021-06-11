process.env.NODE_ENV = 'test'

import expect from 'expect';

it('Sample Test', () => {
    const sum = 1 + 1

    expect(sum).toBe(2)
})