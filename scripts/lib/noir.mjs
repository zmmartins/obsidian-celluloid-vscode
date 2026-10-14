// Intentional Noir treatments layered on shared component/token categories.
// These are component decisions, not an inversion or a remapping of Light hex values.
export function noirOptions(t) {
  const colorOverrides = {};
  const set = (value, ids) => ids.split(/\s+/).filter(Boolean).forEach(id => {
    if (id in colorOverrides) throw new Error(`Duplicate Noir override: ${id}`);
    colorOverrides[id] = value;
  });
  set(t.chrome, `sideBar.background statusBar.background statusBar.noFolderBackground
    titleBar.activeBackground titleBar.inactiveBackground breadcrumb.background minimap.background
    modernUI.shellBackground modernUI.inactiveShellBackground`);
  set(t.shelf, `input.background dropdown.background dropdown.listBackground quickInput.background
    menu.background editorWidget.background editorHoverWidget.background editorSuggestWidget.background
    notifications.background notificationCenterHeader.background breadcrumbPicker.background
    commandCenter.background commandCenter.activeBackground settings.textInputBackground
    settings.numberInputBackground settings.dropdownBackground settings.checkboxBackground
    editorActionList.background surface.background debugToolBar.background`);
  set(t.raised, `list.activeSelectionBackground list.inactiveSelectionBackground list.focusBackground
    list.inactiveFocusBackground list.hoverBackground menu.selectionBackground
    editorSuggestWidget.selectedBackground editorActionList.focusBackground
    modernEditorTab.selectedActionBackground`);
  set(t.ink, `editorSuggestWidget.selectedForeground button.secondaryForeground
    list.activeSelectionIconForeground list.inactiveSelectionIconForeground`);
  set(t.blue, `editorCursor.foreground inputOption.activeBorder commandCenter.activeBorder
    editorBracketMatch.border`);
  set(t.paper, `editorCursor.background terminalCursor.background button.foreground badge.foreground
    activityBarBadge.foreground extensionButton.prominentForeground`);
  set(t.red, `button.background badge.background extensionButton.prominentBackground
    list.focusOutline list.focusAndSelectionOutline activityBar.foreground modernActivityBarItem.activeForeground`);
  set('#FF625A', `button.hoverBackground extensionButton.prominentHoverBackground`);
  set(t.border, `tab.border`);
  set(t.red, `tab.activeBorderTop`);
  set('#00000000', `tab.activeBorder`);
  set(t.red + '80', `tab.unfocusedActiveBorderTop`);
  set('#00000000', `tab.unfocusedActiveBorder`);
  set(t.secondary + '38', `editorIndentGuide.background1 tree.inactiveIndentGuidesStroke editorWhitespace.foreground`);
  set(t.secondary + '70', `editorIndentGuide.activeBackground1 tree.indentGuidesStroke`);
  set('#00000080', `widget.shadow`);
  set(t.red + '66', `list.inactiveFocusOutline`);
  set(t.blue + '18', `editor.selectionHighlightBackground editor.wordHighlightBackground
    editor.wordHighlightStrongBackground editor.wordHighlightTextBackground editor.rangeHighlightBackground
    sideBar.dropBackground list.dropBackground editorGroup.dropBackground`);
  set(t.blue + '60', `editor.selectionHighlightBorder editor.wordHighlightBorder
    editor.wordHighlightStrongBorder editor.wordHighlightTextBorder`);
  set(t.selection, `terminal.inactiveSelectionBackground`);
  set(t.secondary + '30', `scrollbarSlider.background`);
  set(t.secondary + '48', `scrollbarSlider.hoverBackground`);
  set(t.secondary + '60', `scrollbarSlider.activeBackground`);
  set(t.red + '1A', `minimapSlider.background`);
  set(t.red + '26', `minimapSlider.hoverBackground`);
  set(t.red + '33', `minimapSlider.activeBackground`);
  set('#000000D0', `minimap.foregroundOpacity`);
  set(t.blue + '55', `minimap.selectionHighlight`);
  set(t.amber + '24', `editor.findMatchBackground peekViewEditor.matchHighlightBackground peekViewResult.matchHighlightBackground`);
  set(t.amber + '14', `editor.findMatchHighlightBackground editor.findRangeHighlightBackground`);
  set(t.amber + '80', `editor.findMatchHighlightBorder`);
  set(t.green + '18', `diffEditor.insertedTextBackground diffEditor.insertedLineBackground diffEditorGutter.insertedLineBackground`);
  set(t.green + '80', `diffEditorOverview.insertedForeground`);
  set(t.red + '18', `diffEditor.removedTextBackground diffEditor.removedLineBackground diffEditorGutter.removedLineBackground`);
  set(t.red + '80', `diffEditorOverview.removedForeground`);
  set(t.secondary + '18', `diffEditor.diagonalFill`);
  set(t.greenWash, `merge.currentHeaderBackground`);
  set(t.blueWash, `merge.incomingHeaderBackground`);
  set(t.green + '12', `merge.currentContentBackground`);
  set(t.blue + '12', `merge.incomingContentBackground`);
  set(t.secondary + '0D', `merge.commonContentBackground`);
  set(t.red + '15', `testing.uncoveredBackground`);
  set(t.error, `statusBar.debuggingForeground`);
  set(t.blueWash, `statusBarItem.remoteBackground statusBarItem.remoteHoverBackground`);
  set(t.shelf, `statusBarItem.prominentBackground`);
  set(t.raised, `statusBarItem.prominentHoverBackground`);
  // ANSI black is a readable gray foreground on near-black; bright colors remain distinct.
  set('#787885', `terminal.ansiBlack`);
  set('#A1A1AA', `terminal.ansiBrightBlack`);
  set(t.blueBright, `terminal.ansiBrightBlue`);
  set('#FF756C', `terminal.ansiBrightRed`);
  set('#70E591', `terminal.ansiBrightGreen`);
  set(t.amberBright, `terminal.ansiBrightYellow`);
  set('#D7BCFF', `terminal.ansiBrightMagenta`);
  set('#A0E5FF', `terminal.ansiBrightCyan`);
  set('#D8D8DF', `terminal.ansiWhite`);
  set(t.ink, `terminal.ansiBrightWhite`);
  return {
    name: 'Obsidian Celluloid Noir', type: 'dark', colorOverrides,
    tokenOverrides: {
      'Cobalt numbers': { foreground: t.amber },
      'Primitive types': { foreground: t.amber }
    },
    semanticOverrides: { number: t.amber, 'type.defaultLibrary': t.amber }
  };
}
