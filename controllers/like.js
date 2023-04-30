import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = `SELECT userId FROM likes WHERE postId =?`;
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

export const addLike = (req, res) => {
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

      const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";

      const values = [userInfo.id, req.body.data.postId];
console.log(req.body.data.postId)
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been liked");
      });
    });
  }
};

export const deleteLike = (req, res) => {
  let jwtToken;
  const authHeader = req.headers.authorization;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    return res.status(401).json("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json(err);

      const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

      db.query(q, [userInfo.id,req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been disliked");
      });
    });
  }
};
