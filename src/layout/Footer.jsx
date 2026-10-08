import { Link } from 'react-router-dom';
import Brand from '../components/Brand/Brand.jsx';
import { Fact } from '../components/Dummy/Dummy.jsx';
import { nav, site } from '../data/site.js';
import './Footer.css';

const legal = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of use', to: '/terms' },
  { label: 'Refund policy', to: '/refunds' }
];

export default function Footer() {
  return (
    <footer className="footer section" data-theme="navy">
      <div className="container footer__grid">
        <div className="footer__about">
          <Brand size="lg" />
          <p className="footer__line">{site.tagline}.</p>
        </div>

        <nav aria-label="Footer">
          <p className="label">Product</p>
          <ul>
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label">Talk to us</p>
          <ul>
            <li><Fact field={site.contact.phone} /></li>
            <li><Fact field={site.contact.email} /></li>
            <li><Fact field={site.contact.address} /></li>
          </ul>
        </div>

        <div>
          <p className="label">Legal</p>
          <ul>
            {legal.map((n) => (
              <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer__base">
        <p>© {new Date().getFullYear()} SmartShala</p>
        <p lang="hi" className="footer__hi">शाला — school</p>
      </div>
    </footer>
  );
}
