
import { Button } from "@/components/ui/button";
import { FaDiscord, FaTelegramPlane, FaTwitter } from "react-icons/fa";

const socialLinks = [
  { name: "Telegram", href: "#", icon: FaTelegramPlane },
  { name: "Discord", href: "#", icon: FaDiscord },
  { name: "Twitter", href: "#", icon: FaTwitter },
];

export default function CommunitySection() {
  return (
    <section id="comunidad" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Únete a la Comunidad</h2>
          <p className="mt-4 text-lg text-muted-foreground">Somos un movimiento de código abierto. Participa en la conversación, contribuye con ideas y ayúdanos a construir el futuro de las finanzas en los Andes.</p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            {socialLinks.map((link) => (
              <Button key={link.name} variant="outline" size="icon" asChild>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
