import React, { Component } from "react";
import $ from 'jquery';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';

class FormListCreation extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            genres: []
        };
        this.createList = this.createList.bind(this);
        this.getGenres = this.getGenres.bind(this);
        this.getGenres();
    }

    getGenres()
    {
        fetch('/api/genres')
        .then(res => res.json())
        .then(genres => this.setState({genres: genres}));
    }

    createList()
    {
        var title = $("#inputTitle").val();
        var genreID = $("#inputGenre").val();
        var userID = localStorage.getItem( 'userID' );

        fetch('/api/list-create?genreID='+genreID+'&userID='+userID+'&name='+title)
        .then(res => res.json())
        .then(
            data => 
            {
            this.props.onAdd(title);
            }
        );
    }

    render() {
        const renderGenres = this.state.genres.map((array, index) => {
            return (
                <option value={array.ID}
                >
                {array.GENRE}
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
              Create List
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
                            <label className="control-label" for="inputTitle">Title</label>
                            <input type="text" id="inputTitle" name="title" className="form-control" placeholder="Enter list title" required="required"></input>
                        </div>
                        <div className="form-group required">
                            <label className="control-label" for="inputGenre">Genre</label>
                            <select id="inputGenre" className="custom-select">
                                <option disabled selected value="">Select a genre</option>
                                {renderGenres}
                            </select>
                        </div>
                    </form>
                </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.createList}>Create</Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }

class ControlledCarousel extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleSelect = this.handleSelect.bind(this);
      this.listClick = this.listClick.bind(this);
  
      this.state = {
        index: 0,
        direction: null,
        perRow: 6
      };

      this.setState({listArray: this.props.listArray});
    }
  
    handleSelect(selectedIndex, e) {
      this.setState({
        index: selectedIndex,
        direction: e.direction,
      });
    }

    listClick(id) {
        this.props.onClick(id);
    }
  
    render() {
        var numberRows = (this.props.listArray.length / this.state.perRow);
        var controls = false;
        if(numberRows>1)
            controls = true;
        const renderLists = this.props.listArray.map((array, index) => {
        if(index < numberRows)
        {
            return (
                <Carousel.Item>
                    <ListRow
                    rowNumber = {index}
                    perRow = {this.state.perRow}
                    listArray = {this.props.listArray}
                    onClick = {this.listClick}
                    />
                </Carousel.Item>
            );
        }
        });
  
      return (
        <Carousel
          activeIndex={this.state.index}
          direction={this.state.direction}
          onSelect={this.handleSelect}
          controls={controls}
          prevIcon = {<FontAwesomeIcon size="3x" icon={faCaretLeft} style={{"color": "#007bff", "cursor": "pointer"}}/>}
          nextIcon = {<FontAwesomeIcon size="3x" icon={faCaretRight} style={{"color": "#007bff", "cursor": "pointer"}}/>}
        >
        {renderLists}
        </Carousel>
      );
    }
  }


class ListCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.listID,
            name: this.props.name,
            poster_path: null
        };
        this.listClick = this.listClick.bind(this);
        this.fetchMovieID();
    }

    listClick(e) {
        e.preventDefault();
        var id = this.state.id;
        this.props.onClick(id);
    }

    fetchApi(url) {
        fetch(url).then((res) => res.json()).then((data) => 
        {
            var poster_path = 'http://image.tmdb.org/t/p/original' + data.poster_path;
            this.setState({poster_path: poster_path});
        })
      }
    
      fetchMovieID() 
      {
        let url = 'https://api.themoviedb.org/3/movie/' + this.props.firstID + '?api_key=601b3e84fdc281626e092faf669205b5&append_to_response=videos'
        this.fetchApi(url)
      }

    render() {
        return(
            <a href="" onClick = {this.listClick} id={this.state.id}>
                <div className="card" style={{"width": "100%"}}>
                    <img className="card-img-top cover" src={this.state.poster_path} alt="Card image cap"></img>
                        <div className="card-body">
                            <h5 className="card-title">{this.state.name}</h5>
                        </div>
                </div>
            </a>
        );
    }
}

class ListRow extends React.Component {
    constructor(props) {
        super(props);
        this.listClick = this.listClick.bind(this);
    }

    listClick(id) {
        this.props.onClick(id);
    }

    render() {
        var lowResult = (this.props.rowNumber)*this.props.perRow;
        var topResult = (this.props.rowNumber)* this.props.perRow + (this.props.perRow - 1);
        const renderLists = this.props.listArray.map((array, index) => {
            if(index >= lowResult && index <= topResult)
            {
                return (
                        <div className = "col-md-2">
                            <ListCard
                            listID={array.ID}
                            name={array.NAME}
                            firstID = {array.FIRST_ID}
                            onClick = {this.listClick}
                            />
                        </div>
                );
            }
          });
        return (
            <div>
                <div className="row" style={{'marginLeft': '5px'}}>
                    {renderLists}
                </div>
                <hr></hr>
            </div>
        );
    }
}

class ListGenres extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        listArray: [],
        genreID: this.props.id,
        genreName: this.props.name,
        number: 1
      }
      this.getLists = this.getLists.bind(this);
      this.getLists();
      this.listClick = this.listClick.bind(this);
    }

    listClick(id) {
        this.props.onClick(id);
    }

    getLists()
    {
        var self = this;
        fetch('/api/lists?id='+this.props.id)
        .then(res => res.json())
        .then(lists => this.setState({listArray: lists, number: lists.length}));
    }

    render(){
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center container container-fluid">
                    <div className="row">
                        <h4>{this.state.genreName + ' (' + this.state.number + ')'}</h4>
                    </div>
                </div>
                <br></br>
                <ControlledCarousel
                listArray = {this.state.listArray}
                onClick = {this.listClick}
                >
                </ControlledCarousel>
            </div>
        );
    }
}

class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        listArray: [],
        modalShow: false
      }
      this.getListsGenres = this.getListsGenres.bind(this);
      this.getListsGenres();
      this.listClick = this.listClick.bind(this);
      this.notificationDOMRef = React.createRef();
      this.addNotification = this.addNotification.bind(this);
    }

    listClick(id) {
        this.props.history.push({
            pathname: '/list',
            search: "?id=" + id
        });
    }

    getListsGenres()
    {
        var self = this;
        fetch('/api/lists-genres')
        .then(res => res.json())
        .then(lists => this.setState({listArray: lists}));
    }

    addNotification(title)
    {
        this.notificationDOMRef.current.addNotification({
            title: "The list " + title + " was created",
            message: "You can now add movies to this list by adding them individually",
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 10000 },
            dismissable: { click: true }
          });
    }

    render(){
        console.log(this.state.listArray);
        const renderGenres = this.state.listArray.map((array, index) => {
            return (
                <ListGenres
                id = {array.ID}
                name = {array.GENRE}
                onClick = {this.listClick}
                >
                </ListGenres>
            );
        });
        let modalClose = () => this.setState({ modalShow: false });
        return (
            <div>
                <div className="d-flex justify-content-center align-items-center container">
                    <Tooltip title="Create a new list">
                        <a className="navbar-brand"
                        onClick={() => this.setState({ modalShow: true })}
                        >
                        <Icon color="primary" style={{cursor: "pointer"}}>
                            add_circle
                        </Icon>
                        </a>
                    </Tooltip>
                </div>
                <div>
                    {renderGenres}
                </div>
                <FormListCreation
                    show={this.state.modalShow}
                    onHide={modalClose}
                    onAdd ={this.addNotification}
                />
                <ReactNotification ref={this.notificationDOMRef} />
            </div>
        );
    }
}
export default Home;