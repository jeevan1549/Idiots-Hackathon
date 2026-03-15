// const vscode = require("vscode");
// const fs = require("fs");
// const path = require("path");

// // This starts the extension
// function activate(context) {
//   openPanel(context);

//   context.subscriptions.push(
//     vscode.commands.registerCommand("brownboys.start", () =>
//       openPanel(context),
//     ),
//   );
// }

// // This opens the extension window; opens whatever's in webview/assests folder.
// function openPanel(context) {
//   const panel = vscode.window.createWebviewPanel(
//     "brownboys",
//     "BrownBoys",
//     vscode.ViewColumn.One,
//     {
//       enableScripts: true,
//       localResourceRoots: [
//         vscode.Uri.joinPath(context.extensionUri, "webview"),
//         vscode.Uri.joinPath(context.extensionUri, "assets"), // This folder has nothing in it (as of 03/14/26)
//       ],
//     },
//   );

// panel.webview.html = getLanding(panel, context);

// let sessionDuration = null;
// let waterDuraion = null;
  
//   panel.webview.onDidReceiveMessage((msg) => {
//     if (msg.command === "getStarted") {
//       panel.webview.html = getBreakScreen(panel, context);
//     }

//     // Message appears at the bottom of your screen when your work session starts
//     if (msg.command === "startWater") {
//       sessionDuration = msg.duration;
//       panel.webview.html = getWater(panel, context);
//     }
//     if (msg.command === "start202020") {
//       waterDuraion = msg.duration
//       panel.webview.html = get202020(panel, context, sessionDuration);
//     }
//     if(msg.command === "startSession"){
//       vscode.window.showInformationMessage(
//         `Working for ${sessionDuration} minutes. Your capybara is watching!
//         Water break: Every ${waterDuraion} minutes.
//         20-20-20: ${msg.twentyTwentyTwenty ? 'on' : 'off'}`
//       )
//       panel.webview.html = getAnimal(panel, context);
//       startBreakTimer(sessionDuration, waterDuraion, msg.twentytwentytwenty);
//     }
//   });
// }

//   // const ms = minutes * 60 * 1000;

//   // // 20-20-20 reminder every 20 minutes
//   // if (twentyTwentyTwenty) {
//   //   const interval = setInterval(() => {
//   //     vscode.window.showInformationMessage(
//   //       `20-20-20: Look at something 20 meters away for 20 seconds!`
//   //     );
//   //   }, 20 * 60 * 1000);

//   //   // Stop the 20-20-20 reminders when session ends
//   //   setTimeout(() => clearInterval(interval), ms);
//   // }

//   // // Break reminder when session ends
//   // setTimeout(() => {
//   //   vscode.window.showWarningMessage(
//   //     `Time for a break! Your capybara needs to recharge.`
//   //   );
//   // }, ms);
// function startBreakTimer(minutes, waterDuration, twentyTwentyTwenty) {

//   var countDownDate = new Date(new Date().getTime() + minutes * 60 * 1000).getTime();

//   var x = setInterval(function() {
//     var now = new Date().getTime();
//     var distance = countDownDate - now;

//     var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     var mins    = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     console.log(`${hours}h ${mins}m ${seconds}s`);

//     if (distance < 0) {
//       clearInterval(x);
//       console.log("Break timer done!");

//       if (waterDuration) {
//         console.log(`Water reminder: drink water every ${waterDuration} minutes`);
//       }
//       if (twentyTwentyTwenty) {
//         console.log("20-20-20: look 20ft away for 20 seconds");
//       }
//     }
//   }, 1000);

//   return x; 
// }

// function getLanding(panel, context) {
//   // Css url path
//   const cssUri = panel.webview.asWebviewUri(
//     vscode.Uri.joinPath(
//       context.extensionUri,
//       "webview",
//       "styles",
//       "landing.css",
//     ),
//   );

//   let html = fs.readFileSync(
//     path.join(context.extensionPath, 

//       "webview", 
//       "landing.html"), // Opens /vebview/landing.html

//     "utf8",
//   );

//   return html
//     .replace(/{{cssUri}}/g, cssUri)
//     .replace(/{{cspSource}}/g, panel.webview.cspSource);
// }

// function getBreakScreen(panel, context) {
//   const cssUri = panel.webview.asWebviewUri(
//     vscode.Uri.joinPath(context.extensionUri, 

//       "webview", 
//       "styles", 
//       "break.css"
    
//     ),

//   );

//   let html = fs.readFileSync(
//     path.join(context.extensionPath, 
//       "webview",
//       "break.html"
    
//     ),

//     "utf8",
//   );

//   return html
//     .replace(/{{cssUri}}/g, cssUri)
//     .replace(/{{cspSource}}/g, panel.webview.cspSource);
// }

// function getWater(panel, context, water) {
//   // Css url path
//   const cssUri = panel.webview.asWebviewUri(
//     vscode.Uri.joinPath(
//       context.extensionUri,
//       "webview",
//       "styles",
//       "style.css",
//     ),
//   );

//   let html = fs.readFileSync(
//     path.join(context.extensionPath, 

