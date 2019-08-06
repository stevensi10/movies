import React, { Component } from "react";
import $ from 'jquery';
import fancybox from "@fancyapps/fancybox";
import Movie from "./Movie";
import Spinner from 'react-bootstrap/Spinner';
import {Typeahead} from 'react-bootstrap-typeahead';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      searchType: null,
      timer: null,
      timerInterval: 2000,
      suggestions: []
    };
    this.search = this.search.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  search()
  {
    $("#spinner").css("visibility","hidden");
    var searchValue = this.state.search;
    var searchType = this.state.searchType;
    if(this.state.timer != 0)
      this.props.onChange(searchValue,searchType);
  }

  startTimer()
  {
    $("#spinner").css("visibility","visible");
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(this.search, this.state.timerInterval)
    });
  }

  onChange(selected)
  {
    if(typeof selected[0] !== "undefined")
    {
      var value = selected[0].id;
      var type = selected[0].type;
      this.setState({search: value, searchType: type});
      this.startTimer();
    }
  }

  onInputChange(text,event)
  {
    this.setState({search: text, searchType: 'movie'});
    this.getSuggestions(text);
    this.startTimer();
  }

  getSuggestions(value)
  {
    let url = 'https://api.themoviedb.org/3/search/multi?api_key=601b3e84fdc281626e092faf669205b5&language=en-US&query=' + value + '&page=1&include_adult=false';
    fetch(url).then((res) => res.json()).then((data) => 
    {
      var suggestions = [];
      if(data.total_results > 0)
      {
        for(var i = 0; i < data.results.length; i++)
        {
          var id = "";
          var label = "";
          var image_path = "";
          var release_date = "";
          var type = data.results[i].media_type;
          switch(type)
          {
            case 'movie':
                id = data.results[i].title;
                release_date = data.results[i].release_date;
                image_path = data.results[i].poster_path;
                if(image_path != null)
                {
                  image_path = "http://image.tmdb.org/t/p/original" + image_path;
                }
                label = "";
                if(typeof release_date === "undefined")
                {
                  release_date = null;
                  label = id;
      
                }
                else
                {
                  release_date = data.results[i].release_date.substring(0, 4);
                  label = id + ' (' + release_date + ')';
                }
              break;
            case 'person':
                id = data.results[i].name;
                label = id;
                image_path = data.results[i].profile_path;
                if(image_path != null)
                {
                  image_path = "http://image.tmdb.org/t/p/original" + image_path;
                }
              break;
          }
          suggestions[i] = {id: id, label: label, image: image_path, type: type};
        }
      }
      this.setState({suggestions: suggestions});
    });
  }

  render() {
    return (
      <div className="form-group" style={{"width": "95%"}}>
        <Typeahead
          placeholder= "Enter a movie name or a person's name"
          onChange={this.onChange}
          options={this.state.suggestions}
          onInputChange= {this.onInputChange}
          renderMenuItemChildren={(option, props) => (
            <div>
              <img src={option.image}
                style={{height: "60px", width: "40px"}}
              >
              </img>
              &nbsp;&nbsp;
              <span key={option.id}>{option.label}
              </span>
            </div>
          )}
        />
        <div style={{"position": "fixed", "top": "50%", "left": "50%"}}>
            <Spinner id="spinner" animation="border" role="status" style={{"visibility":"hidden"}}>
              <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
      </div>
    );
  }
}

class Genre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: props.id, name: props.name};
  }

  render() {
    var currentGenre = this.props.currentGenre;
    var color = "#007bff";
    var font = "normal"
    if(currentGenre == this.state.id)
    {
      color = "black";
      font = "bold";
    }
    return (
      <a id={this.state.id} href="#/browse"
      onClick = {this.props.onClick}
      style={{'color': color, 'fontWeight': font}}
      >
      {this.state.name}
      </a>
    );
  }
}

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dropdown">
        <button className="btn btn-dark btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.props.sort}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#/browse" id='popularity.desc' name='Popularity'
            onClick={this.props.onClick}
          >Popularity</a>
          <a className="dropdown-item" href="#/browse" id='release_date.desc' name='Release Date'
            onClick={this.props.onClick}
          >Release Date</a>
          <a className="dropdown-item" href="#/browse" id='vote_count.desc' name='Votes Count'
            onClick={this.props.onClick}
          >Vote Count</a>
        </div>
      </div>
    );
  }
}

