// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "traels-rails" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('traels-rails.helloWorld', function () {
  let disposable = vscode.commands.registerCommand('editor.action.commentLine', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from traels-rails!');
    erbComment();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

function erbComment() {
  const editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  
  if (!editor || editor.document.languageId !== "erb") {
    return;
  }

  const selections = editor.selections;
  
  
  
  selections.forEach(selection => {
    // if(selection.isEmpty) {
    //   return;
    // }
    const text = editor.document.getText(selection);
    let lines = text.split(/\r?\n/g);

    const startLine = doc.lineAt(selection.start.line);

    editor.edit(editBuilder => {
      lines.forEach((line, index) => {
        // lines[index] = `<!-- ${line} -->`
        // console.log(startLine.lineNumber + index + 1)
        

        const lineNumber = startLine.lineNumber + index;
        const currentLine = doc.lineAt(lineNumber);
        const lineStartIndex = currentLine.firstNonWhitespaceCharacterIndex
        const lineEndIndex = currentLine.text.length

        if(!currentLine.text) {
          return;
        }

        // console.log(`line: ${lineNumber} - startIndex: ${lineStartIndex} - endIndex: ${lineEndIndex}`)
        
        if(currentLine.text.trim().startsWith('<%#')) {
            // console.log(`removing comment on line ${lineNumber}`)
            editBuilder.delete(new vscode.Range(new vscode.Position(lineNumber, lineStartIndex), new vscode.Position(lineNumber, lineStartIndex + 4)));
            editBuilder.delete(new vscode.Range(new vscode.Position(lineNumber, lineEndIndex - 3), new vscode.Position(lineNumber, lineEndIndex)));
        } else {
            // console.log(`setting comment on line ${lineNumber}`)
            editBuilder.insert(new vscode.Position(lineNumber, lineStartIndex), "<%# ");
            editBuilder.insert(new vscode.Position(lineNumber, lineEndIndex), " %>");
        }

      })
    })

    
    // console.log(startLine.firstNonWhitespaceCharacterIndex)
    // console.log(startLine.text[startLine.firstNonWhitespaceCharacterIndex])

    // const startLine = selection.start.line;


    // console.log(startLine)
  })
  
  // const text = editor.document.getText(selection);
  // console.log(text)

  // editor.edit(editBuilder => {
  //   editBuilder.replace(selection, `<!-- ${text} -->`);
  // });
}

module.exports = {
	activate,
	deactivate
}
