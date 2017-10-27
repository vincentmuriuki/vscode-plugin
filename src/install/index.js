'use strict';

const vscode = require('vscode');
const formidable = require('formidable');
const server = require('../server');
const {wrapHTML, debugHTML, logo} = require('../html-utils');
const {promisifyReadResponse} = require('../utils');
const {
  install: { 
    Authenticate,
    BranchStep,
    CheckEmail,
    CreateAccount,
    Download,
    Flow,
    GetEmail,
    InputEmail,
    Install,
    Login,
    ParallelSteps,
    VoidStep,
    Whitelist,
    WhitelistChoice, 
  }
} =  require('kite-installer');
const URI = 'kite-vscode-install://install';

let instance;

server.addRoute('POST', '/install/emit', (req, res, url) => { 
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      return res.end(err.stack);
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');

    const event = fields.event; 
    delete fields.event;

    instance.installFlow.emit(event, fields);
  });
});

server.addRoute('GET', '/install/progress', (req, res, url) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(instance && 
          instance.installFlow && 
          instance.installFlow.state && 
          instance.installFlow.state.download 
    ? String(instance.installFlow.state.download.ratio)
    : '-1');
})

function inputEmailView (state) { 
  return `
  <p>Great! Create an account with your email address.</p>

  <form novalidate 
        action="http://localhost:${server.PORT}/install/emit" 
        method="POST"
        onsubmit="request(this.method, this.action, new FormData(this))">
    <input type="hidden" name="event" value="did-submit-email"></input>
    <input class="input-text" 
            name="email" 
            type="email" 
            value="${state.account ? state.account.email || '' : ''}"></input>
    <button class="btn btn-primary btn-block">Continue</button>
    <div class="status ${state.error ? 'text-danger' : 'hidden'}">${state.error ? state.error.message : ''}</div>
  </form>`; 
}
function loginView(state) { 
  return `
  <p>It seems like you already have a Kite account. Sign in with your login info.</p>
  
  <form novalidate
        action="http://localhost:${server.PORT}/install/emit" 
        method="POST"
        onsubmit="request(this.method, this.action, new FormData(this))">
    <input type="hidden" name="event" value="did-submit-credentials"></input>
    <input class='input-text' 
            name="email" 
            type="email"
              value="${state.account ? state.account.email || '' : ''}"></input>
    <input class='input-text'   
            name="password" 
            type="password"
            value="${state.account ? state.account.password || '' : ''}"></input>
    <button class="btn btn-primary btn-block" type="submit">Sign in</button>
    <div class="secondary-actions">
      <a class="back" 
          href="#"
          onclick="submitEvent('did-click-back')">Back</a>
      <a class="reset-password secondary-cta"
          href="#"
          onclick="submitEvent('did-forgot-password')">Forgot password</a>
    </div>
    <div class="status ${state.error ? 'text-danger' : 'hidden'}">${state.error ? state.error.message : ''}</div>
  </form>`;
}
function whitelistView(state) { 
  return `
  <p class="email">
    Great we've sent you an email to ${state.account.email}.
    Remember to set your password later!
  </p>
  <p class="text-highlight">
    Kite is a cloud-powered programming tool.
    Where enabled, your code is sent to our cloud,
    where it is kept private and secure.
  </p>
  <p>
    This lets Kite show completions, documentation, examples and more.
  </p>
  <p>
    You can restrict access to individual files or entire directories
    at any time. You can also remove unwanted data from the cloud freely.
    <a href="http://help.kite.com/category/30-security-privacy">Click here to learn more</a>
  </p>

  <form novalidate
        action="http://localhost:${server.PORT}/install/emit" 
        method="POST"
        onsubmit="request(this.method, this.action, new FormData(this))">
    <input type="hidden" name="event" value="did-whitelist"></input>
    <div class="actions">
      <button class="btn btn-primary">Enable access for ${state.path}</button>
      <a class="skip secondary-cta"
         href="#"
         onclick="submitEvent('did-skip-whitelist')">Add Later</a>
    </div>
  </form>
  
  <script>initDownloadProgress();</script>`; 
}
function installEndView(state) { 
  return `
  <div class="welcome-to-kite">
    <div class="welcome-title">
      <h3>Welcome to Kite!</h3>
      <div class="title-logo">${logo}</div>
    </div>
    <div class="warning">
      Kite is still indexing some of your Python code. You\’ll see your completions improve over the next few minutes.
    </div>
    <div class="description">
      <div class="content">
        <p>You\'ll see Kite completions when writing Python in any Kite-enabled directory.</p>
        <p><strong>Kite provides the best Python completions in the world.</strong></p>
        <ul>
          <li>1.5x more completions than local engine</li>
          <li>Completions ranked by popularity</li>
          <li>2x documentation coverage</li>
        </ul>
      </div>
      <!--<div class="description-screenshot"><img src="$\{screenshot\}"></div>-->
    </div>
    <p>
      Kite is under active development. Expect many new features
      in the coming months, including formatted documentation,
      jump to definition, function call signatures, and many more</p>
    <p class="feedback">Send us feedback at <a href="mailto:feedback@kite.com">feedback@kite.com</a></p>
  </div>`; 
}
function installErrorView(state) { 
  return `<div class="status">
    <h4>${install.state.error.message}</h4>
    <pre>${install.state.error.stack}</pre>
  </div>`; 
}

