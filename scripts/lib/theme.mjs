// Shared native workbench groups and token categories; Light defaults remain frozen.
export function createTheme(t, { name, type, colorOverrides = {}, tokenOverrides = {}, semanticOverrides = {} }) {
  const colors = {};
  const set = (value, ids) => ids.split(/\s+/).filter(Boolean).forEach(id => {
    if (id in colors) throw new Error(`Duplicate color: ${id}`);
    colors[id] = value;
  });
  set(t.ink, `foreground editor.foreground activityBar.foreground sideBar.foreground sideBarTitle.foreground
    sideBarSectionHeader.foreground titleBar.activeForeground tab.activeForeground tab.hoverForeground
    statusBar.foreground statusBar.noFolderForeground statusBar.debuggingForeground panelTitle.activeForeground
    input.foreground dropdown.foreground quickInput.foreground menu.foreground editorWidget.foreground
    editorHoverWidget.foreground editorSuggestWidget.foreground notifications.foreground notificationCenterHeader.foreground
    terminal.foreground debugConsole.sourceForeground settings.headerForeground settings.checkboxForeground
    settings.textInputForeground settings.numberInputForeground settings.dropdownForeground breadcrumb.activeSelectionForeground
    list.activeSelectionForeground list.inactiveSelectionForeground list.focusForeground list.hoverForeground
    editorActionList.foreground editorActionList.focusForeground commandCenter.foreground commandCenter.activeForeground`);
  set(t.paper, `editor.background sideBar.background breadcrumbPicker.background tab.activeBackground tab.hoverBackground
    statusBar.background statusBar.noFolderBackground panel.background terminal.background
    input.background dropdown.background dropdown.listBackground quickInput.background menu.background
    editorWidget.background editorHoverWidget.background editorSuggestWidget.background notifications.background
    notificationCenterHeader.background settings.textInputBackground settings.numberInputBackground
    settings.dropdownBackground commandCenter.activeBackground editorActionList.background`);
  set(t.canvas, `editorGroup.emptyBackground editorPane.background titleBar.activeBackground
    editorGutter.background breadcrumb.background minimap.background welcomePage.background`);
  set(t.chrome, `activityBar.background activityBarTop.background sideBarSectionHeader.background
    editorGroupHeader.tabsBackground tab.inactiveBackground tab.unfocusedInactiveBackground
    titleBar.inactiveBackground panelSectionHeader.background editorHoverWidget.statusBarBackground
    editorStickyScroll.background editorStickyScrollHover.background debugToolBar.background
    peekViewEditor.background peekViewResult.background settings.focusedRowBackground`);
  set(t.shelf, `list.hoverBackground list.inactiveSelectionBackground list.focusBackground quickInputTitle.background
    editorSuggestWidget.selectedBackground
    menu.selectionBackground commandCenter.background editorActionList.focusBackground button.secondaryBackground
    inputOption.hoverBackground statusBarItem.hoverBackground statusBarItem.compactHoverBackground
    toolbar.hoverBackground toolbar.activeBackground tab.unfocusedActiveBackground tab.unfocusedHoverBackground`);
  set(t.secondary, `descriptionForeground icon.foreground activityBar.inactiveForeground activityBarTop.inactiveForeground
    titleBar.inactiveForeground tab.inactiveForeground tab.unfocusedActiveForeground tab.unfocusedInactiveForeground
    panelTitle.inactiveForeground input.placeholderForeground breadcrumb.foreground
    list.deemphasizedForeground debugConsole.infoForeground editorCodeLens.foreground editorInlayHint.foreground
    settings.modifiedItemIndicator terminal.ansiBrightBlack`);
  set(t.disabled, `disabledForeground tab.unfocusedHoverForeground editorHint.foreground list.inactiveFocusOutline
    editorGhostText.foreground debugIcon.breakpointDisabledForeground`);
  set(t.border, `activityBar.border sideBar.border editorGroup.border editorGroupHeader.tabsBorder
    tab.border titleBar.border statusBar.border statusBar.noFolderBorder panel.border panelSection.border
    panelSectionHeader.border input.border dropdown.border menu.border editorWidget.border editorHoverWidget.border
    editorSuggestWidget.border notificationCenter.border notifications.border
    commandCenter.border commandCenter.inactiveBorder editorStickyScroll.border notificationToast.border sideBarSectionHeader.border
    debugToolBar.border settings.textInputBorder settings.numberInputBorder settings.dropdownBorder settings.checkboxBorder
    editorRuler.foreground tree.indentGuidesStroke tree.inactiveIndentGuidesStroke editorOverviewRuler.border
    editorIndentGuide.background1 editorWhitespace.foreground`);
  set(t.borderStrong, `editorIndentGuide.activeBackground1 widget.border list.dropBetweenBackground
    editorBracketMatch.border editor.selectionHighlightBorder`);
  set(t.red, `focusBorder activityBar.activeBorder activityBarTop.activeBorder activityBarTop.foreground
    tab.activeBorderTop panelTitle.activeBorder progressBar.background editorCursor.foreground
    terminalCursor.foreground textLink.activeForeground inputOption.activeBorder inputValidation.errorBorder
    editorError.foreground debugIcon.breakpointForeground debugIcon.breakpointCurrentStackframeForeground
    debugIcon.stopForeground debugIcon.disconnectForeground debugIcon.restartForeground
    testing.iconFailed problemsErrorIcon.foreground notificationsErrorIcon.foreground
    list.errorForeground gitDecoration.deletedResourceForeground gitDecoration.conflictingResourceForeground
    editorGutter.deletedBackground editorOverviewRuler.deletedForeground charts.red`);
  set(t.signal, `debugIcon.breakpointStackframeForeground debugIcon.breakpointUnverifiedForeground`);
  set(t.blue, `textLink.foreground list.highlightForeground list.focusHighlightForeground list.focusAndSelectionOutline
    editorSuggestWidget.highlightForeground editorSuggestWidget.focusHighlightForeground editorHoverWidget.highlightForeground editorSuggestWidget.selectedForeground editorLink.activeForeground
    editorInfo.foreground problemsInfoIcon.foreground editorGutter.modifiedBackground
    gitDecoration.modifiedResourceForeground editorOverviewRuler.modifiedForeground
    notificationsInfoIcon.foreground notificationLink.foreground debugConsoleInputIcon.foreground charts.blue testing.iconQueued peekViewTitleLabel.foreground
    peekViewResult.selectionForeground pickerGroup.foreground sash.hoverBorder editorBracketHighlight.foreground1`);
  set(t.amber, `editorWarning.foreground problemsWarningIcon.foreground notificationsWarningIcon.foreground list.warningForeground
    inputValidation.warningBorder gitDecoration.renamedResourceForeground gitDecoration.stageModifiedResourceForeground
    debugConsole.warningForeground testing.iconErrored editorBracketHighlight.foreground2 charts.orange
    tab.activeModifiedBorder tab.inactiveModifiedBorder tab.unfocusedActiveModifiedBorder tab.unfocusedInactiveModifiedBorder`);
  set(t.green, `gitDecoration.addedResourceForeground gitDecoration.untrackedResourceForeground editorGutter.foldingControlForeground
    editorGutter.addedBackground editorOverviewRuler.addedForeground testing.iconPassed
    testing.runAction debugIcon.startForeground debugIcon.continueForeground charts.green editorBracketHighlight.foreground3`);
  set(t.muted, `gitDecoration.ignoredResourceForeground gitDecoration.submoduleResourceForeground
    gitDecoration.stageDeletedResourceForeground peekViewResult.fileForeground peekViewResult.lineForeground
    peekViewTitleDescription.foreground`);
  set(t.paper, `button.foreground button.separator badge.foreground activityBarBadge.foreground
    statusBarItem.remoteForeground statusBarItem.prominentForeground statusBarItem.errorForeground
    statusBarItem.warningForeground extensionButton.prominentForeground inputOption.activeForeground`);
  set(t.carbon, `button.background badge.background`);
  set(t.slate, `button.hoverBackground button.secondaryForeground textPreformat.foreground terminal.ansiBlack charts.foreground`);
  set(t.raised, `button.secondaryHoverBackground editorInlayHint.background editorBracketMatch.background`);
  set(t.red, `activityBarBadge.background extensionButton.prominentBackground statusBarItem.errorBackground`);
  set('#930004', `extensionButton.prominentHoverBackground`);
  set(t.amber, `statusBarItem.warningBackground`);
  set(t.blue, `statusBarItem.remoteBackground statusBarItem.prominentBackground`);
  set('#003FA4', `statusBarItem.prominentHoverBackground`);
  set(t.errorWash, `statusBar.debuggingBackground inputValidation.errorBackground`);
  set(t.error, `inputValidation.errorForeground debugConsole.errorForeground errorForeground`);
  set(t.amberWash, `inputValidation.warningBackground`);
  set(t.amber, `inputValidation.warningForeground`);
  set(t.selection, `inputValidation.infoBackground list.activeSelectionBackground
    editor.selectionBackground terminal.selectionBackground peekViewResult.selectionBackground inputOption.activeBackground`);
  set(t.blue, `inputValidation.infoForeground inputValidation.infoBorder list.focusOutline peekView.border`);
  set(t.selection, `editor.inactiveSelectionBackground`);
  set('#0051CD18', `editor.selectionHighlightBackground editor.wordHighlightBackground editor.wordHighlightStrongBackground
    editor.wordHighlightTextBackground editor.rangeHighlightBackground
    minimap.selectionHighlight sideBar.dropBackground list.dropBackground editorGroup.dropBackground`);
  set('#0051CD66', `editor.wordHighlightBorder editor.wordHighlightStrongBorder editor.wordHighlightTextBorder`);
  set(t.line, `editor.lineHighlightBackground`);
  set('#00000000', `editor.lineHighlightBorder tab.activeBorder tab.unfocusedActiveBorder editorOverviewRuler.background
    editorGhostText.background editorGhostText.border widget.shadow scrollbar.shadow`);
  set(t.gutter, `editorLineNumber.foreground editorLineNumber.dimmedForeground`);
  set(t.ink, `editorLineNumber.activeForeground editorCursor.background terminalCursor.background`);
  set('#E7000B55', `tab.unfocusedActiveBorderTop minimapSlider.activeBackground`);
  set('#0C0C0E14', `scrollbarSlider.background minimapSlider.background`);
  set('#0C0C0E25', `scrollbarSlider.hoverBackground minimapSlider.hoverBackground`);
  set('#0C0C0E40', `scrollbarSlider.activeBackground`);
  set('#FC941F66', `editor.findMatchBackground peekViewEditor.matchHighlightBackground peekViewResult.matchHighlightBackground`);
  set('#FC941F33', `editor.findMatchHighlightBackground editor.findRangeHighlightBackground`);
  set(t.amber, `editor.findMatchBorder minimap.findMatchHighlight`);
  set('#8E4E0080', `editor.findMatchHighlightBorder`);
  set('#107C4120', `diffEditor.insertedTextBackground diffEditor.insertedLineBackground diffEditorGutter.insertedLineBackground
    diffEditorOverview.insertedForeground`);
  set('#BA1A1A20', `diffEditor.removedTextBackground diffEditor.removedLineBackground diffEditorGutter.removedLineBackground
    diffEditorOverview.removedForeground`);
  set('#5F3F3A0D', `diffEditor.diagonalFill`);
  set(t.border, `diffEditor.border diffEditor.unchangedRegionBackground`);
  set(t.secondary, `diffEditor.unchangedRegionForeground`);
  set(t.red + 'B3', `editorOverviewRuler.errorForeground minimap.errorHighlight`);
  set(t.amber + 'B3', `editorOverviewRuler.warningForeground minimap.warningHighlight`);
  set(t.blue + '80', `editorOverviewRuler.infoForeground editorOverviewRuler.selectionHighlightForeground
    editorOverviewRuler.findMatchForeground editorOverviewRuler.wordHighlightForeground editorOverviewRuler.wordHighlightStrongForeground`);
  // VS Code expects foregroundOpacity to encode an alpha value rather than a grey hue.
  set('#000000C0', `minimap.foregroundOpacity`);
  set(t.chrome, `textCodeBlock.background textPreformat.background textBlockQuote.background peekViewTitle.background`);
  set(t.borderStrong, `textBlockQuote.border textSeparator.foreground pickerGroup.border`);
  set(t.blueWash, `merge.currentHeaderBackground merge.incomingHeaderBackground`);
  set('#DAE1FF55', `merge.currentContentBackground merge.incomingContentBackground`);
  set(t.border, `merge.border`);
  set(t.chrome, `merge.commonHeaderBackground`);
  set('#F6F3F580', `merge.commonContentBackground`);
  set(t.red, `terminal.ansiRed`);
  set(t.signal, `terminal.ansiBrightRed`);
  set(t.green, `terminal.ansiGreen terminal.ansiBrightGreen`);
  set(t.amber, `terminal.ansiYellow terminal.ansiBrightYellow`);
  set(t.blue, `terminal.ansiBlue`);
  set('#0055D4', `terminal.ansiBrightBlue`);
  set(t.purple, `terminal.ansiMagenta terminal.ansiBrightMagenta editorBracketHighlight.foreground4 charts.purple`);
  set(t.cyan, `terminal.ansiCyan terminal.ansiBrightCyan editorBracketHighlight.foreground5`);
  set('#777079', `terminal.ansiWhite`);
  set('#635C65', `terminal.ansiBrightWhite`);
  set(t.red, `editorBracketHighlight.foreground6 editorBracketHighlight.unexpectedBracket.foreground`);
  set(t.paper, `settings.checkboxBackground`);
  set(t.secondary, `panelSectionHeader.foreground`);
  set('#DAE1FF80', `terminal.inactiveSelectionBackground`);
  set(t.red, `statusBarItem.focusBorder statusBar.focusBorder commandCenter.activeBorder`);
  set(t.border, `terminal.border terminalOverviewRuler.border statusBar.debuggingBorder activityBarTop.dropBorder`);
  set(t.amber, `editorLightBulb.foreground`);
  set(t.blue, `editorLightBulbAutoFix.foreground editorLightBulbAi.foreground`);
  set(t.greenWash, `testing.coveredBackground`);
  set('#BA1A1A15', `testing.uncoveredBackground`);

  // v0.2 component-specific refinements override the broad foundational groups.
  // Keep this table explicit: each existing key must already belong to the theme.
  const refinements = {
    'editor.foreground': t.carbon, 'terminal.foreground': t.carbon,
    'editorGutter.background': t.gutterSurface, 'editorLineNumber.activeForeground': t.carbon,
    'editorGutter.foldingControlForeground': t.secondary,
    'editorIndentGuide.background1': '#0C0C0E10', 'editorIndentGuide.activeBackground1': '#0C0C0E28',
    'tree.indentGuidesStroke': '#0C0C0E28', 'tree.inactiveIndentGuidesStroke': '#0C0C0E10',
    'editorOverviewRuler.border': '#00000000',
    'widget.shadow': '#0C0C0E0D',
    'editor.selectionHighlightBackground': t.blue + '12', 'editor.selectionHighlightBorder': t.blue + '40',
    'editor.wordHighlightBackground': t.blue + '12', 'editor.wordHighlightStrongBackground': t.blue + '18',
    'editor.wordHighlightTextBackground': t.blue + '12', 'editor.rangeHighlightBackground': t.blue + '12',
    'editor.wordHighlightBorder': t.blue + '40', 'editor.wordHighlightStrongBorder': t.blue + '40',
    'editor.wordHighlightTextBorder': t.blue + '40',
    'list.activeSelectionBackground': t.explorerSelection, 'list.inactiveSelectionBackground': t.explorerSelection,
    'list.focusBackground': t.explorerSelection, 'list.hoverBackground': t.chrome,
    'list.focusOutline': t.red + 'A0', 'list.focusAndSelectionOutline': t.red + 'A0',
    'list.inactiveFocusOutline': t.red + '40',
    'tab.border': '#0C0C0E10', 'tab.activeBorder': t.red, 'tab.activeBorderTop': '#00000000',
    'tab.unfocusedActiveBorder': t.red + '66', 'tab.unfocusedActiveBorderTop': '#00000000',
    'tab.unfocusedActiveBackground': t.paper, 'tab.unfocusedHoverBackground': t.chrome,
    'tab.inactiveForeground': t.muted, 'tab.unfocusedActiveForeground': t.muted, 'tab.unfocusedHoverForeground': t.muted,
    'breadcrumb.background': t.chrome, 'breadcrumb.foreground': t.muted,
    'commandCenter.foreground': t.muted,
    'minimap.background': t.chrome, 'minimap.foregroundOpacity': '#000000A8',
    'minimap.selectionHighlight': t.blue + '30',
    'minimapSlider.background': t.red + '18', 'minimapSlider.hoverBackground': t.red + '24',
    'minimapSlider.activeBackground': t.red + '30',
    'statusBar.foreground': t.muted, 'statusBar.noFolderForeground': t.muted,
    'statusBarItem.remoteForeground': t.blue, 'statusBarItem.remoteBackground': t.blueWash,
    'statusBarItem.prominentForeground': t.ink, 'statusBarItem.prominentBackground': t.shelf,
    'statusBarItem.prominentHoverBackground': t.raised,
    'statusBarItem.errorForeground': t.error, 'statusBarItem.errorBackground': t.errorWash,
    'statusBarItem.warningForeground': t.amber, 'statusBarItem.warningBackground': t.amberWash,
    'inputOption.activeForeground': t.ink
  };
  for (const [id, value] of Object.entries(refinements)) {
    if (!(id in colors)) throw new Error(`Refinement has no foundational color: ${id}`);
    colors[id] = value;
  }
  set(t.selection, `selection.background`);
  set(t.explorerSelection, `list.inactiveFocusBackground`);
  set(t.muted, `list.activeSelectionIconForeground list.inactiveSelectionIconForeground commandCenter.inactiveForeground`);
  set(t.blue, `breadcrumb.focusForeground statusBarItem.remoteHoverForeground`);
  set(t.blueWash, `statusBarItem.remoteHoverBackground`);
  set(t.ink, `statusBarItem.prominentHoverForeground statusBarItem.hoverForeground`);
  set(t.shelf, `statusBarItem.activeBackground`);
  set(t.error, `statusBarItem.errorHoverForeground`);
  set(t.errorWash, `statusBarItem.errorHoverBackground`);
  set(t.amber, `statusBarItem.warningHoverForeground`);
  set(t.amberWash, `statusBarItem.warningHoverBackground`);
  set(t.blue + '18', `minimap.selectionOccurrenceHighlight`);

  // Official modern UI colors apply only when VS Code already uses framed surfaces.
  // Declaring colors does not enable that UI or change the user's layout.
  set(t.paper, `surface.background modernTab.activeBackground modernEditorTab.activeBackground
    modernEditorTab.activeActionBackground modernEditorTab.activeHoverBackground modernEditorTab.activeHoverActionBackground`);
  set(t.ink, `surface.foreground modernTab.activeForeground modernTab.hoverForeground
    modernEditorTab.activeForeground modernEditorTab.hoverForeground modernActivityBarItem.activeForeground modernActivityBarItem.hoverForeground`);
  set(t.border, `surface.border editor.border modernPanel.border modernActivityBar.border`);
  set(t.chrome, `modernActivityBar.background modernActivityBar.inactiveBackground modernEditorTab.inactiveBackground`);
  set(t.shelf, `modernTab.hoverBackground modernEditorTab.hoverBackground modernEditorTab.hoverActionBackground
    modernActivityBarItem.activeBackground modernActivityBarItem.hoverBackground`);
  set(t.explorerSelection, `modernEditorTab.selectedActionBackground`);
  set(t.canvas, `modernUI.shellBackground modernUI.inactiveShellBackground`);
  set(t.borderStrong, `modernSash.gripForeground`);

  const tokenColors = [];
  const rule = (name, scope, foreground, fontStyle = '') => tokenColors.push({ name, scope: scope.split(',').map(s => s.trim()), settings: { foreground, fontStyle } });
  rule('Obsidian text', 'variable, meta.embedded, source, text', t.carbon);
  rule('Filmic comments', 'comment, punctuation.definition.comment', t.comment, 'italic');
  rule('Vermilion keywords', 'keyword, storage.type, storage.modifier', t.red);
  rule('Neutral operators', 'keyword.operator, punctuation, meta.brace', t.slate);
  rule('Word operators', 'keyword.operator.word, keyword.operator.logical.python, keyword.operator.expression', t.red);
  rule('Cinema strings', 'string, markup.inline.raw, markup.raw', t.amber);
  rule('Escapes and interpolation markers', 'constant.character.escape, punctuation.definition.template-expression, punctuation.section.embedded', t.red);
  rule('Cobalt numbers', 'constant.numeric', t.blue);
  rule('Success booleans', 'constant.language.boolean, constant.language.python', t.green);
  rule('JSON literal values (shared grammar scope)', 'constant.language.json', t.green);
  rule('Null and undefined', 'constant.language.null, constant.language.undefined, constant.language.none', t.red);
  rule('Functions and methods', 'entity.name.function, support.function, meta.function-call entity.name.function, variable.function', t.blue);
  rule('Types and interfaces', 'entity.name.type, entity.name.class, support.type, support.class', t.amber);
  rule('Primitive types', 'support.type.primitive, support.type.builtin, support.type.python, storage.type.numeric, storage.type.primitive', t.blue);
  rule('Namespaces and imports', 'entity.name.namespace, entity.name.module, support.module', t.blue);
  rule('Parameters and properties', 'variable.parameter, variable.other.property, variable.other.object.property, support.variable', t.carbon);
  rule('Language variables', 'variable.language', t.red);
  rule('Standard library objects', 'support.variable.object, support.variable.object.dom, support.variable.object.console', t.carbon);
  rule('Constants and enum members', 'variable.other.constant, entity.name.constant', t.blue);
  rule('Decorators', 'meta.decorator entity.name.function, entity.name.function.decorator, punctuation.definition.decorator', t.blue);
  rule('Regular expressions', 'string.regexp', t.amber);
  rule('Regexp operators', 'keyword.operator.quantifier.regexp, keyword.operator.or.regexp, punctuation.definition.character-class.regexp', t.red);
  rule('HTML and JSX tags', 'entity.name.tag, support.class.component', t.blue);
  rule('HTML attributes', 'entity.other.attribute-name', t.muted);
  rule('HTML entities', 'constant.character.entity', t.red);
  rule('CSS selectors', 'entity.other.attribute-name.class.css, entity.other.attribute-name.id.css, entity.name.tag.css', t.blue);
  rule('CSS property names', 'support.type.property-name.css, support.type.property-name.scss', t.muted);
  rule('CSS constants and units', 'support.constant.property-value.css, keyword.other.unit', t.amber);
  rule('JSON property keys', 'support.type.property-name.json, support.type.property-name.json.comments', t.carbon);
  rule('Markdown headings', 'markup.heading, entity.name.section', t.red, 'bold');
  rule('Markdown emphasis', 'markup.italic', t.ink, 'italic');
  rule('Markdown strong', 'markup.bold', t.ink, 'bold');
  rule('Markdown links', 'markup.underline.link, string.other.link', t.blue);
  rule('Markdown quotes', 'markup.quote', t.comment, 'italic');
  rule('Markdown lists', 'punctuation.definition.list.begin', t.red);
  rule('Markdown strikethrough', 'markup.strikethrough', t.secondary, 'strikethrough');
  rule('Shell commands', 'support.function.builtin.shell, entity.name.function.shell', t.blue);
  rule('Shell variables', 'variable.other.normal.shell, variable.other.positional.shell', t.carbon);
  rule('Diff added', 'markup.inserted', t.green);
  rule('Diff removed', 'markup.deleted', t.red);
  rule('Diff changed', 'markup.changed', t.amber);
  rule('Invalid syntax', 'invalid, invalid.illegal', t.error);
  rule('Deprecated syntax', 'invalid.deprecated', t.secondary, 'strikethrough');

  const semanticTokenColors = {
    namespace: t.blue, type: t.amber, class: t.amber, enum: t.amber, interface: t.amber, struct: t.amber,
    typeParameter: t.amber, parameter: t.carbon, variable: t.carbon, property: t.carbon, enumMember: t.blue,
    event: t.blue, function: t.blue, method: t.blue, macro: t.red, label: t.muted, decorator: t.blue,
    comment: { foreground: t.comment, italic: true }, string: t.amber, keyword: t.red, number: t.blue,
    regexp: t.amber, operator: t.slate, 'type.defaultLibrary': t.blue,
    'variable.defaultLibrary': t.carbon, 'variable.readonly': t.carbon, 'property.readonly': t.carbon,
    '*.deprecated': { strikethrough: true },
    'function.declaration': { foreground: t.blue, bold: false },
    'method.declaration': { foreground: t.blue, bold: false }
  };

  for (const [id, value] of Object.entries(colorOverrides)) {
    if (!(id in colors)) throw new Error(`Override has no shared color: ${id}`);
    colors[id] = value;
  }
  for (const rule of tokenColors) {
    if (tokenOverrides[rule.name]) Object.assign(rule.settings, tokenOverrides[rule.name]);
  }
  for (const name of Object.keys(tokenOverrides)) {
    if (!tokenColors.some(rule => rule.name === name)) throw new Error(`Unknown token category: ${name}`);
  }
  Object.assign(semanticTokenColors, semanticOverrides);
  return { $schema: 'vscode://schemas/color-theme', name, type, semanticHighlighting: true,
    colors: Object.fromEntries(Object.entries(colors).sort()), tokenColors, semanticTokenColors };
}
