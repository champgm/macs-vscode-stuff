import * as vscode from 'vscode';
import { Imports } from './Typescript/Imports';
import { Typescript } from './Typescript';
import { Fields } from './Typescript/Fields';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(Typescript.SELECTOR, new Imports())
  );
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(Typescript.SELECTOR, new Fields())
  );
}

export function deactivate() { }
