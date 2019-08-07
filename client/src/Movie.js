import React, { Component } from "react";
import $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faClock, faEyeSlash, faEye, faClone} from '@fortawesome/free-solid-svg-icons';
import Tooltip from '@material-ui/core/Tooltip';
import { Flag, Rating} from 'semantic-ui-react'


class Row extends React.Component {
  constructor(props) {
      super(props);
      this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove() {
      this.props.watchlistChange();
  }

  render() {
      var lowResult = (this.props.rowNumber)*this.props.perRow;
      var topResult = (this.props.rowNumber)* this.props.perRow + (this.props.perRow - 1);
      const renderMovies = this.props.listArray.map((key,index) => {
          if(index >= lowResult && index <= topResult)
          {
              return (
                  <div className = "col-6 col-sm-3 col-md-2 col-lg-2">
                      <Movie
                      movieID={key.TMDB_ID}
                      name={key.TMDB_ID}
                      watchlistChange = {this.handleRemove}
                      />
                  </div>
              );
          }
        });
      return (
          <div>
              <div className="row" style={{"margin-left": "1%"}}>
                  {renderMovies}
              </div>
              <hr></hr>
          </div>
      );
  }
}

class AddList extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
          userLists: []
      };
      this.addToList = this.addToList.bind(this);
      this.getUserLists = this.getUserLists.bind(this);
      this.getUserLists();
  }

  getUserLists()
  {
      var userID = localStorage.getItem( 'userID' );
      fetch('/api/users-lists?id='+userID)
      .then(res => res.json())
      .then(userLists => this.setState({userLists: userLists}));
  }

  addToList()
  {
      var listID = $("#inputList").val();
      var list = $("#inputList option:selected").text();

      fetch('/api/movie-list-add?listID='+listID+'&tmdbID='+this.props.tmdbID+'&title='+this.props.title+'&release_date='+this.props.release_date)
        .then(res => res.json())
        .then(
            data => 
            {
              this.props.onAdd(list);
            }
        );
  }

  render() {
      const renderLists = this.state.userLists.map((array, index) => {
          return (
              <option value={array['ID']}
              >
              {array['NAME']}
              </option >
          );
      });
      return(
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add movie to list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center container">
              <div className="col-md-6 col-md-offset-6">
                  <form id="formUser" className="justify-content-center"
                  onSubmit={
                      (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      }
                  }
                  >
                      <div className="form-group required">
                          <label className="control-label" for="inputList">List</label>
                          <select id="inputList" className="custom-select">
                              <option disabled selected value="">Select a list</option>
                              {renderLists}
                          </select>
                      </div>
                  </form>
              </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.addToList}>Add</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class Similars extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
          similars: []
      };
      this.fetchSimilar = this.fetchSimilar.bind(this);
      this.fetchApi = this.fetchApi.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.fetchSimilar();
  }

  fetchApi(url) {
    fetch(url).then((res) => res.json()).then((data) => 
    {
      var results = data.results;
      var similars = [];
      for(var i = 0; i < results.length; i++)
      {
        similars[i] = results[i].id;
      }

      this.setState({
        similars: similars,
      });
    })
  }

  handleRemove()
  {

  }

  fetchSimilar() 
  {
    var tmdbID = this.props.tmdbID;
    if(typeof tmdbID !== "undefined")
    {
      let url = 'https://api.themoviedb.org/3/movie/' + tmdbID + '/recommendations?api_key=601b3e84fdc281626e092faf669205b5';
      this.fetchApi(url);
    }
  }

  render() {
      const renderData = this.state.similars.map((key, index) => {
          return (
            <div>
              <div className = "col-12 col-sm-12 col-md-4 col-lg-2">
                <Movie
                movieID={key}
                name={key}
                watchlistChange = {this.handleRemove}
                />
              </div>
              <hr></hr>
            </div>
          );
      });
      return(
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Similar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="row">
              {renderData}
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

class Movie extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        original_title: null,
        release_date: null,
        poster_path: null,
        genres: null,
        imdb_id: null,
        overview: null,
        runtime: null,
        videoLink: null,
        seen: 0,
        imdb_link: null,
        modalShow: false,
        complete_release_date: null,
        imdbVotes: null,
        imdbRating: null,
        countries: [],
        watchlist: 0,
        rating: null,
        similarShow: false
      };
      this.notificationDOMRef = React.createRef();
      this.addNotification = this.addNotification.bind(this);
      this.getOMDB = this.getOMDB.bind(this);
      this.showModal = this.showModal.bind(this);
      this.addToWatchlist = this.addToWatchlist.bind(this);
      this.determineWatchlist = this.determineWatchlist.bind(this);
      this.removeWatchlist = this.removeWatchlist.bind(this);
      this.getRating = this.getRating.bind(this);
      this.setRating = this.setRating.bind(this);
      this.similarShow = this.similarShow.bind(this);
    }

    fetchApi(url) {
      fetch(url).then((res) => res.json()).then((data) => 
      {
        // update state with API data
        var genresArray = data.genres;
        var videosArray = []
        if(typeof data.videos !== "undefined")
        {
          videosArray = data.videos.results;
        }
        var genres = '';
        if(typeof data.videos !== "undefined")
        {
          for(var i = 0; i < genresArray.length; i++)
          {
            genres = genres + genresArray[i].name + ', ';
          }
        }
        if(genres.slice(-1) == ' ')
          genres = genres.substring(0, genres.length-2);

        var videoLink = '';
        for(var j = 0; j < videosArray.length; j++)
        {
          if(videosArray[j].type == 'Trailer')
          {
            var videoKey = videosArray[j].key;
            videoLink = 'https://www.youtube.com/embed/' + videoKey;
          }
        }
        var seen = 0;
        if(typeof this.props.seenArray !== 'undefined')
        {
            if(this.props.seenArray.includes(data.imdb_id))
            {
            seen = 1;
            }
        }
        else
            seen = 0

        var release_date = data.release_date;
        var complete_release_date = null;
        if(typeof release_date === "undefined")
        {
          release_date = null;
        }
        else{
          release_date = data.release_date.substring(0, 4);
          complete_release_date = data.release_date;
        }

        var countries = [];
        if(typeof data.production_countries !== "undefined")
        {
          for(var i = 0; i < data.production_countries.length; i++)
          {
            var countryCode = data.production_countries[i].iso_3166_1;
            countryCode = countryCode.toLowerCase();
            var countryName = data.production_countries[i].name;
            countries[i] = [countryCode,countryName];
          }
        }

      
        this.setState({
          original_title: data.title,
          release_date: release_date,
          poster_path: 'http://image.tmdb.org/t/p/w154' + data.poster_path,
          genres: genres,
          imdb_link: 'https://www.imdb.com/title/' + data.imdb_id,
          imdb_id: data.imdb_id,
          overview: data.overview,
          runtime: data.runtime,
          videoLink: videoLink,
          seen: seen,
          complete_release_date: complete_release_date,
          countries: countries
        });
        this.getOMDB(data.imdb_id);
        this.determineWatchlist();
        this.getRating();
      })
    }
  
    fetchMovieID() 
    {
      var movieID = this.props.movieID;
      let url = 'https://api.themoviedb.org/3/movie/' + movieID + '?api_key=601b3e84fdc281626e092faf669205b5&append_to_response=videos'
      this.fetchApi(url)
    }

    getOMDB(imdbID)
    {
      let url = 'http://www.omdbapi.com/?apikey=faa4a160&i=' + imdbID;
      this.fetchOMDB(url)
    }

    fetchOMDB(url) {
      fetch(url).then((res) => res.json()).then((data) => 
      {
        var imdbVotes = data.imdbVotes;
        var imdbRating = data.imdbRating;

        this.setState({
          imdbVotes: imdbVotes,
          imdbRating: imdbRating
        });
      })
    }

    addNotification(list)
    {
      this.notificationDOMRef.current.addNotification({
        title: this.state.original_title + " was added to the list " + list,
        message: "You can consult the list",
        type: "success",
        insert: "bottom",
        container: "bottom-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 10000 },
        dismissable: { click: true }
      });
    }

    componentDidMount() {
      this.fetchMovieID();
    }
 
    componentDidUpdate(prevProps,prevState) {
      if (prevProps.movieID !== this.props.movieID){
        this.fetchMovieID();
      }
    }

    showModal()
    {
      this.setState({ modalShow: true});
    }

    similarShow()
    {
      this.setState({ similarShow: true});
    }

    addToWatchlist()
    {
        var userID = localStorage.getItem("userID");
        var tmdbID = this.props.movieID;
        fetch('/api/movie-watchlist-add?userID='+userID+'&tmdbID='+tmdbID)
        .then(res => res.json())
        .then(
            data => 
            {
              this.setState({watchlist: 1});
              this.props.watchlistChange();
            }
        );
    }

    getRating()
    {
        var userID = localStorage.getItem("userID");
        var imdbID = this.state.imdb_id;
        fetch('/api/movie-rating?userID='+userID+'&imdbID='+imdbID)
        .then(res => res.json())
        .then(
            data => 
            {
              if(typeof data[0] !== "undefined")
                this.setState({rating: data[0].RATING, seen: 1});
            }
        );
    }

    determineWatchlist()
    {
        var watchlist = 0;
        var userID = localStorage.getItem("userID");
        var tmdbID = this.props.movieID;
        fetch('/api/movie-watchlist?userID='+userID+'&tmdbID='+tmdbID)
        .then(res => res.json())
        .then(
            data => 
            {
              if(parseInt(data[0].C) > 0)
                this.setState({watchlist: 1});
            }
        );
    }

    removeWatchlist()
    {
        var userID = localStorage.getItem("userID");
        var tmdbID = this.props.movieID;
        fetch('/api/movie-watchlist-delete?userID='+userID+'&tmdbID='+tmdbID)
        .then(res => res.json())
        .then(
            data => 
            {
              this.setState({watchlist: 0});
              this.props.watchlistChange();
            }
        );
    }

    setRating(event, starRating)
    {
        var nextValue = starRating.rating;
        var userID = localStorage.getItem("userID");
        var imdbID = this.state.imdb_id;
        fetch('/api/movie-rating-set?userID='+userID+'&imdbID='+imdbID+'&rating='+nextValue)
        .then(res => res.json())
        .then(
            data => 
            {
              this.setState({seen: 1, rating: nextValue});
            }
        );
    }
      
  
    render() {
      let modalClose = () => this.setState({ modalShow: false });
      let similarClose = () => this.setState({ similarShow: false });
      var overview = "<div>" + this.state.overview + "</div>";
      var href= "https://www.imdb.com/title/" + this.state.imdb_id + "/?ref_=plg_rt_1";
      var colorSeen = "black";
      if(this.state.seen == 1)
        colorSeen = "green";

        const renderCountries = this.state.countries.map((array, index) => {
          return (
            <Tooltip title={array[1]}>
              <Flag name={array[0]}>
              </Flag>
            </Tooltip>
          );
      });

      if(this.props.movieID != null)
        return (
          <div>
            <div className="" style={{display:"block", height: '175px'}}>
              <div>
              <h5 style={{'color': colorSeen}}>{this.state.original_title} ({this.state.release_date})
              </h5>
                {this.state.videoLink != '' ?
                <Tooltip title="Watch trailer">
                  <a
                  data-fancybox="video"
                  href={this.state.videoLink}
                  >
                    <img style={{width:"40px", height:"30px", cursor: 'pointer'}} src='https://www.freepnglogos.com/uploads/youtube-logo-hd-8.png'>
                    </img>
                  </a>
                  </Tooltip>
                : <span></span>}
                <Tooltip title="Add to list">
                <a
                  onClick={this.showModal}
                >
                  <FontAwesomeIcon icon={faList} style={{"color": "#007bff", "cursor": "pointer",width:"20px", height:"15px"}}
                  />
                </a>
                </Tooltip>
                {this.state.watchlist == 0 ?
                  <Tooltip title="Add to watchlist">
                    <a
                      onClick={this.addToWatchlist}
                    >
                    <FontAwesomeIcon icon={faEye} style={{"color": "#007bff", "cursor": "pointer",width:"20px", height:"15px"}}
                    />
                    </a>
                  </Tooltip>
                  :
                  <Tooltip title="Remove from watchlist">
                    <a
                      onClick={this.removeWatchlist}
                    >
                    <FontAwesomeIcon icon={faEyeSlash} style={{"color": "#007bff", "cursor": "pointer",width:"20px", height:"15px"}}
                    />
                    </a>
                  </Tooltip>
                }
                <Tooltip title="Similar movies">
                <a
                  onClick={this.similarShow}
                >
                  <FontAwesomeIcon icon={faClone} style={{"color": "#007bff", "cursor": "pointer",width:"20px", height:"15px"}}
                  />
                </a>
              </Tooltip>
              </div>
                {this.state.genres}
              <br></br>
                {renderCountries}
              <br></br>
              <FontAwesomeIcon icon={faClock}></FontAwesomeIcon><span>&nbsp;:&nbsp;{this.state.runtime} min.</span><br></br>
              {this.state.imdb_id != null ?
              <div>
              <span class="imdbRatingPlugin" data-user="ur30238090" data-title={this.state.imdb_id} data-style="p3">
              <Tooltip title="Open in IMDB">
                <a target="_blank" href={href}>
                <img src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_37x18.png"/>
                </a>
              </Tooltip>
              </span><span style={{'font-weight': 'bold'}}>&nbsp;{this.state.imdbRating}</span><span style={{'font-size': "0.6em"}}>/10</span><span style={{'font-size': '0.8em', 'color': 'grey'}}>&nbsp;&nbsp;{this.state.imdbVotes} votes</span></div>
              :
              <Tooltip title="Open in TMDB">
                <a target="_blank" href={"https://www.themoviedb.org/movie/" + this.props.movieID}>
                <img style={{width: "30px", height: "30px"}} src="https://www.themoviedb.org/assets/2/v4/logos/312x276-primary-green-74212f6247252a023be0f02a5a45794925c3689117da9d20ffe47742a665c518.png"/>
                </a>
              </Tooltip>
              }
              <br></br>
              <Rating
                icon = "star"
                maxRating = {10}
                name={this.state.movieID}
                rating = {this.state.rating}
                onRate = {this.setRating}
                size = "mini"
              >
              </Rating>
            </div>
            <br></br><br></br>
            <div>
              <img style={{'border': '1.5px solid black', visibility: 'visible', 'object-fit': 'cover',height: '90%'}} src={this.state.poster_path}
            data-featherlight={overview}
            />
            </div>
            <AddList
              show={this.state.modalShow}
              tmdbID = {this.props.movieID}
              title = {this.state.original_title}
              release_date = {this.state.complete_release_date}
              onHide={modalClose}
              onAdd = {this.addNotification}
            />
            {
              this.state.similarShow == true ?
              <Similars
                show={this.state.similarShow}
                onHide={similarClose}
                tmdbID = {this.props.movieID}
              >
              </Similars>
              : <span></span>
            }
            <ReactNotification ref={this.notificationDOMRef} />
          </div>
        );
        else return null;
    }
  }
  export default Movie;
  export{Row};