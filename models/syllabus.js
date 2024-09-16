const mongoose = require("mongoose");
const { type } = require("os");

mongoose.connect('mongodb://127.0.0.1:27017/learning-website');

const Syllabus = mongoose.Schema({
    year:{
        type:String,
        require:true
    },
    semester:{
        type:String,
        require:true,
    },
    subject:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    }

})

module.exports = mongoose.model("syllabus-database",Syllabus);