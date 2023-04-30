import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getFollowers = (req, res) => {
  const q = `SELECT followerUserId FROM relationships WHERE followedUserId =?`;
  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((relationship) => relationship.followerUserId));
  });
};

export const follow = (req, res) => {
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

      const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";

      const values = [userInfo.id, req.body.data.userId];
console.log(req.body.data.userId)
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been followed");
      });
    });
  }
};

export const unfollow = (req, res) => {
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

      const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

      db.query(q, [userInfo.id,req.query.unfollowUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been unfollowed");
      });
    });
  }
};
