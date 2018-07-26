import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as $ from "jquery";
import { Router } from '@angular/router'
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-myvote',
  templateUrl: './myvote.component.html',
  styleUrls: ['./myvote.component.css']
})
export class MyvoteComponent implements OnInit {

  list : Observable<any>
  image : any;
  verified = false;
  name = "omar"

  constructor( private db : AngularFireDatabase, public auth : AngularFireAuth, public route : Router,public storeg : AngularFireStorage) { 


    auth.authState.subscribe( res=> {

      if(res == undefined){
        route.navigate(['/']);
      }

      if(res != undefined){
        
      
        if(res.emailVerified){

        let email = auth.auth.currentUser.email;
        this.list =  db.list("vote",ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
  

       db.list("users",ref => ref.orderByChild("email").equalTo(res.email)).valueChanges().forEach(data => {
         this.image = data[0]["image"];
         this.verified = data[0]['verified']
       });

      }

      if(!res.emailVerified){
        route.navigate(['/']);
      }
       
       
      }
   
     
     });
   

  }

  ngOnInit() {

    var winh = $(window).height();
    $(".add-post").height(winh);

    $("#add").click(function(){
      $(".add-post").css("display","flex");
    });

    $(".addcontent i").click(function(){
      $(".add-post").css("display","none");
    });

   
  }

  showEdit(text,key){
    var winh = $(window).height();
    var navh = $(".navbar").innerHeight();
    $(".add-post").height(winh - navh);

    $(".love-icon i").click(function(){
      $(".add-post").css("display","flex");
    });

    $("textarea").val(text);
    $("#mykey").val(key);

    $(".addcontent i").click(function(){
      $(".add-post").css("display","none");
    });

  }

  delete(key){
       this.db.list("vote").remove(key);
   }

   
  edit(text,key){
    $(".add-post").css("display","none");
    this.db.list("vote").update(key,{
    text:text
    });

  }

  logout(){

        this.auth.auth.signOut();

  }

  votes(){
    this.route.navigate(['/dashboard']);
  }
  


 // change photo 

 takePhoto(file){
  var ref = this.storeg.ref("images/" + file.target.files[0].name);

  var put = ref.put(file.target.files[0]);

  var sub = this.db.list("users",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(data => {

  
  put.then(ok => {
    ref.getDownloadURL().subscribe(url => {
      

      this.db.list("users").update(data[0].payload.key,{
        image:url
      }).then( ()=> {
        

        var cont = this.db.list("vote",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(vdata => {

          vdata.forEach(vimgs => {

            this.db.list("vote").update(vimgs.key,{
              image:url,
            }).then( ()=> {cont.unsubscribe()})

          });

        });

      })


    })
  })

  });

 }


 add(text){


  var date = new Date();
  var year = date.getFullYear();
  var mo = date.getMonth();
  var day = date.getDay();
  var fulldate = year + "/" + mo + "/" + day;


  this.db.list("vote").push({
    text:text,
    year:fulldate,
    like:0,
    dis:0,
    love:0,
    email:this.auth.auth.currentUser.email,
    image:this.image,
    name:this.name,
    verified:this.verified
  }).then( ()=> {
   $(".add-post").css("display","none");
    

  });


 }



}
