import express from 'express';
import axios from 'axios';
import { DiscordGuildMember, DiscordUser } from './types/discord';
import jwt from 'jsonwebtoken'

const authRoutes = express.Router();

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  DISCORD_GUILD_ID,
  DISCORD_EDITOR_ROLE_IDS,
} = process.env;

authRoutes.post('/callback', async (req: any, res: any) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: DISCORD_REDIRECT_URI!,
        scope: 'identify guilds guilds.members.read',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get<DiscordUser>('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const memberRes = await axios.get<DiscordGuildMember>(
      `https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    
    const allowedRoles = DISCORD_EDITOR_ROLE_IDS!.split(',');
    const hasEditorRole = memberRes.data.roles.some(role => allowedRoles.includes(role));

    const payload = {
      id: userRes.data.id,
      username: userRes.data.username,
      avatar: userRes.data.avatar,
      nick: memberRes.data.nick,
      canEdit: hasEditorRole,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '12h',
    });

    return res.json({ token: jwtToken });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Discord auth failed' });
  }
});


export default authRoutes;
