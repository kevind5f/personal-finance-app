import { User } from '../../models/User';
import jwt from 'jsonwebtoken';
import { useRuntimeConfig } from '#imports';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        message: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name
    });

    await user.save();

    // Generate JWT
    const config = useRuntimeConfig();
    const token = jwt.sign(
      { userId: user._id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    });
  }
}); 