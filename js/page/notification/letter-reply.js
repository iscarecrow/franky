var React  = require('react');

var $ = require('jquery');

var Gmdt = require('../../comm/pack');

// require('../../part/autogrow');

$.fn.autogrow = function(options) {
 this.filter('textarea').each(function() {
   this.timeoutId = null;
   var $t = $(this),
     minHeight = $t.height();
   var shadow = $('<div></div>').css({
     position: 'absolute',
     wordWrap: 'break-word',
     top: 0,
     left: -9999,
     display: 'none',
     width: $t.width(),
     fontSize: $t.css('fontSize'),
     fontFamily: $t.css('fontFamily'),
     lineHeight: $t.css('lineHeight')
   }).appendTo(document.body);
   var update = function() {
     var val = this.value.replace(/</g, '<')
       .replace(/>/g, '>')
       .replace(/&/g, '&')
       .replace(/\n$/, '<br/>&nbsp;')
       .replace(/\n/g, '<br/>')
       .replace(/ {2,}/g, function(space) {
         return times('&nbsp;', space.length - 1) + ' '
       });
     shadow.html(val);

     $(this).css('overflow', 'hidden').css('height', Math.max(shadow.height() + (parseInt($t.css('lineHeight')) || 0), minHeight));
     $('#msg-reply').css('height', ($(this).height() + 42) < 100 ? 100 : $(this).height() + 42);

   };

   var updateTimeout = function() {
     clearTimeout(this.timeoutId);
     var that = this;
     this.timeoutId = setTimeout(function() {
       update.apply(that);
     }, 100);
   };

   $(this).change(update).keyup(updateTimeout).keydown(updateTimeout);
   update.apply(this);
 });
 return this;
};

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

function getHash() {
  var opts = window.location.hash.split('?')[1].split('&');
  var _params = {};
  for (var i=0; i<opts.length; i++){
    _params[opts[i].split('=')[0]] = opts[i].split('=')[1];
  }
  return _params;
}

var LetterReply = React.createClass({
  getInitialState: function() {
    return {data: {object_list:[],thread:{participant:{}}}};
  },
  loadFromServer: function(threadId) {
    var data = {thread_id: threadId};
    $.ajax({
      url: '/napi/letter/detail/',
      type: "GET",
      data: data,
      success: function(jsn) {

        jsn.data.thread.participant.avatar = Gmdt.dtImageTrans(jsn.data.thread.participant.avatar,true,48,48,'c');
        this.setState({data: jsn.data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadFromServer(this.props.routeParams.id);
    $('#txa-message').autogrow();
    // 左侧私信dom
    var $leftSixin = $('.pg-ll-nav').eq(2);
    var _params = getHash();
    var _pageId = _params.pageId || 1;
    var LetterListHref = '/notification/#/letters/' + _pageId;
    $leftSixin.attr({'href':LetterListHref});
  },
  sendMail: function(e) {
    e.preventDefault();
    var $form = $('#send-mail'),
        $abtn = $form.find('.abtn'),
        $btn = $abtn.find('[type=submit]');
    if ($abtn.hasClass('abtn-no')) return;

    $abtn.addClass('abtn-no');

    $.ajax({
      url: '/napi/letter/create/',
      data: $form.serializeObject(),
      type: "POST",
      success: function(jsn, h) {
        if (jsn.status === 1) {
          var data = jsn.data;
          var $pmlt = $('.letterDetail');
          var txt_val = $('#txa-message').val().replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>').replace(/ {2,}/g, function(space) {
              return times('&nbsp;', space.length - 1) + ' '});
          var newmessage = '<div class="pg-main-letter"><div class="pg-people-avatar"><img src="' + data.sender.avatar + '" alt="" class="pg-people-image"></div><div class="pg-detail-people-info clr"><p class="pg-people-name">' + data.sender.username + '<span class="pg-uptime"> ' + data.add_datetime + '</span></p><p class="pg-people-msg">' + txt_val + '</p></div></div>';
          $pmlt.prepend(newmessage);
          $('#txa-message').val('');
        } else {
          alert(jsn.message);
        }
      }
    }).always(function() {
      //防止duplicate 提交将提交按钮重置
      $abtn.removeClass('abtn-no');
    });
  },
  // componentWillReceiveProps: function() {
  //   this.loadFromServer(this.props.routeParams.id);
  // },
  render: function() {
    var thread = this.state.data.thread;
    var _params = getHash();
    var _pageId = _params.pageId || 1;
    var LetterListHref = '/notification/#/letters/' + _pageId;
    return (
      <div className="pg-main-l-talk">
        <div className="pg-main-l-title">
          <p className="l">与 <span className="pg-pticiptname">{thread.participant.username}</span> 的私信</p>
          <a href={LetterListHref} className="pg-back r">返回私信列表</a>
        </div>
        <div className="pg-main-letter">
          <div className="pg-people-avatar">
            <img src={thread.participant.avatar} alt="" className="pg-people-image"/>
          </div>
          <div className="pg-t-msg-text clr">
            <form id="send-mail"  method="post" action="/napi/letter/create/" onsubmit="return false;">
              <input type="hidden" name="action" value="sendmsg"/>
              <input type="hidden" name="name" value={thread.participant.username}/>
              <label className="dn" for="txa-reply">发送</label>
              <textarea id="txa-message" name="msg" className="msg-txa"></textarea>
              <div className="msg-subtn">
                <a className="abtn msg-up" target="_self" href="javascript:;">
                  <button type="submit" onClick={this.sendMail}>
                    <u>发送</u>
                  </button>
                </a>
              </div>
              <input type="hidden" id="pg-Mess-toid" name="user_id" value={thread.participant.id} />
            </form>
          </div>
        </div>
      </div> 
    );
  } 
});

module.exports = LetterReply;