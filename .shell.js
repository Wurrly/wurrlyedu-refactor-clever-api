const fs = require('fs');
const path = require('path');
const repl = require('repl');
const projectPath = __dirname;
const historyFile = path.join(projectPath, '.repl_history');
try {
  require('ts-node').register({
    lazy: false,
    fast: true,
    cacheDirectory: path.join(projectPath, '.tscache'),
    project: path.join(projectPath, 'tsconfig.json'),
  });
} catch {
}

const r = repl.start({
  prompt: `${require('./package.json').name}> `,
  terminal: true,
  ignoreUndefined: true,
  useColors: true,
});
initContext(r.context);
loadHistory();
r.on('reset', initContext);
r.on('exit', () => {
  saveHistory();
});
r.defineCommand('history', {
  help: 'Display history',
  action: () => {
    r.clearBufferedCommand();
    const history = getHistory();
    r.outputStream.write(history.join('\n'));
    r.outputStream.write('\n');
    r.displayPrompt();
  },
});

function initContext(context) {
}

function loadHistory() {
  if (!r.history) {
    return;
  }
  if (!fs.existsSync(historyFile)) {
    return;
  }
  fs.readFileSync(historyFile, {encoding: 'utf8'})
    .toString()
    .split('\n')
    .reverse()
    .forEach((line) => {
      line = line.trim();
      if (!line) { return; }
      r.history.push(line);
    })
  ;
}

function saveHistory() {
  const MAX_HISTORY = 1000;
  const history = getHistory();
  if (!history.length) {
    return;
  }
  fs.writeFileSync(
    historyFile,
    history
      .slice(0, MAX_HISTORY)
      .join('\n')
    ,
    {encoding: 'utf8'}
  );
}

function getHistory() {
  const history = [];
  if (!r.history) { return history; }
  r.history.forEach((v) => {
    v = v ? v.trim() : '';
    if (v && !v.startsWith('.')) {
      history.push(v);
    }
  });
  history.reverse();
  return history;
}
