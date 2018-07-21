import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable} from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import * as $ from 'jquery';
import { Router } from '@angular/router'
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  image = "omar"
  name = "omar"
  verified = false;
  list : Observable<any>;

  constructor(public auth : AngularFireAuth, public db : AngularFireDatabase,public route : Router, public storeg : AngularFireStorage) {

    this.list = db.list("vote").snapshotChanges();

    auth.authState.subscribe( res=> {

      if(res == undefined){
        route.navigate(['/']);
      }

      if(res != null){ 
        db.list("users",ref => ref.orderByChild("email").equalTo(res.email)).valueChanges().forEach(data => {
          this.image = data[0]["image"];
          this.name = data[0]["name"];
          this.verified = data[0]['verified']
        });
      }

    })

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

  
   logout(){
       this.auth.auth.signOut()
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

   // myvote 

   myvote(){
    this.route.navigate(['/myvote']);
   }


   // cond


   
  setLike(key,likenum,disnum,lovenum){

    let email = this.auth.auth.currentUser.email;


   var db = this.db.list("votestatus/"+key,ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   var sub = db.subscribe(data => {

      if(data[0] == undefined){
        this.db.list("votestatus/"+key).push({
          email:email,
          key:key,
          like:true,
          dis:false,
          love:false
        }).then( ()=> {
          this.db.list("vote").update(key,{
            like:likenum +1
          })
        });

        sub.unsubscribe();


      }

      if(data[0] != undefined){

        let emaildata = data[0].payload.val()['email'];
        var like = data[0].payload.val()['like'];
        var dis = data[0].payload.val()['dis'];
        var love = data[0].payload.val()['love'];
        var keydata = data[0].payload.val()['key'];

        if(emaildata == email && key == keydata && like == false && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum +1
            });

            sub.unsubscribe();


          });
        }

        // another

        if(emaildata == email && key == keydata && like == true  && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum -1
            });

            sub.unsubscribe();


          });
        }

        // another 

        
        if(emaildata == email && key == keydata && like == false  && dis == true && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:true,
            dis:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                like:likenum +1
              })

            });

            sub.unsubscribe();


          });
        }

        // another 

        if(emaildata == email && key == keydata && like == false  && dis == false && love == true){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:true,
            love:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                like:likenum +1
              })

            });

            sub.unsubscribe();


          });
        }

      }

    });


  }


  // set dis like 

  setDis(key,likenum,disnum,lovenum){

    let email = this.auth.auth.currentUser.email;


   var db = this.db.list("votestatus/"+key,ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   var sub = db.subscribe(data => {

      if(data[0] == undefined){
        this.db.list("votestatus/"+key).push({
          email:email,
          key:key,
          like:false,
          dis:true,
          love:false
        }).then( ()=> {
          this.db.list("vote").update(key,{
            dis:disnum +1
          })
        });

        sub.unsubscribe();


      }

      if(data[0] != undefined){

        let emaildata = data[0].payload.val()['email'];
        var like = data[0].payload.val()['like'];
        var dis = data[0].payload.val()['dis'];
        var love = data[0].payload.val()['love'];
        var keydata = data[0].payload.val()['key'];

        if(emaildata == email && key == keydata && like == false && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum +1
            });

            sub.unsubscribe();


          });
        }

        // another

        if(emaildata == email && key == keydata && like == false  && dis == true && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum -1
            });

            sub.unsubscribe();

          });
        }

        // another 

        
        if(emaildata == email && key == keydata && like == true  && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:false,
            dis:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                dis:disnum +1
              })

            });

            sub.unsubscribe();


          });
        }

        // another 

        if(emaildata == email && key == keydata && like == false  && dis == false && love == true){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:true,
            love:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                dis:disnum +1
              })

            });

            sub.unsubscribe();


          });
        }

      }

    });


  }


  // set love 


  setLove(key,likenum,disnum,lovenum){

    let email = this.auth.auth.currentUser.email;


   var db = this.db.list("votestatus/"+key,ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   var sub = db.subscribe(data => {

      if(data[0] == undefined){
        this.db.list("votestatus/"+key).push({
          email:email,
          key:key,
          like:false,
          dis:false,
          love:true
        }).then( ()=> {
          this.db.list("vote").update(key,{
            love:lovenum +1
          })
        });

        sub.unsubscribe();


      }

      if(data[0] != undefined){

        let emaildata = data[0].payload.val()['email'];
        var like = data[0].payload.val()['like'];
        var dis = data[0].payload.val()['dis'];
        var love = data[0].payload.val()['love'];
        var keydata = data[0].payload.val()['key'];

        if(emaildata == email && key == keydata && like == false && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            love:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum +1
            });

            sub.unsubscribe();


          });
        }

        // another

        if(emaildata == email && key == keydata && like == false  && dis == false && love == true){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            love:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum -1
            });

            sub.unsubscribe();


          });
        }

        // another 

        
        if(emaildata == email && key == keydata && like == true  && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:false,
            love:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                love:lovenum +1
              })

            });

            sub.unsubscribe();


          });
        }

        // another 

        if(emaildata == email && key == keydata && like == false  && dis == true && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:false,
            love:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                love:lovenum +1
              })

            });

            sub.unsubscribe();

           

          });
        }

      }

    });


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




}