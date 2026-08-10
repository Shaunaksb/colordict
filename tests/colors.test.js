const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { buildColorMap, buildComboMap } = require('../script.js');

describe('ColorDict Unit Tests', () => {
  const colorsFilePath = path.join(__dirname, '..', 'colors.json');

  test('Test 1: JSON Schema & Integrity Test', () => {
    assert.strictEqual(fs.existsSync(colorsFilePath), true, 'colors.json file must exist');

    const rawData = fs.readFileSync(colorsFilePath, 'utf8');
    const colors = JSON.parse(rawData);

    assert.strictEqual(Array.isArray(colors), true, 'colors.json must parse as an array');
    assert.ok(colors.length > 0, 'colors array must contain entries');

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    colors.forEach((entry, index) => {
      assert.strictEqual(typeof entry.name, 'string', `Entry at index ${index} must have a string 'name'`);
      assert.ok(entry.name.trim().length > 0, `Entry at index ${index} name cannot be empty`);

      assert.strictEqual(typeof entry.hex, 'string', `Entry at index ${index} must have a string 'hex'`);
      assert.match(entry.hex, hexRegex, `Entry at index ${index} hex '${entry.hex}' must be a valid hex color code`);

      assert.strictEqual(Array.isArray(entry.combinations), true, `Entry at index ${index} must have a 'combinations' array`);
      assert.ok(entry.combinations.length > 0, `Entry at index ${index} combinations array must not be empty`);
    });
  });

  test('Test 2: Combination Mapper Logic Test', () => {
    const mockColors = [
      { name: 'Red', hex: '#FF0000', combinations: [1, 2] },
      { name: 'Blue', hex: '#0000FF', combinations: [1, 3] },
      { name: 'Yellow', hex: '#FFFF00', combinations: [2, 3] }
    ];

    const colorMap = buildColorMap(mockColors);
    assert.strictEqual(colorMap[0].name, 'Red');
    assert.strictEqual(colorMap[1].name, 'Blue');
    assert.strictEqual(colorMap[2].name, 'Yellow');

    const comboMap = buildComboMap(mockColors);

    // comboId 1 should contain indices 0 (Red) and 1 (Blue)
    assert.ok(comboMap[1] instanceof Set, 'Combo map entry must be a Set');
    assert.deepStrictEqual(Array.from(comboMap[1]), [0, 1]);

    // comboId 2 should contain indices 0 (Red) and 2 (Yellow)
    assert.deepStrictEqual(Array.from(comboMap[2]), [0, 2]);

    // comboId 3 should contain indices 1 (Blue) and 2 (Yellow)
    assert.deepStrictEqual(Array.from(comboMap[3]), [1, 2]);
  });
});
