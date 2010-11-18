var p={};
$(document).ready(function(){
	
	initPlayer('A', $('#inputA').val());
	initPlayer('B', $('#inputB').val());
	
	
	$('#setA').click(function() {
		initPlayer('A', $('#inputA').val())
		return false;
	});
	
	$('#setB').click(function() {
		initPlayer('B', $('#inputB').val())
		return false;
	});
	
	$('#playAll').live('click', function() {
		play('A');
		play('B');
		return false;
	});
	
	$('#pauseAll').live('click', function() {
		pause('A');
		pause('B');
		return false;
	});
	
	$('#markA').click(function() {
		$('#storeA').val($('#secA').val());
		
		var preroll_point = $('#storeA').val()-$('#preroll').val();
		if(preroll_point < 0) {
			preroll_point = 0;
		}
		$('#preA').val(preroll_point);
	});
	
	$('#markB').click(function() {
		$('#storeB').val($('#secB').val());
		
		var preroll_point = $('#storeB').val()-$('#preroll').val();
		if(preroll_point < 0) {
			preroll_point = 0;
		}
		$('#preB').val(preroll_point);
	});
	
	$('#seekA').click(function() {
		seek('A', $('#preA').val() );
		pause('A');
	});
	
	$('#seekB').click(function() {
		seek('B', $('#preB').val() );
		pause('B');
	});
	
});


function initPlayer(my_id, video_id) {
	
	$('#container'+my_id).attr('class',"").html("").tubeplayer({
		width: 400, // the width of the player
		height: 300, // the height of the player
		allowFullScreen: "false", // true by default, allow user to go full screen
		initialVideo: video_id, // the video that is loaded into the player
		playerID: my_id, // the ID of the embedded youtube player
		preferredQuality: "default",// preferred quality: default, small, medium, large, hd720
		onPlay: function(id){}, // after the play method is called
		onPause: function(){}, // after the pause method is called
		onStop: function(){}, // after the player is stopped
		onSeek: function(time){}, // after the video has been seeked to a defined point
		onMute: function(){}, // after the player is muted
		onUnMute: function(){} // after the player is unmuted
	});
	
	
}


function onYouTubePlayerReady(my_id) {
    p[my_id] = $('#container'+my_id).tubeplayer('player');
	p[my_id].addEventListener("onStateChange", "onytplayerStateChange");
	setInterval("updateytplayerInfo('"+ my_id +"')", 100);

  	}

function play(my_id) {
	$('#container'+my_id).tubeplayer('play');
}

function pause(my_id) {
	$('#container'+my_id).tubeplayer('pause');
}

function seek(my_id, time) {
	$('#container'+my_id).tubeplayer('seek', time);
}


function onytplayerStateChange(newState) {
   console.log("Player's new state: " + newState);
}
function updateytplayerInfo(playerId) {
	$('#sec'+playerId).val(p[playerId].getCurrentTime());
}

