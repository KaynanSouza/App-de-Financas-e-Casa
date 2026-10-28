// Sanity check of the test runner setup (jest-expo). Not product code.
describe('test runner', () => {
  it('runs TypeScript tests', () => {
    const cents: number = 1050 + 250;
    expect(Number.isInteger(cents)).toBe(true);
    expect(cents).toBe(1300);
  });
});
