import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { green, grey } from '@material-ui/core/colors';
import { Container, TextField, Typography } from '@material-ui/core';
import { mergeStyles } from '@uifabric/merge-styles';
import { encodeTextWithKey, decodeTextWithKey } from './utils';
import { MY_SECRET_KEY } from './constants';

const baseInputStyles = {
  variant: 'outlined',
  fullWidth: true,
  margin: 'dense',
};

const multilineInputStyles = {
  ...baseInputStyles,
  multiline: true,
  rows: 10,
};

function App() {
  const [key, setKey] = useLocalStorage(MY_SECRET_KEY, '');
  const [plainText, setPlainText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [encodingActive, setEncodingActive] = useState(true);

  const onChangeKey = (e) => {
    setKey(e.target.value);
  };

  const encodeText = useCallback(
    encodeTextWithKey(key),
    [key],
  );

  const decodeText = useCallback(
    decodeTextWithKey(key),
    [key],
  );

  const onChangePlainText = (e) => {
    setPlainText(e.target.value);
  };

  useEffect(() => {
    if (encodingActive) {
      const newEncodedText = encodeText(plainText);
      setEncodedText(newEncodedText);
    }
  }, [encodingActive, plainText, encodeText]);

  useEffect(() => {
    if (!encodingActive) {
      const newDecodedText = decodeText(encodedText);
      setPlainText(newDecodedText);
    }
  }, [encodingActive, encodedText, decodeText]);

  const onChangeEncodedText = (e) => {
    setEncodedText(e.target.value);
  };

  const onFocusPlainText = () => {
    setEncodingActive(true);
  };

  const onFocusEncodedText = () => {
    setEncodingActive(false);
  };

  return (
    <Container
      maxWidth="md"
      className={mergeStyles({
        background: grey[100],
        height: '100%',
      })}
    >
      <Typography
        align="center"
        variant="h6"
        color="primary"
      >
        Szyfrowanie tekstem podstawieniowym polialfabetycznym
      </Typography>
      <Typography
        align="justify"
        variant="p"
        gutterBottom
        paragraph
      >
        Program umożliwia zakodowanie oraz rozkodowanie tekstu zapisanego z użyciem znaków alfanumerycznych
        określonych w systemie kodowania UTF-16 (znaki o numerach od 32 do 126) przy pomocy zdefiniowanego klucza.
        Wszystkim znakom tekstu przyporządkowywane są kolejne wartości UTF-16 klucza. Następnie zachodzi szyfrowanie
        każdego znaku poprzez dokonanie przesunięcia, o przyporządkowaną wartość z klucza, dzięki temu te same litery
        szyfrowane są poprzez różne znaki. Klucz szyfrowania zapisywany jest w pamięci przeglądarki.
      </Typography>
      <TextField
        label="klucz szyfrowania"
        placeholder="wprowadź klucz"
        onChange={onChangeKey}
        value={key}
        {...baseInputStyles}
      />
      <TextField
        label="tekst do zaszyfrowania"
        placeholder="wprowadź tekst do zaszyfrowania"
        onChange={onChangePlainText}
        value={plainText}
        onFocus={onFocusPlainText}
        className={mergeStyles({ background: encodingActive && green[100] })}
        {...multilineInputStyles}
      />
      <TextField
        label="tekst zaszyfrowany"
        placeholder="wprowadź tekst zaszyfrowany"
        onChange={onChangeEncodedText}
        value={encodedText}
        onFocus={onFocusEncodedText}
        className={mergeStyles({ background: !encodingActive && green[100] })}
        {...multilineInputStyles}
      />
    </Container>
  );
}

export default App;
