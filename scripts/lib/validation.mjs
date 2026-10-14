import fs from 'node:fs';
import path from 'node:path';
import { XMLValidator, XMLParser } from 'fast-xml-parser';
import Ajv from 'ajv';

export const readJSON = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const hex = /^#[\da-fA-F]{6}([\da-fA-F]{2})?$/;
export function contrast(foreground, background) {
  const rgb = color => [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16) / 255);
  const alpha = foreground.length === 9 ? parseInt(foreground.slice(7), 16) / 255 : 1;
  const bg = rgb(background);
  const fg = rgb(foreground).map((c, i) => c * alpha + bg[i] * (1 - alpha));
  const luminance = channels => channels.map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4)
    .reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + .05) / (b + .05);
}
const assert = (condition, message) => { if (!condition) throw new Error(message); };
export function validateNativeOnly(manifest, preset) {
  assert(!manifest.main && !manifest.browser && !manifest.activationEvents, 'Extension must remain declarative');
  assert(Object.keys(manifest.contributes).every(key => ['themes', 'iconThemes'].includes(key)), 'Only native theme contributions are allowed');
  assert(!Object.keys(preset).some(key => /secondarySideBar|auxiliaryBar|sideBar.*[Vv]isib/.test(key)), 'Preset must not alter secondary sidebar visibility');
}
export function validateTheme(theme, known, expectedType = theme.type) {
  assert(['light', 'dark'].includes(expectedType), 'Invalid native theme type');
  const ajv = new Ajv({ strict: false });
  const schema = {
    type: 'object', required: ['name', 'type', 'colors', 'tokenColors', 'semanticHighlighting', 'semanticTokenColors'],
    additionalProperties: false,
    properties: {
      $schema: { type: 'string' }, name: { type: 'string', minLength: 1 }, type: { const: expectedType },
      semanticHighlighting: { const: true },
      colors: { type: 'object', minProperties: 250, propertyNames: { enum: known }, additionalProperties: { type: 'string', pattern: hex.source } },
      tokenColors: { type: 'array', minItems: 20, items: { type: 'object', required: ['name', 'scope', 'settings'], additionalProperties: false,
        properties: { name: { type: 'string' }, scope: { type: 'array', minItems: 1, items: { type: 'string', minLength: 1 } },
          settings: { type: 'object', required: ['foreground'], additionalProperties: false, properties: {
            foreground: { type: 'string', pattern: hex.source }, fontStyle: { type: 'string', pattern: '^(|italic|bold|underline|strikethrough)( (italic|bold|underline|strikethrough))*$' }
          } } } } }, semanticTokenColors: { type: 'object', minProperties: 20 }
    }
  };
  const validate = ajv.compile(schema);
  assert(validate(theme), `Theme validation: ${ajv.errorsText(validate.errors)}`);
  const types = new Set('namespace type class enum interface struct typeParameter parameter variable property enumMember event function method macro label decorator comment string keyword number regexp operator'.split(' '));
  const modifiers = new Set('declaration definition readonly static deprecated abstract async modification documentation defaultLibrary'.split(' '));
  for (const [selector, style] of Object.entries(theme.semanticTokenColors)) {
    assert(selector.split(':').length <= 2, `Invalid semantic selector ${selector}`);
    const [classification, language] = selector.split(':');
    const [type, ...mods] = classification.split('.');
    assert(type === '*' || types.has(type), `Unknown semantic token type ${selector}`);
    assert(mods.every(m => modifiers.has(m)), `Unknown semantic token modifier ${selector}`);
    assert(!language || /^[\w-]+$/.test(language), `Invalid semantic language ${selector}`);
    if (typeof style === 'string') assert(hex.test(style), `Invalid semantic color ${selector}`);
    else {
      assert(style && typeof style === 'object' && Object.keys(style).length, `Invalid semantic style ${selector}`);
      for (const [key, value] of Object.entries(style)) {
        assert(['foreground', 'bold', 'italic', 'underline', 'strikethrough'].includes(key), `Invalid semantic style key ${key}`);
        assert(key === 'foreground' ? hex.test(value) : typeof value === 'boolean', `Invalid semantic style value ${selector}`);
      }
    }
  }
}
export function validateIcons(icons, base) {
  const definitions = icons.iconDefinitions;
  const used = new Set();
  for (const key of ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded']) {
    assert(definitions[icons[key]], `Missing default icon ${key}`); used.add(icons[key]);
  }
  for (const key of ['fileExtensions', 'fileNames', 'folderNames', 'folderNamesExpanded', 'languageIds']) {
    for (const [name, id] of Object.entries(icons[key])) {
      assert(name.length && definitions[id], `Broken icon mapping ${key}.${name} -> ${id}`); used.add(id);
    }
  }
  for (const variant of ['light', 'highContrast', 'highContrastLight']) {
    if (!icons[variant]) continue;
    for (const [key, mapping] of Object.entries(icons[variant])) {
      assert(['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded',
        'fileExtensions', 'fileNames', 'folderNames', 'folderNamesExpanded', 'languageIds'].includes(key), `Unknown icon override ${key}`);
      for (const id of typeof mapping === 'string' ? [mapping] : Object.values(mapping)) {
        assert(definitions[id], `Broken icon mapping ${variant}.${key} -> ${id}`); used.add(id);
      }
    }
  }
  assert(!icons.dark, 'Dark icons must use native default associations');
  assert(icons.hidesExplorerArrows === false, 'Folder expand controls must remain visible');
  for (const [id, definition] of Object.entries(definitions)) {
    const file = path.resolve(base, definition.iconPath);
    assert(file.startsWith(path.resolve(base) + path.sep), `Icon path escapes icons directory: ${id}`);
    assert(fs.existsSync(file), `Missing icon asset: ${file}`);
    const source = fs.readFileSync(file, 'utf8');
    assert(XMLValidator.validate(source) === true, `Malformed SVG: ${file}`);
    const svg = new XMLParser({ ignoreAttributes: false }).parse(source).svg;
    assert(svg?.['@_viewBox'] === '0 0 16 16', `Invalid icon viewBox: ${id}`);
    assert(!/<(?:script|foreignObject|image|text)\b|\b(?:href|on\w+)\s*=|<!DOCTYPE|<!ENTITY/i.test(source), `Unsafe or external SVG content: ${id}`);
    assert(used.has(id), `Unused icon asset: ${id}`);
  }
}
export function validateIconContrast(icons, base, theme) {
  const overrides = theme.type === 'light' ? icons.light || {} : {};
  const ids = new Set(['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded'].map(key => overrides[key] || icons[key]));
  for (const key of ['fileExtensions', 'fileNames', 'folderNames', 'folderNamesExpanded', 'languageIds']) {
    Object.values({ ...icons[key], ...overrides[key] }).forEach(id => ids.add(id));
  }
  const results = [];
  for (const id of ids) {
    const source = fs.readFileSync(path.resolve(base, icons.iconDefinitions[id].iconPath), 'utf8');
    const foreground = source.match(/color="(#[\da-f]{6})"/i)?.[1];
    assert(foreground, `Missing icon color: ${id}`);
    for (const key of ['sideBar.background', 'list.activeSelectionBackground', 'list.hoverBackground', 'tab.activeBackground', 'tab.inactiveBackground']) {
      const background = theme.colors[key];
      const ratio = contrast(foreground, background);
      assert(ratio >= 3, `Icon contrast ${id} / ${key}: ${ratio.toFixed(2)}:1 < 3:1`);
      results.push({ name: `${id} / ${key}`, foreground, background, ratio: Number(ratio.toFixed(2)), minimum: 3 });
    }
  }
  return results;
}
export function validateContrast(theme) {
  const c = theme.colors;
  const results = [];
  const check = (name, foreground, background, minimum = 4.5) => {
    const ratio = contrast(foreground, background);
    assert(ratio >= minimum, `Contrast ${name}: ${ratio.toFixed(2)}:1 < ${minimum}:1`);
    results.push({ name, foreground, background, ratio: Number(ratio.toFixed(2)), minimum });
  };
  for (const rule of theme.tokenColors) {
    for (const bg of ['editor.background', 'editor.selectionBackground', 'editor.lineHighlightBackground']) {
      check(`${rule.name} / ${bg}`, rule.settings.foreground, c[bg]);
    }
  }
  for (const [name, style] of Object.entries(theme.semanticTokenColors)) {
    const color = typeof style === 'string' ? style : style.foreground;
    if (color) {
      check(`semantic ${name}`, color, c['editor.background']);
      check(`semantic ${name} / selection`, color, c['editor.selectionBackground']);
      check(`semantic ${name} / active line`, color, c['editor.lineHighlightBackground']);
    }
  }
  for (const [fg, bg] of [
    ['foreground', 'quickInput.background'], ['editor.foreground', 'editor.background'],
    ['sideBar.foreground', 'sideBar.background'], ['statusBar.foreground', 'statusBar.background'],
    ['statusBar.debuggingForeground', 'statusBar.debuggingBackground'], ['tab.activeForeground', 'tab.activeBackground'],
    ['tab.inactiveForeground', 'tab.inactiveBackground'], ['input.foreground', 'input.background'],
    ['input.placeholderForeground', 'input.background'], ['editorLineNumber.foreground', 'editorGutter.background'],
    ['button.foreground', 'button.background'], ['button.foreground', 'button.hoverBackground'],
    ['button.secondaryForeground', 'button.secondaryBackground'], ['badge.foreground', 'badge.background'],
    ['editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedBackground'],
    ['list.activeSelectionForeground', 'list.activeSelectionBackground'], ['menu.foreground', 'menu.selectionBackground'],
    ['statusBarItem.errorForeground', 'statusBarItem.errorBackground'], ['statusBarItem.warningForeground', 'statusBarItem.warningBackground'],
    ['inputValidation.errorForeground', 'inputValidation.errorBackground'], ['inputValidation.warningForeground', 'inputValidation.warningBackground'],
    ['editorHoverWidget.foreground', 'editorHoverWidget.background'], ['notifications.foreground', 'notifications.background'],
    ['list.hoverForeground', 'list.hoverBackground'], ['list.focusForeground', 'list.focusBackground'],
    ['list.inactiveSelectionForeground', 'list.inactiveSelectionBackground'], ['breadcrumb.foreground', 'breadcrumb.background'],
    ['commandCenter.foreground', 'commandCenter.background'], ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground'],
    ['statusBarItem.prominentForeground', 'statusBarItem.prominentBackground'], ['statusBarItem.prominentForeground', 'statusBarItem.prominentHoverBackground'],
    ['statusBarItem.errorHoverForeground', 'statusBarItem.errorHoverBackground'], ['statusBarItem.warningHoverForeground', 'statusBarItem.warningHoverBackground'],
    ['modernEditorTab.activeForeground', 'modernEditorTab.activeBackground'], ['modernEditorTab.hoverForeground', 'modernEditorTab.hoverBackground'],
    ['modernTab.activeForeground', 'modernTab.activeBackground'], ['surface.foreground', 'surface.background']
  ]) check(fg, c[fg], c[bg]);
  for (const [id, color] of Object.entries(c)) {
    if (/^terminal\.ansi/.test(id)) check(id, color, c['terminal.background']);
  }
  return results;
}
export function validateIndicators(theme) {
  const c = theme.colors;
  return [
    ['focusBorder', 'input.background'], ['list.focusOutline', 'list.focusBackground'],
    ['list.focusAndSelectionOutline', 'list.activeSelectionBackground'],
    ['editorCursor.foreground', 'editor.background'], ['terminalCursor.foreground', 'terminal.background'],
    [theme.type === 'dark' ? 'tab.activeBorderTop' : 'tab.activeBorder', 'tab.activeBackground'], ['activityBar.activeBorder', 'activityBar.background'],
    ['panelTitle.activeBorder', 'panel.background']
  ].map(([fg, bg]) => {
    const ratio = contrast(c[fg], c[bg]);
    assert(ratio >= 3, `Indicator contrast ${fg}: ${ratio.toFixed(2)}:1 < 3:1`);
    return { name: fg, foreground: c[fg], background: c[bg], ratio: Number(ratio.toFixed(2)), minimum: 3 };
  });
}
