import {db} from "../connect.js"
import jwt from "jsonwebtoken"

export const getUser=(req,res)=>{
    const userId=req.params.userId
    const q="SELECT * FROM users WHERE id=?"
    db.query(q,[userId],(err,data)=>{
        if(err) return res.status(500).json(err)
        const {password,...info}=data[0]
        return res.status(200).json(info)
    })
}

export const updateUser=(req,res)=>{
    let jwtToken;
   const authHeader = req.body.headers.Authorization;
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      return res.status(401).json("Invalid Access Token");
    }
    jwt.verify(jwtToken, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json(err);
  
        const q ="UPDATE users SET `profileImg`=?,`coverImg`=?,`city`=?,`website`=? WHERE id=?"
        console.log(req.body.data.profileImg)
  
        const values =[
            req.body.data.profileImg,
            req.body.data.coverImg,
            req.body.data.city,
            req.body.data.website,
            userInfo.id
        ]
  
        db.query(q, values, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        });
      });
}