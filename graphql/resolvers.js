const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'comp3133_secret_key';

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return { token, user };
    },

    getAllEmployees: async () => {
      return await Employee.find();
    },

    getEmployeeById: async (_, { id }) => {
      return await Employee.findById(id);
    },

    searchEmployeeByDeptOrPosition: async (_, { department, position }) => {
      let filter = {};
      if (department) {
        filter.department = { $regex: department, $options: 'i' };
      }
      if (position) {
        filter.designation = { $regex: position, $options: 'i' };
      }
      return await Employee.find(filter);
    }
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword
      });
      return await user.save();
    },

    addEmployee: async (_, args) => {
      const existingEmployee = await Employee.findOne({ email: args.email });
      if (existingEmployee) {
        throw new Error('Employee with this email already exists');
      }
      const employee = new Employee(args);
      return await employee.save();
    },

    updateEmployee: async (_, { id, ...updates }) => {
      const cleanUpdates = {};
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null) {
          cleanUpdates[key] = updates[key];
        }
      });
      cleanUpdates.updatedAt = new Date();
      return await Employee.findByIdAndUpdate(id, cleanUpdates, { new: true });
    },

    deleteEmployee: async (_, { id }) => {
      return await Employee.findByIdAndDelete(id);
    }
  }
};

module.exports = resolvers;
