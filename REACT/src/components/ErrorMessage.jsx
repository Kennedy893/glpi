export const ErrorMessage = ({ message, onRetry }) => (
  <div className="alert alert-danger" role="alert">
    <h4 className="alert-heading">Erreur</h4>
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-danger btn-sm" onClick={onRetry}>
        Réessayer
      </button>
    )}
  </div>
);