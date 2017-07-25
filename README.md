# US Netting
The best damn netting site on the web.
- ed@usnetting.com
- @USNetting

##Developing on US Netting
We currently use:
- Webpack
- Webpack Dev Server
- Gulp
- NPM

```npm install```
```npm start```

Your site will be available at ```localhost:8080``` and Hot Module Reload is available on ```localhost:8080/webpack-dev-server/``` *notice that urls dont change while on webpack-dev-server hot reload mode

Always create branches for new features and long fixes. These branches should follow the Build phases above once completed.

#Front Matter for the Single Product and Typical Page Creation

```
---
layout: single-product
video: true
title: Cargo Netting Selection Guide for Custom Cargo Nets
title-tag: Cargo Netting Selection Guide for Custom Cargo Nets
description: USA Made Cargo Netting solutions constructed with webbing or rope including hardware for attachment. Find the right cargo net for your job quickly.
metaurl: https://www.usnetting.com/cargo-netting/
ogimage: https://static.usnetting.com/img/polyester-mat.jpg
permalink: /cargo-netting/
page-title: Cargo Netting Selection Guide
category: /commercial-netting/
critical: cargo-guide
---
```

```
video: (boolean) false
```
Does this page contain a video *NOT* hosted simply in an iframe by a 3rd party (Vimeo, Youtube).  True value will load the scripts for the royalslider video player.

```
title: (text) Cargo Netting Selection Guide for Custom Cargo Nets
```
The Title is a generic title used in apps and pages (breadcrumbs, search, etc.) *THIS IS NOT THE TITLE TAG!

```
title-tag: (text) The actual Title Tag that is used by the SEO Campaign
```
This title is placed in the ```<head></head>``` of the document in the ```<title></title>```
Keep <= 70 characters

```
description: (text) USA Made Cargo Netting solutions constructed with webbing or rope including hardware for attachment. Find the right cargo net for your job quickly.
```
The meta description tag is where this will be placed. Must be <= 150 characters. Place your targeted keywords as close to the front of the document as possible

```
metaurl: (url) https://www.usnetting.com/
```
Url used by the open graph protocol to give the url to a given asset

```
ogimage: https://static.usnetting.com/img/polyester-mat.jpg
```
Open Graph image for display on social media and other applications

```
page-title: (text) Title for the page in the red bar
```
This is the main title for the page and it displays in the red bar

```
category: (url segment) /category/
```
URL segment to look up an include to be included as sidebar.html inside of includes/category-value/

```
critical: (text) cargo-netting
```
An all lowercase non-spaced name of the critical css to include int he document. (example would look for cargo-netting.html in includes/critical)




## <a href="PASTDEPLOY.md">Git and Deployment Strategy - DEPLOYHQ</a>
## <a href="CHANGELOG.md">CHANGELOG.MD</a>
