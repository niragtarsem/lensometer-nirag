import React, { useState, useEffect } from 'react';

const IndexPage = ({progress, progressglass}) => {
  const [color, setColor] = useState('');
  const [distanceText, setDistanceText] = useState('');

  useEffect(() => {
    if(progress){
      if (progress >= 40 && progress <= 46) {
        setColor('hsla(39,100%,68%,1)');
        setDistanceText('Move backward almost there');
      } else if (progress >= 47 && progress < 52) {
        setColor('green');
        setDistanceText(progress >= 48 && progress <= 52 ? 'Perfect' : 'near');
      } else if (progress  < 40) {
        setColor('red');
        setDistanceText('You are too close');
      }else if (progress >= 54 && progress <= 59) {
        setColor('orange');
        setDistanceText('You are slightly far');
      } else if (progress > 59 ) {
        setColor('red');
        setDistanceText('You are too far');
      }
    }
    // Define color and distance text based on progress value
    
  }, [progress]);


  useEffect(() => {
    if(progressglass){
      if (progressglass >= 18 && progressglass < 32) {
        setColor('green');
        setDistanceText(progressglass >= 18 && progressglass <= 32 ? 'Perfect' : 'near');
      } else if (progressglass  < 20) {
        setColor('red');
        setDistanceText('You are too close');
      }else if (progressglass >= 20 && progressglass <= 22) {
        setColor('orange');
        setDistanceText('You are slightly far');
      } else if (progressglass > 28 ) {
        setColor('red');
        setDistanceText('You are too far');
      }
    }
    // Define color and distance text based on progress value
    
  }, [progressglass]);

  return (
    <div>
     <div className="progress-bar-containersss">
  <div className="progress-bardd">
    <span style={{ color: color, fontFamily: "Arial", fontSize: "16px", fontWeight: "bold" }}>
  {distanceText}
</span>
  </div>
</div>

      

      <style jsx>{`
        .progress-bar-container {
          background-color: #ddd;
          border-radius: 5px;
          margin-bottom: 20px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 20px;
          border-radius: 5px;
          transition: width 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default IndexPage;
