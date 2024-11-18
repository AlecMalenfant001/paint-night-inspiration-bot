// This script will return a random noun, adjective, or verb
import getAdjective from "./adjectives";
import getNoun from "./nouns";
import getVerb from "./verbs";
import getverb from "./verbs";

export default function randomWord(wordType) {
  let newWord = "";
  switch (wordType) {
    case "noun":
      newWord = randomNoun;
      break;
    case "adjective":
      newWord = randomAdjective;
      break;
    case "verb":
      newWord = randomVerb;
      break;
    default:
      newWord = "error";
  }
  return newWord;
}

const randomAdjective = () => {
  const randomNumber = Math.floor(Math.random() * 1098);
  return getAdjective(randomNumber);
};

const randomNoun = () => {
  const randomNumber = Math.floor(Math.random() * 2333);
  return getNoun(randomNumber);
};

const randomVerb = () => {
  const randomNumber = Math.floor(Math.random() * 633);
  return getVerb(randomNumber);
};
