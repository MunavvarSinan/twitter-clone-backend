import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'


const authRoutes = express.Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION = 10
const AUTHENTICATION_EXPIRATION = 24

function generateEmailToken() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
const JWT_SECRET = process.env.JWT_SECRET as string;
function generateAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId };
    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
}
// it creates a user if no user exists and geneate an emailToken and send it to the mail
authRoutes.post('/login', async (req, res) => {
    const { email } = req.body;

    // generate a token
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION * 60 * 1000);
    try {
        // check if the token exists and delete it
        const ifTokenExists = await prisma.token.findFirst({
            where: {
                type: 'EMAIL',
                user: {
                    email
                }
            },
        })
        if (ifTokenExists) {
            await prisma.token.delete({
                where: {
                    id: ifTokenExists.id
                }
            })
        }
        const createdToken = await prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email },
                    },
                },
            },
        });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'munavvarsinan987@gmail.com',
                pass: 'lbcibaxivctdhjbd',
            },
        });
        const message = {
            from: 'munavvarsinan987@gmail.com',
            to: email,
            subject: 'OTP Verification',
            html: `<html>
<head>
  <meta charset="UTF-8">
  <title>OTP Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
    }

    h1 {
      color: #333333;
    }

    h2 {
      color: #555555;
    }

    p {
      color: #555555;
    }

    .otp {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>OTP Verification</h1>
  <p>Your One-Time Password (OTP) is:</p>
  <h2 class="otp">${emailToken}</h2>
  <p>Please use this OTP to verify your account.</p>
</body>
</html>`
        }
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log(info.response);
            }
        })
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
})

authRoutes.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body;

    const token = await prisma.token.findFirst({
        where: { emailToken, type: 'EMAIL' },
        include: { user: true },
    })
    if (!token || !token.valid) {
        console.log('reached valid')
        return res.status(400).json({ error: "Invalid token" });
    }
    console.log({ user: token.user.email, email })

    if (token.expiration < new Date()) {
        console.log('reached date')
        return res.status(400).json({ error: "Your token has expired" })
    }
    if (token?.user?.email !== email) {
        return res.status(400).json({ error: 'Invalid token' })
    }

    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION * 60 * 60 * 1000);
    const ifTokenExists = await prisma.token.findFirst({
        where: {
            type: 'API',
            user: {
                email
            }
        },
    })
    if (ifTokenExists) {
        await prisma.token.delete({
            where: {
                id: ifTokenExists.id
            }
        })
    }
    const apiToken = await prisma.token.create({
        data: {
            type: 'API',
            expiration,
            user: {
                connect: {
                    email
                }
            }
        }
    })
    await prisma.token.delete({
        where: { id: token.id },
    })

    const authToken = generateAuthToken(apiToken.id)
    console.log(authToken);

    res.status(200).json({ message: "Authentication successful", authToken });
})
export default authRoutes;