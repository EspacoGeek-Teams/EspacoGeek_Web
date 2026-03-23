import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Footer, TopBar } from '../src/components/layout/Layout';
import HomeLandingContent from '../src/components/home/HomeLandingContent';
import StarfieldCanvas from '../src/components/home/StarfieldCanvas';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export default function Page() {
  return (
    <>
      <TopBar />

      <main className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} landing-home-theme relative min-h-screen overflow-hidden`}>
        <StarfieldCanvas />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 pt-32">
          <HomeLandingContent />
        </div>
      </main>

      <Footer />
    </>
  );
}
