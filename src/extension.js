const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const provider = new BrownBoysViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("brownboys.view", provider),
  );
}

class BrownBoysViewProvider {
  constructor(context) {
    this._context = context;
    this._view = null;
    this._sessionDuration = null;
    this._waterInterval = null;
    this._breakDuration = null;
    this._waterTimer = null;
    this._eyeTimer = null;
    this._breakTimeout = null;
    this._lastTwentyTwentyTwenty = false;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._context.extensionUri, "webview"),
        vscode.Uri.joinPath(this._context.extensionUri, "assets"),
        vscode.Uri.joinPath(this._context.extensionUri, "sprites"),
      ],
    };

    webviewView.webview.html = this._getLanding(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((msg) => {
      if (msg.command === "getStarted") {
        webviewView.webview.html = this._getWorkScreen(webviewView.webview);
      }

      if (msg.command === "startBreak") {
        this._sessionDuration = msg.duration;
        webviewView.webview.html = this._getBreak(webviewView.webview);
      }

      if (msg.command === "startWater") {
        this._breakDuration = msg.breakDuration;
        webviewView.webview.html = this._getWater(webviewView.webview);
      }

      if (msg.command === "start202020") {
        this._waterInterval = msg.duration;
        webviewView.webview.html = this._get202020(webviewView.webview);
      }

      if (msg.command === "startSession") {
        this._lastTwentyTwentyTwenty = msg.twentyTwentyTwenty;
        vscode.window.showInformationMessage(
          `Working for ${this._sessionDuration} min. Water every ${this._waterInterval} min. 20-20-20: ${msg.twentyTwentyTwenty ? "on" : "off"}`,
        );
        this._startBreakTimer(
          this._sessionDuration,
          this._waterInterval,
          msg.twentyTwentyTwenty,
        );
        webviewView.webview.html = this._getSessionRunning(webviewView.webview);
      }

      if (msg.command === "breakDone") {
        // this._clearTimers();
        // webviewView.webview.html = this._getSessionRunning(webviewView.webview);
        this._startBreakTimer(
      this._sessionDuration,
      this._waterInterval,
      this._lastTwentyTwentyTwenty
      );
      webviewView.webview.html = this._getSessionRunning(webviewView.webview);
      }
    });
  }

  _clearTimers() {
    clearInterval(this._waterTimer);
    clearInterval(this._eyeTimer);
    clearTimeout(this._breakTimeout);
    this._waterTimer = null;
    this._eyeTimer = null;
    this._breakTimeout = null;
  }

  _startBreakTimer(minutes, waterInterval, twentyTwentyTwenty) {
    this._clearTimers();

    const ms = minutes * 60 * 1000;

    this._waterTimer = setInterval(() => {
      vscode.window.showInformationMessage(
        `BrownBoys: Time to drink some water!`
      );
    }, waterInterval * 60 * 1000);

    if (twentyTwentyTwenty) {
      this._eyeTimer = setInterval(() => {
        vscode.window.showInformationMessage(
          `20-20-20: Look at something 20 meters away for 20 seconds!`
        );
      }, 20 * 60 * 1000);
    }

    this._breakTimeout = setTimeout(() => {
      vscode.window.showWarningMessage(
        `Time for a break! Your turtle needs to recharge.`
      );
      if (this._view) {
        this._view.webview.html = this._getBreakTimer(this._view.webview);
      }
    }, ms);
  }

  // ── HTML loaders ──────────────────────────────────────

  _getLanding(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "landing.css"),
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "landing.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{cat_ICONIC}}/g, spritesPath("cat_ICONIC.png"))
      .replace(/{{cat_icon_whiskers}}/g, spritesPath("cat_icon_whiskers.png"))
      .replace(/{{bb_hero}}/g, spritesPath("bb_hero.png"))
      .replace(/{{bb_icon}}/g, spritesPath("bb_icon.png"))
      .replace(/{{cat_start_pur_1}}/g, spritesPath("cat_start_pur_1.png"))
      .replace(/{{cat_start_pur_2}}/g, spritesPath("cat_start_pur_2.png"))
      .replace(/{{cat_start_pur_3}}/g, spritesPath("cat_start_pur_3.png"))
      .replace(/{{cat_start_pur_4}}/g, spritesPath("cat_start_pur_4.png"))
      .replace(/{{cat_purring_1}}/g, spritesPath("cat_purring_1.png"))
      .replace(/{{cat_purring_2}}/g, spritesPath("cat_purring_2.png"))
      .replace(/{{cat_purring_3}}/g, spritesPath("cat_purring_3.png"))
      .replace(/{{cat_purring_4}}/g, spritesPath("cat_purring_4.png"))
      .replace(/{{otter_1}}/g, spritesPath("otter_1.png"))
      .replace(/{{otter_2}}/g, spritesPath("otter_2.png"))
      .replace(/{{otter_3}}/g, spritesPath("otter_3.png"))
      .replace(/{{turtle_icon}}/g, spritesPath("turtle_icon.png"))
      .replace(/{{turtle_1}}/g, spritesPath("turtle_1.png"))
      .replace(/{{turtle_2}}/g, spritesPath("turtle_2.png"))
      .replace(/{{turtle_3}}/g, spritesPath("turtle_3.png"));
  }

  _getWorkScreen(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "workSession.css"),
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "workSession.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{turtle_icon}}/g, spritesPath("turtle_icon.png"))
      .replace(/{{cspSource}}/g, webview.cspSource);
  }

  _getBreak(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "break.css"),
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "break.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cat_icon}}/g, spritesPath("cat_icon_whiskers.png"))
      .replace(/{{cspSource}}/g, webview.cspSource);
  }

  _getWater(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "water.css"),
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "water.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{otter_icon}}/g, spritesPath("otter_icon.png"));
  }

  _get202020(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "202020.css"),
    );
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "202020.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{clock_icon}}/g, spritesPath("clock20.png"))
      .replace(/{{duration}}/g, this._sessionDuration);
  }

  _getSessionRunning(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "animal.css"),
    );
    const durationMinutes = Number(this._sessionDuration) || 0;
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "animal.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{turtle1}}/g, spritesPath("turtle_1.png"))
      .replace(/{{turtle2}}/g, spritesPath("turtle_2.png"))
      .replace(/{{turtle3}}/g, spritesPath("turtle_3.png"))
      .replace(/{{duration}}/g, durationMinutes.toString())
      .replace(/{{twentyTwentyTwenty}}/g, this._lastTwentyTwentyTwenty ? 'true' : 'false')
      .replace(/{{cat_start_pur_1}}/g, spritesPath("cat_start_pur_1.png"))
      .replace(/{{cat_start_pur_2}}/g, spritesPath("cat_start_pur_2.png"))
      .replace(/{{cat_start_pur_3}}/g, spritesPath("cat_start_pur_3.png"))
      .replace(/{{cat_start_pur_4}}/g, spritesPath("cat_start_pur_4.png"))
      .replace(/{{cat_purring_1}}/g, spritesPath("cat_purring_1.png"))
      .replace(/{{cat_purring_2}}/g, spritesPath("cat_purring_2.png"))
      .replace(/{{cat_purring_3}}/g, spritesPath("cat_purring_3.png"))
      .replace(/{{cat_purring_4}}/g, spritesPath("cat_purring_4.png"))
      .replace(/{{waterInterval}}/g, this._waterInterval ? this._waterInterval.toString() : '0')
      .replace(/{{otter_1}}/g, spritesPath("otter_1.png"))
      .replace(/{{otter_2}}/g, spritesPath("otter_2.png"))
      .replace(/{{otter_3}}/g, spritesPath("otter_3.png"));
  }

  _getBreakTimer(webview) {
    const spritesPath = (file) =>
      webview.asWebviewUri(
        vscode.Uri.joinPath(this._context.extensionUri, "sprites", file),
      );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webview", "styles", "breakRunning.css"),
    );
    const breakSeconds = this._breakDuration * 60;
    let html = fs.readFileSync(
      path.join(this._context.extensionPath, "webview", "turtleDialogue.html"), "utf8",
    );
    return html
      .replace(/{{cssUri}}/g, cssUri)
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{turtle_icon}}/g, spritesPath("turtle_icon.png"))
      .replace(/{{breakSeconds}}/g, breakSeconds);
  }
}

module.exports = { activate };