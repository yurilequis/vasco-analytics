import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Painel Admin",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        try {
          const res = await fetch((process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation Login($email: String!, $senha: String!) {
                  login(email: $email, senha: $senha) {
                    access_token
                    usuario { id, nome, email, role }
                  }
                }
              `,
              variables: { email: credentials.email, senha: credentials.senha }
            })
          });

          const json = await res.json();
          if (json.errors || !json.data?.login) return null;

          const { access_token, usuario } = json.data.login;
          return {
            id: usuario.id.toString(),
            name: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            access_token
          };
        } catch (error) {
          console.error("Erro no login:", error);
          return null;
        }
      }
    }),
    CredentialsProvider({
      id: "register",
      name: "Register",
      credentials: {
        nome: { label: "Nome", type: "text" },
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.nome || !credentials?.email || !credentials?.senha) return null;

        try {
          const res = await fetch((process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation Registrar($nome: String!, $email: String!, $senha: String!) {
                  registrar(nome: $nome, email: $email, senha: $senha) {
                    access_token
                    usuario { id, nome, email, role }
                  }
                }
              `,
              variables: { nome: credentials.nome, email: credentials.email, senha: credentials.senha }
            })
          });

          const json = await res.json();
          if (json.errors || !json.data?.registrar) return null;

          const { access_token, usuario } = json.data.registrar;
          return {
            id: usuario.id.toString(),
            name: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            access_token
          };
        } catch (error) {
          console.error("Erro no registro:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch((process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation LoginComGoogle($email: String!, $nome: String!, $googleId: String!) {
                  loginComGoogle(email: $email, nome: $nome, googleId: $googleId) {
                    access_token
                    usuario { id, nome, email, role }
                  }
                }
              `,
              variables: { 
                email: user.email, 
                nome: user.name || profile?.name || "Usuário", 
                googleId: account.providerAccountId 
              }
            })
          });

          const json = await res.json();
          if (json.errors || !json.data?.loginComGoogle) return false;

          const { access_token, usuario } = json.data.loginComGoogle;
          user.id = usuario.id.toString();
          user.role = usuario.role;
          user.access_token = access_token;
          
          return true;
        } catch (error) {
          console.error("Erro no login com Google:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.access_token = token.access_token;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };