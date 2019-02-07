let url = `http://localhost:3000`
let user = {}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem('token')
        // $('#home').hide()
        $('#signInButton').show()
        $('#signOutButton').hide()
    });
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        type: 'post',
        url: `${url}/users`,
        data: {
            id_token
        }
    })
    .done(success => {
        localStorage.setItem('token', success.token)
        user = success.data
        // $('#home').show()
        $('#signInButton').hide()
        $('#signOutButton').show()
    })
    .fail(err => {
        console.error(err)
    })
}