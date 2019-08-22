const fs = require('fs').promises;

const yaml = require('js-yaml');

module.exports = async function parse(openAPISpecPath) {
  const specRaw = await fs.readFile(openAPISpecPath);
  const specParsed = yaml.safeLoad(specRaw);

  return specParsed;
};
