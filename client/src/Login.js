import React, { Component } from "react";
import $ from 'jquery'; 
class Login extends React.Component {
    constructor(props) {
      super(props);
    }

    login()
    {
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();

        var self = this;
        var url = "functions.php";
        $.ajax({
            url: url
        ,   type: 'GET'
        ,   contentType: 'application/json'
        ,   data: {'func': 'login', 'email': email, 'password' : password}
        ,   success: function (data) {
                if(data == "[]")
                {
                    $('#message').html('Login and password does not match. Please try again').css('color', 'red');
                }
                else{
                    var userArray = JSON.parse(data);
                    self.props.onUpdate(userArray);
                    self.props.history.push('/browse');
                }
            },
            error: function(xhr, ajaxOptions, thrownError){
                console.log(xhr.responseText);
                alert("error");
            },
            timeout: 5000
        });
    }

    render(){
        return (
            <div class="d-flex justify-content-center align-items-center container">
                <div class="col-md-6 col-md-offset-6">
                    <form id="formUser" class="justify-content-center"
                    onSubmit={
                        (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.login();
                        }
                    }
                    >
                        <div class="form-group required">
                            <label class="control-label" for="inputEmail">Email address</label>
                            <input type="text" id="inputEmail" name="email" class="form-control" placeholder="Enter email" required="required" value="stevensi10@hotmail.com"></input>
                        </div>
                        <div class="form-group required">
                            <label class="control-label" for="inputPassword">Password</label>
                            <input type="password" id="inputPassword" name="password" class="form-control" placeholder="Password" required="required" value="stevensi10"
                            onKeyUp = {this.handleChange}></input>
                        </div>
                        <div class="col-md-12">
                            <span id='message'></span>
                        </div>
                        <div class="text-center">
                            <button id="buttonSubmit" type="submit" class="btn btn-primary">Login</button>
                        </div>
                        <div class="row">
                    </div>
                    </form>
                </div>
            </div>
        );
    }
}
export default Login;