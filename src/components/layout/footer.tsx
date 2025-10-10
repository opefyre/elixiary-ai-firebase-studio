import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const socialLinks = [
  { icon: Twitter, href: "#", name: "Twitter" },
  { icon: Facebook, href: "#", name: "Facebook" },
  { icon: Instagram, href: "#", name: "Instagram" },
  { icon: Youtube, href: "#", name: "YouTube" },
];

export function Footer() {
  return (
    <footer className="w-full">
      <div className="relative h-96 w-full">
        <Image
          src="https://picsum.photos/seed/footerbg/1600/600"
          alt="Bartender mixing a cocktail"
          fill
          className="object-cover"
          data-ai-hint="cocktail bar"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-5xl font-bold font-headline">Join Our Community</h2>
          <p className="mt-4 max-w-md text-lg">
            Follow us on social media for the latest recipes, tips, and tricks from our mixologists.
          </p>
          <div className="mt-8 flex gap-4">
            {socialLinks.map((social) => (
              <Button
                key={social.name}
                asChild
                variant="outline"
                size="icon"
                className="rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              >
                <a href={social.href} aria-label={`Follow on ${social.name}`}>
                  <social.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <p className="text-sm text-primary-foreground/80">
            &copy; {new Date().getFullYear()} Elixiary. All Rights Reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="#" className="transition-colors hover:text-primary-foreground/80">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-primary-foreground/80">
              Terms of Service
            </Link>
            <Link href="#" className="transition-colors hover:text-primary-foreground/80">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
