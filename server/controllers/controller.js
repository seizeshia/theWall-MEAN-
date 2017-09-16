var mongoose = require('mongoose');
var bodyParser =require('body-parser');
var Users = mongoose.model('Users');
var Messages = mongoose.model('Message')
var Comment = mongoose.model('Comment')



 module.exports = {
   index: (request, response) => {
   },

   logreg: (request, response)=>{
    //  console.log(request.body);
     Users.findOne(request.body, function(err, users){
        if(users){
          request.session.user = users
          response.json(users)
        }else{
          console.log(request.body)
        var newuser = new Users(request.body);
        newuser.save(function(err, saveduser){
          if(err){
            // console.log("I am here!")
            // console.log(err);
            response.sendStatus(500);
          }else{
            request.session.user=saveduser
            response.json(newuser)
          }
        })
         }
      })
     },
     refresh:(request,response)=>{
       console.log(request.body);
       Messages.find({}).populate('_user').populate({path:'comment', model:'Comment', populate:{path:'_user', model:'Users'}})
       .exec(function(err, messages){
         if(err){
           console.log("something went wrong... ugh");
           response.json(err)
         }else{
           console.log("something didnt go wrong");
           console.log(messages);
           response.json(messages);
         }
       })

     },

    posting:(request, response)=>{
      console.log("***********************************************")
      console.log(request.session.user)
      console.log(request.body);
      var newpost = new Messages();
      // var postinguser;
      console.log(request.body)
      newpost.message = request.body.message.message
      newpost.desc = request.body.message.desc
      newpost._user = request.session.user._id
      console.log("this is the newpost before we save:")
      console.log(newpost);
      newpost.save(function(err){
        console.log(newpost)
        if(err){
          console.log("saving post")
          response.sendStatus(500);
        }else{
          // Messages.find({}, function(err, postings){
          //   console.log(postings)
          //   response.json(postings)
          // })
          Messages.find({}).populate('_user').populate({path:'comment'})
          .exec(function(err, messages){
            if(err){
              console.log("something went wrong... ugh");
              response.json(err)
            }else{
              console.log("something didnt go wrong");
              console.log(messages);
              response.json(messages);
            }
          })
        }
      })
    },
    commenting: (request, response)=>{

      // console.log(request.params, ******************)
      Messages.findOne({_id: request.body.messid}).exec(function(err, thepost){
        console.log(thepost)
        if(err){
          console.log("not good")
          response.json(err)
        }else{
          console.log("found our message");
          console.log()
          var newcomment = new Comment();

          newcomment.comment = request.body.formstuff.content
          newcomment._user = request.session.user._id;

          newcomment.save(function(err){
            if(err){
              console.log("something went wrong saving the comment")
              response.json(err);
            }else{
              thepost.comment.push(newcomment._id)
              console.log("created comment");
              console.log("*************************", request.body.content)
              console.log("****************", thepost.comments)
              thepost.save(function(err){
                if(err){
                  console.log("create comment");
                  response.json(err);
                }else{
                  console.log("message was saved with the new comment.")
                  response.json(thepost)
                }
              })
            }
          })

        }
      })
    },
    liking: (request,response)=>{
      console.log(request.body.messid)
      Messages.findOne({_id:request.body.messid}).exec(function(err, thepost){
        console.log(thepost,"___________________")
        number=thepost.count.length
        if(thepost.count.length > 0){
        for(var i=0;i<thepost.count.length;i++){
          console.log("someonelike it +++++++++++++++++++++++++++=")
          if(thepost.count[i]==request.session.user._id){
            console.log(thepost.count,"^^^^^^^^^^^^^^^")
            thepost.count.splice(i,1);
            console.log(thepost.count,"&&&&&&&&&&&&&&&&&&")
            thepost.save(function(err){
              if(err){
                response.sendStatus(500)
              }else{
                response.json(thepost)
              }
            })
          }

        }
      }if(thepost.count.length == 0 || number == thepost.count.length){
        console.log(thepost.count, "+++++++++++++++++++++++")
        thepost.count.push(request.session.user._id)
        thepost.save(function(err){
          if(err){
            response.sendStatus(500)
          }else{
            response.json("it went through")
          }
        })


      }



      })
    },
    logout: (request,response)=>{
      request.session.destroy()

      console.log(request.session,"=======================")
      response.sendStatus(200)
    },
    checker: (request,response)=>{
      console.log(request.session,"(((((((((((((())))))))))))))")
      if(request.session.user == undefined){
        response.sendStatus(401)
      }else if (request.session) {
        response.json(request.session)
      }
    },
    grabmessage:(request,response)=>{
      console.log(request.body,"OOOOOOOOOOOOOOOOOOOOOOOOOOO")
      Messages.find({_id:request.body.id}).populate('_user').populate({path:'comment', model:'Comment', populate:{path:'_user', model:'Users'}})
      .exec(function(err, message){
        if(err){
          console.log("something went wrong.....")
          response.json(err)
        }else{
          console.log("something didnt go wrong")
          console.log(message)
          response.json(message)
        }
      })

    },
    commentliking:(request,response)=>{
      Comment.findOne({_id:request.body.commid}).exec(function(err,thecomment){
        console.log(request.body,"!!!!!!!!!!!!!!!!!!!!!!!!!")
        number = thecomment.likes.length
        if(err){
          response.sendStatus(500)
        }else{
          console.log(thecomment.likes,"$$$$$$$$$$$$$$$$$$$$$$")
          if(thecomment.likes.length > 0){
            for(var i=0;i>thecomment.likes.length;i++){
              console.log(request.session.user._id,"IIIIIIIIIIIIII")
              if(thecomment.likes[i] == request.session.user._id){
                console.log("------------------------")
                thecomment.likes[i].splice(i,1)
                thecomment.save(function(err){
                  if(err){
                    response.sendStatus(500)
                  }

                })
              }
            }
          }
            console.log(thecomment.likes,"thisisisisisisisi")
            if(thecomment.likes.length == number || thecomment.likes.length == 0){
              console.log("++++++++++++++++++++++++")
              thecomment.likes.push(request.session.user._id)
              thecomment.save(function(err){
                if(err){
                  response.sendStatus(500)
                }else{
                  response.json("comentliking worked")
                }
              })
            }


        }
      })
    },
    getusername: (request, response)=>{
      console.log(request.session._id)
      Users.findOne({_id:request.session.user._id}).exec(function(err,username){
        response.json({username:username.username})
      })
    }
   }