module.exports = class KiteInstall {
  constructor(Kite) {
    this.Kite = Kite;
    this.didChangeEmitter = new vscode.EventEmitter();
    instance = this;
  }

  get onDidChange() { 
    return this.didChangeEmitter.event; 
  }

  update() {
    this.didChangeEmitter.fire(URI);
  }

  dispose() {}

  flow() {
    return new Install([
      new GetEmail({name: 'get-email'}),
      new InputEmail({
        name: 'input-email',
        view: inputEmailView,
      }),
      new CheckEmail({
        name: 'check-email',
        failureStep: 'input-email',
      }),
      new BranchStep([
        {
          match: (data) => data.account.exists,
          step: new Login({
            name: 'login',
            view: loginView,
            failureStep: 'account-switch',
            backStep: 'input-email',
          }),
        }, {
          match: (data) => !data.account.exists,
          step: new CreateAccount({name: 'create-account'}),
        },
      ], {
        name: 'account-switch',
      }),
      new ParallelSteps([
        new Flow([
          new Download({name: 'download'}),
          new Authenticate({name: 'authenticate'}),
        ], {name: 'download-flow'}),
        new WhitelistChoice({
          name: 'whitelist-choice',
          view: whitelistView,
        }),
      ], {
        name: 'download-and-whitelist',
      }),
      new Whitelist({name: 'whitelist'}),
      new BranchStep([
        {
          match: (data) => !data.error,
          step: new VoidStep({
            name: 'end',
            view: installEndView,
          }),
        }, {
          match: (data) => data.error,
          step: new VoidStep({
            name: 'error',
            view: installErrorView,
          }),
        },
      ], {name: 'termination'}),
    ]);
  }

  provideTextDocumentContent() {
    if (!this.installFlow) {
      server.start();

      this.installFlow = this.flow();
      this.installFlow.observeState(state => {
        console.log(state);
        if (!state.download || state.download.done) {
          this.update();
        }
      });
      this.installFlow.onDidChangeCurrentStep(step => {
        console.log('step changed, new:', step.name);
        this.update()
      });
      
      setTimeout(() => {
        this.installFlow.start()
        .then(res => console.log(res))
        .catch(err => console.log(err));
      }, 500);
    }
    const view = this.installFlow.getCurrentStepView();
    const {state} = this.installFlow;

    return Promise.resolve(`
    <div class="install">
      <div class="logo">${logo}</div>
      <div class="progress-indicators">
        <div class="download-kite hidden">
          <progress max='100' value="0" class="inline-block"></progress>
          <span class="inline-block">Downloading Kite</span>
        </div>
        <div class="install-kite ${state.install && !state.install.done ? '' : 'hidden'}">
          <span class="inline-block">Installing Kite</span>
        </div>
        <div class="run-kite ${state.running && !state.running.done ? '' : 'hidden'}">
          <span class="inline-block">Starting Kite</span>
        </div>
      </div>
      <div class="content">${view ? view(this.installFlow.state) : 'install'}</div>
    </div>`)
    .then(html => wrapHTML(html))
    .then(html => debugHTML(html))
  }
}