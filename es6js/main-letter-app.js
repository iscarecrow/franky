/* @jsx React.DOM */

import React from 'react'
import { Router, Route, Link } from 'react-router'

// 私信详情
import LetterApp from './page/notification/letter-app'

import LetterList from './page/notification/letter-list'

const mountNode = document.getElementById("pg-lr-content");

React.render((
  <Router path="/">
    <Route path="/letters/:pageId" component={LetterList}/>
    <Route path="/letter/:id" component={LetterApp}/>
  </Router>
), mountNode);