//       "webview", 
//       "water.html"), // Opens /webview/water.html

//     "utf8",
//   );

//   return html
//     .replace(/{{cssUri}}/g, cssUri)
//     .replace(/{{cspSource}}/g, panel.webview.cspSource)
//     .replace(/{{water}}/g, water)
// }

// function get202020(panel, context, duration) {
//   // Css url path
//   const cssUri = panel.webview.asWebviewUri(
//     vscode.Uri.joinPath(
//       context.extensionUri,
//       "webview",
//       "styles",
//       "202020.css",
//     ),
//   );

//   let html = fs.readFileSync(
//     path.join(context.extensionPath, 

//       "webview", 
//       "202020.html"), // Opens /webview/202020.html

//     "utf8",
//   );

//   return html
//     .replace(/{{cssUri}}/g, cssUri)
//     .replace(/{{cspSource}}/g, panel.webview.cspSource)
//     .replace(/{{duration}}/g, duration)
// }

// function getAnimal(panel, context)
// {
//   const cssUri = panel.webview.asWebviewUri(
//     vscode.Uri.joinPath(
//       context.extensionUri,
//       "webview",
//       "styles",
//       "animal.css"
//     ),
//   );

//   let html = fs.readFileSync(
//     path.join(context.extensionPath,

//       "webview",
//       "animal.html"),

//     "utf8",
//   );

//   return html
//     .replace(/{{cssUri}}/g, cssUri)
//     .replace(/{{cspSource}}/g, panel.webview.cspSource)
// }


// module.exports = { activate };

const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const provider = new BrownBoysViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("brownboys.view", provider)
  );
}

class BrownBoysViewProvider {
  constructor(context) {
    this._context = context;
    this._view = null;
    this._sessionDuration = null;
    this._waterInterval = null;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._context.extensionUri, "webview"),
        vscode.Uri.joinPath(this._context.extensionUri, "assets"),
      ],
    };

    // Show landing page first
    webviewView.webview.html = this._getLanding(webviewView.webview);

    // Handle messages
    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.command === "getStarted") {
        webviewView.webview.html = this._getBreakScreen(webviewView.webview);
      }

      if (msg.command === "startWater") {
        this._sessionDuration = msg.duration;
        webviewView.webview.html = this._getWater(webviewView.webview);
      }

      if (msg.command === "start202020") {
        this._waterInterval = msg.duration;
        webviewView.webview.html = this._get202020(webviewView.webview);
      }

      if (msg.command === "startSession") {
        vscode.window.showInformationMessage(
          `Working for ${this._sessionDuration} min. Water every ${this._waterInterval} min. 20-20-20: ${msg.twentyTwentyTwenty ? 'on' : 'off'}`
        );
        this._startBreakTimer(
          this._sessionDuration,
          this._waterInterval,
          msg.twentyTwentyTwenty
        );
        webviewView.webview.html = this._getSessionRunning(webviewView.webview);
      }
    });
  }

  _startBreakTimer(minutes, waterInterval, twentyTwentyTwenty) {
    const ms = minutes * 60 * 1000;

    // Water reminder using the user's chosen interval
    const waterTimer = setInterval(() => {
      vscode.window.showInformationMessage(
        `BrownBoys: Time to drink some water!`
      );
    }, waterInterval * 60 * 1000);
    setTimeout(() => clearInterval(waterTimer), ms);

    // 20-20-20 reminder every 20 minutes
    if (twentyTwentyTwenty) {
      const eyeTimer = setInterval(() => {
        vscode.window.showInformationMessage(
          `20-20-20: Look at something 20 meters away for 20 seconds!`
        );
      }, 20 * 60 * 1000);
      setTimeout(() => clearInterval(eyeTimer), ms);
    }

    // Break reminder when session ends
    setTimeout(() => {
      vscode.window.showWarningMessage(
        `Time for a break! Your capybara needs to recharge.`
      );
      // Go back to landing when session ends
      if (this._view) {
        this._view.webview.html = this._getLanding(this._view.webview);
      }
    }, ms);
  }

  // ── HTML loaders ──────────────────────────────────────

  _getLanding(webview) {
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri, "webview", "styles", "landing.css"
      )
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "landing.html"), "utf8"
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource);
  }

  _getBreakScreen(webview) {
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri, "webview", "styles", "break.css"
      )
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "break.html"), "utf8"
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource);
  }

  _getWater(webview) {
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri, "webview", "styles", "style.css"
      )
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "water.html"), "utf8"
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource);
  }

  _get202020(webview) {
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri, "webview", "styles", "202020.css"
      )
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "202020.html"), "utf8"
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{duration}}/g, this._sessionDuration);
  }

  _getSessionRunning(webview) {
    const cssUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      this._context.extensionUri,
      "webview",
      "styles",
      "animal.css"
    ),
  );

  let html = fs.readFileSync(
    path.join(this._context.extensionPath,

      "webview",
      "animal.html"),

    "utf8",
  );

  return html
    .replace(/{{cssUri}}/g, cssUri)
    .replace(/{{cspSource}}/g, webview.cspSource)
  }
}

module.exports = { activate };