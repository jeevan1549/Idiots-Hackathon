const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// This starts the extension
function activate(context) {
  openPanel(context);

  context.subscriptions.push(
    vscode.commands.registerCommand("brownboys.start", () =>
      openPanel(context),
    ),
  );
}

// This opens the extension window; opens whatever's in webview/assests folder.
function openPanel(context) {
  const panel = vscode.window.createWebviewPanel(
    "brownboys",
    "BrownBoys",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, "webview"),
        vscode.Uri.joinPath(context.extensionUri, "assets"), // This folder has nothing in it (as of 03/14/26)
      ],
    },
  );

  panel.webview.html = getLanding(panel, context);


  
  panel.webview.onDidReceiveMessage((msg) => {
    if (msg.command === "getStarted") {
      panel.webview.html = getBreakScreen(panel, context);
    }

    // Message appears at the bottom of your screen when your work session starts
    if (msg.command === "startSession") {
      vscode.window.showInformationMessage(
        `Working for ${msg.duration} min. Your capybara is watching!`, // Capybara is subject to change to a different animal
      );
      panel.dispose();
      startBreakTimer(msg.duration);
    }
  });
}

function startBreakTimer(minutes) {
  const ms = minutes * 60 * 1000; // millisecond conversion
  setTimeout(() => {
    vscode.window.showWarningMessage(
      `Time for a break! Your capybara needs to recharge.`, // Capybara is subject to change to a different animal
    );
  }, ms);
}

function getLanding(panel, context) {
  // Css url path
  const cssUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      "webview",
      "styles",
      "landing.css",
    ),
  );

  let html = fs.readFileSync(
    path.join(context.extensionPath, 

      "webview", 
      "landing.html"), // Opens /vebview/landing.html
      
    "utf8",
  );

  return html
    .replace(/{{cssUri}}/g, cssUri)
    .replace(/{{cspSource}}/g, panel.webview.cspSource);
}

function getBreakScreen(panel, context) {
  const cssUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 

      "webview", 
      "styles", 
      "break.css"
    
    ),

  );

  let html = fs.readFileSync(
    path.join(context.extensionPath, 
      "webview",
      "break.html"
    
    ),

    "utf8",
  );

  return html
    .replace(/{{cssUri}}/g, cssUri)
    .replace(/{{cspSource}}/g, panel.webview.cspSource);
}



module.exports = { activate };
