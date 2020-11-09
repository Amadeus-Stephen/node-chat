const express = require("express");
const Chatroom = require("../models/Chatroom");
const User = require('../models/User');
const router = express.Router();
router.get("/", (req, res) => {
  Chatroom.find()
    .then((chatroom) => res.json(chatroom))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});
router.post("/room" , (req , res) => { 
	const {roomid} = req.body;
	Chatroom.findById(roomid)
		.then((chatroom) => {
			console.log(chatroom)
			res.render('chat', {
				chatroom,
				user: req.user
			})
		})
})
router.post("/search", (req, res ) => {
	const {searchparam} = req.body;
	Chatroom.find({name : searchparam})
		.then((chatroom) => {
			if (chatroom.length > 0) {
			res.render('search', {
				chatroom,
				searchparam,
				user: req.user
			})
			} else {
				res.render('search', {
					chatroom: false, 
					searchparam,
					user: req.user
				})
			}
		} )
		.catch((err) => res.status(400).json(`Error: ${err}`))
});
router.post("/", (req, res) => {
  console.log(req);
  const {name} = req.body;
  let errors = [];	

  if (!req.user ) {
    errors.push({ msg: "You have to sign in to use this Feature" });
  }
  if (!name) {
    errors.push({ msg: "No name was given" });
  } if (errors.length > 0) {
      res.render('dashboard', {
        errors,
		name,
		user: req.user
	});
	console.log(errors)
  } 
  else {
    User.findById(req.user, {
      username: true,
    }).then((data) => {
      try {
        Chatroom.findOne({ name }).then((project) => {
          if (project) {
            errors.push({ msg: "you already have a project with that name" });
            res.render('dashboard', {
              	errors,
			  	name,
			 	user: req.user
            });
          } else {
			console.log("open");
			const id = req.user._id;
  			const username = req.user.username;
            let chatroom = new Chatroom({ owner: {id , username}, name });
			chatroom
			.save()
			.then(chatroom => {
				res.render('dashboard', {
					user: req.user
				})
		  })
		  .catch(err => console.log(err))
        }});
      } catch {
		   errors.push( { msg: "Failed to fetch user" } );
		   res.render('dashboard', {
			   	errors,
			  	name,
			    user: req.user
		})
      }
    });
  }
});
router.delete("/:id", (req, res) => {
  Chatroom.findByIdAndDelete(req.params.id)
    .then(() => res.json("Chatroom deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});
module.exports = router;