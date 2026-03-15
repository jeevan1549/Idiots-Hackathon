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

let sessionDuration = null;
let waterDuraion = null;
  
  panel.webview.onDidReceiveMessage((msg) => {
    if (msg.command === "getStarted") {
      panel.webview.html = getBreakScreen(panel, context);
    }

    // Message appears at the bottom of your screen when your work session starts
    if (msg.command === "startWater") {
      sessionDuration = msg.duration;
      panel.webview.html = getWater(panel, context);
    }
    if (msg.command === "start202020") {
      waterDuraion = msg.duration
      panel.webview.html = get202020(panel, context, sessionDuration);
    }
    if(msg.command === "startSession"){
      vscode.window.showInformationMessage(
        `Working for ${sessionDuration} minutes. Your capybara is watching!
        Water break: Every ${waterDuraion} minutes.
        20-20-20: ${msg.twentyTwentyTwenty ? 'on' : 'off'}`
      )
      panel.dispose();
      startBreakTimer(sessionDuration, waterDuraion, msg.twentytwentytwenty);
    }
  });
}

function startBreakTimer(minutes, waterDuration, twentyTwentyTwenty) {
  const ms = minutes * 60 * 1000;

  // 20-20-20 reminder every 20 minutes
  if (twentyTwentyTwenty) {
    const interval = setInterval(() => {
      vscode.window.showInformationMessage(
        `20-20-20: Look at something 20 meters away for 20 seconds!`
      );
    }, 20 * 60 * 1000);

    // Stop the 20-20-20 reminders when session ends
    setTimeout(() => clearInterval(interval), ms);
  }

  // Break reminder when session ends
  setTimeout(() => {
    vscode.window.showWarningMessage(
      `Time for a break! Your capybara needs to recharge.`
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

function getWater(panel, context, water) {
  // Css url path
  const cssUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      "webview",
      "styles",
      "style.css",
    ),
  );

  let html = fs.readFileSync(
    path.join(context.extensionPath, 

      "webview", 
      "water.html"), // Opens /webview/water.html

    "utf8",
  );

  return html
    .replace(/{{cssUri}}/g, cssUri)
    .replace(/{{cspSource}}/g, panel.webview.cspSource)
    .replace(/{{water}}/g, water)
}

function get202020(panel, context, duration) {
  // Css url path
  const cssUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      "webview",
      "styles",
      "202020.css",
    ),
  );

  let html = fs.readFileSync(
    path.join(context.extensionPath, 

      "webview", 
      "202020.html"), // Opens /webview/202020.html

    "utf8",
  );

  return html
    .replace(/{{cssUri}}/g, cssUri)
    .replace(/{{cspSource}}/g, panel.webview.cspSource)
    .replace(/{{duration}}/g, duration)
}


module.exports = { activate };
