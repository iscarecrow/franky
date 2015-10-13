var React  = require('react');
var LetterReply = require('./letter-reply');
var LetterDetail = require('./letter-detail');

var LetterApp = React.createClass({
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
    // console.log(this.props);
    // this.loadFromServer(this.props.routeParams.id);
  },
  render: function() {
    return (
      <div className="letterApp">
        <LetterReply routeParams={this.props.params}/>
        <LetterDetail routeParams={this.props.params}/>
      </div>
    )
  }
})

module.exports = LetterApp;