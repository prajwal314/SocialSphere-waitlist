import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#7c3aed" />
        <meta property="og:title" content="SocialSphere | Join the Waitlist" />
        <meta
          property="og:description"
          content="Join the SocialSphere waitlist and be the first to experience a smarter way to find friends, travel buddies, roommates, co-founders and activity partners."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://socialspherenow.in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SocialSphere | Join the Waitlist" />
        <meta
          name="twitter:description"
          content="Join the SocialSphere waitlist and be the first to experience a smarter way to find friends, travel buddies, roommates, co-founders and activity partners."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
