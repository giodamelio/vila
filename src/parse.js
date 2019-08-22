const fs = require('fs').promises;

const yaml = require('js-yaml');

module.exports = async function parse(openAPISpecPath) {
  const specRaw = await fs.readFile(openAPISpecPath);

  // Since YAML is a superset of JSON there is no need to special case per extention
  const specParsed = yaml.safeLoad(specRaw);

  return specParsed;
};
