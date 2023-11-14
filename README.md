
```bash
web-extension-boilerplate-23/
├── .vscode/
│   ├── launch.json
│   └── settings.json
├── dist/
├── node_modules/
├── src/
│   ├── scripts/
│   │   └── content
            └── components
                └── editor-module
                    └── SheetsEditor.tsx
                └── popup-module
                    └── CustomPopup.tsx
                    └── FloatingBtn.tsx
                    └── InternalNavbar.tsx
│   │       └── App.tsx
│   │       └── index.tsx
│   │   └── onInstalled
│   │       └── App.tsx
│   │       └── index.tsx
│   │       └── onInstalled.html
│   │   └── options
│   │       └── Options.tsx
│   │       └── index.tsx
│   │       └── options.html
│   │   └── popup
│   │       └── Popup.tsx
│   │       └── index.tsx
│   │       └── popup.html
│   │   └── service-worker
│   │       └── service-worker.tsx
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── browser.ts
│   ├── index.html
│   ├── manifest.ts # Generates Manifest.json
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

```bash
npm run dev
```

This spins up a local vite server and opens the browser to a page that injects your extension, popup, options and content script. As a note, the `service-worker` background script, as well as Browser runtimes for `content.ts` (sending/receiving messages, storage etc) aren't available here, as you'll need to build and load the extension into Chrome. More on that later.

You'll find everything you need to get building in `src/scripts/...` so here's a quick overview to get you going.

- `src/scripts/content/*` - Your content script. What gets injected into a client's tab. index.tsx is where the magic happens in traditional React rendering fashion, and `App.tsx` is your entry point into your app.

- `src/scripts/onInstalled` - When first installed, this page gets shown. Take the opportunity to spell out exactly how to use your extension and all the benefits, as well as what to do if there are issues (the default for most users with problems is to review bomb your store page, so give them an alternate way to reach out)

- `src/scripts/options` - The options tab. Self explanatory; When your extension has loaded, right click the extensions icon in the top right of browser and hit `options`.

- `src/scripts/popup` - The popup, that's shown with a left click of the extensions icon. If you're not injecting into a webpage, here's a great place to put the bulk of your UI.

- `src/scripts/service-worker` - The background script. Check out the examples on how to pass messages back and forth between Content and Background script. It should consist mainly of helper functions and listeners for specific events. You can debug this by heading over to `chrome://extensions` and clicking the `inspect service worker` link, that will open up a new devtools env specifically for the background script.

## How to start up the extension

```bash
npm run build
```

From here, open Chrome and go to `chrome://extensions`, then hit `Load Unpacked` and choose the newly made `dist` directory. Assuming no errors, voila! You're in.

You'll notice that `npm run build` calls on two vite configs, one for your `content` script, and another for everything else. The reasoning for this is that we're having to output two very different builds (a normal 'vite'-ish HTML build, and a library (the `content` script)).

You'll also notice that we're watching for changes on the content script so that it rebuilds every time we make a change there. (`vite.config.content.ts` > watch to make edits.) This should make the annoying task of rebuilding, and reloading your extension, slightly easier.

### Protip: Quick Reloading Shortcut

TL;DR - Head to `chrome://extensions/shortcuts` and set your shortcut to Refresh Extension (I set mine to ctrl + spacebar)

Using `npm run build` with the watcher, and the Quick Reload Shortcut, you can get pretty close to a seamless hot-reloading experience, though its not perfect. Any ideas to make this more fluid are welcome!
