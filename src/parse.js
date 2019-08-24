const fs = require('fs').promises;

const yaml = require('js-yaml');
const semver = require('semver');
const lowdb = require('lowdb');
const LowDBMemoryStore = require('lowdb/adapters/Memory');

module.exports = class OpenAPI {
  constructor(spec) {
    this.spec = spec;

    // Insert the routes into the db
    const db = lowdb(new LowDBMemoryStore());
    db.defaults({ routes: [] }).write();
    for (let [path, methods] of Object.entries(this.spec.paths)) {
      for (let [method, route] of Object.entries(methods)) {
        db.get('routes')
          .push({ ...route, method, path })
          .write();
      }
    }
    this._routesDB = db;
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

  findRoute(filter) {
    return this._routesDB
      .get('routes')
      .filter(filter)
      .value();
  }

  findOneRoute(filter) {
    return this._routesDB
      .get('routes')
      .find(filter)
      .value();
  }
};
