import Link from 'next/link';
export const metadata = {
  "title": "Contact et assistance | LeadsBuilder Suisse",
  "description": "Une question sur la gestion de vos contacts avec LeadsBuilder ? Contactez l’assistance Swissbuisness pour les fonctionnalités et l’utilisation du service.",
  "alternates": {
    "canonical": "/contact"
  },
  "openGraph": {
    "title": "Contact et assistance | LeadsBuilder Suisse",
    "description": "Une question sur la gestion de vos contacts avec LeadsBuilder ? Contactez l’assistance Swissbuisness pour les fonctionnalités et l’utilisation du service.",
    "url": "/contact",
    "type": "website",
    "locale": "fr_CH",
    "siteName": "Swissbuisness LeadsBuilder"
  }
};

export default function Contact(){return <main className="max-w-2xl mx-auto p-8"><Link href="/" className="text-blue-600">← Accueil</Link><h1 className="text-3xl font-bold mt-8 mb-4">Contact</h1><p>Pour toute question ou demande d’assistance, écrivez à <a className="text-blue-600" href="mailto:info.fbentretiens@gmail.com">info.fbentretiens@gmail.com</a>.</p></main>;}

