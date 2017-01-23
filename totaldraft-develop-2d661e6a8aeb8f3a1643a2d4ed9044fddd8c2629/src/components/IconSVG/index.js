import React, { PropTypes } from 'react';

const renderGraphic = (icon) => {
  switch (icon) {
    case 'football-icon':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="2" d="M16 1c0 0 2.5 2 3 2.6 -0.1 0.6-0.5 2.2-0.5 2.2s-5 1.9-5.8 1.9c-0.8-0.2-4.4-1.7-4.4-1.7V2.7M18.5 5.9c0 0 3 3.5 3.9 5.1 -0.2 1.2-3.4 4.9-3.4 4.9 -1.4 0-6.1-1.7-6.1-1.7s-0.3-5.8 0-6.3M12.9 14.2c0 0-3.7 3-4.1 3.7 0 1 1.2 5.2 1.5 5.6 0.2 0.4 4.5 1.5 5.4 1.5 0.9-0.1 4.6-3.7 4.6-3.7s-0.5-4.5-1.2-5.1M8.8 17.8c0 0-5-1.6-5.1-1.9s-0.2-5.6-0.2-5.6 4-4.2 4.9-4.1M15.8 24.9l1.6 3.7M10.3 23.4l-5.1 1.3M20.2 21.2c0 0 4.4 0.7 4.6 0.7 0.5-0.4 2.7-4.4 2.7-4.4s-0.2-4.5-0.5-4.9c-0.5-0.5-4.1-1.9-4.6-1.7M27.6 9.4l-0.6 3.3M24.9 21.9l-0.3 2.9M19 3.7l3-0.7M3.7 15.9l-2 3.4M14.9 1c7.7 0 13.9 6.2 13.9 13.9 0 7.7-6.2 13.9-13.9 13.9C7.2 28.8 1 22.6 1 14.9 1 7.2 7.2 1 14.9 1z"/>
          <line fill="none" stroke="#111111" strokeWidth="2" x1="3.4" y1="10.3" x2="2.1" y2="9.5"/>
        </g>
      );
    case 'basketball-icon':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="2" d="M15 1c7.7 0 14 6.3 14 14s-6.3 14-14 14S1 22.7 1 15C1 7.3 7.3 1 15 1zM26.7 7.3c2.7 4.6-0.3 12-7 15.9 -6.7 3.9-14.8 2-17.5-2.6M1.6 10.9c0 0 1.1 3.1 5.8 5.9 4.6 2.8 9.7 3.7 11 6.5s-2.7 5.3-8.1 4.8M16.4 1.1c0 0 4.6 2.1 5.8 7.2 1.2 5 0.6 10.4 2.8 12.4 0.6 0.5 1.8 0.7 2.4 0.7M7.2 3.4c1.4-0.9 6.1 3.8 10.1 10 4.1 6.2 6.6 12.4 5.2 13.3"/>
        </g>
      );
    case 'hockey-icon':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="2" d="M15 1c7.7 0 14 5.3 14 11.7s-6.2 11.7-14 11.7c-7.7 0-14-5.3-14-11.7C1 6.3 7.3 1 15 1z"/>
          <path fill="none" stroke="#111111" strokeWidth="2" d="M29 12.6c0 0 0 3.3 0 4.5 0 6.5-6.2 11.7-14 11.7-7.7 0-14-5.3-14-11.7 0-2 0-4.5 0-4.5"/>
        </g>
      );
    case 'rules-icon':
      return (
        <g>
          <polyline fill="none" stroke="#111111" strokeWidth="2" className="st0" points="1.2 4.3 3.2 6.3 7.2 2.3 "/>
          <polyline fill="none" stroke="#111111" strokeWidth="2" className="st0" points="1.2 14.4 3.2 16.4 7.2 12.3 "/>
          <line fill="none" stroke="#111111" strokeWidth="2" className="st0" x1="1.2" y1="21.3" x2="7.2" y2="27.3"/>
          <line fill="none" stroke="#111111" strokeWidth="2" className="st0" x1="7.2" y1="21.3" x2="1.2" y2="27.3"/>
          <line fill="none" stroke="#111111" strokeWidth="2" className="st0" x1="10.2" y1="5.3" x2="29.2" y2="5.3"/>
          <line fill="none" stroke="#111111" strokeWidth="2" className="st0" x1="10.2" y1="15.3" x2="29.2" y2="15.3"/>
          <line fill="none" stroke="#111111" strokeWidth="2" className="st0" x1="10.2" y1="25.3" x2="29.2" y2="25.3"/>
        </g>
      );
    case 'prize-icon':
      return (
        <g>
          <path d="M26.479,3.475c0.057-0.848,0.086-1.711,0.086-2.586H15H3.435c0,0.876,0.029,1.739,0.086,2.586
C1.574,4.184,0.183,6.05,0.183,8.243c0,2.802,2.271,5.073,5.073,5.073c0.132,0,0.263-0.005,0.392-0.015
c1.583,3.964,3.902,6.884,6.585,8.091l1.236,5.704H7.353v2.016H15h7.647v-2.016h-6.115l1.236-5.704
c2.682-1.207,5.002-4.127,6.585-8.091c0.129,0.01,0.26,0.015,0.392,0.015c2.802,0,5.073-2.271,5.073-5.073
C29.817,6.05,28.426,4.184,26.479,3.475z M1.854,8.243c0-1.31,0.741-2.446,1.826-3.014c0.263,2.296,0.731,4.454,1.367,6.409
C3.266,11.53,1.854,10.051,1.854,8.243z M15,24.645l-0.578-2.669c0.192,0.017,0.384,0.027,0.578,0.027s0.387-0.009,0.578-0.027
L15,24.645z M15,19.987c-4.35,0-9.019-6.79-9.549-17.082H15h9.549C24.019,13.196,19.35,19.987,15,19.987z M24.953,11.637
c0.636-1.955,1.103-4.113,1.367-6.409c1.085,0.568,1.826,1.704,1.826,3.014C28.146,10.051,26.734,11.53,24.953,11.637z"/>
        </g>
      );
    case 'cup-icon':
      return (
        <g>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="6" y1="28" x2="24" y2="28"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="15" y1="28" x2="15" y2="20"/>
          <path fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M22,16c0,2.209-1.791,4-4,4h-6c-2.209,0-4-1.791-4-4 V2h14V16z"/>
          <path fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M23,2h1c2.209,0,4,1.791,4,4v4c0,2.209-1.791,4-4,4 h-1"/>
          <path fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M7,14H6c-2.209,0-4-1.792-4-4.001v-4 C2,3.79,3.791,2,6,2h1"/>
        </g>
      );
    case 'users-icon':
      return (
        <g>
          <path className="st0" d="M20.6 2.9c2.3 0 4.2 1.9 4.2 4.2s-1.9 4.2-4.2 4.2 -4.2-1.9-4.2-4.2S18.3 2.9 20.6 2.9M20.6 1c-3.3 0-6.1 2.7-6.1 6.1s2.7 6.1 6.1 6.1 6.1-2.7 6.1-6.1S23.9 1 20.6 1L20.6 1zM20.6 14.1c3 0 6.4 5.1 6.9 12.1H13.7C14.2 19.1 17.6 14.1 20.6 14.1M20.6 12.2c-4.9 0-8.9 7.5-8.9 15.9 5.9 0 13.8 0 17.7 0C29.5 19.7 25.5 12.2 20.6 12.2L20.6 12.2zM8 6.6c2.1 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7c-2.1 0-3.7-1.7-3.7-3.7S5.9 6.6 8 6.6M8 4.7c-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6 5.6-2.5 5.6-5.6S11.1 4.7 8 4.7L8 4.7zM8.5 15.7c1 0 3.3 1.7 4.7 3.7 -0.6 1.6-1.2 4-1.4 6.8H2.5C3 20.2 5.9 15.7 8.5 15.7M8.5 13.9c-4.4 0-7.9 6.7-7.9 14.2 5.3 0 9.5 0 13 0 0-3.8 0.9-7.1 1.7-8.8C13.9 16.7 10.6 13.9 8.5 13.9L8.5 13.9z"/>
        </g>
      );
    case 'score-icon':
      return (
        <g>
          <polygon fill="none" stroke="#111111" strokeWidth="2" className="st0" points="28.7 13.7 20.9 13.7 20.9 3.4 9.8 3.4 9.8 9.4 1.2 9.4 1.2 26.6 9.8 26.6 20.9 26.6 28.7 26.6 "/>
          <polyline fill="none" stroke="#111111" strokeWidth="2" className="st0" points="14.1 8.6 15.8 7.7 15.8 12.9 "/>
          <path fill="none" stroke="#111111" strokeWidth="2" className="st0" d="M4.6 14.6c0 0 0.9-0.9 1.7-0.9s0.9 1.7 0.9 1.7L5.5 18h2.6"/>
          <path fill="none" stroke="#111111" strokeWidth="2" className="st1" strokeLinejoin="bevel" d="M21.8 17.1h3.4l-2.6 2.6h1.7c0 0 0.9 1.7 0 2.6 -0.9 0.9-2.6 0-2.6 0"/>
        </g>
      );
    case 'login-icon':
      return (
        <g>
          <polyline fill="none" stroke="#ffffff" strokeWidth="2" points="6.9 19.6 6.9 26.6 28.9 26.6 28.9 3.4 6.9 3.4 6.9 10.4 "/>
          <polygon fill="#ffffff" points="11.6 20.3 13.1 22 19.6 15.1 19.6 15.1 19.6 15.1 13.1 8 11.6 9.7 15.4 13.9 1.1 13.9 1.1 16.2 15 16.2 "/>
        </g>
      );
    case 'logout-icon':
      return (
        <g>
          <path fill="#ffffff" d="M29.9,14.9l-1,1l-0.3,0.3v0.2h-0.2l-7,7l-2-2l5-5H5.8v-2.8h18.7l-5.1-5l2-2l6.4,6.3l0,0 l0.7,0.7h0v0L29.9,14.9L29.9,14.9L29.9,14.9z M25.7,3.7H2.9v22.6h22.8v-4.1l2.9-2.9v1.4v7.1h0v1.4H0.1v-2.8h0V3.7h0V0.9h28.5v1.4h0 v8.5L25.7,8L25.7,3.7L25.7,3.7z"/>
        </g>
      );
    case 'user-icon':
      return (
        <g>
          <path fill="#191919" d="M26.6,30H3.4H0.8c0,0,0,0,0,0c0-6.1,3.7-11.3,9-13.3C7.5,15,6,12.3,6,9.2C6,4.1,10,0,15,0 s9.1,4.1,9.1,9.2c0,3.1-1.5,5.8-3.9,7.5c5.3,2.1,9,7.3,9,13.3c0,0,0,0,0,0L26.6,30L26.6,30z M21.5,9.2c0-3.6-2.9-6.6-6.5-6.6 c-3.6,0-6.5,2.9-6.5,6.6s2.9,6.6,6.5,6.6C18.6,15.7,21.5,12.8,21.5,9.2z M15.4,18.3c-0.1,0-0.3,0-0.4,0c-0.1,0-0.3,0-0.4,0 c-5.4,0.2-9.8,4-10.9,9.1h22.6C25.2,22.3,20.7,18.5,15.4,18.3z"/>
        </g>
      );
    case 'user2-icon':
      return (
        <g>
          <path fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M27.954,28c0-7.121-5.796-12.949-12.949-12.949 C7.854,15.051,2.057,20.879,2.057,28H27.954z"/>
          <circle fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" cx="15.005" cy="8.051" r="6.148"/>
        </g>
      );
    case 'info-icon':
      return (
        <g>
          <path fill="#ffffff" d="M15 4.2C21 4.2 25.8 9 25.8 15S21 25.8 15 25.8C9 25.8 4.2 21 4.2 15S9 4.2 15 4.2M15 1.8C7.7 1.8 1.8 7.7 1.8 15S7.7 28.2 15 28.2c7.3 0 13.2-5.9 13.2-13.2S22.3 1.8 15 1.8L15 1.8z"/>
          <rect x="13.8" y="12.6" fill="#ffffff" width="2.4px" height="9.6px"/>
          <rect x="13.8" y="7.8" fill="#ffffff" width="2.4px" height="2.4px"/>
        </g>
      );
    case 'info-light-icon':
      return (
        <g>
          <path fill="none" stroke="#0069EA" strokeWidth="2" strokeMiterlimit="10" d="M14.9,11.2v15.3"/>
          <path fill="none" stroke="#0069EA" strokeWidth="2" strokeMiterlimit="10" d="M14.9,7.2V3.4"/>
        </g>
      );
    case 'question-icon':
      return (
        <g>
          <path fill="#ffffff" d="M15 4.1C21 4.1 25.9 9 25.9 15c0 6-4.9 10.9-10.9 10.9S4.1 21 4.1 15C4.1 9 9 4.1 15 4.1M15 1.7C7.6 1.7 1.7 7.6 1.7 15s6 13.3 13.3 13.3c7.4 0 13.3-6 13.3-13.3S22.4 1.7 15 1.7L15 1.7z"/>
          <path fill="#ffffff" d="M15.5 17.4c0-0.3 0-0.6 0.1-0.8 0-0.2 0.1-0.4 0.2-0.6 0.1-0.2 0.2-0.3 0.4-0.5 0.2-0.2 0.4-0.4 0.7-0.6 0.3-0.2 0.5-0.4 0.7-0.6 0.2-0.2 0.4-0.4 0.6-0.7 0.2-0.2 0.3-0.5 0.4-0.8 0.1-0.3 0.1-0.6 0.1-1 0-0.5-0.1-1-0.3-1.5 -0.2-0.4-0.5-0.8-0.8-1.1 -0.4-0.3-0.8-0.5-1.2-0.6 -0.5-0.1-1-0.2-1.5-0.2 -0.5 0-1 0.1-1.5 0.2 -0.5 0.2-0.9 0.4-1.3 0.7 -0.4 0.3-0.7 0.6-0.9 1.1 -0.2 0.4-0.4 0.9-0.5 1.4l1.8 0.2c0.1-0.6 0.3-1 0.7-1.4 0.4-0.4 0.9-0.6 1.5-0.6 0.6 0 1.1 0.2 1.5 0.5 0.4 0.3 0.6 0.8 0.6 1.4 0 0.4-0.1 0.8-0.3 1.1 -0.2 0.3-0.4 0.5-0.7 0.8l-0.7 0.6c-0.2 0.2-0.4 0.4-0.6 0.6 -0.2 0.2-0.3 0.4-0.4 0.6 -0.1 0.2-0.2 0.4-0.3 0.7 -0.1 0.3-0.1 0.5-0.1 0.9v0.9h1.8C15.5 18.1 15.5 17.4 15.5 17.4zM15.6 19.8c-0.2-0.2-0.5-0.3-0.9-0.3s-0.7 0.1-0.9 0.4c-0.2 0.2-0.4 0.5-0.4 0.9 0 0.3 0.1 0.6 0.4 0.8s0.6 0.4 0.9 0.4c0.4 0 0.7-0.1 0.9-0.4 0.2-0.2 0.4-0.5 0.4-0.8C16 20.3 15.9 20 15.6 19.8z"/>
        </g>
      );
    case 'clock-icon':
      return (
        <g>
          <circle fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" cx="15.029" cy="14.956" r="12.98"/>
          <polyline fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" points="15,8 15,15 22,15 "/>
        </g>
      );
    case 'calendar-icon':
      return (
        <g>
          <rect x="2" y="4" fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" width="26px" height="24px"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="22" y1="18" x2="22" y2="22"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="8" y1="18" x2="8" y2="22"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="15" y1="18" x2="15" y2="22"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="22" y1="11" x2="22" y2="15"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="8" y1="11" x2="8" y2="15"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="22" y1="0" x2="22" y2="8"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="8" y1="0" x2="8" y2="8"/>
          <line fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" x1="15" y1="11" x2="15" y2="15"/>
        </g>
      );
    case 'smart-arrow-left':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="4" className="st0" d="M20.2 28.5L6.8 15 20.2 1.5"/>
        </g>
      );
    case 'smart-arrow-right':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="4" strokeMiterlimit="10" d="M8.3,1.6l13.4,13.2L8.3,28"/>
        </g>
      );
    case 'smart-arrow-down':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="4" strokeMiterlimit="10" d="M29,7.9L15,22.1L1,7.9"/>
        </g>
      );
    case 'smart-arrow-up':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="4" strokeMiterlimit="10" d="M1,22.1L15,7.9l14,14.2"/>
        </g>
      );
    case 'arrow-right':
      return (
        <g>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M1.8,15.4h25.7"/>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M19.8,24.3l8.4-9l-8.4-9"/>
        </g>
      );
    case 'arrow-left':
      return (
        <g>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M2.5,15.4h25.7"/>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M10.2,6.3l-8.4,9l8.4,9"/>
        </g>
      );
    case 'arrow-up':
      return (
        <g>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M14.9,2.5l0,25.7"/>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M24,10.2l-9-8.4l-9,8.4"/>
        </g>
      );
    case 'arrow-down':
      return (
        <g>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M15.1,27.5l0-25.7"/>
          <path fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" d="M6,19.8l9,8.4l9-8.4"/>
        </g>
      );
    case 'plus-icon':
      return (
        <g>
          <line fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" x1="2.3" y1="15" x2="27.7" y2="15"/>
          <line fill="none" stroke="#000000" strokeWidth="2" strokeMiterlimit="10" x1="15" y1="2.3" x2="15" y2="27.7"/>
        </g>
      );
    case 'facebook-icon':
      return (
        <g>
          <path fill="#FFFFFF" d="M17.2,29.1V16.2h4.3l0.6-5h-5V8c0-1.5,0.4-2.4,2.5-2.4l2.7,0V1.1c-0.5-0.1-2-0.2-3.9-0.2c-3.8,0-6.5,2.3-6.5,6.6v3.7H7.7v5H12v12.9H17.2z"/>
        </g>
      );
    case 'vk-icon':
      return (
        <g>
          <path fill="#FFFFFF" d="M14.7,22.8h1.6c0,0,0.5-0.1,0.7-0.3c0.2-0.3,0.2-0.7,0.2-0.7s0-2.2,1-2.5
c1-0.3,2.3,2.1,3.7,3.1c1,0.7,1.8,0.6,1.8,0.6l3.7-0.1c0,0,1.9-0.1,1-1.6C28.4,21,28,20,25.8,18c-2.3-2.1-2-1.8,0.8-5.5
c1.7-2.3,2.4-3.6,2.2-4.2c-0.2-0.6-1.4-0.4-1.4-0.4l-4.1,0c0,0-0.3,0-0.5,0.1c-0.2,0.1-0.4,0.4-0.4,0.4s-0.7,1.7-1.5,3.2
c-1.8,3.1-2.6,3.3-2.9,3.1c-0.7-0.5-0.5-1.8-0.5-2.8c0-3,0.5-4.3-0.9-4.6c-0.5-0.1-0.8-0.2-1.9-0.2c-1.5,0-2.7,0-3.4,0.4
c-0.5,0.2-0.8,0.7-0.6,0.8c0.3,0,0.9,0.2,1.2,0.6c0.4,0.6,0.4,1.9,0.4,1.9s0.2,3.6-0.6,4c-0.6,0.3-1.3-0.3-3-3.2
c-0.8-1.5-1.5-3.1-1.5-3.1S6.9,8.3,6.7,8.1C6.4,7.9,6.1,7.8,6.1,7.8l-3.9,0c0,0-0.6,0-0.8,0.3c-0.2,0.2,0,0.7,0,0.7S4.4,16,7.9,19.7
C11.1,23,14.7,22.8,14.7,22.8L14.7,22.8z"/>
        </g>
      );
    case 'twitter-icon':
      return (
        <g>
          <path fill="#FFFFFF" d="M28.8,6.4c-1,0.4-2.1,0.8-3.3,0.9c1.2-0.7,2.1-1.8,2.5-3.1c-1.1,0.6-2.3,1.1-3.6,1.4
c-1-1.1-2.5-1.8-4.1-1.8c-3.1,0-5.7,2.5-5.7,5.7c0,0.4,0.1,0.9,0.1,1.3c-4.7-0.2-8.9-2.5-11.7-5.9C2.6,5.7,2.4,6.6,2.4,7.7
c0,2,1,3.7,2.5,4.7c-0.9,0-1.8-0.3-2.6-0.7v0.1c0,2.7,1.9,5,4.5,5.6c-0.5,0.1-1,0.2-1.5,0.2c-0.4,0-0.7,0-1.1-0.1
c0.7,2.2,2.8,3.9,5.3,3.9c-1.9,1.5-4.4,2.4-7,2.4c-0.5,0-0.9,0-1.4-0.1c2.5,1.6,5.5,2.5,8.7,2.5c10.4,0,16.1-8.6,16.1-16.1
c0-0.2,0-0.5,0-0.7C27.1,8.6,28,7.6,28.8,6.4L28.8,6.4z"/>
        </g>
      );
    case 'check-icon':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="4" strokeMiterlimit="10" d="M28.4,6.4L12.3,22.7L1.7,12"/>
        </g>
      );
    case 'cross-arrow-icon':
      return (
        <g>
          <path fill="none" stroke="#111111" strokeWidth="2" strokeMiterlimit="10" d="M6.3,22.7h17.8"/>
          <path fill="none" stroke="#111111" strokeWidth="2" strokeMiterlimit="10" d="M18.7,28.8l5.8-6.3l-5.8-6.3"/>
          <path fill="none" stroke="#111111" strokeWidth="2" strokeMiterlimit="10" d="M23.6,7.3H5.9"/>
          <path fill="none" stroke="#111111" strokeWidth="2" strokeMiterlimit="10" d="M11.3,1.2L5.6,7.3l5.8,6.1"/>
        </g>
      );
    case 'rub-icon':
      return (
        <g>
          <path fill="#111111" d="M18,18.1c5.9,0,9.4-4.1,9.4-9S24,0,18,0h-12v19.3H2.6v3.2h3.3V30h3.7v-7.5h9v-3.2h-9v-1.2H18z M9.7,3.3h7.9 c3.5,0,6,2.3,6,5.7c0,3.4-2.4,5.7-6,5.7H9.7V3.3z"/>
        </g>
      );
    case 'fire-icon':
      return (
        <g>
          <path fillRule="evenodd" clipRule="evenodd" fill="#F68B1F" d="M26.906,18.879c0,6.146-5.375,11.127-12.003,11.127
  C8.272,30.007,2.9,25.025,2.9,18.879s3.487-8.205,3.692-8.289c0.207-0.084-0.789,5.439,4.228,6.914
  C6.376,8.252,13.148,0.055,17.674,0c-4.662,9.508,3.691,15.887,3.691,15.887s-3.172-6.232,2.075-9.135
  C22.597,10.086,26.906,12.733,26.906,18.879z"/>
        </g>
      );
    case 'close-icon':
      return (
        <g>
          <path fill="none" stroke="#010101" strokeWidth="4" strokeMiterlimit="10" d="M2.2,27.8L27.8,2.2"/>
          <path fill="none" stroke="#010101" strokeWidth="4" strokeMiterlimit="10" d="M2.2,2.2l25.7,25.7"/>
        </g>
      );
    case 'edit-icon':
      return (
        <g>
          <path fill="none" stroke="#0069EA" strokeMiterlimit="10" strokeWidth="2" d="M19.7,5.3L5.3,19.7v5.1h5.1l14.4-14.4L19.7,5.3z"/>
          <path fill="none" stroke="#0069EA" strokeMiterlimit="10" strokeWidth="2" d="M16.3,8.6l5,5.1"/>
        </g>
      );
    case 'alert-icon':
      return (
        <g>
          <path fill="none" stroke="#FF8400" strokeMiterlimit="10" d="M15.016,4.5c0.65,0,1.14,1.004,1.14,1.004L26.572,23.82 c0,0,0.359,0.606,0.083,1.097c-0.371,0.658-0.858,0.583-0.858,0.583H4.391c0,0-0.481-0.027-0.731-0.715S3.63,23.52,3.63,23.52 L13.906,5.451C13.906,5.451,14.365,4.5,15.016,4.5z"/>
          <rect x="14.5" y="11.5" fill="#FF8400" width="1px" height="6px"/>
          <rect x="14.5" y="19.5" fill="#FF8400" width="1px" height="2px"/>
        </g>
      );
    case 'delete-icon':
      return (
        <g>
          <path fill="none" stroke="#ED1B17" strokeMiterlimit="10" d="M9.879,9.879l10.244,10.244"/>
          <path fill="none" stroke="#ED1B17" strokeMiterlimit="10" d="M20.151,9.851L9.85,20.151"/>
        </g>
      );
    case 'gift-icon':
      return (
        <g>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#fe961b" strokeWidth="4" strokeMiterlimit="10" d="M4.5,10.5h22v17h-22V10.5z"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#fe961b" strokeWidth="4" strokeMiterlimit="10" d="M8.448,9.818c0,0-4.065-7.318,2.052-7.318c6.119,0,5,7,5,7"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#fe961b" strokeWidth="4" strokeMiterlimit="10" d="M22.506,9.893c0,0,4.066-7.393-2.006-7.393c-6.07,0-5,7-5,7"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#fe961b" strokeWidth="4" strokeMiterlimit="10" d="M15.5,11.5v16"/>
        </g>
      );
    case 'fee-icon': {
      return (
        <g>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M26.5,17.5v9h-24v-9"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M14.5,3.5v15"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#ffffff" strokeWidth="4" strokeMiterlimit="10" d="M7.946,12.841L14.5,19.5l6.554-6.659"/>
        </g>
      );
    }
    case 'table-view-icon': {
      return (
        <g>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#222222" strokeMiterlimit="10" d="M8.5,7.5h13v15h-13V7.5z"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#222222" strokeMiterlimit="10" d="M8.499,15H21.5"/>
        </g>
      );
    }
    case 'list-view-icon': {
      return (
        <g>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#222222" strokeMiterlimit="10" d="M9,15.002h12"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#222222" strokeMiterlimit="10" d="M9,10.998h12"/>
          <path fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#222222" strokeMiterlimit="10" d="M9,19.002h12"/>
        </g>
      );
    }
    case 'player-injure-icon': {
      return (
        <g>
          <polygon fill="#ED1C24" points="30,19.8 30,10.2 19.8,10.2 19.8,0 10.2,0 10.2,10.2 0,10.2 0,19.8 10.2,19.8 10.2,30 19.8,30 19.8,19.8 "/>
        </g>
      );
    }
    case 'red-card-icon': {
      return (
        <g>
          <rect fill="#ED1C24" x="4.6" y="-0.1" width="20.8px" height="30px"/>
        </g>
      );
    }
    case 'yellow-card-icon': {
      return (
        <g>
          <rect fill="#FFDA00" x="4.6" y="-0.1" width="20.8px" height="30px"/>
        </g>
      );
    }
    case 'lock-close-icon': {
      return (
        <g>
          <rect fill="none" stroke="#FE9920" strokeWidth="3" x="6.2" y="13.5" width="17.2px" height="14.2px"/>
          <path fill="none" stroke="#FE9920" strokeWidth="3" d="M9.6,13.5v-3.2c0-2.9,2.3-5.2,5.2-5.2l0,0c2.9,0,5.2,2.3,5.2,5.2v3.2"/>
          <line fill="none" stroke="#FE9920" strokeWidth="3" x1="14.8" y1="17.6" x2="14.8" y2="22.6"/>
        </g>
      );
    }
    case 'lock-open-icon': {
      return (
        <g>
          <rect fill="none" stroke="#FE9920" strokeWidth="3" x="6.2" y="13.5" width="17.2px" height="14.2px"/>
          <path fill="none" stroke="#FE9920" strokeWidth="3" d="M9.6,13.5V7.3c0-2.9,2.3-5.2,5.2-5.2l0,0c2.9,0,5.2,2.3,5.2,5.2v0.3"/>
          <line fill="none" stroke="#FE9920" strokeWidth="3" x1="14.8" y1="17.6" x2="14.8" y2="22.6"/>
        </g>
      );
    }
    default:
      return (
        <g></g>
      );
  }
};

function IconSVG({ icon, size, cssClass }) {
  const styles = {
    verticalAlign: 'middle',
    width: size + 'px', // CSS instead of the width attr to support non-pixel units
    height: size + 'px' // Prevents scaling issue in IE
  };

  return (
    <svg className={cssClass} viewBox="0 0 30 30" preserveAspectRatio="xMidYMid meet" style={styles}>
      {renderGraphic(icon)}
    </svg>
  );
}

IconSVG.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  style: PropTypes.object,
  cssClass: PropTypes.string
};
IconSVG.defaultProps = { size: 30 };

export default IconSVG;