class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.getCountries();
    this.state = {
      countriesArray : []
    };
  }

  getCountries() 
  {
    let url = 'https://api.themoviedb.org/3/configuration/countries?api_key=601b3e84fdc281626e092faf669205b5';
    this.fetchCountries(url);
  }

  fetchCountries(url) {
    fetch(url).then((res) => res.json()).then((data) => 
    {
      var countriesArray = [];
      for(var i = 0; i < data.length; i++)
      {
        countriesArray[i] = [data[i].iso_3166_1,data[i].english_name];
      }
      this.setState({countriesArray: countriesArray});
    })
  }

  render() {
    const coutriesList = this.state.countriesArray.map(array => {
      return (
        <a className="dropdown-item" 
        href="#" 
        id={array[0]}
        name={array[1]}
        onClick={this.props.onClick}
        >
        {array[1]}
        </a>
      );
    });

    return (
      <div className="dropdown">
        <button className="btn btn-dark btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.props.country}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {coutriesList}
        </div>
      </div>
    );
  }
}

class Year extends React.Component {
  constructor(props) {
    super(props);
    this.state = {year: this.props.year, id: this.props.id};
  }

  render() {
    return (
      <input
      id={this.state.id}
      type="number" 
      className="form-control"
      syle={{width:'10%'}}
      value={this.state.year} 
      onChange={this.props.onChange}
      placeholder={this.props.id}
      />
    );
  }
}

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.getSeen();
    this.getGenres();

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var perRow = 6;
    if(w < 576)
      perRow = 2;
    else if(w < 768)
      perRow = 3;
    else if(w < 992)
      perRow = 4;

    this.state = {
      title: null, 
      results: [], 
      currentPage: 1, 
      perPage: 12, 
      resultsNumber: 0, 
      genre: null, 
      genresArray: [], 
      sort: 'popularity.desc', 
      sortLabel: 'Popularity',
      minYear: null,
      maxYear: null,
      seenArray: [],
      currentDataLoaded: 0,
      searchType: null,
      perRow: perRow
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickGenre = this.handleClickGenre.bind(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.handleClickSort = this.handleClickSort.bind(this);
    this.handleChangeYear = this.handleChangeYear.bind(this);
    this.getSeen = this.getSeen.bind(this);
    this.watchlistChange = this.watchlistChange.bind(this);
  }

  fetchData(url,lowResult,topResult,page) {
    fetch(url).then((res) => res.json()).then((data) => 
    {
      var results = this.state.results;
      var resultsNumber = data.total_results;
      var currentDataLoaded = this.state.currentDataLoaded;
      if(currentDataLoaded >= 12)
        currentDataLoaded = 0;
      if (typeof data.results !== 'undefined') {
        for(var i = 0; i < data.results.length; i++)
        {
          var currentResult = (page - 1)*20 + i;
          if(currentResult >= lowResult && currentResult < topResult)
          {
            results[currentDataLoaded] = data.results[i].id;
            currentDataLoaded++;
          }
        }
      }
      if(resultsNumber <= this.state.perPage)
      {
        results.splice(resultsNumber, results.length);
      }
      this.setState({results: results, resultsNumber: resultsNumber, currentDataLoaded: currentDataLoaded});
    })
  }

  fetchMovies(value,type) 
  {
    var self = this;
    var page = this.state.currentPage;
    var perPage = this.state.perPage;

    var lowResult = (page-1) * perPage;
    var topResult = (page*perPage);

    var lowAPIPage = Math.floor(lowResult/20) + 1;
    var topAPIPage = Math.floor(topResult/20) + 1;

    var pages = [lowAPIPage,topAPIPage];
    pages = pages.filter(function(item, pos) {
        return pages.indexOf(item) == pos;
    })

    var minYear = this.state.minYear;
    if(minYear == null)
      minYear = 0;
    minYear = minYear + '-01-01';
    var maxYear = this.state.maxYear;
    if(maxYear == null)
    {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      maxYear = yyyy + '-' + mm + '-' + dd;
    }
    maxYear = maxYear + '-12-31';
    if(page > 1000)
      page = 1000;
    if(type == 'genre')
    {
      pages.forEach(function(page)
      {
        let url = 'https://api.themoviedb.org/3/discover/movie?api_key=601b3e84fdc281626e092faf669205b5&language=en-US&sort_by='+self.state.sort+'&with_genres=' + value + '&page='+page+'&include_adult=false&primary_release_date.lte=' + maxYear + '&primary_release_date.gte=' + minYear;
        self.fetchData(url,lowResult,topResult,page);
      });
    }
    else if(type == "movie")
    {
      this.setState({currentDataLoaded: 0});
      let url = 'https://api.themoviedb.org/3/search/movie?api_key=601b3e84fdc281626e092faf669205b5&language=en-US&query=' + value + '&page=1&include_adult=false';
      self.fetchData(url,lowResult,topResult,page);
    }
    else if(type == "person")
    {
      this.setState({currentDataLoaded: 0});
      let url = 'https://api.themoviedb.org/3/search/person?api_key=601b3e84fdc281626e092faf669205b5&language=en-US&query=' + value + '&page=1&include_adult=false';
      fetch(url).then((res) => res.json()).then((data) => 
      {
        if(data.total_results > 0)
        {
          var personID = data.results[0].id;
          pages.forEach(function(page)
          {
            let url = 'https://api.themoviedb.org/3/discover/movie?api_key=601b3e84fdc281626e092faf669205b5&language=en-US&sort_by='+self.state.sort+'&with_people=' + personID + '&page='+page+'&include_adult=false&primary_release_date.lte=' + maxYear + '&primary_release_date.gte=' + minYear;
            self.fetchData(url,lowResult,topResult,page);
          });
        }
      });
    }
  }

  handleChange(searchValue,type) {
    this.setState({title: searchValue, genre: null, searchType: type},
    () => {this.afterSetState();}
    );
  }

  handleClick(event) {    
    this.setState({currentPage: Number(event.target.id)},
    () => {this.afterSetState();}
    );
  }

  afterSetState()
  {
    switch(this.state.searchType)
    {
      case 'genre':
        this.fetchMovies(this.state.genre,this.state.searchType);
        break;
      case 'movie':
      case 'person':
        this.fetchMovies(this.state.title,this.state.searchType);
        break;
    }
  }

  handleClickGenre(event) {
    this.setState({genre: event.target.id, currentPage: 1, searchType: 'genre'},
      () => {this.afterSetState();});
  }

  getGenres() 
  {
    let url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=601b3e84fdc281626e092faf669205b5&language=en-US';
    this.fetchGenres(url);
  }

  fetchGenres(url) {
    fetch(url).then((res) => res.json()).then((data) => 
    {
      var genresArray = [];
      for(var i = 0; i < data.genres.length; i++)
      {
        genresArray[i] = [data.genres[i].id,data.genres[i].name];
      }
      this.setState({genresArray: genresArray});
    })
  }

  handleClickSort(event) {
    const value = event.target.id;
    this.setState({sort: value, sortLabel: event.target.name, currentPage: 1},
      () => {this.afterSetState();});
  }

  handleClickCountry(event) {
    const value = event.target.id;
    this.setState({country: value, countryLabel: event.target.name},
      () => {this.afterSetState();});
  }

  handleChangeYear(event) {
    var id = event.target.id;
    var value = event.target.value;
    if(id == "Min")
    {
      this.setState({minYear: value, currentPage: 1},
        () => {this.afterSetState();});
    }
    else if(id == "Max")
    {
      this.setState({maxYear: value, currentPage: 1},
        () => {this.afterSetState();});
    }
  }

  getSeen()
  {
    fetch('/api/seen?id='+this.props.userID)
        .then(res => res.json())
        .then(seenArray => this.setState({seenArray: seenArray}));
  }

  watchlistChange()
  {
    this.props.watchlistChange();
  }

  render() {
    const pageNumbers = [];
    const currentPage = this.state.currentPage;

    if(this.state.resultsNumber > 0)
    {
      if(currentPage != 1)
        pageNumbers.push([1,"First"]);
      if(currentPage > 2)
        pageNumbers.push([currentPage-2,currentPage-2]);
      if(currentPage > 1)
        pageNumbers.push([currentPage-1,currentPage-1]);
      pageNumbers.push([currentPage,currentPage]);
      if(currentPage < Math.ceil(this.state.resultsNumber / this.state.perPage))
        pageNumbers.push([currentPage+1,currentPage+1]);
      if(currentPage < Math.ceil(this.state.resultsNumber / this.state.perPage) - 1)
        pageNumbers.push([currentPage+2,currentPage+2]);
      if(currentPage != Math.ceil(this.state.resultsNumber / this.state.perPage))
        pageNumbers.push([Math.ceil(this.state.resultsNumber / this.state.perPage),"Last"]);
    }

    const renderPageNumbers = pageNumbers.map(array => {
      switch(array[1])
      {
        case 'First':
          return (
            <li className="page-item">
              <a className="page-link" href="#/browse"
              key={array[1]}
              id={array[0]}
              onClick={this.handleClick}
              >
              <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
          );
          break;
        case 'Last':
          return (
            <li className="page-item">
              <a className="page-link" href="#/browse"
              key={array[1]}
              id={array[0]}
              onClick={this.handleClick}
              >
              <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          );
          break;
        default:
          return (
            <li className="page-item">
              {this.state.currentPage != array[0]
              ?
              <a className="page-link" href="#/browse"
              key={array[1]}
              id={array[0]}
              onClick={this.handleClick}
              >
              {array[1]}
              </a>
              :
              <a className="page-link"
              key={array[1]}
              id={array[0]}
              >
              {array[1]}
              </a>
              }
            </li>
          );
          break;
      }
    });

  const genresList = this.state.genresArray.map(array => {
      return (
        <li className="list-inline-item">
          <Genre
          id={array[0]}
          name={array[1]}
          onClick={this.handleClickGenre}
          currentGenre = {this.state.genre}
          />
        </li>
      );
    });

    const moviesList = this.state.results.map((array, index) => {
      if(index < this.state.perPage)
      {
        if((index % this.state.perRow) == 0)
        {
          return (
            <div className = "col-6 col-sm-3 col-md-2 col-lg-2">
              <div>
                <Movie seenArray = {this.state.seenArray} movieID = {this.state.results[index]} watchlistChange = {this.watchlistChange}/>
              </div>
              <hr></hr>
            </div>
          );
        }
        else
        {
          return (
            <div className = "col-6 col-sm-3 col-md-2 col-lg-2">
              <div>
                <Movie seenArray = {this.state.seenArray} movieID = {this.state.results[index]} watchlistChange = {this.watchlistChange}/>
              </div>
            </div>
          );
        }
      }
    });
    return (
      <div className="app">
        <div className="app-search">
          <hr></hr>
          <div className="row" style={{'marginLeft': '10px'}}>
            <Search 
              onChange = {this.handleChange}
            />
          </div>
        </div>
        <hr></hr>
        <div className="input-group input-group-sm mb-3" style={{'marginLeft': '10px'}}>
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Release Date</span>
          </div>
          <Year 
            id = "Min"
            year = {this.state.minYear}
            onChange = {this.handleChangeYear}
          />
          <Year 
            id = "Max"
            year = {this.state.maxYear}
            onChange = {this.handleChangeYear}
          />
          <div className="col-md-9"></div>
        </div>
        <div className="row" style={{'marginLeft': '10px'}}>
        <nav className="navbar navbar-dark bg-light" style={{width: '100%'}}>
          <ul className="list-inline">
            {genresList}
          </ul>
          <div className='text-right' style={{'marginRight': '25px'}}>
            <Sorter
              sort = {this.state.sortLabel}
              onClick = {this.handleClickSort}
            />
          </div>
        </nav>
        </div>
        <div className="app-movie" style={{'backgroundColor': '#f2f2f2', 'border': '1px solid black'}}>
          <div className="row" style={{'marginLeft': '10px'}}>
            {moviesList}
          </div>
        </div>
          <nav>
            <ul id="page-numbers" className="pagination">
              {renderPageNumbers}
            </ul>
          </nav>
      </div>
    );
  }
}
export default Browse;