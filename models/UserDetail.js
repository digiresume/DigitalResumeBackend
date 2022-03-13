const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({

    firstname: String,
    lastname: String,
    uploadphoto: String,
    email: String,
    phone: Number,
    jobtitle: String,
    objective: String,
    location: String,
    dob: Date,
    linkedin: String,
    github: String,
    degreeug: String,
    universityug: String,
    yearsug: String,
    achievementsug: String,
    schoolXII: String,
    boardXII: String,
    yearsXII: String,
    achievementsXII: String,
    schoolX: String,
    boardX: String,
    yearsX: String,
    achievementsX: String,
    fdjob: String,
    fdcompany: String,
    fdduration: String,
    fddescription: String,
    skill: Array,
    date: Array,
    certificationTitle: Array,
    authorityOfCertification: Array,
    title: Array,
    description: Array

});



const UserdetailInfo = mongoose.model('userdetails', userDetailSchema);

module.exports = UserdetailInfo; //inside models->Comments.js