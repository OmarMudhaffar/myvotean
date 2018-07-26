import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { WOW } from 'wowjs/dist/wow.min';
import { AngularFireAuth } from 'angularfire2/auth';
import {  AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public auth : AngularFireAuth, public route : Router,public db : AngularFireDatabase) {

    auth.authState.subscribe( res=> {

      if(res != undefined){
        
        if(res.emailVerified){
        route.navigate(['/dashboard']);
        }
      }

    })

   }

   ngAfterViewInit(){

    var wow = new WOW({
      live: false
  });
    wow.init();

  
 
  }
 

  ngOnInit() {

  

    var navh = $("nav").innerHeight();
    var winh = $(window).height();
    console.log(winh);
    $(".header,.overlay, .header .carousel-item, .header-content ").height(winh - navh);


    $(".signupbut").click(function(){
      $(".login-content").hide();
      $(".signup-content").fadeIn();
    });


    $(".loginbut").click(function(){
      $(".signup-content").hide();
      $(".login-content").fadeIn();
    });


    $(window).on("scroll",function(){
      var st = $(window).scrollTop();
       if(st == 349){

       }
       
    });

    var i = 0;

    var myinter = setInterval(function(inter){
 
      i = i + 1;

      $(".pres").text(i + "% Security");

      if ( i == 100){
        clearInterval(myinter);
      }

    },50);

  }


  login(email,pass){

 
    if(email.length > 0 && pass.length > 0) {

    
    $("#btn-login p").hide();
    $("#btn-login i").show();

    this.auth.auth.signInWithEmailAndPassword(email,pass).then( ()=> {
      $("#btn-login p").show();
      $("#btn-login i").hide();

      if(!this.auth.auth.currentUser.emailVerified){
      $("#alert-login").text("Please active your email")
      }

      if(this.auth.auth.currentUser.emailVerified){
    
        this.route.navigate(['/dashboard']);
      
      }

    }).catch(err => {
      $("#btn-login p").show();
      $("#btn-login i").hide();
      $("#alert-login").show();
      $("#alert-login").text(err.message);
    })
    
    }


  }


  signup(email,name:any,pass){

  
    if(email.length > 0 && pass.length > 0 && name.length > 0) {

        
      $("#btn-signup p").hide();
      $("#btn-signup i").show();  

      var db = this.db.list("users",ref => ref.orderByChild("name").equalTo(name.toLowerCase())).snapshotChanges();
      var sub = db.subscribe(userche => {

        
      if(userche[0] == undefined){

        $("#btn-singup p").show();
        $("#btn-singup i").hide();

        this.auth.auth.createUserWithEmailAndPassword(email,pass).then( ()=> {

          $("input").val("");

          
          $("input").val().toLowerCase();

          console.log(name);
  
          this.db.list("users").push({
            email:email,
            name:name,
            image:"https://firebasestorage.googleapis.com/v0/b/vote-b1894.appspot.com/o/11906329_960233084022564_1448528159_a.jpg?alt=media&token=dd943fc8-1538-4ad5-88dd-a4db29fa069d",
            verified:false
          });

          var user = this.auth.auth.currentUser;
          user.sendEmailVerification().then( ()=> {
           $("#suc").show();
           $("#btn-login p").show();
           $("#btn-login i").hide();
           $("#suc p").text("Activation link have been sent to your email");
          });

        

        }).catch(err => {
          $("#btn-signup p").show();
          $("#btn-signup i").hide();  
          $("#dang").show();
          $("#dang p").text(err.message);
        });

        sub.unsubscribe();

      }


      if(userche[0] != undefined){
        $("#dang").show();
        $("#dang p").text("name is already taken");
        $("#btn-signup p").show();
        $("#btn-signup i").hide();  
      }

      sub.unsubscribe();

    })


    }


  }

 // end fedback 

 sendFed(email,name,text){

  if(email.length > 0 && name.length > 0 && text.length > 0){
  

    if(email.search("@") != -1 && email.search(".") != -1){


      $("#defname, #defemail, #deftext").css("border","2px solid green");
      
    var mesg = "{email :" + email + "}\n{name : " + name + "}\n{message : " + text + " }"
    $.get("https://api.telegram.org/bot577083786:AAE8P9QtbEpeI_FNua4XDTatyyZlXJbNX5s/sendMessage?chat_id=578601940&text=" + mesg ,function(data){
    if(data.ok == true){
      
      $("#sendFed").text("Message sent!");

      setTimeout(function(){
        $("input,textarea").val("");
        $("#sendFed").text("Send Message");
        $("#defname, #defemail, #deftext").css("border","none");
      },3000);
      
    }
  });

    }

    if(email.search("@") == -1 && email.search("@") == -1){
      $("#defemail").css("border","2px solid #e00")
    }


  }
}

}
