var ref = new Firebase('https://glaring-inferno-5854.firebaseio.com/');

var auth = ref.getAuth();

ref.onAuth(onAuthCallback);
ref.offAuth(onAuthCallback);

ref.child('messages').on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayChatMessage(message.name, message.text);
});

ref.child('users').on('child_added', function(snapshot) {
	var user = snapshot.val();
	console.log('user',user);
});


$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
    	var auth = ref.getAuth();
    	console.log('auth', auth);
      	
      	
	    if(auth !== null){
	    	var text = $('#messageInput').val();
	    	var name = getName(auth);
		    ref.child("messages").push({name: name, text: text, timestamp: Date.now()});
		    $('#messageInput').val('');
		}else{
			toastr.error('you must login to post');
		}
    }
});

$('button.logout').click(function(){
	ref.unauth();
	location.reload();
});

$('button.login').click(function(){
	var $btn = $(this),
		provider = $btn.data('provider');

	ref.authWithOAuthRedirect(provider, 
		function(error, authData) {
			if (error) {
			    toastr.error("Authentication Failed!", error);
			} else {
				location.reload();
				// We'll never get here, as the page will redirect on success.
			    // toastr.success("Authenticated to github" );
			    // console.log('authData', authData);
			}
		},
		//additional oauth parameters
		{
			remember : "sessionOnly",
			// scope: "user, gist"
		}
	);
});

function onAuthCallback(authData){
	if (authData ) {
	    // save the user's profile into the database so we can list users,
	    // use them in Security and Firebase Rules, and show profiles
	    console.log("Authenticated user ", authData);
	    if(authData.github !== undefined){
	    	$('#userIcon').attr({src : authData.github.profileImageURL}).show();
	    }else if(authData.google !== undefined){
	    	$('#userIcon').attr({src : authData.google.profileImageURL}).show();
	    }
	    ref.child("users").child(authData.uid).set({
	      provider: authData.provider,
	      name: getName(authData),
	      time : new Date().toUTCString()
	    });

	}else{
		console.log('Unauthenticated user');
	}
}

// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
     case 'github':
       return authData.github.displayName;
     case 'google':
       return authData.google.displayName;
  }
}

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
}