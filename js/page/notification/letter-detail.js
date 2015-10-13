var React  = require('react');

var $ = require('jquery');

var Gmdt = require('../../comm/pack');

var LetterDetail = React.createClass({
  getInitialState: function() {
    return {data: {object_list:[],thread:{}}};
  },
  loadFromServer: function(threadId) {
    var data = {thread_id: threadId};
    $.ajax({
      url: '/napi/letter/detail/',
      type: "GET",
      data: data,
      success: function(jsn) {
        this.setState({data: jsn.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadFromServer(this.props.routeParams.id);
  },
  // componentWillReceiveProps: function() {
  //   this.loadFromServer(this.props.routeParams.id);
  // },
  render: function() {
    var thread = this.state.data.thread;
    var letterDetail = this.state.data.object_list.map(function (letter){
      letter.sender.avatar = Gmdt.dtImageTrans(letter.sender.avatar,true,48,48,'c');
      // 参与者链接
      var participant_href = '/people/' + thread.participant.id+'/';
      var messageType = letter.message_type || '';
      // console.log(messageType);
      // 私信类型
      switch (messageType) {
        // 分享文本
        case 'text':
          return (
            <div className="pg-main-letter">
              <div className="pg-people-avatar">
                <a href={participant_href} target="_blank">
                  <img src={letter.sender.avatar} className="pg-people-image"/>
                </a>
              </div>
              <div className="pg-detail-people-info clr">
                <p className="pg-people-name">
                  <a href={participant_href} target="_blank">{letter.sender.username}</a>
                  <span className="pg-uptime"> · {letter.add_datetime}</span>
                </p>
                <p className="pg-people-msg">{letter.msg}</p>
              </div>
            </div>
          )
          break;
        // 分享图片
        case 'share_blog':
          // blog链接
          if (letter.blog !== undefined) {
            var blog_href = '/people/mblog/'+ letter.blog.id +'/detail/';
            // blog高度 和 宽度
            var blog_width = letter.blog.photo.width;
            var blog_height = letter.blog.photo.height;
            var blog_path = Gmdt.dtImageTrans(letter.blog.photo.path,true,224);
            var height = Math.floor(blog_height*224/blog_width) -2;
            var coverStyle= {
              height: height + 'px'
            } 
            return (
              <div className="pg-main-letter">
                <div className="pg-people-avatar">
                  <a href={participant_href} target="_blank">
                    <img className="pg-people-image" src={letter.sender.avatar} />
                  </a>
                </div>
                <div className="pg-detail-people-info clr">
                  <p className="pg-people-name">
                    <a href={participant_href} target="_blank">{letter.sender.username}</a>
                    <span className="pg-uptime"> · {letter.add_datetime}</span>
                  </p>
                  <p className="pg-people-msg">{letter.msg}</p>
                  <div className="pg-people-send">
                    <div className="pg-people-sendpic">
                      <img src={blog_path}/>
                      <a href={blog_href} className="pg-people-send-cover" style={coverStyle} target="_blank" target="_blank"></a>
                    </div>
                    <div className="pg-people-sendmsg">
                      <div className="pg-sendmsg-inner">
                        <p>{letter.blog.msg}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          
          break;
        // 分享专辑
        case 'share_album':
          if (letter.album !== undefined) {
            // album链接
            var album_href = '/album/' + letter.album.id +'/';
            // album拥有者链接
            var user_href = '/people/' + letter.album.user.id +'/';
            var covers = Gmdt.dtImageTrans(letter.album.covers[0],true,224,224,'c');
            return (
              <div className="pg-main-letter">
                <div className="pg-people-avatar">
                  <a href={participant_href} target="_blank">
                    <img src={letter.sender.avatar} className="pg-people-image"/>
                  </a>
                </div>
                <div className="pg-detail-people-info clr">
                  <p className="pg-people-name">
                    <a href={participant_href} target="_blank">{letter.sender.username}</a>
                    <span className="pg-uptime"> · {letter.add_datetime}</span>
                  </p>
                  <p className="pg-people-msg">{letter.msg}</p>
                  <div className="pg-people-send">
                    <div className="pg-album-sendpic">
                      <img src={covers}/>
                      <a href={album_href} className="pg-album-send-cover" target="_blank"></a>
                    </div>
                    <div className="pg-album-sendmsg">
                      <div className="pg-album-sendmsg-inner">
                        <a href={album_href} className="pg-album-name" target="_blank">{letter.album.name}</a>
                        <div className="pg-album-attr">
                          <p>by 
                            <a href={user_href} className="pg-album-user" target="_blank">{letter.album.user.username}</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="section-bottom-a"></div>
                    <div className="section-bottom-b"></div>
                  </div>
                </div>
              </div>
            );
          }
          
          break;
        // 分享banner
        case 'banner':
          if (letter.banner !== undefined) {
            var image_url = Gmdt.dtImageTrans(letter.banner.image_url,true,400) || '';
            return(
              <div className="pg-main-letter">
                <div className="pg-people-avatar">
                  <a href={participant_href} target="_blank">
                    <img src={letter.sender.avatar} className="pg-people-image"/>
                  </a>
                </div>
                <div className="pg-detail-people-info clr">
                  <p className="pg-people-name">
                    <a href={participant_href} target="_blank">{letter.sender.username}</a>
                    <span className="pg-uptime"> · {letter.add_datetime}</span>
                  </p>
                  <p className="pg-people-msg">{letter.msg}</p>
                  <div className="pg-banner-send">
                    <div className="pg-banner-sendpic">
                      <img src={image_url}/>
                      <a href={letter.banner.target} className="pg-banner-send-cover" target="_blank"></a>
                    </div>
                    <div className="pg-banner-sendmsg">
                      <div className="pg-banner-sendmsg-inner">
                        <p>{letter.banner.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          break;
        // 共建专辑
        case 'co_album_invitation':
          
          break;
      }
    });

    return (
      <div className="letterDetail">
        {letterDetail}
      </div>
    )
  }
});


module.exports = LetterDetail;