import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';
import * as actions from '../actions';

const Dashboard = () => <div>Dashboard</div>;
const Landing = () => <div>Landing</div>;
const SurveyNew = () => <div>Survey New</div>;

class App extends Component {
    componentDidMount() {
      this.props.fetchUser();
    }
    render(){
        return(
            <div>
                <BrowserRouter>
                    <div>
                        <Header/>
                        <Route exact path="/" component={Landing}/>
                        <Route exact path="/surveys" component={Dashboard}/>
                        <Route exact path="/surveys/new" component={SurveyNew}/>
                    </div>
        
                </BrowserRouter>
            </div>
        )
    }
};


export default connect(null, actions)(App);