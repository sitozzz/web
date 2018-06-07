$(function() {
 
    Parse.$ = jQuery;
    Parse.initialize(
      "pS2OMrZoPr7Z0Dg3JNiBEt26W7sUffOAlXkcaUnP",
      "mPoO6vFBsXqk9ysMy4Hycvz94WPPf3klnc7NUfs3"
    );
  Parse.serverURL = 'https://pg-app-jns12nd4yd1x33wca2iqz5cys7u4se.scalabl.cloud/1/';
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
    testObject.save({foo: "bar"}).then(function(object) {
      alert("yay! it worked");
    });
 
});