import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login", // Ensina ao middleware onde é a porta de entrada
  },
});

export const config = {
  matcher: [
    "/admin/:path*", // Protege tudo dentro de /admin
  ],
};