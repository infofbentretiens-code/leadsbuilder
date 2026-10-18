
import Link from 'next/link';
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


export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1F2937',
        }}>
          🚀 LeadsBuilder
        </h2>
        <div style={{
          display: 'flex',
          gap: '20px',
        }}>
          <Link href="/pricing" style={{
            color: '#3B82F6',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Tarifs
          </Link>
          <Link href="/auth/login" style={{
            color: '#3B82F6',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Se connecter
          </Link>
          <Link href="/pricing" style={{
            padding: '10px 24px',
            backgroundColor: '#3B82F6',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 40px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 7vw, 56px)',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: '#1F2937',
          maxWidth: '800px',
        }}>
          Gérez efficacement vos leads commerciaux
        </h1>

        <p style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '700px',
          lineHeight: '1.6',
        }}>
          LeadsBuilder est une solution simple pour gérer vos leads commerciaux. Suivi des statuts, tableau de bord et historique des interactions — tout dans une seule plateforme intuitive.
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '80px', flexWrap: 'wrap',
        }}>
          <Link href="/pricing" style={{
            padding: '14px 40px',
            backgroundColor: '#3B82F6',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '16px',
          }}>
            Découvrir gratuitement
          </Link>
          <Link href="/pricing" style={{
            padding: '14px 40px',
            border: '2px solid #3B82F6',
            color: '#3B82F6',
            borderRadius: '8px',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '16px',
            backgroundColor: 'transparent',
          }}>
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: 'white',
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '60px',
          color: '#1F2937',
        }}>
          Fonctionnalités puissantes
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            padding: '30px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
            }}>
              📊
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1F2937',
            }}>
              Tableau de bord
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
            }}>
              Consultez le nombre de contacts à chaque étape : nouveau, contacté, qualifié, perdu ou converti.
            </p>
          </div>

          <div style={{
            padding: '30px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
            }}>
              ✉️
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1F2937',
            }}>
              Notifications par e-mail — à venir
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
            }}>
              Les alertes par e-mail sont prévues dans une prochaine étape. Retrouvez dès maintenant vos contacts et leur statut dans votre espace.
            </p>
          </div>

          <div style={{
            padding: '30px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
            }}>
              👥
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1F2937',
            }}>
              Historique des échanges
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
            }}>
              Retrouvez vos appels, réunions et notes pour chaque contact et préparez vos prochaines relances.
            </p>
          </div>

          <div style={{
            padding: '30px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
            }}>
              📁
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1F2937',
            }}>
              Gestion des leads
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
            }}>
              Enregistrez les coordonnées, la source et les notes de chaque contact. Faites évoluer son statut au fil des échanges.
            </p>
          </div>

          <div style={{
            padding: '30px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
            }}>
              ⚙️
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1F2937',
            }}>
              Un espace personnel
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
            }}>
              Connectez-vous pour retrouver les contacts et les interactions associés à votre compte.
            </p>
          </div>

          <div style={{
            padding: '30px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '40px',
              marginBottom: '16px',
            }}>
              📈
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1F2937',
            }}>
              Prêt pour la croissance
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
            }}>
              Ajoutez vos propres contacts, recherchez un nom et exportez votre liste au format CSV.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: '#3B82F6',
        color: 'white',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '40px',
          fontWeight: 'bold',
          marginBottom: '24px',
        }}>
          Prêt à construire votre pipeline commercial ?
        </h2>

        <p style={{
          fontSize: '18px',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
        }}>
          Découvrez les fonctions de gestion de contacts. Aucune carte de crédit requise. Aucun prélèvement automatique.
        </p>

        <Link href="/pricing" style={{
          padding: '14px 40px',
          backgroundColor: 'white',
          color: '#3B82F6',
          borderRadius: '8px',
          fontWeight: '600',
          textDecoration: 'none',
          fontSize: '16px',
          display: 'inline-block',
        }}>
          Commencer gratuitement
        </Link>
      </section>

      {/* Dashboard Preview for Logged-In Users */}
      <section style={{
        padding: '60px 40px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '20px',
        }}>
          Vous avez déjà un compte ?{' '}
          <Link href="/dashboard" style={{
            color: '#3B82F6',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Accédez au tableau de bord
          </Link>
        </p>
      </section>
    </div>
  );
}
