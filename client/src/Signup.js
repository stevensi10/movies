import React, { Component } from "react";
import $ from 'jquery'; 
class Signup extends React.Component {
    constructor(props) {
      super(props);
    }

    createUser()
    {
        var firstName = $("#inputFirstName").val();
        var lastName = $("#inputLastName").val();
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();
        var password2 = $("#inputPassword2").val();

        if(password == password2)
        {
            var self = this;
            var url = "functions.php";
            $.ajax({
                url: url
            ,   type: 'GET'
            ,   contentType: 'application/json'
            ,   data: {'func': 'createUser','firstName': firstName, 'lastName': lastName, 'email': email, 'password' : password}
            ,   success: function (data) {
                $('#successMessage').html('Account created successfully').css('color', 'green');
                },
                error: function(xhr, ajaxOptions, thrownError){
                    alert("error");
                },
                timeout: 5000
            });
        }
    }

    handleChange = ({ target }) => {
        switch(target.name)
        {
            case 'password':
                if(target.value != $("#inputPassword2").val())
                {
                    $('#message').html('Not Matching').css('color', 'red');
                }
                else{
                    $('#message').html('Matching').css('color', 'green');
                }
                break;
            case 'password2':
                if(target.value != $("#inputPassword").val())
                {
                    $('#message').html('Not Matching').css('color', 'red');
                }
                else
                {
                    $('#message').html('Matching').css('color', 'green');
                }
                break;
        }
     };

    render(){
        return (
            <div class="d-flex justify-content-center align-items-center container ">
                <div class="col-md-6 col-md-offset-6">
                    <form id="formUser"
                    onSubmit={
                        (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.createUser();
                        }
                    }
                    >
                        <div class="row">
                            <div class="form-group col-md-6">
                                <div class="form-group required">
                                    <label class="control-label" for="inputFirstName">First Name</label>
                                    <input type="text" id="inputFirstName" name="firstName" class="form-control" placeholder="Enter first name" required="required"></input>
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="form-group required">
                                    <label class="control-label" for="inputLastName">Last Name</label>
                                    <input type="text" id="inputLastName" name="lastName" class="form-control" placeholder="Enter last name" required="required"></input>
                                </div>
                            </div>
                        </div>
                        <div class="form-group required">
                            <label class="control-label" for="inputEmail">Email address</label>
                            <input type="text" id="inputEmail" name="email" class="form-control" placeholder="Enter email" required="required"></input>
                        </div>
                        <div class="form-group required">
                            <label class="control-label" for="inputPassword">Password</label>
                            <input type="password" id="inputPassword" name="password" class="form-control" placeholder="Password" required="required"
                            onKeyUp = {this.handleChange}></input>
                        </div>
                        <div class="form-group required">
                            <label class="control-label" for="inputPassword2">Confirm Password</label>
                            <input type="password" id="inputPassword2" name="password2" class="form-control" placeholder="Confirm Password" required="required"
                            onKeyUp = {this.handleChange}></input>
                            <span id='message'></span>
                        </div>
                        <div class="text-center">
                            <button id="buttonSubmit" type="submit" class="btn btn-primary">Create Account</button>
                        </div>
                    </form>
                    <div class="row">
                        <div class="col-md-6">
                            <span id='successMessage'></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Signup;