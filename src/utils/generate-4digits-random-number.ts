export const generate4DigitsRandomNumber = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
}