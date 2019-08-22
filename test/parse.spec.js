const path = require('path');

const parse = require('../src/parse');

describe('Parse OpenAPI specs', () => {
  it('Parse YAML spec', async () => {
    expect.assertions(1);
    const spec = await parse(path.join(__dirname, 'openapi_specs/simple.yaml'));

    expect(spec).toBeDefined();
  });

  it('Parse JSON spec', async () => {
    expect.assertions(1);
    const spec = await parse(path.join(__dirname, 'openapi_specs/simple.json'));

    console.log(spec);
    expect(spec).toBeDefined();
  });

  it('Spec file does not exist', async () => {
    expect.assertions(1);

    await expect(
      parse('this file does not exist')
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"ENOENT: no such file or directory, open 'this file does not exist'"`
    );
  });
});
