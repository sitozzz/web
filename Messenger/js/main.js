$(function () {

    Parse.$ = jQuery;
    Parse.initialize(
        "pS2OMrZoPr7Z0Dg3JNiBEt26W7sUffOAlXkcaUnP",
        "mPoO6vFBsXqk9ysMy4Hycvz94WPPf3klnc7NUfs3"
    );
    Parse.serverURL = 'https://pg-app-jns12nd4yd1x33wca2iqz5cys7u4se.scalabl.cloud/1/';
    Parse.User.enableUnsafeCurrentUser()
    var currentUser = Parse.User.current();
    if (currentUser) {
        console.log('current');
    } else {
        console.log('not');
    }
    username = Parse.User.current().get("username");
    document.getElementById("username").innerText = username;
    //Текущее количество диалогов
    var dialogCount = 0;
    //Добавление нового диалога
    document.getElementById("search").onclick = function () {
        //console.log("click");
        document.getElementById("search_advice_wrapper").style.visibility = 'visible';
    }

    document.getElementById("search").oninput = function () {

        $("#search_advice_wrapper").html("").show();
        append_advice();
    }

    function append_advice() {
        search_text = document.getElementById("search").value;
        if (search_text.length > 0) {
            var reg = new RegExp(search_text, "i")

            var Users = Parse.Object.extend("User");
            var usrQuery = new Parse.Query(Users);

            usrQuery.find({
                success: function (usr) {
                    for (let i = 0; i < usr.length; i++) {
                        var usrName = usr[i].get("username");
                        if (usrName.match(reg) != null) {
                            $('#search_advice_wrapper').append('<div class="advice_variant">' + usrName + '</div>');
                        }
                    }
                    var elems = document.getElementsByClassName("advice_variant");
                    for (i = 0; i < elems.length; i++) {
                        elems[i].onclick = function () {
                            text = this.innerText;
                            document.getElementById("search").value = text;
                            document.getElementById("search_advice_wrapper").style.visibility = 'hidden';
                            $("#search_advice_wrapper").html("").show();
                        }
                    }
                }
            });
        }
    }
    //Удаление
    function delete_cookie(cookie_name) {
        var cookie_date = new Date(); // Текущая дата и время
        cookie_date.setTime(cookie_date.getTime() - 1);
        document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
    }

    //Установка coolie
    function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
        var cookie_string = name + "=" + escape(value);

        if (exp_y) {
            var expires = new Date(exp_y, exp_m, exp_d);
            cookie_string += "; expires=" + expires.toGMTString();
        }

        if (path)
            cookie_string += "; path=" + escape(path);

        if (domain)
            cookie_string += "; domain=" + escape(domain);

        if (secure)
            cookie_string += "; secure";

        document.cookie = cookie_string;
    }

    document.getElementById("new_chat").onclick = function () {
        var user = document.getElementById("search").value;
        if (user.length != 0) {
            //Предварительно очищаем 
            delete_cookie('ToUser');
            //Сохраняем получателя в cookie
            set_cookie('ToUser', user);
            //Переходим на страницу чата
            window.location.href = "chat.html";//?ToUser=" + user;
            
        } else {
            alert('Это поле не может быть пустым');
        }
    }

    document.getElementById('logout').onclick = logout;

    function logout() {
        window.location.href = "index.html";
        Parse.User.logOut().then(() => {
            var currentUser = Parse.User.current();
        });
    }

    function create_Dialogs(final_dict) {
        var iterator = Object.keys(final_dict);

        var articleDiv = document.querySelector("ul.shoutbox-content");
        articleDiv.innerHTML = "";
        for (let k = 0; k < iterator.length; k++) {
            var p = document.createElement("p");
            p.className = "shoutbox-comment";
            var li = document.createElement("li");
            var span = document.createElement("span")
            span.className = "shoutbox-username";
            li.className = "liClass";
            li.onclick = function () {
                delete_cookie('ToUser');
                set_cookie('ToUser',iterator[k]);
                window.location.href = "chat.html";//?ToUser=" + btoa(iterator[k]);
            }

            var liText = document.createTextNode('Dialog with:    ' + iterator[k]);
            span.appendChild(liText);

            var br = document.createElement("br");
            span.appendChild(br);


            var fromUserText = document.createTextNode(final_dict[iterator[k]][2] + ': ');
            p.appendChild(fromUserText);

            var pText = document.createTextNode(final_dict[iterator[k]][0]);
            p.appendChild(pText);
            var spanDate = document.createElement("span");
            spanDate.className = "shoutbox-comment-ago";
            var options = {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            };

            var tme = final_dict[iterator[k]][1]

            var dateText = document.createTextNode(tme.toLocaleTimeString("en-us", options));

            spanDate.appendChild(dateText);

            li.appendChild(span);
            li.appendChild(p);
            li.appendChild(spanDate);

            articleDiv.appendChild(li);

        }

    }

    var final_dict = {};

    function interval() {
        setInterval(function () {

            var UserName_dict = new Object();
            UserName_dict['test'] = 'test';
            var ToUser_dict = new Object();

            var Chat = Parse.Object.extend("Chat");
            //Основной элемент для заполнения
            var dateQuery = new Parse.Query(Chat);
            dateQuery.equalTo("UserName", username);

            dateQuery.find({

                success: function (UserName1) {
                    UserName_dict = new Object();
                    for (let i = 0; i < UserName1.length; i++) {
                        var arr = [UserName1[i].get('Messages'), UserName1[i].get('createdAt'), UserName1[i].get('UserName')];
                        UserName_dict[UserName1[i].get('ToUser')] = arr;
                    }
                    dateQuery = new Parse.Query(Chat);
                    dateQuery.equalTo("ToUser", username);
                    dateQuery.find({
                        success: function (ToUser) {
                            for (let i = 0; i < ToUser.length; i++) {
                                var arr = [ToUser[i].get('Messages'), ToUser[i].get('createdAt'), ToUser[i].get('UserName')];
                                ToUser_dict[ToUser[i].get('UserName')] = arr;
                            }
                            keys1 = Object.keys(UserName_dict);
                            keys2 = Object.keys(ToUser_dict);
                            if (keys1.length > keys2.length) {
                                for (let i = 0; i < keys1.length; i++) {
                                    var check = false
                                    if (ToUser_dict[keys1[i]] == undefined) {

                                        final_dict[keys1[i]] = UserName_dict[keys1[i]];
                                        check = true;
                                    }
                                    if (check == false && UserName_dict[keys1[i]][1] > ToUser_dict[keys1[i]][1]) {
                                        final_dict[keys1[i]] = UserName_dict[keys1[i]];
                                    } else if (check == false) {
                                        final_dict[keys1[i]] = ToUser_dict[keys1[i]];
                                    }
                                }
                                create_Dialogs(final_dict);
                            } else {
                                for (let i = 0; i < keys2.length; i++) {
                                    var check = false
                                    if (UserName_dict[keys2[i]] == undefined) {
                                        final_dict[keys2[i]] = ToUser_dict[keys2[i]];
                                        check = true;

                                    }

                                    if (check == false && UserName_dict[keys2[i]][1] > ToUser_dict[keys2[i]][1]) {
                                        final_dict[keys2[i]] = UserName_dict[keys2[i]];
                                    } else if (check == false) {
                                        final_dict[keys2[i]] = ToUser_dict[keys2[i]];
                                    }
                                }
                                create_Dialogs(final_dict);

                            }
                        }
                    })
                }
            })
        }, 1500);
    }

    function getAllChats() {
        var Chat = Parse.Object.extend("Chat");
        //Основной элемент для заполнения
        var articleDiv = document.querySelector("ul.shoutbox-content");
        var dateQuery = new Parse.Query(Chat);
        dateQuery.equalTo("UserName", username);
        dateQuery.descending("updatedAt");
        dateQuery.limit(50);
        dateQuery.find({
            success: function (msg) {
                //Запоминаем количество сообщений при загрузке
                dialogCount = msgArray.length;
                var msgArray = msg;
                console.log("len = " + msgArray.length)
                for (let i = 0; i < msg.length; i++) {
                    console.log(msg[i].get("Messages")[msg[i].get("Messages").length - 1]["text"]);

                    var p = document.createElement("p");
                    p.className = "shoutbox-comment";
                    var li = document.createElement("li");
                    var span = document.createElement("span")
                    span.className = "shoutbox-username";
                    li.className = "liClass";
                    li.onclick = function () {
                        console.log("click li");
                        window.location.href = "chat.html?ToUser=" + msg[i].get("ToUser");
                    }
                    var liText = document.createTextNode(msg[i].get("ToUser"));
                    span.appendChild(liText);
                    var pText = document.createTextNode(msg[i].get("Messages")[msg[i].get("Messages").length - 1]["text"]);
                    p.appendChild(pText);

                    var spanDate = document.createElement("span");
                    spanDate.className = "shoutbox-comment-ago";
                    var options = {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    };
                    var dateText = document.createTextNode(msg[i].get("updatedAt").toLocaleTimeString("en-us", options));
                    spanDate.appendChild(dateText);

                    li.appendChild(span);
                    li.appendChild(p);
                    li.appendChild(spanDate);

                    articleDiv.appendChild(li);
                }
            }
        });
    }
    //Получаем список диалогов 1 раз
    getAllChats();
    //Обновляем
    interval();
});