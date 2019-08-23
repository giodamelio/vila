const fs = require('fs').promises;

const yaml = require('js-yaml');
const semver = require('semver');

module.exports = class OpenAPI {
  constructor(spec) {
    this.spec = spec;
  }

  static async fromFile(specPath) {
    const specRaw = await fs.readFile(specPath);

    // Since YAML is a superset of JSON there is no need to special case per extention
    const specParsed = yaml.safeLoad(specRaw);

    // Ensure that the spec is of the correct version
    if (!specParsed.openapi) {
      throw new Error('Input must be an OpenAPI spec');
    }
    if (!semver.satisfies(specParsed.openapi, '3.x')) {
      throw new Error('Input must be an OpenAPI whose version matches 3.x');
    }

    return new this(specParsed);
  }
};
