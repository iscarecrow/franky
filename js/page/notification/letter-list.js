var React  = require('react');

var $ = require('jquery');

var Gmdt = require('../../comm/pack');

// 是否存在下一页
var isPageNext = false;
// 是否存在上一页
var isPagePrev = false;

// 下一页，开始
var pageNext = 0;

var limit = 20;

var LetterPager = React.createClass({
  render: function() {
    var domPrev = '';
    var domNext = '';
    var nextHref = '/notification/#/letters/' + (pageNext/limit + 1);
    var prevHref = '/notification/#/letters/' + (pageNext/limit - 1);
    if (isPagePrev) {
      domPrev = <a className="pg-pager-prev" href={prevHref}>上一页</a>;
    }
    if (isPageNext) {
      domNext = <a className="pg-pager-next" href={nextHref}>下一页</a>;
    }
    if (isPagePrev && isPageNext) {
      var domPageStyle = {
        width: '200px'
      }
    } else {
      var domPageStyle = {
        width: '78px'
      }
    }
    
    return (
      <div className="letterPager">
        <div className="pg-message-pager" style={domPageStyle}>
          <span>{domPrev}</span>
          <span>{domNext}</span>
        </div>
      </div>
    );
  }
});


var LetterList = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadFromServer: function(id) {
    var _start = limit * (id - 1);
    var _data = {
      limit: limit,
      start: _start
    }
    $.ajax({
      url: '/napi/letter/list/',
      type: "GET",
      data: _data,
      success: function(jsn) {
        var nowPage = parseInt(jsn.data.next_start/limit);
        $.each(jsn.data.object_list, function(index, elem){
          elem.participant.avatar = Gmdt.dtImageTrans(elem.participant.avatar,true,48,48,'c');
          elem.letter_href = '#/letter/' + elem.id + '?pageId=' + nowPage;
          elem.people_href = '/people/'+ elem.participant.id +'/';
        });

        isPageNext = jsn.data.more === 1 ? true : false;
        isPagePrev = (parseInt(jsn.data.next_start - limit*2 ) >= 0 ) ? true : false;
        pageNext = jsn.data.next_start;
        this.setState({data: jsn.data.object_list});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    var _id = this.props.routeParams.pageId;    
    this.loadFromServer(_id);
    // 私信删能
    // var $D = $(document);
    // $D.on('click','.pg-people-name',this.deleteThread);
  },
  componentWillReceiveProps: function(nextProps) {
    var _id = parseInt(nextProps.routeParams.pageId);
    this.loadFromServer(_id);
  },
  deleteThread: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  render: function() {
    // 回到顶部
    Gmdt.scrollToAnchor('letter-anchor',160);

    var letterLists = this.state.data.map(function (letter){
      // 私信类型 && 脏数据 last_letter丢失
      var messageType = letter.last_letter !== undefined ? letter.last_letter.message_type : '';
      var domType = 'pg-type-' + messageType;
      var imgRight;
      switch (messageType) {
        // 分享文本
        case 'text':
          imgRight = '';
          return (
            <a href={letter.letter_href} data-type={messageType} className={domType}>
              <li className="clr">
                <div className="pg-people-avatar">
                  <img src={letter.participant.avatar} className="pg-people-image" data-pdetail={letter.people_href} />
                </div>
                <div className="pg-people-info clr">
                  <p className="pg-people-name">{letter.participant.username}</p> 
                  <p className="pg-people-msg">{letter.last_letter.msg}</p>
                  {imgRight}
                </div>
              </li>
            </a>
          );
          
          break;
        // 分享图片
        case 'share_blog':
      
          if (letter.last_letter.blog !== undefined) {
            var photo= Gmdt.dtImageTrans(letter.last_letter.blog.photo.path,true,48,48,'c');
            imgRight = <img className="pg-opeople-image" src={photo} />;
            return (
              <a href={letter.letter_href} data-type={messageType} className={domType}>
                <li className="clr">
                  <div className="pg-people-avatar">
                    <img src={letter.participant.avatar} className="pg-people-image" data-pdetail={letter.people_href} />
                  </div>
                  <div className="pg-people-info clr">
                    <p className="pg-people-name">{letter.participant.username}</p> 
                    <p className="pg-people-msg">{letter.last_letter.msg}</p>
                    {imgRight}
                  </div>
                </li>
              </a>
            );
          }
          break;
        // 分享专辑
        case 'share_album':
          if (letter.last_letter.album !== undefined) {
            var covers = Gmdt.dtImageTrans(letter.last_letter.album.covers[0],true,48,48,'c');
            imgRight = <img className="pg-opeople-image" src={covers}/>;
            return (
              <a href={letter.letter_href} data-type={messageType} className={domType}>
                <li className="clr">
                  <div className="pg-people-avatar">
                    <img src={letter.participant.avatar} className="pg-people-image" data-pdetail={letter.people_href} />
                  </div>
                  <div className="pg-people-info clr">
                    <p className="pg-people-name">{letter.participant.username}</p> 
                    <p className="pg-people-msg">{letter.last_letter.msg}</p>
                    {imgRight}
                  </div>
                </li>
              </a>
            );
          }
          
          break;
        // 分享banner
        case 'banner':
          if (letter.last_letter.banner !== undefined) {
            imgRight = <img className="pg-opeople-image" src={letter.last_letter.banner.image_url} />;
            return (
              <a href={letter.letter_href} data-type={messageType} className={domType}>
                <li className="clr">
                  <div className="pg-people-avatar">
                    <img src={letter.participant.avatar} className="pg-people-image" data-pdetail={letter.people_href} />
                  </div>
                  <div className="pg-people-info clr">
                    <p className="pg-people-name">{letter.participant.username}</p> 
                    <p className="pg-people-msg">{letter.last_letter.msg}</p>
                    {imgRight}
                  </div>
                </li>
              </a>
            );
          }
          break;
        // 共建专辑
        case 'co_album_invitation':
          imgRight = '';
          break;
      }
    });

    return (
      <div className="letterList">
        <div className="pg-main-l-content">
          <a name="letter-anchor"></a>
          <ul id="pg-letter" classNameg="pg-letter">
            {letterLists}
          </ul>
        </div>
        <LetterPager />
      </div>
    )
  }
});

module.exports = LetterList;