'use babel';

export const repeat = (char, length) => {
  let res = '';
  while (res.length < length) {
    res += char;
  }
  return res;
}
