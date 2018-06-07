$(function () {
    Parse.$ = jQuery;
    Parse.initialize(
        "pS2OMrZoPr7Z0Dg3JNiBEt26W7sUffOAlXkcaUnP",
        "mPoO6vFBsXqk9ysMy4Hycvz94WPPf3klnc7NUfs3"
    );
    Parse.serverURL = 'https://pg-app-jns12nd4yd1x33wca2iqz5cys7u4se.scalabl.cloud/1/';

    document.getElementById("back").onclick = function () {
        delete_cookie('ToUser');
        window.location.href = "main.html";
    }
    var msgBuffer = 0;

    function parseUrlQuery() {
        var data = {};
        if (location.search) {
            var pair = (location.search.substr(1)).split('&');
            for (var i = 0; i < pair.length; i++) {
                var param = pair[i].split('=');
                data[param[0]] = atob(param[1]);
            }
        }
        return data;
    }

    //Удаление cookie
    function delete_cookie(cookie_name) {
        var cookie_date = new Date(); // Текущая дата и время
        cookie_date.setTime(cookie_date.getTime() - 1);
        document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
    }

    //Получение cookie
    function get_cookie(cookie_name) {
        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results){
            console.log(unescape(results[2]));
            return (unescape(results[2]));
        }
        else
            return null;
    }
    //Достаем имя получателя из cookie
    toUser = get_cookie('ToUser');//parseUrlQuery()['ToUser'];
    console.log('touser = ' + toUser);
    document.getElementById("chatwith").innerText = toUser;
    sender = Parse.User.current().get("username");

    //Отправка нового сообщения
    document.getElementById("send_msg").onclick = function () {
        var text = document.getElementById("message").value;
        if (text != "") {
            //Отправка
            var Chat = Parse.Object.extend("Chat");
            var new_message = new Chat();
            //Загрузка файла
            var fileUploadControl = $("#profilePhotoFileUpload")[0];
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var filename = new Date().getDate();
                var name = 'file_' + filename + '.jpg';

                var parseFile = new Parse.File(name, file);
                new_message.set('File', parseFile);
                console.log('file loaded');
            }
            new_message.set('UserName', sender);
            new_message.set('ToUser', toUser);
            new_message.set('Messages', text);
            new_message.save();
            //Чистим поля
            document.getElementById("profilePhotoFileUpload").value = "";
            document.getElementById("message").value = "";
        } else {
            alert("Сообщение не может быть пустым!");
        }
    }

    function interval() {
        setInterval(function () {
            console.log('interval working')
            var Chat = Parse.Object.extend("Chat");
            var query = new Parse.Query(Chat);
            query.containedIn('UserName', [sender, toUser]);
            query.containedIn('ToUser', [sender, toUser]);


            var articleDiv = document.querySelector("ul.shoutbox-content");

            query.find({
                success: function (msg) {


                    if (msg.length != msgBuffer) {
                        console.log("msg.length" + msg.length)

                        for (let i = msgBuffer; i < msg.length; i++) {
                            var text = msg[i].get('Messages');
                            var author = msg[i].get('UserName');
                            var date = msg[i].get('createdAt');
                            var file = msg[i].get('File');
                            var p = document.createElement("p");
                            p.className = "shoutbox-comment";

                            var li = document.createElement("li");
                            var span = document.createElement("span")
                            span.className = "shoutbox-username";
                            li.className = "liClass";
                            li.onclick = function () {
                                console.log("clisdfck li");
                                //Доделать ответ по клику
                                //window.location.href = "chat.html?ToUser=" + msg[i].get("ToUser");
                            }
                            var liText = document.createTextNode(author);
                            span.appendChild(liText);
                            var br = document.createElement("br");
                            var pText = document.createTextNode(text);
                            p.appendChild(pText);

                            var spanDate = document.createElement("span");
                            spanDate.className = "shoutbox-comment-ago";
                            var dateText = document.createTextNode(date);
                            spanDate.appendChild(dateText);

                            li.appendChild(span);
                            li.appendChild(p);
                            li.appendChild(spanDate);
                            li.appendChild(br)
                            var filePlace = document.createElement("img");
                            if (file != undefined) {
                                filePlace.src = file.url();
                                filePlace.style.height = "68px";
                                filePlace.style.width = "68px";

                                li.appendChild(filePlace);
                                filePlace.onclick = function () {
                                    var file = msg[i].get('File');
                                    console.log(file);
                                    document.getElementById('bigger_image').src = file.url();
                                    document.getElementById('win').removeAttribute('style');
                                }

                            }
                            articleDiv.appendChild(li);
                        }
                        msgBuffer = msg.length;
                    }
                    //console.log(array.length);
                }
            })
        }, 1500);
    }

    function getAllChats() {
        var Chat = Parse.Object.extend("Chat");
        //Основной элемент для заполнения
        var articleDiv = document.querySelector("ul.shoutbox-content");

        var Chat = Parse.Object.extend("Chat");
        var query = new Parse.Query(Chat);
        query.containedIn('UserName', [sender, toUser]);
        query.containedIn('ToUser', [toUser, sender]);
        query.find({
            success: function (msg) {
                if (msg.length == 0) {
                    //Создаем новый диалог

                    var new_chat = new Chat();
                    new_chat.set("UserName", sender);
                    new_chat.set("ToUser", toUser);
                    new_chat.set("Messages", 'Hi there!');
                    new_chat.save(null, {
                        success: function (user) {
                            console.log("Success");
                        },
                        error: function (user, error) {
                            console.log("Error");
                        }
                    });

                } else {
                    console.log('msg length = ' + msg.length);
                    //var array = msg[0].get("Messages");
                    msgBuffer = msg.length;
                    for (let i = 0; i < msg.length; i++) {
                        var text = msg[i].get('Messages');
                        var author = msg[i].get('UserName');
                        var date = msg[i].get('createdAt');
                        var file = msg[i].get('File');

                        var p = document.createElement("p");
                        p.className = "shoutbox-comment";

                        var li = document.createElement("li");
                        var span = document.createElement("span")
                        span.className = "shoutbox-username";
                        li.className = "liClass";
                        li.onclick = function () {
                            console.log("click li");
                            //Доделать ответ по клику
                            //window.location.href = "chat.html?ToUser=" + msg[i].get("ToUser");
                        }
                        var liText = document.createTextNode(author);
                        span.appendChild(liText);
                        var pText = document.createTextNode(text);
                        p.appendChild(pText);
                        var br = document.createElement("br");
                        var spanDate = document.createElement("span");
                        spanDate.className = "shoutbox-comment-ago";
                        var dateText = document.createTextNode(date);
                        spanDate.appendChild(dateText);

                        li.appendChild(span);
                        li.appendChild(p);
                        li.appendChild(spanDate);
                        li.appendChild(br)

                        var filePlace = document.createElement("img");
                        if (file != undefined) {
                            filePlace.src = file.url();
                            filePlace.style.height = "68px";
                            filePlace.style.width = "68px";

                            li.appendChild(filePlace);
                            filePlace.onclick = function () {
                                var file = msg[i].get('File');
                                console.log(file);
                                document.getElementById('bigger_image').src = file.url();
                                document.getElementById('win').removeAttribute('style');
                            }

                        }

                        articleDiv.appendChild(li);
                    }
                }
            }
        });
    }
    //Получаем историю сообщений
    getAllChats();
    interval();
});