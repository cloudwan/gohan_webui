import React from 'react';

function AddButton({onClick, disabled}) {
  return (
    <div className='row'>
      <p className='col-xs-2 col-xs-offset-10 array-item-add text-right'>
        <button type='button' className='btn btn-info col-xs-12'
          tabIndex='-1' onClick={onClick}
          disabled={disabled} style={{fontWeight: 'bold'}}>➕</button>
      </p>
    </div>
  );
}

export default AddButton;
