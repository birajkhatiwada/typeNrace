// list top-level statements of src/main.ts: lines, declared names, section
import ts from 'typescript';
import fs from 'node:fs';
const src = fs.readFileSync(process.argv[2] || 'src/main.ts', 'utf8');
const sf = ts.createSourceFile('m.ts', src, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TS);
const out = [];
for (const st of sf.statements) {
  const a = sf.getLineAndCharacterOfPosition(st.getStart()).line + 1, b = sf.getLineAndCharacterOfPosition(st.end).line + 1;
  let kind = ts.SyntaxKind[st.kind], names = [];
  if (ts.isVariableStatement(st)) { kind = (st.declarationList.flags & ts.NodeFlags.Const) ? 'const' : (st.declarationList.flags & ts.NodeFlags.Let) ? 'let' : 'var';
    for (const d of st.declarationList.declarations) { const walk = (n) => { if (ts.isIdentifier(n)) names.push(n.text); else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) n.elements.forEach((e) => { if (!ts.isOmittedExpression(e)) walk(e.name); }); }; walk(d.name); } }
  else if (ts.isFunctionDeclaration(st)) { kind = 'function'; names = [st.name.text]; }
  else if (ts.isClassDeclaration(st)) { kind = 'class'; names = [st.name.text]; }
  else if (ts.isImportDeclaration(st)) kind = 'import';
  else kind = 'stmt';
  out.push({ a, b, kind, names });
}
fs.writeFileSync('tools/stmts.json', JSON.stringify(out));
console.log(out.length, 'statements');
const kinds = {}; out.forEach((o) => { kinds[o.kind] = (kinds[o.kind] || 0) + 1; }); console.log(kinds);
