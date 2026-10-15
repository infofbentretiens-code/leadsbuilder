import './globals.css';
export const metadata = {
  title: 'Swissbuisness LeadsBuilder',
  description: 'Plateforme de gestion de leads pour F.B Rénovations et Nettoyages',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {process.env.SUPABASE_DATA_READY !== 'true' && <div role="status" style={{padding:'12px 20px',background:'#fff7ed',textAlign:'center'}}>Ouverture en préparation : les inscriptions seront bientôt disponibles.</div>}{children}
      </body>
    </html>
  )
}

