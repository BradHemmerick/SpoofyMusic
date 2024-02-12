import React from 'react';
import styles from './Modal.module.css';

function PreviewUnavailableModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    const handleOverlayClick = (e) => {
      e.stopPropagation();
    };
  
    return (
      <div className={styles.modalOverlay} onClick={onCancel}>
        <div className={styles.modal} onClick={handleOverlayClick}>
          <button className={styles.closeButton} onClick={onCancel}>×</button>
          <h2 className={styles.modalTitle}>Preview Unavailable</h2>
          <p className={styles.modalContent}>
            This song does not have an available preview. Would you like to open it in Spotify?
          </p>
          <div className={styles.modalActions}>
            <button className={styles.modalButton} onClick={onConfirm}>
              Yes
            </button>
            <button className={styles.modalButton} onClick={onCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  export default PreviewUnavailableModal;
