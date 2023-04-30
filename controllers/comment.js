import {db} from "../connect.js"
import  jwt  from "jsonwebtoken";
import moment from "moment"

export const getComments = (req, res) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined)
    return res.status(401).json("Invalid Access Token");

  jwt.verify(jwtToken, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json(err);

    const q = `SELECT c.*,u.id as userId,u.username AS username, u.profileImg AS userImg FROM comments as c JOIN users AS u ON (c.userId=u.id) 
    WHERE c.postId=? ORDER BY c.createdAt DESC`;
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addComment = (req, res) => {
  let jwtToken;
  const authHeader = req.body.headers.Authorization;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    return res.status(401).json("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json(err);

      const q = "INSERT INTO comments (`desc`,`createdAt`,`userId`,`postId`) VALUES (?)";

      const values=[
          req.body.data.desc,
          moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          userInfo.id,
          req.body.data.postId
      ]

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment has been posted");
      });
    });
  }
};
