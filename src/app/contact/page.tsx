import { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContactFormCard } from '@/components/contact/ContactFormCard';
import { Mail, MapPin, Phone, Linkedin, Instagram, Twitter, Github, Youtube } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact — GDGOC IAR',
  description: 'Get in touch with GDGOC at the Institute of Advanced Research.',
};

const socials = [
  { Icon: Github, label: 'GitHub', href: '#', color: 'hover:text-white' },
  { Icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:text-g-blue' },
  { Icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-g-red' },
  { Icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-g-blue' },
  { Icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-g-red' },
];

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="bg-number">CONTACT</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-number mb-4">01 — Get In Touch</div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Let&apos;s <span className="google-gradient-text">Connect</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl">
            Have a question, partnership proposal, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ContactFormCard />
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <GlassCard animate={false}>
                <h3 className="section-number mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Mail size={16} className="text-g-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-mono text-white/35 mb-0.5">Email</div>
                      <a href="mailto:gdgoc@iar.ac.in" className="text-white text-sm hover:text-g-blue transition-colors">gdgoc@iar.ac.in</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={16} className="text-g-green mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-mono text-white/35 mb-0.5">Phone</div>
                      <span className="text-white text-sm">+91 98765 43210</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-g-red mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-mono text-white/35 mb-0.5">Location</div>
                      <span className="text-white text-sm leading-relaxed">Institute of Advanced Research<br />Koba Institutional Area<br />Gandhinagar, Gujarat 382426</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard animate={false}>
                <h3 className="section-number mb-4">Follow Us</h3>
                <div className="grid grid-cols-5 gap-2">
                  {socials.map(({ Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border border-white/5 hover:border-white/15 text-white/30 ${color} transition-all`}
                    >
                      <Icon size={15} />
                      <span className="text-[9px] font-mono">{label}</span>
                    </a>
                  ))}
                </div>
              </GlassCard>

              <GlassCard animate={false}>
                <h3 className="section-number mb-4">Campus Map</h3>
                <div className="rounded-lg overflow-hidden h-48 border border-white/10 relative">
                  <iframe
                    src="https://maps.google.com/maps?q=Institute%20of%20Advanced%20Research,%20Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </GlassCard>

              <GlassCard animate={false}>
                <h3 className="section-number mb-4">Operating Hours</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/40">Mon – Fri</span>
                    <span className="text-white/70">10:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Saturday</span>
                    <span className="text-white/70">11:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Sunday</span>
                    <span className="text-white/40">Closed</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle number="02" title="Find Us On Campus" />
          <div className="mt-8 rounded-2xl overflow-hidden h-96 border border-white/10 relative">
            <iframe
              src="https://maps.google.com/maps?q=Institute%20of%20Advanced%20Research,%20Gandhinagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

