var ref = new Firebase('https://glaring-inferno-5854.firebaseio.com/');

$('#messageInput').keypress(function (e) {
    if (e.keyCode == 13) {
      var name = $('#nameInput').val();
      var text = $('#messageInput').val();
      ref.push({name: name, text: text});
      $('#messageInput').val('');
    }
});

$('button.github').click(function(){
	ref.authWithOAuthRedirect("github", 
		function(error, authData) {
			if (error) {
			    toastr.error("Authentication Failed!", error);
			} else {
			    toastr.success("Authenticated to github" );
			    console.log('authData', authData);
			}
		},
		//additional oauth parameters
		{
			remember : "sessionOnly",
			scope: "user, gist"
		}
	);
});

ref.on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayChatMessage(message.name, message.text);
});

function displayChatMessage(name, text) {
    $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
}