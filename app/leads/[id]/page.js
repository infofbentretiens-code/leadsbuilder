'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/client-data';
import Link from 'next/link';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id;

  const [lead, setLead] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newInteraction, setNewInteraction] = useState('');
  const [interactionType, setInteractionType] = useState('appel');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (leadId) {
      fetchLeadAndInteractions();
    }
  }, [leadId]);

  async function fetchLeadAndInteractions() {
    try {
      // Récupérer le lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError) throw leadError;
      setLead(leadData);

      // Récupérer les interactions
      const { data: interactionsData, error: interError } = await supabase
        .from('interactions')
        .select('*')
        .eq('lead_id', leadId)
        .order('date_interaction', { ascending: false });

      if (interError) throw interError;
      setInteractions(interactionsData);
    } catch (error) {
      console.error('Erreur:', error.message);
      setMessage('❌ Erreur: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddInteraction(e) {
    e.preventDefault();

    if (!newInteraction.trim()) {
      setMessage('La description ne peut pas être vide');
      setMessageType('error');
      return;
    }

    try {
      const { error } = await supabase
        .from('interactions')
        .insert([{
          lead_id: leadId,
          type: interactionType,
          description: newInteraction,
          date_interaction: new Date().toISOString(),
        }]);

      if (error) throw error;

      setMessage('✅ Interaction ajoutée');
      setMessageType('success');
      setNewInteraction('');
      setInteractionType('appel');

      setTimeout(() => setMessage(''), 2000);
      fetchLeadAndInteractions();
    } catch (error) {
      setMessage('❌ Erreur: ' + error.message);
      setMessageType('error');
    }
  }

  async function handleDeleteInteraction(interactionId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette interaction ?')) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .delete()
        .eq('id', interactionId);

      if (error) throw error;

      setMessage('✅ Interaction supprimée');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
      fetchLeadAndInteractions();
    } catch (error) {
      setMessage('❌ Erreur: ' + error.message);
      setMessageType('error');
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Lead non trouvé</p>
        <Link href="/leads">Retour aux leads</Link>
      </div>
    );
  }

  const interactionTypeEmojis = {
    appel: '📞',
    email: '📧',
    reunion: '🤝',
    visite: '📍',
    autre: '📝',
  };

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

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {/* Message de feedback */}
      {message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: messageType === 'success' ? '#D1FAE5' : '#FEE2E2',
          color: messageType === 'success' ? '#065F46' : '#991B1B',
          border: `1px solid ${messageType === 'success' ? '#A7F3D0' : '#FECACA'}`,
        }}>
          {message}
        </div>
      )}

      {/* En-tête du lead */}
      <div style={{
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #E5E7EB',
      }}>
        <Link href="/leads" style={{
          color: '#3B82F6',
          textDecoration: 'none',
          marginBottom: '15px',
          display: 'inline-block',
        }}>
          ← Retour aux leads
        </Link>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
          {lead.nom}
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}>
          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '3px' }}>EMAIL</p>
            <p style={{ fontWeight: 'bold' }}>{lead.email}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '3px' }}>ENTREPRISE</p>
            <p style={{ fontWeight: 'bold' }}>{lead.entreprise || '-'}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '3px' }}>TÉLÉPHONE</p>
            <p style={{ fontWeight: 'bold' }}>{lead.telephone || '-'}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '3px' }}>STATUT</p>
            <p style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: `${getStatusColor(lead.statut)}20`,
              color: getStatusColor(lead.statut),
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              {lead.statut}
            </p>
          </div>
        </div>

        {lead.notes && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#F0F9FF',
            borderRadius: '6px',
            borderLeft: '3px solid #3B82F6',
          }}>
            <p style={{ color: '#666', fontSize: '12px', marginBottom: '3px' }}>NOTES</p>
            <p style={{ fontSize: '14px', color: '#1F2937' }}>{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout d'interaction */}
      <div style={{
        padding: '20px',
        backgroundColor: '#F9FAFB',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        marginBottom: '30px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Ajouter une interaction
        </h2>

        <form onSubmit={handleAddInteraction}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Type d'interaction
            </label>
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="appel">📞 Appel</option>
              <option value="email">📧 Email</option>
              <option value="reunion">🤝 Réunion</option>
              <option value="visite">📍 Visite</option>
              <option value="autre">📝 Autre</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              value={newInteraction}
              onChange={(e) => setNewInteraction(e.target.value)}
              placeholder="Décrivez l'interaction..."
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Ajouter l'interaction
          </button>
        </form>
      </div>

      {/* Liste des interactions */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Historique des interactions ({interactions.length})
        </h2>

        {interactions.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#999',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            border: '1px dashed #D1D5DB',
          }}>
            Aucune interaction pour le moment...
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}>
            {interactions.map(interaction => (
              <div key={interaction.id} style={{
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}>
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                    }}>
                      {interactionTypeEmojis[interaction.type] || '📝'} {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                    }}>
                      {new Date(interaction.date_interaction).toLocaleDateString('fr-CH')} à {new Date(interaction.date_interaction).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteInteraction(interaction.id)}
                    style={{
                      backgroundColor: '#FEE2E2',
                      color: '#991B1B',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>

                <p style={{
                  fontSize: '14px',
                  color: '#1F2937',
                  backgroundColor: '#F9FAFB',
                  padding: '10px',
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {interaction.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

