import React, { useState } from 'react';
import Lab4Queries from '../components/Voenkomat/Lab4Queries';
import Lab5Queries from '../components/Voenkomat/Lab5Queries';

const VoenkomatPage = () => {
  const [activeLab, setActiveLab] = useState('lab4');

  return (
    <div className="voenkomat-page">
      <div className="lab-tabs">
        <button
          className={activeLab === 'lab4' ? 'active' : ''}
          onClick={() => setActiveLab('lab4')}
        >
          Запросы Лабораторной 4
        </button>
        <button
          className={activeLab === 'lab5' ? 'active' : ''}
          onClick={() => setActiveLab('lab5')}
        >
          Запросы Лабораторной 5
        </button>
      </div>

      <div className="lab-content">
        {activeLab === 'lab4' && <Lab4Queries />}
        {activeLab === 'lab5' && <Lab5Queries />}
      </div>
    </div>
  );
};

export default VoenkomatPage;
