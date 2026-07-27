import React, { useRef, useEffect, useCallback } from 'react';

/**
 * GroveDialog — accessible replacement for the div-based modals in App.jsx.
 *
 * Wraps the native <dialog> element, which gives you for free the four things
 * the current modals are missing:
 *   • focus is trapped inside while open
 *   • Escape closes it
 *   • the rest of the page is hidden from screen readers (aria-modal)
 *   • focus returns to whatever opened it
 *
 * Usage:
 *   <GroveDialog
 *     open={showCurriculumModal}
 *     onClose={() => setShowCurriculumModal(false)}
 *     title="Add a curriculum review"
 *     footer={<>
 *       <button className="btn btn-secondary" onClick={close}>Cancel</button>
 *       <button className="btn btn-primary" type="submit" form="cur-form">Save review</button>
 *     </>}
 *   >
 *     <form id="cur-form" onSubmit={handleCurriculumSubmit}> ... </form>
 *   </GroveDialog>
 */
export default function GroveDialog({
  open,
  onClose,
  title,
  children,
  footer,
  width = '640px',
  closeOnBackdrop = true,
}) {
  const ref = useRef(null);
  const titleId = useRef(`dlg-${Math.random().toString(36).slice(2, 9)}`).current;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && el.open) {
      el.close();
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape and the native close button both fire 'cancel'/'close'
  const handleCancel = useCallback((e) => {
    e.preventDefault();
    onClose();
  }, [onClose]);

  // Clicking the backdrop: the <dialog> itself is the backdrop hit area,
  // so a click whose target IS the dialog (not its children) came from outside.
  const handleClick = useCallback((e) => {
    if (!closeOnBackdrop) return;
    if (e.target === ref.current) onClose();
  }, [closeOnBackdrop, onClose]);

  return (
    <dialog
      ref={ref}
      className="grove-dialog"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClose={onClose}
      onClick={handleClick}
      style={{ width: `min(92vw, ${width})` }}
    >
      <div className="grove-dialog__head">
        <h2 className="grove-dialog__title" id={titleId}>{title}</h2>
        <button
          type="button"
          className="btn-icon"
          onClick={onClose}
          aria-label={`Close ${title}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z" />
          </svg>
        </button>
      </div>

      <div className="grove-dialog__body">{children}</div>

      {footer && <div className="grove-dialog__foot">{footer}</div>}
    </dialog>
  );
}

/* -------------------------------------------------------------------------
 * Field — the other half of the fix. Every input in App.jsx currently has a
 * label that is not programmatically tied to it, and validation goes through
 * alert(). This wires up id / htmlFor / aria-describedby / aria-invalid.
 * ------------------------------------------------------------------------- */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  as = 'input',
  children,
  ...inputProps
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;
  const Tag = as;

  return (
    <div className="form-group">
      <label className="field__label" htmlFor={id} data-required={required ? '' : undefined}>
        {label}
      </label>

      {hint && <p className="field__hint" id={hintId}>{hint}</p>}

      {children ? (
        React.cloneElement(children, {
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? 'true' : undefined,
          required,
        })
      ) : (
        <Tag
          id={id}
          className="form-control"
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          {...inputProps}
        />
      )}

      {error && <p className="field__error" id={errId}>{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Notice — drop-in replacement for alert(). Screen readers announce it
 * without stealing focus, and it stays on screen so people can re-read it.
 * ------------------------------------------------------------------------- */
export function Notice({ kind = 'info', children }) {
  return (
    <p
      className={`notice notice--${kind}`}
      role={kind === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------
 * Rating — stars are decorative; the number is what gets announced.
 * ------------------------------------------------------------------------- */
export function Rating({ value, count }) {
  const full = Math.round(value);
  return (
    <span className="rating">
      <span className="stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} viewBox="0 0 24 24" className={i <= full ? 'star-on' : 'star-off'}>
            <path d="M12 17.3 18.2 21l-1.6-7L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2l5.5 4.8L5.8 21z" />
          </svg>
        ))}
      </span>
      <span className="rating__value" aria-hidden="true">{value.toFixed(1)}</span>
      {count != null && <span className="rating__count" aria-hidden="true">· {count} families</span>}
      <span className="visually-hidden">
        {value.toFixed(1)} out of 5 stars{count != null ? ` from ${count} families` : ''}
      </span>
    </span>
  );
}
