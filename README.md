# Kite Python Plugin for Visual Studio Code

Kite is an AI-powered programming assistant that helps you write Python code inside Visual Studio Code. The
[Kite Engine](https://kite.com/) needs to be installed in order for the extension to work properly. The extension itself
provides the frontend that interfaces with the Kite Engine, which runs 100% locally on your computer performing all the code analysis and machine learning (no code is sent to a cloud server).


## Features

Kite helps you write code faster by showing you the right information at the right time. Learn more about how Kite heightens VS Code's capabilities at https://kite.com/integrations/vs-code/.

At a high level, Kite provides you with:
* 🧠 __[Line-of-Code Completions](https://kite.com/blog/product/launching-line-of-code-completions-going-cloudless-and-17-million-in-funding/)__ powered by machine learning models trained on the entire open source code universe
* 📝 __[Intelligent Snippets](https://kite.com/blog/product/announcing-intelligent-snippets-for-python/)__ that automatically provide context-relevant code snippets for your function calls
* 🔍 __[Instant documentation](https://kite.com/copilot/)__ for the symbol underneath your cursor so you save time searching for Python docs


## Requirements

* macOS 10.11+, Windows 7+ or Linux
* Visual Studio Code v1.28.0+
* [Kite Engine](https://kite.com/)

Use another editor? Check out [Kite’s other editor integrations](https://kite.com/integrations/).


## Installation

### Installing the Kite Engine

__macOS Instructions__
1. Download the [installer](https://kite.com/download/) and open the downloaded `.dmg` file.
2. Drag the Kite icon into the `Applications` folder.
3. Run `Kite.app` to start the Kite Engine.

__Windows Instructions__
1. Download the [installer](https://kite.com/download/) and run the downloaded `.exe` file.
2. The installer should run the Kite Engine automatically after installation is complete.

__Linux Instructions__

Install Kite on Linux by running one command:

```
bash -c "$(wget -q -O - https://linux.kite.com/dls/linux/current)"
```

Kite will launch automatically after installation.


### Installing the Kite Assistant for Visual Studio Code

When running the Kite Engine for the first time, you'll be guided through a setup process which will allow you to install
the VS Code extension. You can also install or uninstall the VS Code extension at any time using the Kite Engine's [plugin
manager](https://help.kite.com/article/62-managing-editor-plugins).

Alternatively, you have 2 options to manually install the package:
1. Search for "Kite" in VS Code's built-in extension marketplace and install from there.
2. Run the command `code --install-extension kiteco.kite` in your terminal.

[Learn about the additional capabilities Kite adds to VS Code.](https://www.kite.com/integrations/vs-code/)


## Usage

The following is a brief guide to using Kite in its default configuration.

### Hover

Hover your mouse cursor over a symbol to view a short summary of what the symbol represents.

![hover](https://s3.amazonaws.com/helpscout.net/docs/assets/589ced522c7d3a784630c348/images/5c3eb72c2c7d3a3194501270/file-LaHSHhYTkH.png)

### Documentation

Click on the `Docs` link in the hover popup to open the documentation for the symbol inside the Copilot, Kite's standalone
reference tool.

![copilot](https://github.com/kiteco/atom-plugin/blob/master/docs/images/copilot.png?raw=true)

### Definitions

If a `Def` link is available in the hover popup, clicking on it will jump to the definition of the symbol.

### Autocompletions

Simply start typing in a saved Python file and Kite will automatically suggest completions for what you're typing. Kite's
autocompletions are all labeled with the `⟠` symbol.

![completions](https://s3.amazonaws.com/helpscout.net/docs/assets/589ced522c7d3a784630c348/images/5c3eb54f04286304a71e4292/file-jJZznGIq2t.png)

### Function Signatures

When you call a function, Kite will show you the arguments required to call it. Kite's function signatures are also all
labeled with the `⟠` symbol.

![signature](https://s3.amazonaws.com/helpscout.net/docs/assets/589ced522c7d3a784630c348/images/5c3eb6ad2c7d3a319450126e/file-j1bl9zETcx.png)

> __Note:__ If you have the Microsoft Python extension installed, Kite will _not_ be able to show you information on
> function signatures.

### Commands

Kite comes with sevaral commands that you can run from VS Code's command palette.

|Command|Description|
|:---|:---|
|`kite.open-copilot`|Open the Copilot|
|`kite.docs-at-cursor`|Show documentation of the symbol underneath your cursor in the Copilot|
|`kite.engine-settings`|Open the settings for the Kite Engine|
|`kite.help`|Open Kite's help website in the browser|


## Contact Us

Feel free to contact us with bug reports, feature requests, or general comments at feedback@kite.com.

Happy coding!


---

#### About Kite

Kite is built by a team in San Francisco devoted to making programming easier and more enjoyable for all. Follow Kite on
[Twitter](https://twitter.com/kitehq) and get the latest news and programming tips on the
[Kite Blog](https://kite.com/blog/).
Kite has been featured in [Wired](https://www.wired.com/2016/04/kites-coding-asssitant-spots-errors-finds-better-open-source/), 
[VentureBeat](https://venturebeat.com/2019/01/28/kite-raises-17-million-for-its-ai-powered-developer-environment/), 
[The Next Web](https://thenextweb.com/dd/2016/04/14/kite-plugin/), and 
[TechCrunch](https://techcrunch.com/2019/01/28/kite-raises-17m-for-its-ai-driven-code-completion-tool/). 
