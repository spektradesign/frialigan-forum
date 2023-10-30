/* Google webfont loader */
WebFontConfig = {
  google: { families: [ 'Roboto:400,500,400italic,300,700:latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  //s.parentNode.insertBefore(wf, s);
})();

//Put your custom javascript here
//This is executed after other scripts
