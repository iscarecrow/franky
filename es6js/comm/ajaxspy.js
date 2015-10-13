var $ = require('jquery');

var Gmdt = require('../../comm/pack');

/*
@说明：全站ajax 请求情况监控，用于统计失败请求次数
@作者：balibell
@时间：2013-05-28
*/

$.ajaxSetup({
  type : 'POST',
  timeout : 20000,
  /*
  @说明： wrongmsg 使用了 SUGAR 类，该方法只适用web 端
  */
  wrongmsg : function (jsn){
    var wrongmsg = $.trim(mergeServerMessage(jsn.message));
    if( wrongmsg && SUGAR ){
      SUGAR.PopOut.alert('<div class="prompt prompt-fail"><h3>'+wrongmsg+'</h3></div>');
      $({}).delay(4000).queue(function (){
        SUGAR.PopOut.closeMask();
      });
    }
  },
  /*
  @说明： errormsg 使用了 SUGAR 类，该方法只适用web 端
  */
  errormsg : function (){
    if( SUGAR ){
      SUGAR.PopOut.alert('<div class="prompt prompt-fail"><h3>网络出问题了，请稍后再试</h3></div>');
      $({}).delay(2000).queue(function (){
        SUGAR.PopOut.closeMask();
      });
    }
  },
  success : function(h,statustext,x){
    // 如果返回内容是 html 则不作处理
    if( $.inArray('html',this.dataTypes) != -1 ){
      return;
    }

    //转json对象
    var jsn = $.isPlainObject(h) ? h : $.parseJSON(h);
    //如果parse 失败，直接返回
    if(!jsn){
      Gmdt.gaq('/_trc/Error/ajax/json_parse_fail_'+this.url);
      return;
    }
    //判断jsn 请求是否成功返回数据
    if( jsn.success || jsn.status == 1 ){
      if( $.isFunction( this.mysuccess ) ){
        this.mysuccess(jsn,h);
      }
    }else{
      // 在 myfailure 里也可以调用 wrongmsg 弹出错误提示
      if( $.isFunction( this.myfailure ) ){
        this.myfailure(jsn,h);
      }else{
        // 默认情况下会弹出错误提示
        this.wrongmsg(jsn);
      }

      var wrongmsg = mergeServerMessage(jsn.message);
      if( wrongmsg ){
        Gmdt.gaq('/_trc/Error/ajax/response_'+wrongmsg+'_'+this.url);
      }
    }
  },
  error : function (x,statustext){
    Gmdt.gaq('/_trc/Error/ajax/status_'+statustext+'_'+(this.url ? this.url : 'null_'+window.location.href));
    if( $.isFunction( this.myerror ) ){
      this.myerror(x,statustext);
    }
  }
});