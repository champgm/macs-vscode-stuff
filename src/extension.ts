import * as vscode from 'vscode';
import { Imports } from './Typescript/Imports';
import { Typescript } from './Typescript';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(Typescript.SELECTOR, new Imports())
  );
}

export function deactivate() { }
