import React from 'react';
import Image from 'next/image';

const working: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'black' }}>
      <Image src="/flow.png" alt="Flow Image" width={800} height={600} />
    </div>
  );
};

export default working;
