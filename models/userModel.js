import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      // make sure to start this at false
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// middleware that compares the unencrypted password with the encrypted password
userSchema.methods.matchPassword = async function ( enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password)
}
// middleware that runs before we save a new user to the db, we're going to use it to save a hashed password instead of just the passowrd that's entered!
userSchema.pre('save', async function(next){
  // we only want to run this if the password field is sent / modified we don't want to do this if we're updating the user or it'll change the password and they can't logg in
  // so if password is not modified, we won't run the hash
  if(!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
