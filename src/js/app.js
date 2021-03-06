import React from 'react';
import {render} from 'react-dom';
import jQuery from 'jquery';
import _ from 'lodash';
import {Router, Route, Link} from 'react-router';

import Header from './header';
import TweetList from './tweet-list'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      tweets: []
    };
  }
  componentDidMount() {
    this.getTweets();
  }

  getTweets() {
    jQuery.ajax('https://twitterapii.herokuapp.com/users.json?include=tweets')
      .then( response => {
        var tweets = response.included;
        var users = response.data;
        var tweetData = tweets.map(function(tweet){
          return {
            id: tweet.id,
            body: tweet.attributes.body,
            created_at: tweet.attributes.created_at,
            userId: tweet.relationships.user.data.id,
            email: users.filter(function(user) {
              return user.id === tweet.relationships.user.data.id
            })[0].attributes.email
          }
        });
        this.setState({
          hasLoaded: true,
          tweets: tweetData
        });
      });
  }

  render(){
    return(
      <div className="wrapper">
        <Header/>
      <main>
          <TweetList tweets={this.state.tweets}
                     users={this.state.users}
                     hasLoaded={this.state.hasLoaded}/>
      </main>
      </div>
    )
  }
}

let NotFound = () => {
  return (
    <h1>
      404 ERROR: Page not Found!
    </h1>
  )
}

let routes = (
  <Router>
    <Route path='/' component={App}>

    </Route>
    <Route path='*' component={NotFound} />
  </Router>
)

render(
  routes,
  document.getElementById('app')
);

export default App;
