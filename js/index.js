var ref = new Firebase('https://glaring-inferno-5854.firebaseio.com/');


ref.onAuth(onAuthCallback);
ref.offAuth(onAuthCallback);

ref.on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayChatMessage(message.name, message.text);
});


$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      var name = $('#nameInput').val();
      var text = $('#messageInput').val();
      ref.push({name: name, text: text});
      $('#messageInput').val('');
    }
});

$('button.logout').click(function(){
	ref.unauth();
});

$('button.login').click(function(){
	var $btn = $(this),
		provider = $btn.data('provider');

	ref.authWithOAuthRedirect(provider, 
		function(error, authData) {
			if (error) {
			    toastr.error("Authentication Failed!", error);
			} else {
				// We'll never get here, as the page will redirect on success.
			    // toastr.success("Authenticated to github" );
			    // console.log('authData', authData);
			}
		},
		//additional oauth parameters
		{
			remember : "sessionOnly",
			scope: "user, gist"
		}
	);
});

function onAuthCallback(authData){
	if (authData ) {
	    // save the user's profile into the database so we can list users,
	    // use them in Security and Firebase Rules, and show profiles
	    console.log("Authenticated user ", authData);
	    
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
  }
}

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
}