import React from 'react';

const Loading = () => {
  const loadingStyles = {
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex', // 컴포넌트 보이도록 수정
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // 다른 컴포넌트 위에 보이도록 설정
  };

  const spinnerStyles = {
    boxSizing: 'border-box',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '8px solid transparent',
    borderTopColor: '#0080FF',
    borderBottomColor: '#0080FF',
    animation: 'spinner 0.8s ease infinite',
  };

  return (
    <div style={loadingStyles}>
      <style>
        {`
          @keyframes spinner {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyles}></div>
    </div>
  );
};

export default Loading;

// import React from 'react';
// import {Background, LoadingText} from './Styles';
   
// export default () => {
//   return (
//     <Background>
//       <LoadingText>wareh</LoadingText>
//     </Background>
//   );
// };