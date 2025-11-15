import { AuthSection } from './_components/auth-section';
import { GuestHero } from './_components/guest-hero';

export default function Home() {
  return (
    <div className="container mx-auto max-w-2xl px-4 pt-safe pb-8 md:pb-12 md:pt-28">
      <section className="mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">
          Craft Your Perfect Elixir
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Tell our AI mixologist what you're in the mood for, and it will invent a unique cocktail recipe just for you.
        </p>
      </section>

      <section>
        <AuthSection guestHero={<GuestHero />} />
      </section>
    </div>
  );
}
