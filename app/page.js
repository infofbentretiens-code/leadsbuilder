import SwissHome from './components/SwissHome';
import './swiss-home.css';
export const metadata = {
  "title": "Gestion de contacts et suivi des prospects | LeadsBuilder Suisse",
  "description": "Centralisez vos contacts commerciaux, leurs statuts et l’historique des échanges avec LeadsBuilder. Un outil en français pour préparer vos relances.",
  "alternates": {
    "canonical": "/"
  },
  "openGraph": {
    "title": "Gestion de contacts et suivi des prospects | LeadsBuilder Suisse",
    "description": "Centralisez vos contacts commerciaux, leurs statuts et l’historique des échanges avec LeadsBuilder. Un outil en français pour préparer vos relances.",
    "url": "/",
    "type": "website",
    "locale": "fr_CH",
    "siteName": "Swissbuisness LeadsBuilder"
  }
};


export default function Home(){return <SwissHome/>;}

