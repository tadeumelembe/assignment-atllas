import IRoute from '../types/IRoute';
import { Router } from 'express';
import { compareSync, genSalt, hash } from 'bcrypt';
import { attachSession } from '../middleware/auth';
import { ISession, sequelize, Session, User } from '../services/db';
import { randomBytes } from 'crypto';

const AuthRouter: IRoute = {
  route: '/auth',
  router() {
    const router = Router();
    router.use(attachSession);

    // If we're authenticated, return basic user data.
    router.get('/', (req, res) => {
      if (req.session?.token?.id) {
        const {
          token: { token, ...session },
          user: { password, ...user },
        } = req.session;
        return res.json({
          success: true,
          message: 'Authenticated',
          data: {
            session,
            user,
          },
        });
      } else {
        return res.json({
          success: false,
          message: 'Not Authenticated',
        });
      }
    });

    // Attempt to log in
    router.post('/login', async (req, res) => {
      const {
        username,
        password,
      } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password.',
        });
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username),
        ),
      }).catch(err => console.error('User lookup failed.', err));

      // Ensure the user exists. If not, return an error.
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // Ensure the password is correct. If not, return an error.
      if (!compareSync(password, user.dataValues.password)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // We now know the user is valid so it's time to mint a new session token.
      const { session, sessionToken } = await generateSession(user.dataValues.id)

      if (!session) return passError('Returned session was nullish.', null, res);

      // We set the cookie on the response so that browser sessions will
      // be able to use it.
      res.cookie('SESSION_TOKEN', sessionToken, {
        expires: new Date(Date.now() + (3600 * 24 * 7 * 1000)), // +7 days
        secure: false,
        httpOnly: true,
      });

      // We return the cookie to the consumer so that non-browser
      // contexts can utilize it easily. This is a convenience for the
      // take-home so you don't have to try and extract the cookie from
      // the response headers etc. Just know that this is a-standard
      // in non-oauth flows :)
      delete user.dataValues.password;
      return res.json({
        success: true,
        message: 'Authenticated Successfully.',
        data: {
          token: sessionToken,
          user: user
        },
      });
    });

    // Attempt to register
    router.post('/register', async (req, res) => {
      // TODO
      const {
        username,
        name,
        password,
      } = req.body;

      if (!username || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password/name.',
        });
      }

      //Check if user exists
      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username),
        ),
      })
      if (user) return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });

      //Hash password
      const salt = await genSalt(10)
      const hashedPassword = await hash(password, salt)

      const storedUser = await User.create({
        username: username,
        displayName: name,
        password: hashedPassword,
        registered: new Date()
      }).catch(err => console.error('Error creating user.', err));

      if (!storedUser) return passError('Error creating user', null, res);


      const { session, sessionToken } = await generateSession(storedUser.dataValues.id)

      if (!session) return passError('Returned session was nullish.', null, res);

      // We set the cookie on the response so that browser sessions will
      // be able to use it.
      res.cookie('SESSION_TOKEN', sessionToken, {
        expires: new Date(Date.now() + (3600 * 24 * 7 * 1000)), // +7 days
        secure: false,
        httpOnly: true,
      });

      return res.json({
        success: true,
        message: 'User Created Successfully.',
        data: {
          token: sessionToken,
          user: storedUser
        },
      });


    });

    // Log out
    router.post('/logout', (req, res) => {
      // TODO
      if (req.session?.token?.id) {
        res.cookie('SESSION_TOKEN', '', {
          expires: new Date(Date.now()), // expire now
          secure: false,
          httpOnly: true,
        });
        return res.json({
          success: true,
          message: 'Logout Successfully',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Not authenticated',
        });
      }
    });

    return router;
  },
};

export default AuthRouter;

function passError(message, error, response) {
  console.error(message, error);
  return response.status(500).json({
    success: false,
    message: `Internal: ${message}`,
  });
}

async function generateSession(user_id: number): Promise<{ session: ISession, sessionToken: string }> {
  const sessionToken = randomBytes(32).toString('hex');

  let session;
  try {
    // Persist the token to the database.
    session = await Session.create({
      token: sessionToken,
      user: user_id,
    });
  } catch (e) {
    return e;
  }

  return {
    session,
    sessionToken
  };
}