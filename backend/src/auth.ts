import express from 'express';
import axios from 'axios';
import { DiscordGuildMember, DiscordUser } from './types/discord';

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
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: DISCORD_CLIENT_ID!,
      client_secret: DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: DISCORD_REDIRECT_URI!,
      scope: 'identify guilds guilds.members.read',
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenRes.data;

    const userRes = await axios.get<DiscordUser>('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const memberRes = await axios.get<DiscordGuildMember>(
      `https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const editorRoleIds = DISCORD_EDITOR_ROLE_IDS?.split(',') || [];
    const hasEditorRole = editorRoleIds.some(roleId =>
      memberRes.data.roles.includes(roleId)
    );

    return res.json({
      username: userRes.data.username,
      id: userRes.data.id,
      avatar: userRes.data.avatar,
      canEdit: hasEditorRole,
      nick: memberRes.data.nick ?? null
    });    
  } catch (error: any) {
    console.error('Discord error response:', error.response?.data);
    console.error('Full error:', error.message);
    return res.status(500).json({ error: 'Discord auth failed', detail: error.response?.data || error.message });
  }  
});

export default authRoutes;
