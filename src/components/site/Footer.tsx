import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-[#F6F6F4] border-t border-border relative overflow-hidden">
      <div className="container-luxe pt-24 pb-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="heading-xl">
              Let's design<br/>
              <span className="italic-serif text-accent">something lasting.</span>
            </h2>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-4 group"
            >
              <span className="w-14 h-14 rounded-full border border-white/70 group-hover:bg-accent group-hover:border-accent transition-colors inline-flex items-center justify-center">→</span>
              <span className="uppercase tracking-[0.2em] text-xs">Book a consultation</span>
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="eyebrow text-accent mb-4">Studio</div>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/studio" className="hover:text-white">About</Link></li>
                <li><Link to="/process" className="hover:text-white">Process</Link></li>
                <li><Link to="/journal" className="hover:text-white">Journal</Link></li>
                <li><Link to="/contact" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow text-accent mb-4">Work</div>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/projects" className="hover:text-white">Residential</Link></li>
                <li><Link to="/projects" className="hover:text-white">Commercial</Link></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow text-accent mb-4">Contact</div>
              <ul className="space-y-2 text-white/70">
                <li>12 Kala Ghoda Lane<br/>Mumbai 400001</li>
                <li>hello@ssarchitects.com</li>
                <li>+91 22 4890 2200</li>
              </ul>
            </div>
            <div>
              <div className="eyebrow text-accent mb-4">Follow</div>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white">Pinterest</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50">
          <div>© {new Date().getFullYear()} SS Architects &amp; Interiors. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
