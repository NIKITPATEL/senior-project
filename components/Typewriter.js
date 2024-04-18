import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const Typewriter = ({ text, delay }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setDisplayText(text.substring(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex === text.length) {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <Text>{displayText}</Text>;
};

export default Typewriter;
