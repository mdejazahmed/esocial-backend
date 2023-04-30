import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  let jwtToken;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    return res.status(401).json("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json(err);

      const q =
        userId === "undefined"
          ? `SELECT p.*,u.id as userId,u.username AS username, u.profileImg AS userImg FROM posts as p JOIN users AS u ON (p.userId=u.id) LEFT JOIN
    relationships AS r ON (p.userId=r.followedUserId) WHERE r.followerUserId=? OR p.userId=? ORDER BY p.createdAt DESC`
          : `SELECT p.*,u.id as userId,u.username AS username, u.profileImg AS userImg FROM posts as p JOIN users AS u ON (p.userId=u.id) WHERE p.userId=? `;

      const values =
        userId === "undefined" ? [userInfo.id, userInfo.id] : [userId];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  }
};

export const addPost = (req, res) => {
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

      const q =
        "INSERT INTO posts (`desc`,`img`,`userId`,`createdAt`) VALUES (?)";

      const values = [
        req.body.data.desc,
        req.body.data.img,
        userInfo.id,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      ];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created");
      });
    });
  }
};

export const deletePost = (req, res) => {
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

      const q = "DELETE FROM posts WHERE `id`=? AND `userId`=?";

      const values = [req.params.postId, userInfo.id];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been deleted");
      });
    });
  }
};
