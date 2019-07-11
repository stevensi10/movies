import React, { Component } from "react";
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
class User extends React.Component {
    constructor(props) {
      super(props);
    }

    importFile()
    {
        var self = this;
        if(window.confirm("Do you really want to import this file?"))
        {
            var url = "functions.php";
            var file = $("#file").prop('files')[0];

            var form = document.querySelector('formFile');
            var formData = new FormData(form);
            formData.append('file', file);
            formData.append('userID', this.props.userID);
            formData.append('func', 'import');
            
            $.ajax({
                url: url
            ,   type: 'POST'
            ,   contentType: false
            ,   processData: false
            ,   data: formData
            ,   success: function (data) {
                    self.props.onImport();
                    self.props.history.push('/browse');
            },
                error: function(){
                   alert("error"); 
                },
                timeout: 5000
            });
        }
    }
    render(){
        return (
            <div class="d-flex justify-content-center align-items-center container ">
                <div>
                    <div class="row">
                        <h5>Name: </h5><span>&nbsp;{this.props.userName}</span>
                    </div>
                    <div class="row">
                        <h5>Email: </h5>&nbsp;<span>{this.props.userEmail}</span>
                    </div>
                    <br></br>
                    <h5>Import IMDB file: </h5>
                    <form id="formFile" class="justify-content-center" method="POST" action="#" enctype="multipart/form-data"
                    onSubmit={
                        (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.importFile();
                        }
                    }
                    >
                        <div class="form-group required">
                            <input type="file" class="form-control" id="file" placeholder='Choose a file...'></input>
                        </div>
                        <div class="text-center">
                            <button id="buttonSubmit" type="submit" class="btn btn-primary"><FontAwesomeIcon icon={faUpload}/> Import</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default User;