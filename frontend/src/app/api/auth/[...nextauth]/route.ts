import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Painel Admin",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        try {
          const res = await fetch("http://localhost:3001/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation Login($email: String!, $senha: String!) {
                  login(email: $email, senha: $senha) {
                    access_token
                    usuario {
                      id
                      nome
                      email
                      role
                    }
                  }
                }
              `,
              variables: {
                email: credentials.email,
                senha: credentials.senha
              }
            })
          });

          const json = await res.json();

          // 👇 O NOSSO ESPIÃO: Vai cuspir a resposta inteira do NestJS no terminal 👇
          console.log("🕵️‍♂️ RESPOSTA DO BACKEND NO LOGIN:", JSON.stringify(json, null, 2));

          const { data, errors } = json;

          if (errors) {
            console.error("🚨 O NESTJS RECUSOU O LOGIN. MOTIVO:", errors[0].message);
            return null; 
          }

          if (!data?.login) {
            console.error("🚨 BACKEND NÃO DEVOLVEU O OBJETO DE LOGIN!");
            return null;
          }

          const { access_token, usuario } = data.login;

          return {
            id: usuario.id.toString(),
            name: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            accessToken: access_token,
          };
        } catch (error) {
          console.error("🚨 ERRO CATASTRÓFICO DE CONEXÃO COM O BACKEND:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "CHAVE_SECRETA_VASCO_ANALYTICS_2026",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };