import {capitalize, capitalizeWords} from '../../../src/core/utils/text';

describe('capitalize', () => {
  it.each([
    ['', ''],
    ['pikachu', 'Pikachu'],
    ['Pikachu', 'Pikachu'],
    ['p', 'P'],
  ])('capitalizes %p', (value, expected) => {
    expect(capitalize(value)).toBe(expected);
  });

  it('does not change the remaining characters', () => {
    expect(capitalize('pIkAcHu')).toBe('PIkAcHu');
  });
});

describe('capitalizeWords', () => {
  it.each([
    ['pikachu', 'Pikachu'],
    ['fire-fly', 'Fire Fly'],
    ['mr-mime', 'Mr Mime'],
    ['mega-evolution-pokemon', 'Mega Evolution Pokemon'],
    ['', ''],
  ])('converts %p to %p', (value, expected) => {
    expect(capitalizeWords(value)).toBe(expected);
  });

  it('preserves extra hyphens as spaces', () => {
    expect(capitalizeWords('one--two')).toBe('One  Two');
  });
});