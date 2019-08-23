const path = require('path');

const OpenAPI = require('../src/parse');

describe('Parse OpenAPI specs', () => {
  describe('constructor()', () => {
    it('Properly build operationId to route map', async () => {
      expect.assertions(3);

      const spec = await OpenAPI.fromFile(
        path.join(__dirname, 'openapi_specs/simple.yaml')
      );

      expect(spec._operationIdToRoute).toBeDefined();
      expect(spec._operationIdToRoute.size).toBe(1);
      expect(spec._operationIdToRoute).toMatchSnapshot();
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
});
