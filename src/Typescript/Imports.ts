import vscode, { CodeAction, Selection, Range, Uri, WorkspaceEdit, CodeActionKind, Diagnostic, workspace } from 'vscode';

const autoFixImports = [
  'path',
  'fs',
  'vscode',
];

interface PackageAction {
  codeAction: CodeAction,
  packageName: string,
}

export class Imports implements vscode.CodeActionProvider {

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    const codeActions = this.doSomething(document.uri, context.diagnostics);
    return codeActions;
  }

  private doSomething(uri: Uri, diagnostics: Diagnostic[]): CodeAction[] {
    const codeActions = diagnostics
      .filter((diagnostic) => {
        return diagnostic.message.startsWith('Cannot find name');
      })
      .map((diagnostic) => {
        const packageName = diagnostic.message.substring(18, diagnostic.message.length - 2);
        const importStatement = `import ${packageName} from '${packageName}'`;

        const theTop = new vscode.Position(0, 0);
        const workspaceEdit = new WorkspaceEdit();
        workspaceEdit.insert(uri, theTop, `${importStatement};\n`);

        const packageAction: PackageAction = {
          packageName,
          codeAction: {
            title: importStatement,
            edit: workspaceEdit,
            diagnostics: [diagnostic],
            kind: CodeActionKind.QuickFix,
            isPreferred: false,
          }
        };
        return packageAction;
      })
      .filter((packageAction) => {
        if (autoFixImports.includes(packageAction.packageName)) {
          vscode.workspace.applyEdit(packageAction.codeAction.edit as WorkspaceEdit);
          return false;
        }
        return true;
      })
      .map((packageAction) => {
        return packageAction.codeAction;
      });

    return codeActions;
  }
}
