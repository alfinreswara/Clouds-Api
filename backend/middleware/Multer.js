import bcrypt from "bcrypt"

const salt = bcrypt.genSalt();
console.log(salt);