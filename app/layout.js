import './globals.css';
import PublicAnalytics from './components/PublicAnalytics';
import SiteFooter from './components/SiteFooter';
export const metadata = {
  metadataBase: new URL('https://www.swissbuisness.com'),
  title: 'Swissbuisness LeadsBuilder',
  description: 'Organisez vos contacts commerciaux, suivez vos échanges et préparez vos relances avec LeadsBuilder.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {process.env.SUPABASE_DATA_READY !== 'true' && <div role="status" style={{padding:'12px 20px',background:'#fff7ed',textAlign:'center'}}>Ouverture en préparation : les inscriptions seront bientôt disponibles.</div>}{children}<SiteFooter/><PublicAnalytics/>
      </body>
    </html>
  )
}

