var $ = require('jquery');

var Gmdt = {
  gaq: function(trc) {
    // 新增堆糖内部打点 kibana
    new Image().src = "http://da.dtxn.net/da.gif?kibana="+trc + uidparam +"&url="+encodeURIComponent(window.location.hostname+window.location.pathname);
    typeof _gaq != "undefined" && _gaq && _gaq.push(['_trackPageview', trc]);
  },
  dtImageTrans : function(url,t,w,h,c){
    var pathn = $.trim(url).replace(/^http(s)?:\/\//ig,'');
        pathn = pathn.split('/');
    var domain = pathn[0];
        pathn = pathn[1];

    // 只有堆糖域名下 uploads misc 目录下的图片可以缩略
    if( domain.indexOf('duitang.com') == -1 || !pathn || pathn != 'uploads' && pathn != 'misc' ){
      return url;
    }
    if(t){
      w = w || 0;
      h = h || 0;
      c = c ? '_'+c : '';
      return Gmdt.dtImageTrans(url).replace(/(\.[a-z_]+)$/ig,'.thumb.'+w+'_'+h+c+'$1');
    }else{
      return url.replace(/(?:\.thumb\.\w+|\.[a-z]+!\w+)(\.[a-z_]+)$/ig,'$1');
    }
  },
  /*
  描述：平滑scroll 到指定的 anchor
  参数：
  dom - <a name="xxxxx-anchor"></a>
  anchor   - (Str)  anchor对应的 name 值
  diff     - (Num)  位置修正，一般为正值
  调用方法:
  scrollToAnchor('xxxx-anchor',60)
  */
  scrollToAnchor : function (anchor,diff){
        
    var $W = $(window),
        $body = $('body,html'),
        $tohsh = $('a[name='+anchor+']');
        diff = diff || 0;

    // 分页内容容器置空，先置空内容再做 anchor 定位
    if( anchor && $tohsh.length ){
      // 此处由于导航设置fix 跟随，需要额外减去70 的高度
      var at = $tohsh.offset().top - diff || 0;
      $body.animate({scrollTop:at},200);
    }else{
      // 除了ie6 其它浏览器不要设置默认回顶部，会造成切换时页面跳动
      // 这里用到了 ActiveXObject 和 XMLHttpRequest 对象来区分 ie6
      if( !!window.ActiveXObject && !window.XMLHttpRequest ){
        // $body.animate({scrollTop:at},200);
      }
    }
  },
};

module.exports = Gmdt;