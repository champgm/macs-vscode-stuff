import vscode, { CodeAction, Selection, Range, Uri, WorkspaceEdit, CodeActionKind, Diagnostic, TextDocument } from 'vscode';
import { cpus } from 'os';

export class Fields implements vscode.CodeActionProvider {

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    const codeActions = this.doSomething(document.uri, context.diagnostics, document);
    return codeActions;
  }

  private doSomething(uri: Uri, diagnostics: Diagnostic[], document: TextDocument): CodeAction[] {
    return diagnostics
      .filter((diagnostic) => {
        return diagnostic.message.includes('is missing the following properties from type');
      })
      .map((diagnostic) => {
        const prefixPosition = diagnostic.message.indexOf('is missing the following properties from type');
        const colonPosition = diagnostic.message.indexOf(':', prefixPosition);
        const fieldList = diagnostic.message.substr(colonPosition + 1);
        const missingFields = fieldList.split(',').map(field => field.trim());

        const nextLineNumber = diagnostic.range.start.line + 1;
        const nextLine = document.lineAt(nextLineNumber);
        const indentation = getIndentation(nextLine.text);

        const linesToAdd = missingFields.map((fieldName) => {
          return padText(`${fieldName}: '${fieldName}',`, indentation);
        }).join('\n');

        const underneathDeclaration = new vscode.Position(nextLineNumber, 0);
        const workspaceEdit = new WorkspaceEdit();
        workspaceEdit.insert(uri, underneathDeclaration, `${linesToAdd}\n`);


        const codeAction: CodeAction = {
          title: 'Add missing fields',
          edit: workspaceEdit,
          diagnostics: [diagnostic],
          kind: CodeActionKind.QuickFix,
          isPreferred: true,
        }
        return codeAction;
      });
  }
}

function getIndentation(line: string) {
  const splitBySpace = line.split(' ');
  return splitBySpace.findIndex(text => text !== '') + 1;
}

function padText(text: string, pad: number) {
  const padding = new Array(pad).join(' ');
  return `${padding}${text}`;
}