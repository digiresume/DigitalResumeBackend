const UserdetailInfo = require('../models/UserDetail')
const CommentInfo = require('../models/Comment')

exports.userdetail = async (req, res, next) => {

    // Fetch data from user using form
    const {
        firstname, lastname, uploadphoto, email, phone, jobtitle, objective,
        location, dob, linkedin, github, degreeug, universityug, yearsug, achievementsug, schoolXII, boardXII,
        yearsXII, achievementsXII, schoolX, boardX, yearsX, fdjob, fdcompany, fdduration, fddescription,
        achievementsX, skill, date, certificationTitle, authorityOfCertification, title, description
    } = req.body;



    try {
        // Store data in the db User
        const user = await UserdetailInfo.create({
            firstname, lastname, uploadphoto, email, phone, jobtitle, objective,
            location, dob, linkedin, github, degreeug, universityug, yearsug, achievementsug, schoolXII, boardXII,
            yearsXII, achievementsXII, schoolX, boardX, yearsX, fdjob, fdcompany, fdduration, fddescription,
            achievementsX, skill, date, certificationTitle, authorityOfCertification, title, description
        });
        console.log(user);
        res.json(user)

    } catch (error) {
        next(error);
    }
};

exports.admin = async (req, res, next) => {
    // Only shows the recent comments within 1 day
    try {
        CommentInfo.find({ "date": { $lt: new Date(), $gt: new Date(new Date() - 24 * 60 * 60 * 1000) } }, function (err, users) {
            if (err) {
                res.send('something went really wrong!!')
            }
            console.log(users)
            res.json(users)
        })

    } catch (error) {
        next(error);
    }

};

exports.user = async (req, res, next) => {
    // Only shows the recent comments within 1 day
    try {
        UserdetailInfo.find({}, function (err, user) {
            if (err) {
                res.send("Something went wrong in user detail")
            }
            // console.log(user)
            res.json(user)
        })
    } catch (error) {
        next(error);
    }

};

exports.viewprofile = async (req, res, next) => {
    // Only shows the recent comments within 1 day
    console.log("view")

    // console.log(username)
    try {
        const username = req.params.name;
        UserdetailInfo.findOne({ firstname: username }, function (err, user) {
            if (err) {
                res.send("Something went wrong in user detail")
            }
            console.log(user)
            res.json(user)
        })
    } catch (error) {
        next(error);
    }

};

exports.comments = async (req, res) => {
    const commentnew = {
        name: req.body.name,
        comments: req.body.comments
    }
    const newcomment = new CommentInfo(commentnew);
    console.log(newcomment)
    newcomment.save().then(data => {
        res.json(data);
    })

};