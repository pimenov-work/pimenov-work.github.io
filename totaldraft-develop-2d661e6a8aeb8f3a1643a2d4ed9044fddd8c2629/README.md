# TotalDraft.com

Based on [React Starter Kit](https://www.reactstarterkit.com). React, Redux, Webpack, CSS-Modules, etc.

### Getting Started
Clone git repo
```
git clone git@gitlab.jazzpixels.com:jazzpixels/totaldraft.git
```
Install packages
```
npm install (yarn install)
```
Run project
```
npm start
```
Project run at http://localhost:3001

#### Development

Using React-intl v2.0 API

https://github.com/yahoo/react-intl/issues/162

#### TotalDraft API docs

http://api.totaldraft.com/


### Deployment
#### Staging server
Use regular Jazz Pixels password or SSH.
Use github Release branch for staging deployment.
```
npm run deploy -- staging
```
Check http://dev.totaldraft.com

#### Production server
Use regular Jazz Pixels password or SSH
Use github Master branch for production deployment.
```
npm run deploy -- production
```
Check http://totaldraft.com


### Debug deployment
Using git hooks. Check post-receive hook.

Remote staging repo
```
ssh://root@188.166.14.52/var/repo/staging.git
```

---

#### Learn More

  * [Getting Started with React.js](http://facebook.github.io/react/)
  * [Redux Architecture for Building User Interfaces](http://redux.js.org/)
  * [React.js Questions on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
  * [React.js Discussion Board](https://discuss.reactjs.org/)
  * [Flow - A static type checker for JavaScript](http://flowtype.org/)
  * [The Future of React](https://github.com/reactjs/react-future)
  * [Learn ES6](https://babeljs.io/docs/learn-es6/), [ES6 Features](https://github.com/lukehoban/es6features#readme)
