'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/client-data';
import Link from 'next/link';
import AccountNav from '../components/AccountNav';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    contacte: 0,
    qualifie: 0,
    perdu: 0,
    converti: 0,
  });
  const [dataError, setDataError] = useState('');
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Récupérer tous les leads
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculer les statistiques
      const newStats = {
        total: leads.length,
        nouveau: leads.filter(l => l.statut === 'nouveau').length,
        contacte: leads.filter(l => l.statut === 'contacte').length,
        qualifie: leads.filter(l => l.statut === 'qualifie').length,
        perdu: leads.filter(l => l.statut === 'perdu').length,
        converti: leads.filter(l => l.statut === 'converti').length,
      };

      setStats(newStats);
      setRecentLeads(leads.slice(0, 5)); // Afficher les 5 leads les plus récents
    } catch (error) {
      setDataError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      nouveau: '#3B82F6',
      contacte: '#F59E0B',
      qualifie: '#10B981',
      perdu: '#EF4444',
      converti: '#8B5CF6',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      nouveau: 'Nouveau',
      contacte: 'Contacté',
      qualifie: 'Qualifié',
      perdu: 'Perdu',
      converti: 'Converti',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <AccountNav />{dataError && <p role="alert" className="bg-red-50 text-red-800 p-4">{dataError}</p>}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px', fontSize: '28px', fontWeight: 'bold' }}>
          📊 Tableau de bord
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Vue d'ensemble de votre base de leads
        </p>
      </div>

      {/* Carte statistiques globales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px',
      }}>
        <div style={{
          backgroundColor: '#F3F4F6',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Total de leads
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937' }}>
            {stats.total}
          </div>
        </div>

        {Object.entries({
          nouveau: '🆕 Nouveau',
          contacte: '📞 Contacté',
          qualifie: '⭐ Qualifié',
          perdu: '❌ Perdu',
          converti: '✅ Converti',
        }).map(([key, label]) => (
          <div key={key} style={{
            backgroundColor: `${getStatusColor(key)}15`,
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${getStatusColor(key)}40`,
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: getStatusColor(key) }}>
              {stats[key]}
            </div>
          </div>
        ))}
      </div>

      {/* Graphique en barres des statuts */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        marginBottom: '30px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
          Distribution par statut
        </h2>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '200px' }}>
          {Object.entries({
            nouveau: stats.nouveau,
            contacte: stats.contacte,
            qualifie: stats.qualifie,
            perdu: stats.perdu,
            converti: stats.converti,
          }).map(([status, count]) => {
            const maxValue = Math.max(...Object.values(stats)) || 1;
            const height = (count / maxValue) * 100;
            return (
              <div key={status} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: `${count ? Math.max(12, height * 1.6) : 2}px`,
                  backgroundColor: getStatusColor(status),
                  borderRadius: '4px 4px 0 0',
                  minHeight: '2px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  paddingBottom: '4px',
                }}>
                  {count > 0 ? count : ''}
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', textAlign: 'center', color: '#666' }}>
                  {getStatusLabel(status).slice(0, 3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leads récents */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Leads récents
        </h2>
        {recentLeads.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            Aucun lead pour le moment
          </p>
        ) : (
          <div style={{
            overflowX: 'auto',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>
                    Nom
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>
                    Entreprise
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>
                    Statut
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} style={{
                    borderBottom: '1px solid #E5E7EB',
                    '&:hover': { backgroundColor: '#F9FAFB' },
                  }}>
                    <td style={{ padding: '12px', color: '#1F2937' }}>
                      <Link href={'/leads/'+lead.id}>{lead.nom}</Link>
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {lead.email}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {lead.entreprise || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: `${getStatusColor(lead.statut)}20`,
                        color: getStatusColor(lead.statut),
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {getStatusLabel(lead.statut)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {new Date(lead.created_at).toLocaleDateString('fr-CH')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        gap: '15px',
      }}>
        <Link href="/leads" style={{
          padding: '10px 20px',
          backgroundColor: '#3B82F6',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none',
        }}>
          Gérer les leads
        </Link>
      </div>
    </div>
  );
}

