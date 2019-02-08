let url = `http://localhost:3000`
let user = {}
let songDatabase = [];
let tracks = []

getTopChart()
setLoginBar();
accessContent();

function onLoad() {
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
  }

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem('token')
        setLoginBar();
        accessContent();
        notif().logout();
        $('#loginPage').show()
        $('#content').hide()
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
        $('#loginPage').hide()
        $('#content').show()
    })
    .fail(err => {
        console.error(err)
    })
}

function setLoginBar(){
    if (isLogin()) {
        $('#signInButton').hide();
        $('#signOutButton').show();
        $('#loginPage').hide()
    } else { 
        $('#loginPage').show()
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
            $('#loginPage').show()
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
            $('#content').empty()
            $('#content').append(`
            <div class="card-columns" style="column-count: 4">
            </div>  
            `)
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


function songDetail(title=$('#searchTitle').val(), image, index) {
    
    $.ajax({
        url: `${url}/song?search=${title}`,
        type: 'GET',
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
                  <div class="card text-white bg-primary mt-1 " style="width: 98%; height: 89vh">
                      <div class="card-header">Info</div>
                      <div class="card-body-music">
                        <div id="thisPicture" style="text-align: center">
                        <img src="${data[0].album.cover_medium}" height=100px alt="Music Cover Picture">
                        </div>
                        <div id="music" style ="text-align: center">
                          <br> Music List:<br>
                          <select id="musicList" class="form-control" onchange="selectMusic('${index}')" style="width: 200px; margin: 10px auto; ">
                          </select>
                          <div id="musicBox"></div> 
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <div class="col-sm-8" id="lyrics">
              
            </div>
          </div>`
        )
        console.log(title, 'ini title')
        getLyrics(title)
        songDatabase = data;
        // console.log(data, typeof data, 'ini song database !!!!!!!!!!!')
        appendMusic(index, data);
    })
    .fail(err => {
        console.error(err);
    })
}
function getLyrics (title) {
    $.ajax({
        type: 'get',
        url: `${url}/lyrics?trackName=${title}`,
        headers: {
            token: localStorage.token
        }
    })
    .done(data => {
        $('#lyrics').empty()
        $('#lyrics').append(`
        <div class="text-white bg-primary mt-1" style="width: 98%; height: 89vh">
            <div class="card-header"></div>
            <div class="card-body">
            
            <p id="detailLyrics" class="card-text">${data}</p>
            </div>
        </div>
        `)
    })
    .fail(err => {
        Swal.fire({
            position: 'top end',
            type: 'error',
            title: 'Lyrics not found!',
            showConfirmButton: false,
            timer: 2000
        })
        // Swal('Sorry', 'Lyrics not found')
        // console.log(err, 'masuk erorrorosdjj' )
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

function selectMusic(index){
    getLyrics( $( `#musicList` ).val() )
    getPicture( $( `#musicList` ).val() );
    makeMusicPlayer( $( `#musicList` ).val());
}

function appendMusic(index, data){

    for(let i = 0; i < data.length; i++){
        $( `#musicList` ).append( `<option id=pickSong value="${data[i].title}">${data[i].title}</option>` );
    }
    getPicture( $( '#musicList' ).val() );
    makeMusicPlayer( $( '#musicList' ).val());
}

function makeMusicPlayer(title, data){
    $( '#music-player' ).remove();
    // console.log(data, 'ini data makemusic=============', songDatabase)
    const thisSong = songDatabase.filter(song => (song.title === title))
    // console.log(thisSong, 'ini song', title)
    $( '#musicBox' ).append( `<audio id="music-player" controls style="background-color:white; border-radius: 10px">
        <source src="${thisSong[0].preview}" type="audio/mpeg">
        Your browser does not support the audio element.
        </audio>` )
}

function getPicture( title ){
    // $( '#thisPicture' ).remove();
    const thisSong = tracks.filter( song => ( song.title === title ) )
    // $( '#thisPicture' ).append( `<img src="${thisSong[0].album.cover_medium}" height=100px alt="Music Cover Picture">` )
    // $( '#thisPicture' ).append(`<h4></h4>`)
    // $( '#thisPicture' ).append(`artist: ${thisSong[0].artist.name}<br>`)
    // $( '#thisPicture' ).append(`album: ${thisSong[0].album.title}<br> `)
    // $( '#thisPicture' ).append(`rank: ${thisSong[0].rank} `)
}



function getMusicHistory(){
}

function searchSong () {
    songDetail()
}

