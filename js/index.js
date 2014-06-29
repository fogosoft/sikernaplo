
var server_nodeurl = "http://www.proudlog.com";

function signInCallback(authResult) {
    console.log("kuldjuk a tokent a szervernek");
    if (authResult.code) {
        $.post(server_nodeurl + '/testsikerBE/gauth/callback', {code: authResult.code})
                .done(function(data) {
            console.log("node gauth/callback valasz:");
            console.log(data);
            if (data === 'nemok') {
                $scope.login.error = "Invalid username or password";
            } else {
                $('#loginAblak').modal('hide');
                $rootScope.currentUser = data;
                $rootScope.$broadcast("user_ok", {
                    currentUser: data
                });
            }
            $('#signinButton').hide();
        });
    } else if (authResult.error) {
        console.log('There was an error: ' + authResult.error);
    }
}
;

function signOutGoogle() {
    console.log("sign out google");
    gapi.auth.signOut();
}
;

function checkGoogle() {
    console.log("checks google");

    gapi.auth.checkSessionState({'client_id': '354437215227-la2qsd4541ucl132a7p1fhbrf6pu4rmj.apps.googleusercontent.com', 'session_state': null}, function(ertek) {
        console.log("checkGoogleSession: " + ertek);
    });
}
;

