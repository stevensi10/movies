import React, { Component } from "react";
import $ from 'jquery';
import queryString from 'query-string'
import Movie, {Row} from "./Movie";
import InfiniteScroll from 'react-infinite-scroll-component';

class List extends React.Component {
    constructor(props) {
      super(props);
      var values = queryString.parse(this.props.history.location.search);
      this.state = {
          id : values.id,
          listArray: [],
          perRow: 6
        };
      this.getMovies = this.getMovies.bind(this);
      this.getMovies();
    }

    getMovies()
    {
        var self = this;
        fetch('/api/lists-content?id='+this.state.id)
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
export default List;