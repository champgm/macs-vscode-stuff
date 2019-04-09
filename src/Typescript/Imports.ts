import vscode, { CodeAction, Selection, Range, Uri, WorkspaceEdit, CodeActionKind, Diagnostic } from 'vscode';

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
    return diagnostics
      .filter((diagnostic) => {
        return diagnostic.message.startsWith('Cannot find name');
      })
      .map((diagnostic) => {
        const packageName = diagnostic.message.substring(18, diagnostic.message.length - 2);
        const importStatement = `import ${packageName} from '${packageName}'`;

        const theTop = new vscode.Position(0, 0);
        const workspaceEdit = new WorkspaceEdit();
        workspaceEdit.insert(uri, theTop, `${importStatement};\n`);

        const codeAction: CodeAction = {
          title: importStatement,
          edit: workspaceEdit,
          diagnostics: [diagnostic],
          kind: CodeActionKind.QuickFix,
          isPreferred: false,
        }
        return codeAction;
      });
  }
}
