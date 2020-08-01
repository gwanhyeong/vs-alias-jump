import * as vscode from 'vscode';
import * as path from 'path';
import Configuration from './Configuration';
import {
  fixFilePathExtension,
  extractImportPathFromTextLine,
  getFileZeroLocationFromFilePath
} from './util';

export default class DefinitionProvider implements vscode.DefinitionProvider {
  constructor(private readonly _configuration: Configuration) {}

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Definition> {
    this._configuration.update(document.uri);
    return this._getFileRealPosition(document, position);
  }

  private _needJump(document: vscode.TextDocument, filePath: string): boolean {
    if (
      filePath.startsWith('.') &&
      (/\.(less|scss|sass)$/.test(filePath) || document.fileName.endsWith('.vue'))
    )
      return true;
    return false;
  }

  private async _getFileRealPosition(document: vscode.TextDocument, position: vscode.Position) {
    const textLine = document.lineAt(position);
    const pathObj = extractImportPathFromTextLine(textLine);

    let realFilePath: string;
    if (pathObj && pathObj.range.contains(position)) {
      realFilePath = this._tranformAliasPath(pathObj.path);

      if (!realFilePath && this._needJump(document, pathObj.path)) {
        realFilePath = path.resolve(document.fileName, '../', pathObj.path);
      }
    }

    if (realFilePath) {
      realFilePath = await fixFilePathExtension(realFilePath);
    }

    if (realFilePath) {
      return getFileZeroLocationFromFilePath(realFilePath);
    }
  }

  private _tranformAliasPath(insertedPath: string) {
    const {
      workspaceRootPath,
      workspaceFolderPath,
      homeDirectory,
      aliases
    } = this._configuration.data;

    let aliasPath = insertedPath;
    const isFound = Object.keys(aliases || {}).some((key: string) => {
      if (aliasPath.startsWith(key)) {
        aliasPath = aliasPath.replace(key, aliases[key]);
        return true;
      }
    });

    if (isFound && workspaceRootPath) {
      aliasPath = aliasPath.replace('${workspace}', workspaceRootPath);
    }

    if (isFound && workspaceFolderPath) {
      aliasPath = aliasPath.replace('${folder}', workspaceFolderPath);
    }

    if (isFound && homeDirectory) {
      aliasPath = aliasPath.replace('${home}', homeDirectory);
    }

    // alias was not found, use the raw path inserted by user
    return isFound ? aliasPath : insertedPath;
  }
}
