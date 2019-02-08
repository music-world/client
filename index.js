let url = `http://localhost:3000`
let user = {}
let tracks = []
getTopChart()

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

function getTopChart() {
    $.ajax({
        type: 'get',
        url: `${url}/lastfm/toptracks`,
        headers: {
            token: localStorage.token
        }
    })
    .done(topTracks => {
        $('.card-columns').empty()
        // console.log(topTracks.tracks.track)
        topTracks.tracks.track.forEach(track => {
            $('.card-columns').append(`
                <div class="container">
                    <div class="card text-white bg-primary mx-1 mt-1 inline" style="width: 98%; height: 250px;">
                        <img src="${track.image[3]['#text']}" style="height:100%;width:100%" class="card-img-top" >
                        <div class="overlay">
                            <h3 class="card-body text-white text-center" onclick="${songDetail(track.name, track.image[3]['#text'])}" style="cursor:pointer">${track.name}</h3>
                            <h5 class="card-body text-white text-center">${track.artist.name}</h5>
                        </div>
                    </div>
                </div>
            `)
            tracks.push(track)
        })
    })
    .fail(err => {
        console.log(err)
    })
}

function songDetail(title, image) {

}
