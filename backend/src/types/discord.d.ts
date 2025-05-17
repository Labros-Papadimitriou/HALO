export interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
  }
  
  export interface DiscordGuildMember {
    roles: string[];
    nick: string;
  }
  