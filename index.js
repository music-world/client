let url = `http://localhost:3000`
let user = {}
let songDatabase = [];
let tracks = []

getTopChart()
setLoginBar();
accessContent();

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem('token')
        // $('#home').hide()
        setLoginBar();
        accessContent();
        notif().logout();
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
        notif().login();
        setLoginBar();
        accessContent();
    })
    .fail(err => {
        console.error(err)
    })
}

function setLoginBar(){
    if(isLogin()){
        $('#signInButton').hide();
        $('#signOutButton').show();
    }
    else{
        $('#signInButton').show();
        $('#signOutButton').hide();
    }
}

function isLogin() {
    return localStorage.getItem('token') ? true : false;
}

function accessContent(){
    $( '#content' ).click(event => {
        if(!isLogin()){
            notif().nonRegisterUser();
            return false
        }
    })
}

function notif() {
    return {
        logout: function(){
            Swal.fire({
                position: 'start',
                type: 'success',
                title: 'Log Out Success',
                showConfirmButton: false,
                timer: 1500
            });
        },
        login: function(){
            Swal.fire({
                position: 'top',
                type: 'success',
                title: 'Log In Verified',
                showConfirmButton: false,
                timer: 1500
            })
        },
        nonRegisterUser: function(){
            Swal.fire({
                position: 'start',
                type: 'error',
                title: 'You Must Log In First',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
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
        topTracks.tracks.track.forEach((track, i) => {
            $('.card-columns').append(`
                <div class="container">
                    <div class="card text-white bg-primary mx-1 mt-1 inline" style="width: 98%; height: 250px;">
                        <img src="${track.image[3]['#text']}" style="height:100%;width:100%" class="card-img-top" >
                        <div class="overlay">
                            <h3 class="card-body text-white text-center" onclick="songDetail('${track.name}', '${track.image[3]['#text']}', '${i}')" style="cursor:pointer">${track.name}</h3>
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

function songDetail(title, image, index) {
    $.ajax({
        url: `${url}/song`,
        type: 'GET',
        data: {
            search: title
        },
        headers: {
            token: localStorage.token
        }
    })
    .done(({data}) => {
        $('#content').empty()
        $('#content').append(
            `<div class="row">
            <div class="col-sm-4">
              <div class="row">
                  <div class="card text-white bg-primary mt-1 " style="width: 98%; height: 400px">
                      <div class="card-header">Info</div>
                      <div class="card-body-music">
                        <div id="thisPicture" style="text-align: center"></div>
                        <div id="music" style ="text-align: center">
                          <br> Music List:<br>
                          <select id="musicList${index}" class="form-control" onclick="selectMusic('${index}')" style="width: 200px; margin: 10px auto; ">
                          </select>
                          <div id="musicBox"></div> 
                        </div>
                      </div>
                  </div>
              </div>
              <div class="row">
                  <div class="card text-white bg-primary mt-1 " style="width: 98%; height: 185px">
                      <div class="card-header">Video</div>
                      <div class="card-body">
                        <h4 class="card-title">Primary card title</h4>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                      </div>
                  </div>
              </div>  
            </div>
            <div class="col-sm-8" >
                <div class="text-white bg-primary mt-1" style="width: 98%; height: 540px">
                    <div class="card-header">Lyrics</div>
                    <div class="card-body">
                      <h4 class="card-title">Primary card title</h4>
                      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
          </div>`
        )
        songDatabase = data;
        appendMusic(index);
    })
    .fail(err => {
        console.error(err);
    })
}

function setLoginBar(){
    if(isLogin()){
        $('#signInButton').hide();
        $('#signOutButton').show();
    }
    else{
        $('#signInButton').show();
        $('#signOutButton').hide();
    }
}

function isLogin() {
    return localStorage.getItem('token') ? true : false;
}

function accessContent(){
    $( '#content' ).click(event => {
        event.preventDefault()
        if(!isLogin()){
            notif().nonRegisterUser();
            return false
        }
    })
}

function notif() {
    return {
        logout: function(){
            Swal.fire({
                position: 'start',
                type: 'success',
                title: 'Log Out Success',
                showConfirmButton: false,
                timer: 1500
            });
        },
        login: function(){
            Swal.fire({
                position: 'top',
                type: 'success',
                title: 'Log In Verified',
                showConfirmButton: false,
                timer: 1500
            })
        },
        nonRegisterUser: function(){
            Swal.fire({
                position: 'start',
                type: 'error',
                title: 'You Must Log In First',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
}

function selectMusic(){
    getPicture( $( '#musicList' ).val() );
    makeMusicPlayer( $( '#musicList' ).val() );
}

function appendMusic(index){
    for(let i = 0; i < songDatabase.length; i++){
        $( `#musicList${index}` ).append( `<option id=pickSong value="${songDatabase[i].title}">${songDatabase[i].title}</option>` );
    }
    getPicture( $( '#musicList' ).val() );
    makeMusicPlayer( $( '#musicList' ).val());
}

function makeMusicPlayer(title){
    $( '#music-player' ).remove();
    const thisSong = songDatabase.filter(song => (song.title === title))
    $( '#musicBox' ).append( `<audio id="music-player" controls style="background-color:white; border-radius: 10px">
        <source src="${thisSong[0].preview}" type="audio/mpeg">
        Your browser does not support the audio element.
        </audio>` )
}

function getPicture( title ){
    $( '#thisPicture' ).remove();
    const thisSong = songDatabase.filter( song => ( song.title === title ) )
    $( '#thisPicture' ).append( `<img src="${thisSong[0].album.cover_medium}" height=100px alt="Music Cover Picture">` )
    $( '#thisPicture' ).append(`<h4></h4>`)
    $( '#thisPicture' ).append(`artist: ${thisSong[0].artist.name}<br>`)
    $( '#thisPicture' ).append(`album: ${thisSong[0].album.title}<br> `)
    $( '#thisPicture' ).append(`rank: ${thisSong[0].rank} `)
}

function getLyrics() {

}

function getMusicHistory(){
}


