// Mechanical split of tools/main.orig.ts into modules (see PLAN). Run: node tools/split.mjs
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'tools/main.orig.ts';
const text = fs.readFileSync(SRC, 'utf8');
const sf = ts.createSourceFile('main.ts', text, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
const host = ts.createCompilerHost({}); const orig = host.getSourceFile.bind(host);
host.getSourceFile = (f, ...r) => (f === 'main.ts' ? sf : orig(f, ...r));
host.fileExists = (f) => f === 'main.ts' || ts.sys.fileExists(f); host.readFile = (f) => (f === 'main.ts' ? text : ts.sys.readFile(f));
const program = ts.createProgram({ rootNames: ['main.ts'], options: { noResolve: true, noLib: true, allowJs: false, target: ts.ScriptTarget.ES2020, types: [] }, host });
const checker = program.getTypeChecker();
const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;

/* ---- plan: [first line, last line, module] ; special modules: DROP, STATE(auto), INIT, MAIN ---- */
const PLAN = [
  // import-time side effects become a function called first thing in boot()
  [468, 468, 'INIT'], [1779, 1779, 'INIT'], [1789, 1789, 'INIT'], [2659, 2659, 'INIT'],
  [277, 305, 'config/rides'], [306, 342, 'config/maps'], [344, 344, 'config/tuning'], [345, 346, 'config/words'],
  [349, 355, 'utils/helpers'], [358, 364, 'render/renderer'], [366, 376, 'world/assets'],
  [381, 485, 'world/tracks/track'], [489, 625, 'world/tracks/grandprix'], [628, 633, 'render/scenes'],
  [635, 782, 'world/props'], [784, 844, 'world/atmosphere'], [848, 971, 'world/tracks/skyway'], [975, 1174, 'world/tracks/city'],
  [1177, 1289, 'world/tracks/space'], [1291, 1421, 'world/tracks/river'], [1422, 1502, 'world/raceWorld'], [1504, 1761, 'world/garage'],
  [1764, 1771, 'vehicles/vehicle'], [1780, 1780, 'items/definitions'], [1785, 1788, 'storage/best'],
  [1791, 1792, 'race/simulation'], [1794, 1832, 'race/setup'], [1835, 1936, 'typing/engine'],
  [1937, 1938, 'items/definitions'], [1939, 1947, 'items/inventory'], [1948, 1948, 'items/definitions'], [1949, 1954, 'items/inventory'],
  [1956, 1957, 'items/definitions'], [1958, 1959, 'config/words'], [1961, 2026, 'items/effects'], [2029, 2094, 'items/boxes'],
  [2096, 2123, 'typing/input'], [2126, 2171, 'race/simulation'], [2173, 2188, 'DROP'], [2189, 2213, 'render/camera'],
  [2216, 2291, 'ui/hud'], [2293, 2323, 'ui/minimap'], [2324, 2325, 'ui/toast'], [2326, 2362, 'ui/results'], [2365, 2400, 'audio/audio'],
  [2403, 2405, 'ui/garage'], [2406, 2406, 'config/avatars'], [2407, 2408, 'core/player'], [2409, 2409, 'config/maps'], [2410, 2411, 'ui/garage'],
  [2412, 2428, 'rooms/voting'], [2430, 2469, 'rooms/room'], [2470, 2618, 'ui/garage'], [2621, 2660, 'render/layout'],
  [2662, 2730, 'core/loop'], [2731, 2731, 'core/loop'], [2734, 2794, 'core/boot'], [2795, 2795, 'MAIN'],
];
const moduleOf = (line) => { const p = PLAN.find(([a, b]) => line >= a && line <= b); return p ? p[2] : null; };

/* ---- collect top-level decls ---- */
const letNames = new Set(), letSyms = new Map(); // symbol -> name
const declSyms = new Map(); // symbol -> {module, stmt}
const stmts = [];
for (const st of sf.statements) {
  if (ts.isImportDeclaration(st)) continue;
  const a = lineOf(st.getStart()), b = lineOf(st.end);
  const mod = moduleOf(a);
  const rec = { st, a, b, mod, kind: 'stmt', names: [] };
  if (ts.isVariableStatement(st)) {
    const isLet = !(st.declarationList.flags & ts.NodeFlags.Const);
    rec.kind = isLet ? 'let' : 'const';
    for (const d of st.declarationList.declarations) {
      if (!ts.isIdentifier(d.name)) throw new Error('destructuring top-level at ' + a);
      const sym = checker.getSymbolAtLocation(d.name); rec.names.push(d.name.text);
      if (isLet) { letSyms.set(sym, d.name.text); letNames.add(d.name.text); } else declSyms.set(sym, rec);
    }
  } else if (ts.isFunctionDeclaration(st)) { rec.kind = 'function'; rec.names = [st.name.text]; declSyms.set(checker.getSymbolAtLocation(st.name), rec); }
  stmts.push(rec);
}
for (const r of stmts) if (r.kind !== 'let' && !r.mod) throw new Error('unassigned statement at line ' + r.a + ' (' + r.names.join(',') + ')');

/* ---- original imports: symbol -> {decl, spec} ---- */
const importSym = new Map();
for (const st of sf.statements) {
  if (!ts.isImportDeclaration(st)) continue;
  const from = st.moduleSpecifier.text; const c = st.importClause;
  if (c.name) importSym.set(checker.getSymbolAtLocation(c.name), { from, kind: 'default', local: c.name.text });
  if (c.namedBindings) {
    if (ts.isNamespaceImport(c.namedBindings)) importSym.set(checker.getSymbolAtLocation(c.namedBindings.name), { from, kind: 'ns', local: c.namedBindings.name.text });
    else for (const e of c.namedBindings.elements) importSym.set(checker.getSymbolAtLocation(e.name), { from, kind: 'named', local: e.name.text, imported: (e.propertyName || e.name).text });
  }
}

/* ---- walk every statement: edits (let -> S.x) and dependencies ---- */
const exportsNeeded = new Set(); // rec
const fileOf = (m) => path.join('src', m + '.ts');
const info = new Map(); // module -> {parts:[], needsS, ext:Map(local->spec), imports:Map(module->Set(name))}
const get = (m) => { if (!info.has(m)) info.set(m, { parts: [], needsS: false, ext: new Map(), imports: new Map() }); return info.get(m); };

function processStatement(rec, targetModule, opts = {}) {
  const I = get(targetModule); const edits = [];
  const start = rec.st.getStart(), end = rec.st.end;
  const visit = (n) => {
    if (ts.isIdentifier(n)) {
      const parent = n.parent;
      let sym = null;
      if (parent && ts.isShorthandPropertyAssignment(parent) && parent.name === n) sym = checker.getShorthandAssignmentValueSymbol(parent);
      else if (parent && (ts.isPropertyAccessExpression(parent) && parent.name === n)) sym = null;
      else if (parent && ts.isPropertyAssignment(parent) && parent.name === n) sym = null;
      else if (parent && (ts.isMethodDeclaration(parent) || ts.isGetAccessor(parent) || ts.isSetAccessor(parent)) && parent.name === n) sym = null;
      else if (parent && ts.isBindingElement(parent) && parent.propertyName === n) sym = null;
      else sym = checker.getSymbolAtLocation(n);
      if (sym) {
        if (letSyms.has(sym) && !(opts.declName === n)) {
          I.needsS = true;
          const nm = n.text;
          edits.push([n.getStart(), n.end, parent && ts.isShorthandPropertyAssignment(parent) && parent.name === n ? nm + ': S.' + nm : 'S.' + nm]);
        } else if (declSyms.has(sym)) {
          const d = declSyms.get(sym);
          if (d.mod !== targetModule && d.mod !== 'DROP') { exportsNeeded.add(d); const s = I.imports.get(d.mod) || new Set(); s.add(n.text); I.imports.set(d.mod, s); }
        } else if (importSym.has(sym)) { const s = importSym.get(sym); I.ext.set(s.local, s); }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(rec.st);
  edits.sort((x, y) => y[0] - x[0]);
  let out = text.slice(start, end);
  for (const [a, b, t] of edits) out = out.slice(0, a - start) + t + out.slice(b - start);
  return out;
}

const stateLines = []; // for core/state.ts
for (const rec of stmts) {
  if (rec.kind === 'let') {
    // each declarator becomes: S.name = <init>;
    const I = get('core/state');
    for (const d of rec.st.declarationList.declarations) {
      const nm = d.name.text;
      if (!d.initializer) { stateLines.push(`S.${nm} = undefined;`); continue; }
      const fake = { st: d.initializer };
      const t = processStatement(fake, 'core/state');
      stateLines.push(`S.${nm} = ${t};`);
    }
    continue;
  }
  if (rec.mod === 'DROP') continue;
  const t = processStatement(rec, rec.mod === 'INIT' || rec.mod === 'MAIN' ? (rec.mod === 'INIT' ? 'core/init' : 'main') : rec.mod);
  rec.text = t.replace('  placePanel(gp, carYaw, dt);\n', '');
  const comments = ''; // keep leading comments out; section banners are added per module
  get(rec.mod === 'INIT' ? 'core/init' : rec.mod === 'MAIN' ? 'main' : rec.mod).parts.push(rec);
}
get('core/state'); 

/* ---- emit ---- */
const rel = (from, to) => { let r = path.relative(path.dirname(from), to).split(path.sep).join('/'); if (!r.startsWith('.')) r = './' + r; return r; };
const stripExt = (p) => p.replace(/\.ts$/, '');
fs.rmSync('src/_gen', { recursive: true, force: true });
const written = [];
for (const [m, I] of info) {
  const file = m === 'main' ? 'src/main.ts' : fileOf(m);
  const lines = [];
  lines.push('// @ts-nocheck');
  // external imports
  const byFrom = new Map();
  for (const s of I.ext.values()) { const k = s.from; if (!byFrom.has(k)) byFrom.set(k, { ns: null, def: null, named: [] }); const e = byFrom.get(k); if (s.kind === 'ns') e.ns = s.local; else if (s.kind === 'default') e.def = s.local; else e.named.push(s.imported === s.local ? s.local : `${s.imported} as ${s.local}`); }
  for (const [from, e] of byFrom) {
    let f = from; if (f.startsWith('./')) f = rel(file, path.join('src', f));
    if (e.ns) lines.push(`import * as ${e.ns} from '${f}';`);
    if (e.def) lines.push(`import ${e.def} from '${f}';`);
    if (e.named.length) lines.push(`import { ${[...new Set(e.named)].join(', ')} } from '${f}';`);
  }
  if (I.needsS && m !== 'core/state') lines.push(`import { S } from '${stripExt(rel(file, 'src/core/state.ts'))}';`);
  for (const [mod, names] of I.imports) { if (mod === m) continue; const target = mod === 'INIT' ? 'core/init' : mod; lines.push(`import { ${[...names].sort().join(', ')} } from '${stripExt(rel(file, fileOf(target)))}';`); }
  lines.push('');
  if (m === 'core/state') {
    lines.push('/** All mutable game state lives here (one place, instead of module-level `let`s). */');
    lines.push('export const S: any = {};');
    lines.push(...stateLines);
  } else if (m === 'core/init') {
    lines.push('/** Work that used to run at import time: called once from boot(). */');
    lines.push('export function runInit() {');
    for (const r of I.parts) lines.push('  ' + r.text.replace(/\n/g, '\n  '));
    lines.push('}');
  } else {
    for (const r of I.parts) { lines.push((exportsNeeded.has(r) ? 'export ' : '') + r.text); lines.push(''); }
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join('\n') + '\n'); written.push(file);
}
console.log('wrote', written.length, 'files'); console.log(written.join('\n'));
