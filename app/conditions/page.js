import Link from 'next/link';
export const metadata = {
  "title": "Conditions d’utilisation du service | LeadsBuilder",
  "description": "Consultez les conditions du service LeadsBuilder : utilisation du compte, version de découverte, abonnements et disponibilité.",
  "alternates": {
    "canonical": "/conditions"
  },
  "openGraph": {
    "title": "Conditions d’utilisation du service | LeadsBuilder",
    "description": "Consultez les conditions du service LeadsBuilder : utilisation du compte, version de découverte, abonnements et disponibilité.",
    "url": "/conditions",
    "type": "website",
    "locale": "fr_CH",
    "siteName": "Swissbuisness LeadsBuilder"
  }
};

export default function Terms(){return <main className="max-w-3xl mx-auto p-6 py-12 space-y-5"><Link href="/" className="text-blue-700">← Accueil</Link><h1 className="text-3xl font-bold">Conditions du service</h1><p>Mise à jour : 15 octobre 2026.</p><h2 className="text-xl font-bold">Service et contact</h2><p>LeadsBuilder permet de gérer des contacts commerciaux, leur statut et l’historique de vos échanges. Il ne fournit pas automatiquement de prospects et ne garantit aucun chiffre d’affaires. Assistance : <a className="text-blue-700" href="mailto:info.fbentretiens@gmail.com">info.fbentretiens@gmail.com</a>. {process.env.LEGAL_NAME&&<>Responsable : {process.env.LEGAL_NAME}. {process.env.LEGAL_ADDRESS}</>}</p><h2 className="text-xl font-bold">Version de découverte</h2><p>La création d’un compte ne demande pas de carte et ne déclenche aucun paiement. Les fonctions disponibles sont décrites sur la page des tarifs. Les fonctions annoncées comme à venir ne sont pas incluses. Conservez une copie des informations importantes grâce à l’export CSV.</p><h2 className="text-xl font-bold">Compte et utilisation</h2><p>Vous êtes responsable de la confidentialité de vos identifiants et des données que vous ajoutez. N’utilisez pas le service pour envoyer des messages non sollicités, porter atteinte à autrui ou conserver des informations obtenues sans autorisation. Signalez toute utilisation suspecte à l’assistance.</p><h2 className="text-xl font-bold">Abonnements</h2><p>Tant que la facturation n’est pas ouverte, aucun abonnement n’est prélevé. Lorsqu’elle sera ouverte, le forfait Essentiel sera proposé à 29 CHF par mois ou 290 CHF par an pour un utilisateur. Le récapitulatif Stripe indique le montant à payer avant validation. Après une souscription explicite, l’abonnement est renouvelé automatiquement pour la période choisie. La demande de résiliation se fait depuis le portail de facturation accessible dans Mon abonnement ; sa date d’effet y est indiquée. Pour toute question de facturation ou demande de remboursement, contactez l’assistance. Aucun remboursement automatique n’est promis sur cette page.</p><h2 className="text-xl font-bold">Disponibilité et données</h2><p>Des interruptions peuvent survenir, notamment lors de maintenances ou d’incidents chez les prestataires. Le service ne garantit pas une disponibilité permanente. Vous pouvez demander la fermeture du compte et la suppression de ses données auprès de l’assistance. Les données personnelles sont décrites sur la page de confidentialité.</p><p><Link className="text-blue-700" href="/confidentialite">Lire la politique de confidentialité</Link></p></main>;}
