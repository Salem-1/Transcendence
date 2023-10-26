
import NextAuth from "next-auth/next"
import FortyTwoProvider from "next-auth/providers/42-school";

const handler = NextAuth({
    providers: [
        FortyTwoProvider({
          clientId: process.env.FORTY_TWO_CLIENTID ?? "" ,
          clientSecret: process.env.FORTY_TWO_CLIENTSECRET  ?? "",
        })
      ],
      callbacks: {
        async session({ session, token, user }) {

          // Send properties to the client, like an access_token and user id from a provider.
          session.accessToken = token.accessToken
          session.user.id = token.id
          
          return session
        },
        async jwt({ token, account, profile }) {

          // Persist the OAuth access_token and or the user id to the token right after signin
          if (account) {
            token.accessToken = account.access_token
            token.id = profile.id
          }
          return token
        }
        // async redirect({ url, baseUrl }) {
        //   // Allows relative callback URLs
        //   if (url.startsWith("/")) return `${baseUrl}${url}`
        //   // Allows callback URLs on the same origin
        //   else if (new URL(url).origin === baseUrl) return url
        //   return baseUrl
        // },
      }
})

export {handler as GET, handler as POST}