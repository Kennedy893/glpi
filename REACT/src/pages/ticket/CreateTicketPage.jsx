import { useState, useEffect } from 'react';
import { useAssetsByType } from '../../hooks/asset/useAssetsByType';
import { useCreateTicket } from '../../hooks/ticket/useCreateTicket';

const TICKET_TYPES = [{ value: 1, label: 'Incident' }, { value: 2, label: 'Demande' }];
const TICKET_PRIORITIES = [
  { value: 1, label: 'Très basse' }, { value: 2, label: 'Basse' },
  { value: 3, label: 'Moyenne' },    { value: 4, label: 'Haute' },
  { value: 5, label: 'Très haute' }, { value: 6, label: 'Majeure' },
];
const ASSET_TYPES = [
  { value: 'Computer',         label: 'Ordinateurs' },
  { value: 'Monitor',          label: 'Écrans' },
  { value: 'Printer',          label: 'Imprimantes' },
  { value: 'NetworkEquipment', label: 'Réseau' },
  { value: 'Phone',            label: 'Téléphones' },
  { value: 'Peripheral',       label: 'Périphériques' },
];
const TICKET_STATUS = [
  { value: 1, label: 'New' }, { value: 2, label: 'Processing' },
  { value: 4, label: 'Pending' },    { value: 5, label: 'Solved' },
  { value: 6, label: 'Closed' }, 
];

