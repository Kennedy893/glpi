// components/kanban/StatusDialog.jsx
import { useState, useEffect } from 'react';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { TicketCostRepository } from '../../domain/repositories/TicketCostRepository';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';
import { useAnnulerCosts } from '../../hooks/superCost/useAnnulerCosts';

const PRIORITY_LABELS = { 1:'Très basse', 2:'Basse', 3:'Moyenne', 4:'Haute', 5:'Très haute', 6:'Majeure' };
const TYPE_LABELS     = { 1:'Incident', 2:'Demande' };

export const StatusDialog = ({ dialog, onConfirm, onCancel }) => {
  const { ticket, title, fields, newStatus } = dialog;

  const [technicienId, setTechnicienId] = useState('');
  const [solution,     setSolution]     = useState('');
  const [cause,        setCause]        = useState('');
  const [boutonAnnuler, setBoutonAnnuler] = useState('');
  const [pourcentageReouverture, setPourcentageReouverture] = useState(0);
  const [superCost,    setSuperCost]    = useState('');  // ← Changé: string vide au lieu de 0
  const [techniciens,  setTechniciens]  = useState([]);
  const [loadingTech,  setLoadingTech]  = useState(false);
  const [error,        setError]        = useState('');

  const { annuler, messagefinal, nombre_modifies } = useAnnulerCosts();

  // Charger les techniciens si le champ est requis
  useEffect(() => {
    if (!fields.includes('technicien')) return;

    const load = async () => {
      setLoadingTech(true);
      try {
        const results = await UserRepository.getTechniciens();
        setTechniciens(results || []);
      } catch {
        setTechniciens([]);
      } finally {
        setLoadingTech(false);
      }
    };
    load();
  }, [fields]);

  const handleConfirm = () => {
    // Validation
    if (fields.includes('technicien') && !technicienId) {
      setError('Veuillez sélectionner un technicien.');
      return;
    }
    if (fields.includes('solution') && !solution.trim()) {
      setError('Veuillez saisir une solution.');
      return;
    }
    if (fields.includes('cause') && !cause.trim()) {
      setError('Veuillez saisir une cause.');
      return;
    }
    if (fields.includes('superCost') && (!superCost || parseFloat(superCost) <= 0)) {
      setError('Veuillez saisir un superCost valide (supérieur à 0).');
      return;
    }
    setError('');
    
    onConfirm({ 
      technicienId: technicienId ? parseInt(technicienId) : null, 
      solution, 
      cause, 
      superCost: superCost ? parseFloat(superCost) : 0  // ← Convertir en nombre
    });
  };

  const handleAnnuler = async () => {
    await annuler();
    alert(messagefinal);
  }

  return (
    <div style={s.overlay} onClick={onCancel}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={s.header}>
          <h3 style={s.title}>{title}</h3>
          <button style={s.closeBtn} onClick={onCancel}>✕</button>
        </div>

        {/* Résumé du ticket concerné */}
        <div style={s.ticketSummary}>
          <span style={s.summaryLabel}>Ticket #{ticket.id}</span>
          <span style={s.summaryName}>{ticket.name}</span>
          <div style={s.summaryMeta}>
            <span style={s.metaChip}>{TYPE_LABELS[ticket.type] ?? '—'}</span>
            <span style={s.metaChip}>{PRIORITY_LABELS[ticket.priority] ?? '—'}</span>
            <span style={{ ...s.metaChip, background: '#dcfce7', color: '#15803d' }}>
              → {newStatus}
            </span>
          </div>
        </div>

        {/* Champs dynamiques */}
        <div style={s.fields}>

          {/* Champ technicien */}
          {fields.includes('technicien') && (
            <div style={s.field}>
              <label style={s.label}>Technicien assigné *</label>
              {loadingTech ? (
                <p style={s.hint}>Chargement des techniciens...</p>
              ) : techniciens.length === 0 ? (
                <p style={s.hint}>Aucun technicien disponible.</p>
              ) : (
                <select
                  style={s.select}
                  value={technicienId}
                  onChange={e => setTechnicienId(e.target.value)}
                >
                  <option value="">-- Sélectionner un technicien --</option>
                  {techniciens.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.realname} {t.firstname} ({t.name})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Champ solution */}
          {fields.includes('solution') && (
            <div style={s.field}>
              <label style={s.label}>Solution *</label>
              <textarea
                style={s.textarea}
                rows={4}
                placeholder="Décrivez la solution apportée..."
                value={solution}
                onChange={e => setSolution(e.target.value)}
              />
            </div>
          )}

          {/* Champ superCost */}
          {fields.includes('superCost') && (
            <div style={s.field}>
              <label style={s.label}>SuperCost * (en Ar)</label>
              <input
                type="number"
                style={s.input}
                placeholder="Ex: 2000"
                value={superCost}
                onChange={e => setSuperCost(e.target.value)}
                min="0"
                step="100"
              />
              <small style={s.hint}>Montant en Ariary (Ar)</small>
            </div>
          )}

          {fields.includes('boutonAnnuler') && 
            <div style={s.field}>
              <button onClick={handleAnnuler}>Annuler</button>
            </div>
          }

          {/* Champ pourcentageReouverture */}
          {fields.includes('pourcentageReouverture') && (
            <div>
            <div style={s.field}>
              <label style={s.label}>Pourcentage Reouverture *</label>
              <input
                type="number"
                style={s.input}
                placeholder="Ex: 2000"
                value={pourcentageReouverture}
                onChange={e => setPourcentageReouverture(e.target.value)}
                min="0"
                step="100"
              />%
            </div>
            <div>
              <button>Reouverture</button>
            </div>
            </div>
          )}

          {/* Champ cause */}
          {fields.includes('cause') && (
            <div style={s.field}>
              <label style={s.label}>Cause *</label>
              <textarea
                style={s.textarea}
                rows={4}
                placeholder="Décrivez la cause..."
                value={cause}
                onChange={e => setCause(e.target.value)}
              />
            </div>
          )}

        </div>

        {/* Erreur */}
        {error && <p style={s.error}>⚠️ {error}</p>}

        {/* Actions */}
        <div style={s.actions}>
          <button style={s.btnCancel} onClick={onCancel}>Annuler</button>
          <button style={s.btnConfirm} onClick={handleConfirm}>Confirmer</button>
        </div>

      </div>
    </div>
  );
};

const s = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 12,
    width: '100%', maxWidth: 480,
    padding: '1.5rem',
    display: 'flex', flexDirection: 'column', gap: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 17, fontWeight: 600, margin: 0, color: '#111' },
  closeBtn: {
    border: 'none', background: 'none', fontSize: 18,
    cursor: 'pointer', color: '#888', padding: 0,
  },
  ticketSummary: {
    background: '#f8fafc', borderRadius: 8,
    padding: '0.75rem 1rem',
    display: 'flex', flexDirection: 'column', gap: 6,
    border: '1px solid #e2e8f0',
  },
  summaryLabel: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' },
  summaryName:  { fontSize: 14, fontWeight: 500, color: '#111' },
  summaryMeta:  { display: 'flex', gap: 6, flexWrap: 'wrap' },
  metaChip: {
    fontSize: 11, padding: '2px 8px', borderRadius: 999,
    background: '#e2e8f0', color: '#475569', fontWeight: 500,
  },
  fields: { display: 'flex', flexDirection: 'column', gap: 14 },
  field:  { display: 'flex', flexDirection: 'column', gap: 6 },
  label:  { fontSize: 13, fontWeight: 500, color: '#333' },
  hint:   { fontSize: 12, color: '#888', margin: 0 },
  select: {
    padding: '0.5rem 0.75rem', fontSize: 14, borderRadius: 7,
    border: '1px solid #ddd', background: '#fff',
    color: '#111', width: '100%', cursor: 'pointer',
  },
  input: {  // ← Ajout du style pour l'input
    padding: '0.5rem 0.75rem', fontSize: 14, borderRadius: 7,
    border: '1px solid #ddd', background: '#fff',
    color: '#111', width: '100%',
  },
  textarea: {
    padding: '0.5rem 0.75rem', fontSize: 14, borderRadius: 7,
    border: '1px solid #ddd', background: '#fff',
    color: '#111', width: '100%', resize: 'vertical',
    fontFamily: 'inherit', boxSizing: 'border-box',
  },
  error: { fontSize: 13, color: '#dc2626', margin: 0 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10 },
  btnCancel: {
    padding: '0.5rem 1.1rem', fontSize: 14, borderRadius: 7,
    border: '1px solid #ddd', background: '#fff',
    color: '#555', cursor: 'pointer',
  },
  btnConfirm: {
    padding: '0.5rem 1.25rem', fontSize: 14, fontWeight: 600, borderRadius: 7,
    border: 'none', background: '#2563eb',
    color: '#fff', cursor: 'pointer',
  },
};