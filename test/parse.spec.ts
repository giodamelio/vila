import * as path from 'path';

import OpenAPI from '../src/parse';

describe('Parse OpenAPI specs', () => {
  describe('constructor()', () => {
    let spec;
    beforeAll(async () => {
      spec = await OpenAPI.fromFile(
        path.join(__dirname, 'openapi_specs/simple.yaml')
      );
    });

    it('Propertly insert routes into database', async () => {
      expect.assertions(2);

      const routes = spec._routesDB
        .get('routes')
        .filter({})
        .value();
      expect(routes).toHaveLength(1);
      expect(routes).toMatchSnapshot();
    });
  });

  describe('fromFile()', () => {
    it('Parse YAML spec', async () => {
      expect.assertions(1);

      const spec = await OpenAPI.fromFile(
        path.join(__dirname, 'openapi_specs/simple.yaml')
      );

      expect(spec).toBeDefined();
    });

    it('Parse JSON spec', async () => {
      expect.assertions(1);

      const spec = await OpenAPI.fromFile(
        path.join(__dirname, 'openapi_specs/simple.json')
      );

      expect(spec).toBeDefined();
    });

    it('Spec file does not exist', async () => {
      expect.assertions(1);

      await expect(
        OpenAPI.fromFile('this file does not exist')
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"ENOENT: no such file or directory, open 'this file does not exist'"`
      );
    });

    it('Version must match OpenAPI 3.x', async () => {
      expect.assertions(2);

      await expect(
        OpenAPI.fromFile(
          path.join(__dirname, 'openapi_specs/swagger_version_2.json')
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Input must be an OpenAPI spec"`
      );
      await expect(
        OpenAPI.fromFile(
          path.join(__dirname, 'openapi_specs/openapi_version_4.json')
        )
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Input must be an OpenAPI whose version matches 3.x"`
      );
    });
  });

  describe('findOneRoute()', () => {
    let spec;
    beforeAll(async () => {
      spec = await OpenAPI.fromFile(
        path.join(__dirname, 'openapi_specs/simple.yaml')
      );
    });

    it('Get a route by its operation id', () => {
      expect.assertions(1);

      expect(spec.findOneRoute({ operationId: 'echo' })).toMatchSnapshot();
    });

    it('No routes matching', () => {
      expect.assertions(1);

      expect(
        spec.findOneRoute({ operationId: 'thisOperationIdDoesNotExist' })
      ).not.toBeDefined();
    });
  });

  describe('findRoute()', () => {
    let spec;
    beforeAll(async () => {
      spec = await OpenAPI.fromFile(
        path.join(__dirname, 'openapi_specs/simple.yaml')
      );
    });

    it('Get a route by its operation id', () => {
      expect.assertions(1);

      expect(spec.findRoute({ operationId: 'echo' })).toMatchSnapshot();
    });

    it('No routes matching', () => {
      expect.assertions(1);

      expect(
        spec.findRoute({ operationId: 'thisOperationIdDoesNotExist' })
      ).toEqual([]);
    });
  });
});
