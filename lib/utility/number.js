'use babel';

export function ordinal(number) {
  const secondDigit = (number + '').substr(-2, 1);
  if (secondDigit === '1') {
    return number + 'th';
  } else {
    switch ((number + '').substr(-1, 1)) {
      case '1': return number + 'st';
      case '2': return number + 'nd';
      case '3': return number + 'rd';
      default: return number + 'th';
    }
  }
}
