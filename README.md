# FalconLink
App created using Angular CLI 18, Node 22 and npm 10\

## Development server
### Serve in default language (en)
Run `npm start` for a dev server in default language (en). Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.  

### Serve in Hebrew (rtl)
Run `npm run start:he` to start dev server, translated to Hebrew.  

## Build
## Default language (en)
Run `npm run build` to build the project in default language. The build artifacts will be stored in the `dist/falcon-link/browser` directory.  
Run `npm run build:staging` to build the project in defalt language, with `staging` configuration.  
Run `npm run watch` to watch for changes on built files, in default language.  

### All languages
Languages configuration can be found in `angular.json`, under `i18n` key.  
Run `npm run build:localize` to build the project in all specified languages, with `production` configuration. The build artifacts for each language will be stored in the `dist/falcon-link/browser/{lang}` directory.  
Run `npm run build:staging:localize` to build the project in all specified languages, with `staging` configuration.  

## Build and serve localized app (locally)
Run `npm run build:local` to build the project in all specified languages, with `development` configuration. The build artifacts for each language will be stored in the `dist/falcon-link/browser/{lang}` directory.  
 Run `npm run serve:local` to serve localized built files, from `dist/falcon-link/browser/{lang}` folders. Navigate to `http://localhost:4200/{lang}` and change language in dropdown.  
   
 NOTE: When using `npm run build:local`, after build, `copy-assets` npm script is run automatically. This is not the case with onther `build:*` scripts.
 this is only for local testing purposes. On staging and production server, `assets` will be served from each {lang} folder, for each language resctively.  

## Utilities
### Copy assets
Run `npm run copy-assets` after build, to copy from `./public` folder `dist/falcon-link/browser`, if needed.  

### Extract i18n into xlf file
Run `npm run extraxt-i18n`  

### Analyze bundle size
Run `npm run analyze-bundle` will build `staging` configuration bundle and run web based bundle size analytics  
