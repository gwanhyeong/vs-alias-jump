import * as vscode from 'vscode';

interface ConfigurationValues {
  aliases?: {
    [key: string]: string;
  };
  homeDirectory?: string;
  workspaceFolderPath?: string;
  workspaceRootPath?: string;
}

export default class Configuration {
  readonly data: ConfigurationValues;
  private _codeConfiguration: vscode.WorkspaceConfiguration;
  private _listenConfigChangeDispose: { dispose(): any };

  constructor() {
    this.data = {};
    this.update();

    this._listenConfigChange();
  }

  update(fileUri?: vscode.Uri) {
    this._codeConfiguration = vscode.workspace.getConfiguration('vs-alias-jump', fileUri || null);

    this.data.aliases = this._codeConfiguration.get('alias');
    this.data.homeDirectory = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];

    const workspaceRootFolder = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : null;
    let workspaceFolder = workspaceRootFolder;

    if (fileUri) {
      workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
    }

    this.data.workspaceFolderPath = workspaceFolder && workspaceFolder.uri.fsPath;
    this.data.workspaceRootPath = workspaceRootFolder && workspaceRootFolder.uri.fsPath;
  }

  updateAliases(aliases, cleanAll = false) {
    if (aliases && Object.keys(aliases).length) {
      const data = cleanAll ? aliases : Object.assign(this.data.aliases, aliases);
      this._codeConfiguration.update('aliases', data);
    }
  }

  private _listenConfigChange() {
    this._listenConfigChangeDispose = vscode.workspace.onDidChangeConfiguration(
      this.update.bind(this)
    );
  }

  dispose() {
    this._listenConfigChangeDispose.dispose();
  }
}
