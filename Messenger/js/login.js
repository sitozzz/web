$(function () {

    Parse.$ = jQuery;
    Parse.initialize(
        "pS2OMrZoPr7Z0Dg3JNiBEt26W7sUffOAlXkcaUnP",
        "mPoO6vFBsXqk9ysMy4Hycvz94WPPf3klnc7NUfs3"
    );
    Parse.serverURL = 'https://pg-app-jns12nd4yd1x33wca2iqz5cys7u4se.scalabl.cloud/1/';
//------------FB--------------------------------
    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);

        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            loginWithFB();
        } else {
            // The person is not logged into your app or we are unable to tell.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
        }
    }


    function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId: '223774685043264',
            cookie: true, // enable cookies to allow the server to access 
            // the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.8' // use graph api version 2.8
        });
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });

    };

    // Load the SDK asynchronously
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    function loginWithFB() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);    
            var new_fb_name = response.name;
            new_fb_name = new_fb_name.replace(/ /g, '_');        
            let User = Parse.Object.extend('User');
            let userQuery = new Parse.Query(User);
            userQuery.equalTo('username', new_fb_name);
            
            console.log(new_fb_name);
            userQuery.find({
                success: function (usr) {
                    //Если не найден, регистрируем
                    if (usr.length == 0) {
                        let Users = Parse.Object.extend('User');
                        let new_user = new Users();
                        
                        
                        console.log('name'+new_fb_name);
                        new_user.set('username', new_fb_name);
                        new_user.set('password', new_fb_name + 'pswd-fb-login');
                        new_user.save(null, {
                            success: function (user) {
                                console.log('Registration with Fb success');
                                window.location.href = 'main.html';
                            },

                            error: function (user, error) {
                                console.log('Registr with Fb FAILED');
                                console.log(error);
                            }
                        });
                    } else {
                        Parse.User.logIn(new_fb_name,  new_fb_name + 'pswd-fb-login',{
                            success: function (user) {
                                window.location.href = 'main.html';
                            },

                            error: function (user, error) {
                                console.log(user);
                                console.log("ERROR WITH LOGIN");
                                console.log(error);

                            }
                        });
                    }
                }
            });

            document.getElementById('status').innerHTML =
                'Thanks for logging in, ' + response.name + '!';
        });
    }
//------------FB--------------------------------

    document.getElementById("register").onclick = function () {
        var username = document.getElementById("usr").value;
        var pass = document.getElementById("pass").value;

        var Users = Parse.Object.extend("User");
        var user = new Users();
        user.set("username", username);
        user.set("password", pass);
        user.save(null, {
            success: function (user) {
                alert("Успешная регистрация");
            },
            error: function (user, error) {
                alert("Такой пользователь уже существует");
            }
        });
    }
    $('.form-signin').on('submit', function (e) {

        e.preventDefault();

        var data = $(this).serializeArray(),
            username = data[0].value,
            password = data[1].value;

        Parse.User.logIn(username, password, {

            success: function (user) {
                window.location.href = "main.html";

            },
            error: function (user, error) {
                console.log(error);
            }
        });
    });
});