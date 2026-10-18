import Pricing from './PricingClient';
import {billingReady} from '../../lib/billing';
export const metadata = {
  "title": "Fonctionnalités et tarifs | LeadsBuilder Suisse",
  "description": "Découvrez les fonctions de LeadsBuilder pour suivre vos contacts, leurs statuts et vos échanges. Consultez les modalités de la version de découverte.",
  "alternates": {
    "canonical": "/pricing"
  },
  "openGraph": {
    "title": "Fonctionnalités et tarifs | LeadsBuilder Suisse",
    "description": "Découvrez les fonctions de LeadsBuilder pour suivre vos contacts, leurs statuts et vos échanges. Consultez les modalités de la version de découverte.",
    "url": "/pricing",
    "type": "website",
    "locale": "fr_CH",
    "siteName": "Swissbuisness LeadsBuilder"
  }
};

export const dynamic='force-dynamic';
export default function Page(){return <Pricing ready={billingReady()}/>;}
