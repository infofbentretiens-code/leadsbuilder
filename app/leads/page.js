'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountNav from '../components/AccountNav';
import { supabase } from '../../lib/client-data';

export default function LeadsPage() {
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    entreprise: '',
    telephone: '',
    source: 'direct',
    notes: '',
  });

  const [leads, setLeads] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data);
    } catch (error) {
      setMessage(error.message); setMessageType('error');
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email || !formData.nom) {
      setMessage('Email et Nom sont obligatoires');
      setMessageType('error');
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          email: formData.email,
          nom: formData.nom,
          entreprise: formData.entreprise,
          telephone: formData.telephone,
          source: formData.source,
          notes: formData.notes,
          statut: 'nouveau',
        }]);

      if (error) throw error;

      // Envoyer une notification email
      try {
        await fetch('/api/send-lead-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            nom: formData.nom,
            entreprise: formData.entreprise,
            telephone: formData.telephone,
            source: formData.source,
            notes: formData.notes,
          }),
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      setMessage('✅ Lead ajouté avec succès');
      setMessageType('success');
      setFormData({
        email: '',
        nom: '',
        entreprise: '',
        telephone: '',
        source: 'direct',
        notes: '',
      });

      setTimeout(() => setMessage(''), 3000);
      fetchLeads();
    } catch (error) {
      setMessage('❌ ' + error.message);
      setMessageType('error');
    }
  }

  async function handleStatusChange(leadId, newStatus) {
    try {
      // Get current lead information before updating
      const currentLead = leads.find(l => l.id === leadId);
      const oldStatus = currentLead?.statut;

      const { error } = await supabase
        .from('leads')
        .update({ statut: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      // Mettre à jour la liste locale
      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, statut: newStatus } : lead
      ));

      // Send status change email notification
      try {
        await fetch('/api/send-status-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: currentLead?.nom,
            email: currentLead?.email,
            entreprise: currentLead?.entreprise,
            newStatus,
            oldStatus,
          }),
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }


      setMessage('✅ Statut mis à jour');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Erreur: ' + error.message);
      setMessageType('error');
    }
  }

  async function handleDeleteLead(leadId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) return;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.filter(lead => lead.id !== leadId));
      setMessage('✅ Lead supprimé');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Erreur: ' + error.message);
      setMessageType('error');
    }
  }

  const statusOptions = [
    { value: 'nouveau', label: 'Nouveau', emoji: '🆕' },
    { value: 'contacte', label: 'Contacté', emoji: '📞' },
    { value: 'qualifie', label: 'Qualifié', emoji: '⭐' },
    { value: 'perdu', label: 'Perdu', emoji: '❌' },
    { value: 'converti', label: 'Converti', emoji: '✅' },
  ];

  const sourceOptions = [
    { value: 'direct', label: 'Direct' },
    { value: 'site', label: 'Site web' },
    { value: 'email', label: 'Email' },
    { value: 'reseaux', label: 'Réseaux sociaux' },
    { value: 'autre', label: 'Autre' },
  ];

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
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <AccountNav />{/* Message de feedback */}
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

      <h1 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: 'bold' }}>
        📋 Gestion des Leads
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '30px',
        marginBottom: '40px',
      }}>
        {/* Formulaire de saisie */}
        <form onSubmit={handleSubmit} style={{
          padding: '20px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          maxWidth: '600px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
            Ajouter un nouveau lead
          </h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="exemple@email.com"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              placeholder="Nom du contact"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Entreprise
            </label>
            <input
              type="text"
              name="entreprise"
              value={formData.entreprise}
              onChange={handleInputChange}
              placeholder="Nom de l'entreprise"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              placeholder="+41 22 123 45 67"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              {sourceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Remarques additionnelles..."
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
              width: '100%',
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
            Ajouter le lead
          </button>
        </form>

        {/* Liste des leads */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
            Leads ({leads.length})
          </h2>

          {leads.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              border: '1px dashed #D1D5DB',
            }}>
              Aucun lead pour le moment...
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              maxHeight: '600px',
              overflowY: 'auto',
            }}>
              {leads.map(lead => (
                <div key={lead.id} style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: `2px solid ${getStatusColor(lead.statut)}40`,
                  borderLeft: `4px solid ${getStatusColor(lead.statut)}`,
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px',
                  }}>
                    <div>
                      <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                        <Link href={'/leads/'+lead.id}>{lead.nom}</Link>
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '3px' }}>
                        📧 {lead.email}
                      </p>
                      {lead.entreprise && (
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '3px' }}>
                          🏢 {lead.entreprise}
                        </p>
                      )}
                      {lead.telephone && (
                        <p style={{ color: '#666', fontSize: '14px' }}>
                          ☎️ {lead.telephone}
                        </p>
                      )}
                    </div>

                    {/* Sélecteur de statut */}
                    <select
                      value={lead.statut}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: `${getStatusColor(lead.statut)}20`,
                        color: getStatusColor(lead.statut),
                        border: `2px solid ${getStatusColor(lead.statut)}`,
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        minWidth: '120px',
                      }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.emoji} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {lead.notes && (
                    <p style={{
                      fontSize: '13px',
                      color: '#666',
                      backgroundColor: '#F3F4F6',
                      padding: '8px',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      marginTop: '10px',
                    }}>
                      📝 {lead.notes}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid #E5E7EB',
                    fontSize: '12px',
                    color: '#999',
                  }}>
                    <span>
                      📅 {new Date(lead.created_at).toLocaleDateString('fr-CH')}
                    </span>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

