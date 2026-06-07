import { useState, useEffect } from 'react';

// ─── Constants ───────────────────────────────────────────
const TICKET_TYPES     = [{ value: 1, label: 'Incident' }, { value: 2, label: 'Demande' }];
const TICKET_PRIORITIES = [
  { value: 1, label: 'Très basse' }, { value: 2, label: 'Basse' },
  { value: 3, label: 'Moyenne' },    { value: 4, label: 'Haute' },
  { value: 5, label: 'Très haute' }, { value: 6, label: 'Majeure' },
];
const ASSET_ENDPOINTS  = ['Computer', 'Monitor', 'Printer', 'NetworkEquipment', 'Phone', 'Peripheral'];
const ASSET_LABELS     = {
  Computer: 'Ordinateur', Monitor: 'Écran', Printer: 'Imprimante',
  NetworkEquipment: 'Réseau', Phone: 'Téléphone', Peripheral: 'Périphérique',
};

// ─── CreateTicketPage ─────────────────────────────────────
export const CreateTicketPage = ({ ticketRepository, assetRepository, onSuccess }) => {

  // Formulaire
  const [form, setForm] = useState({
    type:        1,
    priority:    3,
    titre:       '',
    description: '',
  });

  // Assets
  const [allAssets, setAllAssets]       = useState([]); // tous les assets disponibles
  const [selectedAssets, setSelectedAssets] = useState([]); // assets ajoutés au ticket
  const [assetSearch, setAssetSearch]   = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('Computer');
  const [loadingAssets, setLoadingAssets] = useState(false);

  // Soumission
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [success, setSuccess]       = useState(false);

  // ─── Chargement des assets selon le filtre ───────────────
  useEffect(() => {
    const fetchAssets = async () => {
      setLoadingAssets(true);
      try {
        const results = await assetRepository.getByType(assetTypeFilter);
        setAllAssets(results || []);
      } catch {
        setAllAssets([]);
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, [assetTypeFilter]);

  // ─── Filtrage par recherche ───────────────────────────────
  const filteredAssets = allAssets.filter(a =>
    a.name?.toLowerCase().includes(assetSearch.toLowerCase())
  );

  // ─── Ajouter / retirer un asset ──────────────────────────
  const toggleAsset = (asset) => {
    const exists = selectedAssets.find(a => a.id === asset.id && a.itemtype === assetTypeFilter);
    if (exists) {
      setSelectedAssets(prev => prev.filter(a => !(a.id === asset.id && a.itemtype === assetTypeFilter)));
    } else {
      setSelectedAssets(prev => [...prev, { ...asset, itemtype: assetTypeFilter }]);
    }
  };

  const removeAsset = (id, itemtype) => {
    setSelectedAssets(prev => prev.filter(a => !(a.id === id && a.itemtype === itemtype)));
  };

  // ─── Soumission ───────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);
    if (!form.titre.trim()) { setError("Le titre est obligatoire."); return; }
    if (!form.description.trim()) { setError("La description est obligatoire."); return; }

    setSubmitting(true);
    try {
      const ticketId = await ticketRepository.createTicket({
        type:     form.type,
        priority: form.priority,
        name:     form.titre.trim(),
        content:  form.description.trim(),
        status:   1,
        entities_id: 0,
      });

      // Lier chaque asset au ticket
      for (const asset of selectedAssets) {
        await ticketRepository.createItemTicket({
          tickets_id: ticketId,
          itemtype:   asset.itemtype,
          items_id:   asset.id,
        });
      }

      setSuccess(true);
      onSuccess?.({ ticketId });
    } catch (err) {
      setError(err.message || "Erreur lors de la création du ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Reset ───────────────────────────────────────────────
  const handleReset = () => {
    setForm({ type: 1, priority: 3, titre: '', description: '' });
    setSelectedAssets([]);
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div style={s.page}>
        <div style={s.successBox}>
          <span style={s.successIcon}>✅</span>
          <h2 style={s.successTitle}>Ticket créé avec succès</h2>
          <p style={s.successSub}>
            {selectedAssets.length > 0
              ? `${selectedAssets.length} élément(s) associé(s) au ticket.`
              : 'Aucun élément associé.'}
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
        <p style={s.subtitle}>Renseignez les informations du ticket et associez les éléments concernés.</p>
      </div>

      <div style={s.layout}>

        {/* ── Colonne gauche : formulaire ── */}
        <div style={s.formCol}>

          {/* Type + Priorité */}
          <div style={s.row2}>
            <Field label="Type *">
              <div style={s.segmented}>
                {TICKET_TYPES.map(t => (
                  <button
                    key={t.value}
                    style={{ ...s.segBtn, ...(form.type === t.value ? s.segBtnActive : {}) }}
                    onClick={() => setForm(f => ({ ...f, type: t.value }))}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Priorité *">
              <select
                style={s.select}
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}
              >
                {TICKET_PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Titre */}
          <Field label="Titre *">
            <input
              style={s.input}
              type="text"
              placeholder="Résumé court du problème ou de la demande"
              value={form.titre}
              onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            />
          </Field>

          {/* Description */}
          <Field label="Description *">
            <textarea
              style={s.textarea}
              placeholder="Décrivez le problème en détail..."
              rows={6}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </Field>

          {error && <p style={s.errorMsg}>⚠️ {error}</p>}

          <button
            style={{ ...s.btnPrimary, opacity: submitting ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Création en cours...' : 'Créer le ticket'}
          </button>

        </div>

        {/* ── Colonne droite : association éléments ── */}
        <div style={s.assetCol}>
          <h3 style={s.assetTitle}>Éléments associés</h3>

          {/* Assets sélectionnés */}
          {selectedAssets.length === 0
            ? <p style={s.assetEmpty}>Aucun élément ajouté.</p>
            : (
              <div style={s.selectedList}>
                {selectedAssets.map(a => (
                  <div key={`${a.itemtype}-${a.id}`} style={s.selectedChip}>
                    <span style={s.chipType}>{ASSET_LABELS[a.itemtype] ?? a.itemtype}</span>
                    <span style={s.chipName}>{a.name}</span>
                    <button style={s.chipRemove} onClick={() => removeAsset(a.id, a.itemtype)}>✕</button>
                  </div>
                ))}
              </div>
            )
          }

          <div style={s.divider} />

          {/* Filtre par type */}
          <div style={s.typeFilter}>
            {ASSET_ENDPOINTS.map(type => (
              <button
                key={type}
                style={{ ...s.typeBtn, ...(assetTypeFilter === type ? s.typeBtnActive : {}) }}
                onClick={() => setAssetTypeFilter(type)}
              >
                {ASSET_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <input
            style={{ ...s.input, marginBottom: 8 }}
            type="text"
            placeholder={`Rechercher un ${ASSET_LABELS[assetTypeFilter]}...`}
            value={assetSearch}
            onChange={e => setAssetSearch(e.target.value)}
          />

          {/* Liste des assets disponibles */}
          <div style={s.assetList}>
            {loadingAssets && <p style={s.assetEmpty}>Chargement...</p>}
            {!loadingAssets && filteredAssets.length === 0 && (
              <p style={s.assetEmpty}>Aucun élément trouvé.</p>
            )}
            {!loadingAssets && filteredAssets.map(asset => {
              const isSelected = selectedAssets.some(
                a => a.id === asset.id && a.itemtype === assetTypeFilter
              );
              return (
                <div
                  key={asset.id}
                  style={{ ...s.assetItem, ...(isSelected ? s.assetItemSelected : {}) }}
                  onClick={() => toggleAsset(asset)}
                >
                  <span style={s.assetItemName}>{asset.name}</span>
                  <span style={s.assetItemSn}>{asset.serial || asset.otherserial || ''}</span>
                  {isSelected && <span style={s.assetCheck}>✓</span>}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Composant Field ──────────────────────────────────────
const Field = ({ label, children }) => (
  <div style={s.field}>
    <label style={s.label}>{label}</label>
    {children}
  </div>
);

// ─── Styles ───────────────────────────────────────────────
const s = {
  page: {
    padding: '2rem 1.5rem',
    maxWidth: 1000,
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  header: { marginBottom: '1.5rem' },
  title: {
    fontSize: 22, fontWeight: 600,
    color: 'var(--color-text-primary, #111)', margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: 14, color: 'var(--color-text-secondary, #666)', margin: 0,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 24,
    alignItems: 'start',
  },
  formCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  assetCol: {
    background: 'var(--color-background-secondary, #f9f9f9)',
    borderRadius: 10,
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    border: '0.5px solid var(--color-border-tertiary, #e0e0e0)',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary, #333)' },
  input: {
    padding: '0.55rem 0.75rem', fontSize: 14, borderRadius: 7,
    border: '1px solid var(--color-border-tertiary, #ddd)',
    background: 'var(--color-background-primary, #fff)',
    color: 'var(--color-text-primary, #111)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  textarea: {
    padding: '0.55rem 0.75rem', fontSize: 14, borderRadius: 7,
    border: '1px solid var(--color-border-tertiary, #ddd)',
    background: 'var(--color-background-primary, #fff)',
    color: 'var(--color-text-primary, #111)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
    resize: 'vertical', fontFamily: 'inherit',
  },
  select: {
    padding: '0.55rem 0.75rem', fontSize: 14, borderRadius: 7,
    border: '1px solid var(--color-border-tertiary, #ddd)',
    background: 'var(--color-background-primary, #fff)',
    color: 'var(--color-text-primary, #111)',
    width: '100%', cursor: 'pointer',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  segmented: { display: 'flex', borderRadius: 7, overflow: 'hidden', border: '1px solid var(--color-border-tertiary, #ddd)' },
  segBtn: {
    flex: 1, padding: '0.5rem', fontSize: 13, fontWeight: 500,
    border: 'none', cursor: 'pointer',
    background: 'var(--color-background-primary, #fff)',
    color: 'var(--color-text-secondary, #555)',
  },
  segBtnActive: {
    background: '#2563eb', color: '#fff',
  },
  btnPrimary: {
    padding: '0.65rem 1.5rem', fontSize: 14, fontWeight: 600,
    color: '#fff', background: '#2563eb',
    border: 'none', borderRadius: 8, cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  errorMsg: { fontSize: 13, color: '#dc2626', margin: 0 },
  assetTitle: { fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--color-text-primary, #111)' },
  assetEmpty: { fontSize: 13, color: 'var(--color-text-secondary, #888)', margin: 0 },
  selectedList: { display: 'flex', flexDirection: 'column', gap: 6 },
  selectedChip: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#eff6ff', borderRadius: 6,
    padding: '0.4rem 0.6rem',
    border: '1px solid #bfdbfe',
  },
  chipType: { fontSize: 11, fontWeight: 600, color: '#2563eb', minWidth: 70 },
  chipName: { fontSize: 13, flex: 1, color: '#111' },
  chipRemove: {
    border: 'none', background: 'none', cursor: 'pointer',
    color: '#888', fontSize: 14, padding: 0,
  },
  divider: { height: 1, background: 'var(--color-border-tertiary, #e0e0e0)' },
  typeFilter: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  typeBtn: {
    fontSize: 12, padding: '0.3rem 0.6rem', borderRadius: 5,
    border: '1px solid var(--color-border-tertiary, #ddd)',
    background: 'var(--color-background-primary, #fff)',
    cursor: 'pointer', color: 'var(--color-text-secondary, #555)',
  },
  typeBtnActive: { background: '#2563eb', color: '#fff', borderColor: '#2563eb' },
  assetList: {
    display: 'flex', flexDirection: 'column', gap: 4,
    maxHeight: 260, overflowY: 'auto',
  },
  assetItem: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0.5rem 0.6rem', borderRadius: 6, cursor: 'pointer',
    border: '1px solid transparent',
    background: 'var(--color-background-primary, #fff)',
    transition: 'background 0.15s',
  },
  assetItemSelected: {
    background: '#eff6ff', borderColor: '#bfdbfe',
  },
  assetItemName: { fontSize: 13, flex: 1, color: 'var(--color-text-primary, #111)' },
  assetItemSn: { fontSize: 11, color: 'var(--color-text-secondary, #888)' },
  assetCheck: { fontSize: 14, color: '#2563eb', fontWeight: 700 },
  successBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', gap: 12,
  },
  successIcon: { fontSize: 48 },
  successTitle: { fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--color-text-primary, #111)' },
  successSub: { fontSize: 14, color: 'var(--color-text-secondary, #666)', margin: 0 },
};