import Head from "next/head"
import { WaitlistExperience } from "@/components/ui/waitlist-landing-page-with-countdown-timer"
import SocialSphereInfo from "@/components/socialsphere-info"
import MinimalFooter from "@/components/footer-minimal"

export default function Home() {
  return (
    <>
      <Head>
        <title>SocialSphere | Join the Waitlist</title>
        <meta
          name="description"
          content="Join the SocialSphere waitlist and be the first to experience a smarter way to find friends, travel buddies, roommates, co-founders and activity partners."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WaitlistExperience />
      <SocialSphereInfo />
      <MinimalFooter />
    </>
  )
}
