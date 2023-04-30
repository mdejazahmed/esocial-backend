import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

export const register = (req, res) => {
  // check user if exists?
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length) return res.status(409).send("User already exists");
    //create new user
    //hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const q =`insert into users (username,mobile,email,password) values (?)`;

    const values =
      [req.body.username, req.body.mobile, req.body.email, hashedPassword];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send("User has been created");
    });
  });
};

export const login = (req, res) => {

  const q=`select * from users where mobile=?`

  db.query(q,[req.body.mobile],(err,data)=>{
    if(err) return res.status(500).json(err)
    if(data.length===0) return res.status(404).json("User doesn't exists")
    const checkPassword=bcrypt.compareSync(req.body.password,data[0].password)
    if(!checkPassword) return res.status(400).json("Wrong password")
    const jwtToken=jwt.sign({id:data[0].id},"secretkey")
    const {password,...other}=data[0]
    res.status(200).json({...other,jwtToken})
  })
};

export const logout = (req, res) => {};
