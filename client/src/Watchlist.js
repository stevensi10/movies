import React, { Component } from "react";
import $ from 'jquery';
import queryString from 'query-string'
import Movie, {Row} from "./Movie";

class WatchList extends React.Component {
    constructor(props) {
      super(props);
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var perRow = 6;
      if(w < 576)
        perRow = 2;
      else if(w < 768)
        perRow = 3;
      else if(w < 992)
        perRow = 4;
      this.state = {
          listArray: [],
          perRow: perRow
        };
      this.getMovies = this.getMovies.bind(this);
      this.getMovies();
    }

    getMovies()
    {
        var userID = this.props.userID;
        var self = this;
        fetch('/api/watchlist')
        .then(res => res.json())
        .then(lists => this.setState({listArray: lists}));
    }

    render(){
        var numberRows = (this.state.listArray.length / this.state.perRow);
        const renderRows = this.state.listArray.map((array, index) => {
            if(index < numberRows)
            {
                return (
                        <Row
                        rowNumber = {index}
                        perRow = {this.state.perRow}
                        listArray = {this.state.listArray}
                        watchlistChange = {this.getMovies}
                        />
                    );
            }
          });
        return (
            <div>
                {renderRows}
            </div>
        );
    }
}
export default WatchList;