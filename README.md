[![Stories in Ready](https://badge.waffle.io/igarape/copcast-admin.png?label=ready&title=Ready)](https://waffle.io/igarape/copcast-admin)
[![Build Status](https://travis-ci.org/igarape/copcast-admin.svg?branch=master)](https://travis-ci.org/igarape/copcast-admin)
[![Code Climate](https://codeclimate.com/github/igarape/copcast-admin/badges/gpa.svg)](https://codeclimate.com/github/igarape/mogi-server)
# Copcast Admin

Copcast Admin is part of the Copcast solution to help improve police accountability using mobile phones to record the video and the audio and register their GPS location.

Copcast Admin is developed with <a href="https://angularjs.org">AngularJS</a>

## Installation

First, install <a href="https://nodejs.org">Node.js</a> in your development machine. We are using, currently, version <b>0.10.40</b>.

With node installed, install Bower, Gulp, Karma and PhantomJs (the last two, to run the tests). And then, run npm install and bower install for the packages in the root of the project.

```
  npm install -g bower
  npm install -g gulp@3.9.0
  npm install -g karma@0.13.3
  npm install phantomjs@1.9.17
  
  npm install
  bower install
```
Now you have Copcast Admin installed. To connect it with the server, you must have installed <a href="https://github.com/igarape/mogi-server">Copcast Server</a>. If you did not install it yet, this is the time!

Open the file <b>src/app/app.js</b> and make sure that the constant <b>ServerUrl</b> points to <b>//\<COPCAST_SERVER_ADDRESS\>:\<COPCAST_SERVER_PORT\></b>

```
angular.module('copcastAdminApp').constant('ServerUrl', '//localhost:3000');
```

Please note that we intentionally omit the schema ("http:") in order to allow the same value to be used with both HTTP and HTTPS.

Now finally run the app:

```
  gulp serve
```


## Deployment

_Gulp_ is not suited for the production environment and you should use a real web server for the task, like _Apache_ or _Nginx_.
Once you have configured your web server, you can instruct _gulp_ to build your files with:

```
  gulp build
```

The generated files will be deployed to the _dist_ directory, which should serve as your web root.

If you want to have your service running under HTTPS, configure your web server as usual and do not forget to omit the schema part from the _ServerUrl_.


To test copcast completely, you must have also the <a href="https://github.com/igarape/copcast-android">Copcast Android</a> app installed in an Android phone and connected to the <a href="https://github.com/igarape/mogi-server">Copcast Server</a>.
<hr/>
<small>Copcast Admin is developed by <a href="http://www.igarape.org.br/en/">Instituto Igarapé</a> as part of the <a href="http://www.igarape.org.br/en/smart-policing/">Smart Policing Project</a>.</small>
