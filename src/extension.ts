import * as vscode from 'vscode';
import Configuration from './Configuration';
import DefinitionProvider from './DefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
  const configuration = new Configuration();
  const definitionProvider = new DefinitionProvider(configuration);
  const registerDefinitionProvider = vscode.languages.registerDefinitionProvider(
    { scheme: 'file', pattern: '**/*.{js,jsx,ts,tsx,vue,css,scss}' },
    definitionProvider
  );
  context.subscriptions.push(configuration);
  context.subscriptions.push(registerDefinitionProvider);

  console.log('vs-alias-jump extension activated');
}
