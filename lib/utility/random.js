'use babel';

const CHAR_CODE = {
  ZERO: '0'.charCodeAt(),
  NINE: '9'.charCodeAt(),
  A: 'A'.charCodeAt(),
  Z: 'Z'.charCodeAt()
};

const SMALL_ALPHABET_OFFSET = 32;

export function generateRandomString(length) {
  var name = '';
  while (name.length < length) {
    name += randomNumberOrAlphabet();
  }
  return name;
}

function randomNumberOrAlphabet() {
  while (true) {
    const random = Math.floor(Math.random() * 100);

    if (CHAR_CODE.ZERO <= random && random <= CHAR_CODE.NINE) {
      // Number
      return String.fromCharCode(random);
    } else if (CHAR_CODE.A <= random && random <= CHAR_CODE.Z) {
      // Alphabet
      return String.fromCharCode(toSmallCaseCharCode(random));
    }
  }
}

function toSmallCaseCharCode(largeAlphabetCharCode) {
  return largeAlphabetCharCode + SMALL_ALPHABET_OFFSET;
}
