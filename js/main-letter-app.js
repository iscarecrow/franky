/* @jsx React.DOM */


var React  = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

// 私信详情
var LetterApp =  require('./page/notification/letter-app');

// 私信列表
var LetterList = require('./page/notification/letter-list');

var mountNode = document.getElementById("pg-lr-content");

React.render((
  <Router path="/">
    <Route path="/letters/:pageId" component={LetterList}/>
    <Route path="/letter/:id" component={LetterApp}/>
  </Router>
), mountNode);