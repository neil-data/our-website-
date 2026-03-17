import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Instagram, Twitter, Youtube, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Events', href: '/events' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Media', href: '/media' },
    { label: 'Community', href: '/community' },
  ],
  Chapter: [
    { label: 'About Us', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
    { label: 'Join Us', href: '/login?mode=register' },
  ],
  Resources: [
    { label: 'Google Developers', href: 'https://developers.google.com' },
    { label: 'GDG Community', href: 'https://gdg.community.dev' },
    { label: 'Codelabs', href: 'https://codelabs.developers.google.com' },
    { label: 'DevFest', href: '#' },
  ],
};

const socials = [
  { Icon: Github, href: '#', label: 'GitHub' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      {/* Top glow bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-g-blue/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="GDGOC IAR logo"
                width={30}
                height={30}
                className="rounded-sm"
              />
              <span className="font-heading font-bold text-white text-sm tracking-wide">
                GDGOC <span className="text-white/30">×</span>{' '}
                <span className="text-g-blue">IAR</span>
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-6">
              Google Developer Groups On Campus at the Institute of Advanced Research. Building the next generation of developers.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded border border-white/8 text-white/40 hover:text-white hover:border-g-blue/40 transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                <Mail size={12} />
                <span>gdgoc@iar.ac.in</span>
              </div>
              <div className="flex items-center gap-2 text-white/35 text-xs font-mono">
                <MapPin size={12} />
                <span>Institute of Advanced Research, Gandhinagar</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white/60 text-xs font-mono uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-white/35 text-sm hover:text-white transition-colors animated-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="separator-line mt-12 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-mono">
            © 2025 GDGOC IAR. All rights reserved.
          </p>
          <span className="text-white/20 text-xs font-mono">Powered by Google Developer Groups</span>
        </div>
      </div>
    </footer>
  );
}
