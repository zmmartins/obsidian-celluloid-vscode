import fs from 'node:fs';
import { contrast } from './validation.mjs';

export const defaultIconKeys = ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded'];
export const mappingIconKeys = ['fileExtensions', 'fileNames', 'folderNames', 'folderNamesExpanded', 'languageIds'];

// Native file icon themes use default associations for dark themes and a light
// override. Keep the exact original definitions/assets in the light override.
export function adaptIcons(original, noir, tokens, write) {
  const icons = structuredClone(original);
  const backgrounds = ['sideBar.background', 'list.hoverBackground', 'list.activeSelectionBackground',
    'tab.activeBackground', 'tab.inactiveBackground'].map(id => noir.colors[id]);
  const palette = JSON.parse(fs.readFileSync('design/tokens.json', 'utf8'));
  const light = {};
  const replacements = new Map();
  for (const [id, definition] of Object.entries(original.iconDefinitions)) {
    const source = fs.readFileSync(`icons/${definition.iconPath}`, 'utf8');
    const ink = source.match(/color="(#[\da-f]{6})"/i)?.[1];
    if (!ink) throw new Error(`Icon has no palette color: ${id}`);
    if (backgrounds.every(bg => contrast(ink, bg) >= 3)) continue;
    const role = Object.keys(palette).find(key => palette[key] === ink);
    const color = tokens[role];
    if (!color || !backgrounds.every(bg => contrast(color, bg) >= 3)) throw new Error(`Unusable Noir icon color: ${id}`);
    const darkId = `${id}-noir`;
    write(`icons/svg/noir/${id}.svg`, source.replace(`color="${ink}"`, `color="${color}"`));
    icons.iconDefinitions[darkId] = { iconPath: `./svg/noir/${id}.svg` };
    replacements.set(id, darkId);
  }
  for (const key of defaultIconKeys) {
    if (!replacements.has(original[key])) continue;
    light[key] = original[key];
    icons[key] = replacements.get(original[key]);
  }
  for (const key of mappingIconKeys) {
    const overrides = {};
    for (const [name, id] of Object.entries(original[key])) {
      if (!replacements.has(id)) continue;
      overrides[name] = id;
      icons[key][name] = replacements.get(id);
    }
    if (Object.keys(overrides).length) light[key] = overrides;
  }
  icons.light = light;
  return icons;
}