export const CreateTicketPage = ({ ticketRepository, assetRepository, onSuccess }) => {

  // Tous les assets chargés dès le montage de la page
  const {
    computers, printers, monitors,
    networkEquipments, phones, peripherals,
    loading: loadingAssets, error: errorAssets,
  } = useAssetsByType();

  // map direct depuis le hook — pas de useState séparé
  const assetsByType = {
    Computer:         computers        || [],
    Printer:          printers         || [],
    Monitor:          monitors         || [],
    NetworkEquipment: networkEquipments || [],
    Phone:            phones           || [],
    Peripheral:       peripherals      || [],
  };

  const [form, setForm] = useState({ type: 1, priority: 3, status: 1, titre: '', description: '', date: null });

  // Types dont la liste est "ouverte" (déroulée)
  const [openTypes, setOpenTypes]         = useState({});

  // Sélection finale : [{ id, name, itemtype, label }]
  const [selectedAssets, setSelectedAssets] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(false);

  // Hook de creation
  const { create } = useCreateTicket();   
  

  // ── Charger les assets d'un type au premier clic ─────────
  const loadTypeIfNeeded = async (itemtype) => {
    if (assetsByType[itemtype] !== undefined) return; // déjà chargé
    setLoadingType(prev => ({ ...prev, [itemtype]: true }));
    try {
      const results = await assetRepository.getByType(itemtype);
      setAssetsByType(prev => ({ ...prev, [itemtype]: results || [] }));
    } catch {
      setAssetsByType(prev => ({ ...prev, [itemtype]: [] }));
    } finally {
      setLoadingType(prev => ({ ...prev, [itemtype]: false }));
    }
  };

  // ── Ouvrir / fermer un type ───────────────────────────────
  const toggleOpen = async (itemtype) => {
    await loadTypeIfNeeded(itemtype);
    setOpenTypes(prev => ({ ...prev, [itemtype]: !prev[itemtype] }));
  };

  // ── Sélection multiple dans un <select multiple> ─────────
  const handleMultiSelect = (e, itemtype) => {
    const label = ASSET_TYPES.find(t => t.value === itemtype)?.label ?? itemtype;
    const options = Array.from(e.target.selectedOptions);

    options.forEach(option => {
      const assetId = parseInt(option.value);
      const asset   = (assetsByType[itemtype] || []).find(a => a.id === assetId);
      if (!asset) return;

      const already = selectedAssets.some(a => a.id === assetId && a.itemtype === itemtype);
      if (!already) {
        setSelectedAssets(prev => [...prev, {
          id: asset.id, name: asset.name, itemtype, label,
        }]);
      }
    });
  };

  // ── Retirer un asset ─────────────────────────────────────
  const removeAsset = (id, itemtype) => {
    setSelectedAssets(prev => prev.filter(a => !(a.id === id && a.itemtype === itemtype)));
  };

  // ── Soumission ───────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    if (!form.titre.trim())       { setError("Le titre est obligatoire.");       return; }
    if (!form.description.trim()) { setError("La description est obligatoire."); return; }

    setSubmitting(true);
    try {
    //   const ticketId = await ticketRepository.createTicket({
    //     type: form.type, priority: form.priority,
    //     name: form.titre.trim(), content: form.description.trim(),
    //     status: 1, entities_id: 0,
    //   });

    //   for (const asset of selectedAssets) {
    //     await ticketRepository.createItemTicket({
    //       tickets_id: ticketId, itemtype: asset.itemtype, items_id: asset.id,
    //     });
    //   }
        
      await create(
        form.date,
        form.type,
        form.titre,
        form.description,
        form.status,
        form.priority,
        selectedAssets
      ) 

      setSuccess(true);
      onSuccess?.({ ticketId });
    } catch (err) {
      setError(err.message || "Erreur lors de la création du ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ type: 1, priority: 3, titre: '', description: '', date: null });
    setSelectedAssets([]);
    setOpenTypes({});
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div style={s.page}>
        <div style={s.successBox}>
          <span style={{ fontSize: 48 }}>✅</span>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>Ticket créé avec succès</h2>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            {selectedAssets.length > 0 ? `${selectedAssets.length} élément(s) associé(s).` : 'Aucun élément associé.'}
          </p>
          <button style={s.btnPrimary} onClick={handleReset}>Créer un autre ticket</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Nouveau ticket</h1>
        <p style={s.subtitle}>Renseignez les informations et associez les éléments concernés.</p>
      </div>

      <div style={s.layout}>

        {/* ── Colonne gauche : formulaire + listes d'assets ── */}
        <div style={s.formCol}>

          <div style={s.row2}>
            <Field label="Type *">
              <div style={s.segmented}>
                {TICKET_TYPES.map(t => (
                  <button key={t.value}
                    style={{ ...s.segBtn, ...(form.type === t.value ? s.segBtnActive : {}) }}
                    onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  >{t.label}</button>
                ))}
              </div>
            </Field>
            <Field label="Priorité *">
              <select style={s.select} value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}>
                {TICKET_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Status *">
              <select style={s.select} value={form.status}
                onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))}>
                {TICKET_STATUS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Titre *">
            <input style={s.input} type="text"
              placeholder="Résumé court du problème ou de la demande"
              value={form.titre}
              onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            />
          </Field>

          <Field label="Description *">
            <textarea style={s.textarea} rows={5}
              placeholder="Décrivez le problème en détail..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </Field>

          <Field label="Date *">
            <input style={s.input} type="datetime-local"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </Field>

          {/* ── Listes d'assets par type ── */}
          <div>
            <p style={s.sectionLabel}>Éléments à associer</p>
            <p style={s.hint}>Cliquez sur un type pour afficher la liste. Ctrl+clic pour sélectionner plusieurs éléments.</p>

            <div style={s.accordionList}>
              {/* // ✅ après — un seul état de chargement global */}
                {ASSET_TYPES.map(({ value: itemtype, label }) => {
                    const assets       = assetsByType[itemtype] || [];
                    const isOpen       = !!openTypes[itemtype];
                    const countSelected = selectedAssets.filter(a => a.itemtype === itemtype).length;

                    return (
                        <div key={itemtype} style={s.accordion}>

                        {/* En-tête — plus besoin de loadTypeIfNeeded */}
                        <button style={s.accordionHeader}
                            onClick={() => setOpenTypes(prev => ({ ...prev, [itemtype]: !prev[itemtype] }))}
                        >
                            <span style={s.accordionLabel}>{label}</span>
                            <div style={s.accordionRight}>
                            {countSelected > 0 && <span style={s.badge}>{countSelected} sélectionné(s)</span>}
                            <span style={s.accordionArrow}>{isOpen ? '▲' : '▼'}</span>
                            </div>
                        </button>

                        {/* Corps — données déjà disponibles */}
                        {isOpen && (
                            <div style={s.accordionBody}>
                            {loadingAssets ? (
                                <p style={s.hint}>Chargement...</p>
                            ) : assets.length === 0 ? (
                                <p style={s.hint}>Aucun élément disponible.</p>
                            ) : (
                                <select multiple size={Math.min(assets.length, 6)}
                                    style={s.selectMultiple}
                                    onChange={e => handleMultiSelect(e, itemtype)}
                                >
                                {assets.map(asset => {
                                    const alreadyIn = selectedAssets.some(
                                        a => a.id === asset.id && a.itemtype === itemtype
                                    );
                                    return (
                                        <option key={asset.id} value={asset.id}
                                            style={{ color: alreadyIn ? '#9ca3af' : 'inherit' }}
                                        >
                                            {alreadyIn ? '✓ ' : ''}{asset.name}
                                            {asset.otherserial ? ` — ${asset.otherserial}` : ''}
                                        </option>
                                    );
                                })}
                                </select>
                            )}
                            </div>
                        )}
                        </div>
                    );
                })}
            </div>
          </div>

          {error && <p style={s.errorMsg}>⚠️ {error}</p>}

          <button
            style={{ ...s.btnPrimary, opacity: submitting ? 0.6 : 1 }}
            onClick={handleSubmit} disabled={submitting}
          >
            {submitting ? 'Création en cours...' : 'Créer le ticket'}
          </button>

        </div>

        {/* ── Colonne droite : récap des éléments choisis ── */}
        <div style={s.recapCol}>
          <div style={s.recapHeader}>
            <span style={s.recapTitle}>Éléments associés</span>
            {selectedAssets.length > 0 && (
              <span style={s.badgeLarge}>{selectedAssets.length}</span>
            )}
          </div>

          {selectedAssets.length === 0 ? (
            <p style={s.hint}>Aucun élément sélectionné.</p>
          ) : (
            <div style={s.recapList}>
              {/* Grouper par type pour l'affichage */}
              {ASSET_TYPES.map(({ value: itemtype, label }) => {
                const group = selectedAssets.filter(a => a.itemtype === itemtype);
                if (group.length === 0) return null;
                return (
                  <div key={itemtype} style={s.recapGroup}>
                    <p style={s.recapGroupLabel}>{label}</p>
                    {group.map(a => (
                      <div key={`${a.itemtype}-${a.id}`} style={s.chip}>
                        <span style={s.chipName}>{a.name}</span>
                        <button style={s.chipRemove}
                          onClick={() => removeAsset(a.id, a.itemtype)}
                          title="Retirer"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary, #333)' }}>{label}</label>
    {children}
  </div>
);

const s = {
  page:     { padding: '2rem 1.5rem', maxWidth: 1050, margin: '0 auto', fontFamily: 'sans-serif' },
  header:   { marginBottom: '1.5rem' },
  title:    { fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary, #111)', margin: '0 0 4px 0' },
  subtitle: { fontSize: 14, color: 'var(--color-text-secondary, #666)', margin: 0 },
  layout:   { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' },
  formCol:  { display: 'flex', flexDirection: 'column', gap: 16 },

  row2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  segmented: { display: 'flex', borderRadius: 7, overflow: 'hidden', border: '1px solid var(--color-border-tertiary, #ddd)' },
  segBtn:    { flex: 1, padding: '0.5rem', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: 'var(--color-background-primary, #fff)', color: 'var(--color-text-secondary, #555)' },
  segBtnActive: { background: '#2563eb', color: '#fff' },

  input:    { padding: '0.55rem 0.75rem', fontSize: 14, borderRadius: 7, border: '1px solid var(--color-border-tertiary, #ddd)', background: 'var(--color-background-primary, #fff)', color: 'var(--color-text-primary, #111)', width: '100%', boxSizing: 'border-box' },
  textarea: { padding: '0.55rem 0.75rem', fontSize: 14, borderRadius: 7, border: '1px solid var(--color-border-tertiary, #ddd)', background: 'var(--color-background-primary, #fff)', color: 'var(--color-text-primary, #111)', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' },
  select:   { padding: '0.55rem 0.75rem', fontSize: 14, borderRadius: 7, border: '1px solid var(--color-border-tertiary, #ddd)', background: 'var(--color-background-primary, #fff)', color: 'var(--color-text-primary, #111)', width: '100%', cursor: 'pointer' },
  selectMultiple: { fontSize: 13, borderRadius: 7, border: '1px solid var(--color-border-tertiary, #ddd)', background: 'var(--color-background-primary, #fff)', color: 'var(--color-text-primary, #111)', width: '100%', cursor: 'pointer', padding: 4 },

  sectionLabel: { fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary, #333)', margin: '0 0 4px 0' },
  hint:         { fontSize: 12, color: 'var(--color-text-secondary, #888)', margin: '0 0 8px 0' },

  accordionList:   { display: 'flex', flexDirection: 'column', gap: 6 },
  accordion:       { borderRadius: 8, border: '1px solid var(--color-border-tertiary, #e0e0e0)', overflow: 'hidden' },
  accordionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.6rem 0.9rem', background: 'var(--color-background-secondary, #f5f5f5)', border: 'none', cursor: 'pointer', textAlign: 'left' },
  accordionLabel:  { fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary, #333)' },
  accordionRight:  { display: 'flex', alignItems: 'center', gap: 8 },
  accordionArrow:  { fontSize: 10, color: 'var(--color-text-secondary, #888)' },
  accordionBody:   { padding: '0.6rem 0.9rem', background: 'var(--color-background-primary, #fff)' },

  badge:      { background: '#2563eb', color: '#fff', borderRadius: 999, fontSize: 11, fontWeight: 700, padding: '1px 7px' },
  badgeLarge: { background: '#2563eb', color: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 700, padding: '2px 10px' },

  btnPrimary: { padding: '0.65rem 1.5rem', fontSize: 14, fontWeight: 600, color: '#fff', background: '#2563eb', border: 'none', borderRadius: 8, cursor: 'pointer', alignSelf: 'flex-start' },
  errorMsg:   { fontSize: 13, color: '#dc2626', margin: 0 },

  // Colonne droite récap
  recapCol:        { background: 'var(--color-background-secondary, #f9f9f9)', borderRadius: 10, padding: '1.25rem', border: '0.5px solid var(--color-border-tertiary, #e0e0e0)', position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  recapHeader:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  recapTitle:      { fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary, #111)' },
  recapList:       { display: 'flex', flexDirection: 'column', gap: 12 },
  recapGroup:      { display: 'flex', flexDirection: 'column', gap: 5 },
  recapGroupLabel: { fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 },
  chip:        { display: 'flex', alignItems: 'center', gap: 8, background: '#eff6ff', borderRadius: 6, padding: '0.35rem 0.6rem', border: '1px solid #bfdbfe' },
  chipName:    { fontSize: 13, flex: 1, color: '#111' },
  chipRemove:  { border: 'none', background: 'none', cursor: 'pointer', color: '#888', fontSize: 14, padding: 0, lineHeight: 1 },

  successBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', gap: 12 },
};
