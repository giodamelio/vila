import { promises as fs } from 'fs';

import yaml from 'js-yaml';
import semver from 'semver';
import lowdb from 'lowdb';
import LowDBMemoryStore from 'lowdb/adapters/Memory';

import { OpenAPIV3 } from 'openapi-types';

export default class OpenAPI {
  spec: OpenAPIV3.Document;
  _routesDB: lowdb.LowdbSync<any>;

  constructor(spec: OpenAPIV3.Document) {
    this.spec = spec;

    // Insert the routes into the db
    const db = lowdb(new LowDBMemoryStore(''));
    db.defaults({ routes: [] }).write();
    for (let [path, methods] of Object.entries(this.spec.paths)) {
      for (let [method, route] of Object.entries(methods)) {
        // `as any` is a nasty hack because of bug it lowdb/lodash type definitions
        // https://github.com/typicode/lowdb/issues/233
        (db.get('routes') as any).push({ ...route, method, path }).write();
      }
    }
    this._routesDB = db;
  }

  static async fromFile(specPath: string) {
    const specRaw = await fs.readFile(specPath);

    // Since YAML is a superset of JSON there is no need to special case per extention
    const specParsed = yaml.safeLoad(specRaw.toString());

    // Ensure that the spec is of the correct version
    if (!specParsed.openapi) {
      throw new Error('Input must be an OpenAPI spec');
    }
    if (!semver.satisfies(specParsed.openapi, '3.x')) {
      throw new Error('Input must be an OpenAPI whose version matches 3.x');
    }

    return new this(specParsed);
  }

  findRoute(filter: object) {
    // `as any` is a nasty hack because of bug it lowdb/lodash type definitions
    // https://github.com/typicode/lowdb/issues/233
    return (this._routesDB.get('routes') as any).filter(filter).value();
  }

  findOneRoute(filter: object) {
    // `as any` is a nasty hack because of bug it lowdb/lodash type definitions
    // https://github.com/typicode/lowdb/issues/233
    return (this._routesDB.get('routes') as any).find(filter).value();
  }
}
