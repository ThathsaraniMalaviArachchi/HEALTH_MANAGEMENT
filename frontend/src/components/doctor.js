const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);


const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor


    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
  next();
});

module.exports = mongoose.model('Doctorconst mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    ', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.mode
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  specialization: {
    type: String,
    required: [true, 'Please enter your specialization'],
    enum: [
      'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
      'Orthopedics', 'Ophthalmology', 'Psychiatry', 'Radiology',
      'General Medicine', 'Dentistry', 'Gynecology', 'Urology'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please enter your license number'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  ],
  consultationFee: {
    type: Number,
    required: [true, 'Please enter consultation fee']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: [
    {
      patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient'
      },
      name: String,
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  profilePicture: {
    public_id: String,
    url: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Return JWT token
doctorSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  });
};

// Compare password
doctorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update timestamp on update
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Doctor', doctor
    l('Doctor', doctor