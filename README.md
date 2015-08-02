[![Build Status](https://travis-ci.org/igarape/copcast-admin.svg?branch=master)](https://travis-ci.org/igarape/copcast-admin)
# Copcast Admin

Copcast Admin is part of the Copcast solution to help improve police accountability using mobile phones to record the video and the audio and register their GPS location.

Copcast Admin is developed with <a href="https://angularjs.org">Angularjs</a>

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

Open the file <b>src/app/app.js</b> and make sure that the constant <b>ServerUrl</b> points to <b>localhost:\<COPCAST_SERVER_PORT\></b>

```
angular.module('copcastAdminApp').constant('ServerUrl', 'http://localhost:3000');
```

And to finally run the app:

```
  gulp serve
```

To test copcast completely, you must have also the <a href="https://github.com/igarape/copcast-android">Copcast Android</a> app installed in an Android phone and connected to the <a href="https://github.com/igarape/mogi-server">Copcast Server</a>.

Copcast Admin is developed by <a href="http://www.igarape.org.br/en/">Instituto Igarapé</a> as part of the <a href="http://www.igarape.org.br/en/smart-policing/">Smart Policing Project</a>.
