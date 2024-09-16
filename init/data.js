const mongoose = require("mongoose");
const syllabus = require("../models/syllabus.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/learning-website";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

let allChat = [
    {
      year:2023,
      semester: "A sem",
      subject: "operting system",
      content:"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos recusandae, accusantium fugit veritatis repellat ipsam hic magnam, fugiat deleniti temporibus illum explicabo doloremque deserunt. Error dicta nulla odit doloribus nisi! ",

    },
    {
      year:2023,
      semester: "A sem",
      subject: "english",
      content:"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos recusandae, accusantium fugit veritatis repellat ipsam hic magnam, fugiat deleniti temporibus illum explicabo doloremque deserunt. Error dicta nulla odit doloribus nisi! ",
      
    },
    {
      year:2023,
      semester: "A sem",
      subject: "c , c++",
      content:"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos recusandae, accusantium fugit veritatis repellat ipsam hic magnam, fugiat deleniti temporibus illum explicabo doloremque deserunt. Error dicta nulla odit doloribus nisi! ",
      
    },
    {
      year:2023,
      semester: "A sem",
      subject: "fundamental",
      content:"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos recusandae, accusantium fugit veritatis repellat ipsam hic magnam, fugiat deleniti temporibus illum explicabo doloremque deserunt. Error dicta nulla odit doloribus nisi! ",
      
    },
    {
      year:2023,
      semester: "B sem",
      subject: "digital",
      content:"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos recusandae, accusantium fugit veritatis repellat ipsam hic magnam, fugiat deleniti temporibus illum explicabo doloremque deserunt. Error dicta nulla odit doloribus nisi! ",
      
    },
    {
      year:2023,
      semester: "B sem",
      subject: "web development",
      content:"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos recusandae, accusantium fugit veritatis repellat ipsam hic magnam, fugiat deleniti temporibus illum explicabo doloremque deserunt. Error dicta nulla odit doloribus nisi! ",
      
    },
];
 
    //  chat.insertMany(allChat);

const initDB = async () => {
  // await syllabus.deleteMany({});
  await syllabus.insertMany(allChat);

  console.log("data was initialized");
};

initDB();


