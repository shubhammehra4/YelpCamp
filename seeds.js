const mongoose = require('mongoose'),
Campgrounds = require('./models/campgrounds'),
Comment = require('./models/comment'),
User = require('./models/user'); 

var data =[
    {
        name: "Granite Hill",
        coverImage: "https://images.unsplash.com/photo-1476908965434-f988d59d7abd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias ab in impedit delectus. Quod, itaque architecto? Nemo maiores facilis, veniam possimus quaerat, corrupti et earum molestias adipisci esse mollitia perspiciatis."
    },
    {
        name: "Sunset Point",
        coverImage: "https://s3.envato.com/files/268795742/Tourist%20camp%20in%20mountains%20with%20tent%20and%20cauldron%20over%20fire%20at%20sunset.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias ab in impedit delectus. Quod, itaque architecto? Nemo maiores facilis, veniam possimus quaerat, corrupti et earum molestias adipisci esse mollitia perspiciatis."
    },
    {
        name: "Peaceful Hill",
        coverImage: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestias ab in impedit delectus. Quod, itaque architecto? Nemo maiores facilis, veniam possimus quaerat, corrupti et earum molestias adipisci esse mollitia perspiciatis."
    },
    {
        name: "Cloud's Rest",
        coverImage: "https://i.pinimg.com/originals/6b/70/c9/6b70c98708d2e7c66edbe4ce3bb5ea1d.png",
        description: "Great place"
    },
    {
        name: "Pleatue Gardens",
        coverImage: "https://wordpress.accuweather.com/wp-content/uploads/2019/03/camping-thumbnail.11.4920AM-1.png?w=632",
        description: "Great place"
    },
    {
        name: "Haunted Forest",
        coverImage: "https://www.nj.com/resizer/3zwBo4iNPxy_LN7uZHRSprTmdig=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/DUNWFNGOAVCRLAHO4ZPTBKNJEM.jpg",
        description: "Great place"
    }
]
function seedDb(params) {
    User.deleteMany({}, function (err) {
        if(err){
            console.log(err);
        } else {
            console.log("deleted all users");
        }
    });
    Campgrounds.deleteMany({}, function (err) {
        if(err){
            console.log(err);
        } else{
            console.log("Cleared Campgrounds");
            Comment.deleteMany({}, function (err) {
                if(err){
                    console.log(err);
                } else{
                    console.log("Cleared comments");
                }
            });
            // data.forEach(function (seed) {
            //     Campgrounds.create(seed, function (err, campground) {
            //         if(err){
            //             console.log(err)
            //         } else{
            //             console.log("Added a Campground");
            //             Comment.create(
            //                 {
            //                     text: "This place is great.",
            //                     author: "Homer"
            //                 }, function (err, comment) {
            //                     campground.comments.push(comment);
            //                     campground.save();
            //                     console.log("Comment added");
            //                 });
            //         }
            //     })
            // });
        }
     });   
};
module.exports = seedDb