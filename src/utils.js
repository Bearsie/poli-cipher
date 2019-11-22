import { FIRST_CHAR_CODE, LAST_CHAR_CODE, CHARS_AMOUNT } from "./constants";

const anyInvalidCharCodes = (charCodes) => charCodes.some(
  code => code < FIRST_CHAR_CODE || code > LAST_CHAR_CODE
);

const adjustToCustomRange = (charCodes) => charCodes.map(
  (code) => code - FIRST_CHAR_CODE
);

const revertFromCustomRange = (customCharCodes) => customCharCodes.map(
  (code) => code + FIRST_CHAR_CODE
);

const getCharCodes = (string) => {
  const charCodes = [...string].map(char => char.charCodeAt(0));

  if (anyInvalidCharCodes(charCodes)) {
    return null;
  }

  return adjustToCustomRange(charCodes);
}

const encrypt = (key, transform) => {
  const keyCharCodes = getCharCodes(key);

  if (!keyCharCodes) {
    return null;
  }

  return (text) => {
    const textCharCodes = getCharCodes(text);

    if (!textCharCodes) {
      return null;
    }

    const transformedTextCharCodes = transform(textCharCodes, keyCharCodes);
    const newTextCharCodes = revertFromCustomRange(transformedTextCharCodes);
    const newText = String.fromCharCode(...newTextCharCodes);

    return newText;
  };
}

const encodeCodes = (textCodes, keyCodes) => textCodes.map(
  (code, index) =>
    (code + keyCodes[index % keyCodes.length]) % CHARS_AMOUNT
  );

const decodeCodes = (textCodes, keyCodes) => textCodes.map(
  (code, index) => {
    const decodedCode = (
      code - keyCodes[index % keyCodes.length]
    ) % CHARS_AMOUNT;
    
    if (decodedCode < 0) {
      return decodedCode + CHARS_AMOUNT;
    }

    return decodedCode;
  });

export const encodeTextWithKey = (key) => encrypt(key, encodeCodes);
export const decodeTextWithKey = (key) => encrypt(key, decodeCodes);
