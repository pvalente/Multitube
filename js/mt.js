var p={};

$(document).ready(function(){
	
	if ($('#containerA').html()) {
	    
		console.log("Stuff exists, let's roll");
		
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
		
		$('#playAllCorrected').live('click', function() {
		    // Uses javascript to compensate for differences in keyframe timing
		    
		    var dA = $('#delayA').val();
		    var dB = $('#delayB').val();
		    
		    //Determines which player should stert first, and then cues the other one
		    if (dA < 0 && dB > 0) {
		        dB = dB - dA;
		        dA = 0;
		        console.log("New dB is "+ dB);
		    }
		    
		    if (dB < 0 && dA > 0) {
		        dA = dA - dB;
		        dB = 0;
		        console.log("New dA is "+ dA);
		    }
		    
		    if (dB < 0 && dA < 0) {
		        // If both keyframes are before the marked point, the difference between them is used
		        // to start the players
		        if (dA < dB) {
		            dB = (dA - dB) * -1;
		            dA = 0;
		        } else {
		            dA = (dB - dA) * -1;
		            dB = 0;
		        }
		    }
		    
		    setTimeout('play(\'A\')', dA )
		    setTimeout('play(\'B\')', dB )
			return false;
		});
	
		$('#pauseAll').live('click', function() {
			pause('A');
			pause('B');
			return false;
		});
		
		$('#seekAll').live('click', function() {
			$('#seekA').click();
			$('#seekB').click();
			return false;
		});
	
		$('#markA').click(function() {
			$('#storeA').val($('#secA').val());
		
			var preroll_point = $('#storeA').val()-$('#preroll').val();
			if(preroll_point < 0) {
				preroll_point = 0;
			}
			$('#preA').val(preroll_point);
		    return false;
		});
	
		$('#markB').click(function() {
			$('#storeB').val($('#secB').val());
		
			var preroll_point = $('#storeB').val()-$('#preroll').val();
			if(preroll_point < 0) {
				preroll_point = 0;
			}
			$('#preB').val(preroll_point);
			return false;
		});
	
		$('#seekA').click(function() {
			seek('A', $('#preA').val() );
			pause('A');
			updateDelay('A');
			//console.log("Direto: "+ p['A'].getCurrentTime() +" - Value: "+ $('#secA').val() );
			//$('#delayA').val( Math.round( ($('#secA').val() - $('#preA').val() ) * 1000 ) );
			return false;
		});
	
		$('#seekB').click(function() {
			seek('B', $('#preB').val() );
			pause('B');
			updateDelay('B');
			//setTimeout('updateDelay("B");', 1000 );
			//console.log("Diff B: "+ ($('#secB').val() - $('#preB').val() ) );
			//$('#delayB').val( Math.round( ($('#secB').val() - $('#preB').val() ) * 1000 )  );
			return false;
		});
		
        populateFromURL();
		
		$('#generateURL').click(function() {
		    $('#syncURL').val(generateURL());
		    return false;
		});
		
	} else {
		console.log("Nothing here, I'm in test world");
	}
	
});


function initPlayer(my_id, video_id) {
	
	$('#container'+my_id).attr('class',"").html("").tubeplayer({
		width: 586, // the width of the player
		height: 360, // the height of the player
		allowFullScreen: "false", // true by default, allow user to go full screen
		initialVideo: video_id, // the video that is loaded into the player
		playerID: my_id, // the ID of the embedded youtube player
		preferredQuality: "large",// preferred quality: default, small, medium, large, hd720
		onPlay: function(id){}, // after the play method is called
		onPause: function(){ 
		            //console.log("Will pause "+ my_id) 
		        }, // after the pause method is called
		onStop: function(){}, // after the player is stopped
		onSeek: function(time){
		            //console.log("Will seek "+ my_id + " to "+ time); 
		        }, // after the video has been seeked to a defined point
		onMute: function(){}, // after the player is muted
		onUnMute: function(){} // after the player is unmuted
	});
}


function onYouTubePlayerReady(my_id) {
    p[my_id] = $('#container'+my_id).tubeplayer('player');
	p[my_id].addEventListener("onStateChange", "onytplayerStateChange");
	setInterval("updateytplayerInfo('"+ my_id +"')", 100);
	prepareVideo(my_id);
}


function prepareVideo(my_id) {
    console.log('Preparing video '+ $('#pre' + my_id).val());
    var time = $('#pre' + my_id).val();
    $.when( $('#container'+my_id)
        .tubeplayer('seek', time)
        .tubeplayer('pause') ).then(function(){
            
            $.when( $('#container'+my_id)
                .tubeplayer('play') ).then(function(){
                    $('#container'+my_id)
                .tubeplayer('pause')
            });
        });
}






function play(my_id) {
	$('#container'+my_id).tubeplayer('play');
}

function pause(my_id) {
	$('#container'+my_id).tubeplayer('pause');	
}

function seek(my_id, time) {
    $('#container'+my_id).tubeplayer('seek', time);
    //pause(my_id);
}


function onytplayerStateChange(newState) {
   console.log("Player's new state: " + newState);
   
   /*
   var stateA = $('#containerA').tubeplayer('data').state;
   var hasBytesA = ( $('#containerA').tubeplayer('data').bytesLoaded > 0);
   var timeIsDifferentA = ($('#containerA').tubeplayer('data').currentTime != $('#preA').val() );
   if ( timeIsDifferentA && hasBytesA) {
       console.log('A READY TO PLAY');
   } else {
       console.log('A NOT READY');
       if (stateA == -1) {
          seekChain(pauseChain(playChain($('#containerA'))), $('#preA').val());
       }
   }
   
   //var t = $('#containerA').tubeplayer('data').currentTime;
   //$('#sec' + my_id).val(time);
   */
}

function updateytplayerInfo(my_id) {
	$('#sec' + my_id).val( p[my_id].getCurrentTime() );
}


function populateFromURL() {
    if($.url.param("videoA")) {
	    $('#inputA').val($.url.param("videoA"));
	    $('#setA').click();
	}
	if($.url.param("videoB")) {
	    $('#inputB').val($.url.param("videoB"));
	    $('#setB').click();
	}
	if($.url.param("seekA")) {
	    $('#preA').val($.url.param("seekA"));
	}
	if ($.url.param("seekB")) {
	    $('#preB').val($.url.param("seekB"));
	}
	
	return false;
}


function updateDelay(my_id) {
    $('#delay' + my_id).val( Math.round( ( $('#sec' + my_id).val() - $('#pre' + my_id).val() ) * 1000 ) );
}

function generateURL() {
    return "http://" + $.url.attr('host') + $.url.attr('path') + "?videoA=" +  $('#inputA').val() + "&videoB=" + $('#inputB').val() + "&seekA=" + $('#preA').val() + "&seekB=" + $('#preB').val();
}

