//(function(){
//	var app = angular.module('projectRtc', [],
//		function($locationProvider){$locationProvider.html5Mode(true);}
//    );
//	var client = new PeerManager();
//
//	app.controller('RemoteStreamsController', ['$location', '$http', function($location, $http){
//		var rtc = this;
//		rtc.remoteStreams = [];
//		function getStreamById(id) {
//		    for(var i=0; i<rtc.remoteStreams.length;i++) {
//		    	if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i];}
//		    }
//		}
//		rtc.loadData = function () {
//			// get list of streams from the server
//			$http.get('/streams.json').success(function(data){
//				// filter own stream
//				var streams = data.filter(function(stream) {
//			      	return stream.id != client.getId();
//			    });
//			    // get former state
//			    for(var i=0; i<streams.length;i++) {
//			    	var stream = getStreamById(streams[i].id);
//			    	streams[i].isPlaying = (!!stream) ? stream.isPLaying : false;
//			    }
//			    // save new streams
//			    rtc.remoteStreams = streams;
//			});
//		};
//
//		rtc.view = function(stream){
//			client.peerInit(stream.id);
//			stream.isPlaying = !stream.isPlaying;
//		};
//		rtc.call = function(stream){
//			/* If json isn't loaded yet, construct a new stream
//			 * This happens when you load <serverUrl>/<socketId> :
//			 * it calls socketId immediatly.
//			**/
//			if(!stream.id){
//				stream = {id: stream, isPlaying: false};
//				rtc.remoteStreams.push(stream);
//			}
//
//		};
//
//		//initial load
//		rtc.loadData();
//    	if($location.url() != '/'){
//      		rtc.call($location.url().slice(1));
//    	};
//	}]);
//
//
//})();
