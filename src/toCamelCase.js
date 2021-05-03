const toCamelCase = (str) => {
  return str.toLowerCase().replace(/^[a-z]/u, (init) => {
    return init.toUpperCase();
  }).replace(/_(?:<wordInit>[a-z])/u, (_, n1, o, s, {wordInit}) => {
    return wordInit.toUpperCase();
  });
};

export default toCamelCase;
