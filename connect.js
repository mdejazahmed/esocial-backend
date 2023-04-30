import mysql2 from 'mysql2';

export const db=mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"merimaa@5657",
    database:"esocial"
})

db.connect(function (err) {
    if (err) {
        console.log('Error connecting to Database',err);
        return;
    }
    console.log('Connection established');
});