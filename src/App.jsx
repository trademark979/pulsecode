import { useState, useEffect, useCallback } from "react";

// ─── CHAPTER METADATA ──────────────────────────────────────────────────────
const CHAPTERS = [
  { id:1,  num:"01", title:"The Heart's Electric System",     sub:"Anatomy & Architecture",      icon:"🏛️", dur:"45 min",  free:true,  color:"#00d4ff" },
  { id:2,  num:"02", title:"Reading the ECG Strip",           sub:"The Rhythm Blueprint",         icon:"📡", dur:"60 min",  free:true,  color:"#00d4ff" },
  { id:3,  num:"03", title:"Arrhythmia Origins",              sub:"Mapping the Rebels",           icon:"🗺️", dur:"50 min",  free:false, color:"#a855f7" },
  { id:4,  num:"04", title:"Sinus Rhythms",                   sub:"Normal & Its Variations",      icon:"🎛️", dur:"55 min",  free:false, color:"#a855f7" },
  { id:5,  num:"05", title:"Atrial Rhythms",                  sub:"When the Atria Take Charge",   icon:"🌊", dur:"70 min",  free:false, color:"#a855f7" },
  { id:6,  num:"06", title:"Junctional Rhythms",              sub:"The AV Node Steps Up",         icon:"⚡", dur:"45 min",  free:false, color:"#a855f7" },
  { id:7,  num:"07", title:"Ventricular Rhythms",             sub:"Wide, Fast & Dangerous",       icon:"💥", dur:"65 min",  free:false, color:"#a855f7" },
  { id:8,  num:"08", title:"AV Blocks",                       sub:"When the Relay Fails",         icon:"🔗", dur:"60 min",  free:false, color:"#a855f7" },
  { id:9,  num:"09", title:"Artificial Pacemakers",           sub:"The Backup Generator",         icon:"🔋", dur:"50 min",  free:false, color:"#a855f7" },
  { id:10, num:"10", title:"AVNRT & AVRT",                    sub:"Reentrant Circuits",           icon:"🔄", dur:"65 min",  free:false, color:"#a855f7" },
  { id:11, num:"11", title:"Systematic Interpretation",       sub:"Any Strip, Every Time",        icon:"🎚️", dur:"75 min",  free:false, color:"#a855f7" },
  { id:12, num:"12", title:"Artifacts",                       sub:"Filtering the Noise",          icon:"📻", dur:"40 min",  free:false, color:"#a855f7" },
  { id:13, num:"13", title:"Clinical Practice",               sub:"Beyond the Strip",             icon:"🏥", dur:"50 min",  free:false, color:"#a855f7" },
  { id:14, num:"14", title:"Final Practice Exam",             sub:"CRAT Certification Prep",      icon:"🏆", dur:"2–3 hrs", free:false, color:"#f59e0b" },
];

// ─── SVG ECG DIAGRAMS ───────────────────────────────────────────────────────
const ECGDiagrams = {
  // Normal Sinus Rhythm
  NSR: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 20,50 28,44 36,50 50,50 58,44 66,50 80,50 88,22 92,78 96,50 106,50 114,44 122,50 150,50 158,44 166,50 180,50 188,22 192,78 196,50 206,50 214,44 222,50 250,50 258,44 266,50 280,50 288,22 292,78 296,50 306,50 314,44 322,50 350,50 358,44 366,50 380,50 388,22 392,78 396,50 406,50 414,44 422,50 450,50 458,44 466,50 480,50 488,22 492,78 496,50 506,50 514,44 522,50 550,50 558,44 566,50 580,50 588,22 592,78 596,50 600,50"/>
      <text x="10" y="16" fill="rgba(0,212,255,0.5)" fontSize="10" fontFamily="JetBrains Mono,monospace">Normal Sinus Rhythm — 75 bpm</text>
    </svg>
  ),
  // Sinus Tachycardia
  STach: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 10,50 15,44 20,50 30,50 34,22 38,78 42,50 48,50 52,44 57,50 70,50 74,44 79,50 89,50 93,22 97,78 101,50 107,50 111,44 116,50 129,50 133,44 138,50 148,50 152,22 156,78 160,50 166,50 170,44 175,50 188,50 192,44 197,50 207,50 211,22 215,78 219,50 225,50 229,44 234,50 247,50 251,44 256,50 266,50 270,22 274,78 278,50 284,50 288,44 293,50 306,50 310,44 315,50 325,50 329,22 333,78 337,50 343,50 347,44 352,50 365,50 369,44 374,50 384,50 388,22 392,78 396,50 402,50 406,44 411,50 424,50 428,44 433,50 443,50 447,22 451,78 455,50 461,50 465,44 470,50 483,50 487,44 492,50 502,50 506,22 510,78 514,50 520,50 524,44 529,50 542,50 546,44 551,50 561,50 565,22 569,78 573,50 579,50 583,44 588,50 600,50"/>
      <text x="10" y="16" fill="rgba(0,212,255,0.5)" fontSize="10" fontFamily="JetBrains Mono,monospace">Sinus Tachycardia — 130 bpm</text>
    </svg>
  ),
  // Atrial Fibrillation
  AFib: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 5,48 10,52 15,47 20,53 25,49 30,51 34,22 38,78 42,50 47,53 52,47 57,51 62,49 67,52 72,48 77,53 82,47 92,22 96,78 100,50 105,52 110,47 115,51 120,49 125,53 130,47 140,22 144,78 148,50 153,48 158,52 163,47 168,53 173,49 183,22 187,78 191,50 196,52 201,48 206,51 211,47 216,53 221,49 226,52 236,22 240,78 244,50 249,48 254,52 259,47 264,53 269,49 274,51 284,22 288,78 292,50 297,53 302,47 307,51 312,49 317,52 327,22 331,78 335,50 340,48 345,52 350,47 355,53 360,49 370,22 374,78 378,50 383,52 388,47 393,51 398,49 403,53 413,22 417,78 421,50 426,48 431,52 436,47 446,22 450,78 454,50 459,53 464,47 469,51 474,49 479,52 489,22 493,78 497,50 502,48 507,52 512,47 517,53 527,22 531,78 535,50 540,52 545,48 550,51 555,47 560,53 565,49 570,52 580,22 584,78 588,50 593,48 598,52 600,50"/>
      <text x="10" y="16" fill="rgba(245,158,11,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">Atrial Fibrillation — Irregularly Irregular</text>
    </svg>
  ),
  // Atrial Flutter
  AFlutter: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 8,38 16,62 24,38 32,62 36,18 40,82 44,50 52,38 60,62 68,38 76,62 80,18 84,82 88,50 96,38 104,62 112,38 120,62 124,18 128,82 132,50 140,38 148,62 156,38 164,62 168,18 172,82 176,50 184,38 192,62 200,38 208,62 212,18 216,82 220,50 228,38 236,62 244,38 252,62 256,18 260,82 264,50 272,38 280,62 288,38 296,62 300,18 304,82 308,50 316,38 324,62 332,38 340,62 344,18 348,82 352,50 360,38 368,62 376,38 384,62 388,18 392,82 396,50 404,38 412,62 420,38 428,62 432,18 436,82 440,50 448,38 456,62 464,38 472,62 476,18 480,82 484,50 492,38 500,62 508,38 516,62 520,18 524,82 528,50 536,38 544,62 552,38 560,62 564,18 568,82 572,50 580,38 588,62 596,38 600,50"/>
      <text x="10" y="16" fill="rgba(168,85,247,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">Atrial Flutter — Sawtooth Pattern 300 bpm</text>
    </svg>
  ),
  // Ventricular Tachycardia
  VTach: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(248,113,113,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(248,113,113,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 5,50 8,44 12,15 16,85 20,56 24,50 29,50 32,44 36,15 40,85 44,56 48,50 53,50 56,44 60,15 64,85 68,56 72,50 77,50 80,44 84,15 88,85 92,56 96,50 101,50 104,44 108,15 112,85 116,56 120,50 125,50 128,44 132,15 136,85 140,56 144,50 149,50 152,44 156,15 160,85 164,56 168,50 173,50 176,44 180,15 184,85 188,56 192,50 197,50 200,44 204,15 208,85 212,56 216,50 221,50 224,44 228,15 232,85 236,56 240,50 245,50 248,44 252,15 256,85 260,56 264,50 269,50 272,44 276,15 280,85 284,56 288,50 293,50 296,44 300,15 304,85 308,56 312,50 317,50 320,44 324,15 328,85 332,56 336,50 341,50 344,44 348,15 352,85 356,56 360,50 365,50 368,44 372,15 376,85 380,56 384,50 389,50 392,44 396,15 400,85 404,56 408,50 413,50 416,44 420,15 424,85 428,56 432,50 437,50 440,44 444,15 448,85 452,56 456,50 461,50 464,44 468,15 472,85 476,56 480,50 485,50 488,44 492,15 496,85 500,56 504,50 509,50 512,44 516,15 520,85 524,56 528,50 533,50 536,44 540,15 544,85 548,56 552,50 557,50 560,44 564,15 568,85 572,56 576,50 581,50 584,44 588,15 592,85 596,56 600,50"/>
      <text x="10" y="16" fill="rgba(248,113,113,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">Ventricular Tachycardia — Wide QRS 180 bpm</text>
    </svg>
  ),
  // PVC
  PVC: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 20,50 28,44 36,50 50,50 58,22 62,78 66,50 76,50 84,44 92,50 110,50"/>
      <polyline fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        points="110,50 114,44 118,10 124,90 130,56 138,50"/>
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="138,50 160,50 168,44 176,50 190,50 198,22 202,78 206,50 216,50 224,44 232,50 250,50 258,22 262,78 266,50 276,50 284,44 292,50"/>
      <polyline fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        points="292,50 296,44 300,10 306,90 312,56 320,50"/>
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="320,50 340,50 348,44 356,50 370,50 378,22 382,78 386,50 396,50 404,44 412,50 430,50 438,22 442,78 446,50 456,50 464,44 472,50 490,50"/>
      <polyline fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        points="490,50 494,44 498,10 504,90 510,56 518,50"/>
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="518,50 540,50 548,44 556,50 570,50 578,22 582,78 586,50 596,50 600,50"/>
      <text x="10" y="16" fill="rgba(248,113,113,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">PVC Trigeminy — Wide Ectopic Beat Every 3rd</text>
    </svg>
  ),
  // First Degree AV Block
  FirstDegree: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 15,50 22,44 30,50 55,50 63,22 67,78 71,50 81,50 89,44 97,50 122,50 130,44 138,50 163,50 171,22 175,78 179,50 189,50 197,44 205,50 230,50 238,44 246,50 271,50 279,22 283,78 287,50 297,50 305,44 313,50 338,50 346,44 354,50 379,50 387,22 391,78 395,50 405,50 413,44 421,50 446,50 454,44 462,50 487,50 495,22 499,78 503,50 513,50 521,44 529,50 554,50 562,44 570,50 595,50 600,50"/>
      <line x1="22" y1="44" x2="55" y2="44" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="130" y1="44" x2="163" y2="44" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
      <line x1="238" y1="44" x2="271" y2="44" stroke="rgba(245,158,11,0.3)" strokeWidth="1" strokeDasharray="3,2"/>
      <text x="10" y="16" fill="rgba(245,158,11,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">1st Degree AV Block — Prolonged PR &gt;0.20 sec</text>
    </svg>
  ),
  // Wenckebach / Mobitz I
  Wenckebach: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 15,50 22,44 37,50 47,50 55,22 59,78 63,50 73,50 80,44 100,50 110,50 118,22 122,78 126,50 136,50 143,44 168,50"/>
      <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" strokeLinecap="round"
        points="168,50 175,44 188,50"/>
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="200,50 215,50 222,44 237,50 247,50 255,22 259,78 263,50 273,50 280,44 300,50 310,50 318,22 322,78 326,50 336,50 343,44 368,50"/>
      <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" strokeLinecap="round"
        points="368,50 375,44 388,50"/>
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="400,50 415,50 422,44 437,50 447,50 455,22 459,78 463,50 473,50 480,44 500,50 510,50 518,22 522,78 526,50 536,50 543,44 568,50"/>
      <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" strokeLinecap="round"
        points="568,50 575,44 588,50"/>
      <text x="10" y="16" fill="rgba(245,158,11,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">Mobitz I (Wenckebach) — PR Lengthens then Drops</text>
    </svg>
  ),
  // Complete Heart Block
  CompleteBlock: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(248,113,113,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(248,113,113,0.06)" strokeWidth="1"/>)}
      {[0,60,120,180,240,300,360,420,480,540].map(x=>(
        <g key={x}>
          <circle cx={x+10} cy={35} r="4" fill="none" stroke="rgba(0,212,255,0.5)" strokeWidth="1.5"/>
        </g>
      ))}
      <polyline fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,65 30,65 36,58 40,30 44,95 50,65 80,65 116,58 120,30 124,95 130,65 160,65 196,58 200,30 204,95 210,65 240,65 280,65 286,58 290,30 294,95 300,65 330,65 370,65 376,58 380,30 384,95 390,65 420,65 460,65 466,58 470,30 474,95 480,65 510,65 550,65 556,58 560,30 564,95 570,65 600,65"/>
      <text x="10" y="16" fill="rgba(248,113,113,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">3rd Degree AV Block — P waves & QRS Dissociated</text>
    </svg>
  ),
  // Pacemaker
  Paced: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[20,120,220,320,420,520].map(x=>(
        <line key={x} x1={x} y1="20" x2={x} y2="80" stroke="#f59e0b" strokeWidth="2.5"/>
      ))}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 20,50 22,50 26,15 34,85 40,50 60,55 80,50 100,50 120,50 122,50 126,15 134,85 140,50 160,55 180,50 200,50 220,50 222,50 226,15 234,85 240,50 260,55 280,50 300,50 320,50 322,50 326,15 334,85 340,50 360,55 380,50 400,50 420,50 422,50 426,15 434,85 440,50 460,55 480,50 500,50 520,50 522,50 526,15 534,85 540,50 560,55 580,50 600,50"/>
      <text x="10" y="16" fill="rgba(245,158,11,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">V-Paced Rhythm — Spike → Wide QRS</text>
    </svg>
  ),
  // Junctional
  Junctional: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 30,50 34,56 38,50 42,22 46,78 50,50 80,50 110,50 114,56 118,50 122,22 126,78 130,50 160,50 190,50 194,56 198,50 202,22 206,78 210,50 240,50 270,50 274,56 278,50 282,22 286,78 290,50 320,50 350,50 354,56 358,50 362,22 366,78 370,50 400,50 430,50 434,56 438,50 442,22 446,78 450,50 480,50 510,50 514,56 518,50 522,22 526,78 530,50 560,50 590,50 594,56 598,50 600,50"/>
      <text x="10" y="16" fill="rgba(168,85,247,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">Junctional Rhythm — Inverted P after QRS, 50 bpm</text>
    </svg>
  ),
  // Artifact
  Artifact: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 20,50 28,44 36,50 50,50 58,22 62,78 66,50 76,50 84,44 92,50 110,50"/>
      <polyline fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        points="110,50 115,30 120,70 125,20 130,80 135,35 140,65 145,25 150,75 155,40 160,60 165,20 170,80 175,35 180,65 185,30 190,70 195,45 200,55 205,25 210,75 215,40 220,60 225,30 230,70 235,45 240,55 245,20 250,80 255,35 260,65 265,25 270,75 275,40 280,60 285,30 290,70 295,45 300,55 305,20 310,80 315,35 320,65 325,30 330,70 335,45 340,55 345,25 350,75 355,40 360,60 365,30 370,70 375,35 380,65 385,40 390,60 395,50"/>
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="395,50 410,50 418,44 426,50 440,50 448,22 452,78 456,50 466,50 474,44 482,50 500,50 508,22 512,78 516,50 526,50 534,44 542,50 560,50 568,22 572,78 576,50 586,50 594,44 600,50"/>
      <text x="10" y="16" fill="rgba(248,113,113,0.6)" fontSize="10" fontFamily="JetBrains Mono,monospace">Motion Artifact — Sudden Onset, Normal Before & After</text>
    </svg>
  ),
  // AVNRT
  AVNRT: () => (
    <svg viewBox="0 0 600 100" style={{width:"100%",height:90}} preserveAspectRatio="none">
      <rect width="600" height="100" fill="#080c14" rx="8"/>
      {[...Array(12)].map((_,i)=><line key={i} x1={i*50} y1="0" x2={i*50} y2="100" stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={i*25} x2="600" y2={i*25} stroke="rgba(0,212,255,0.06)" strokeWidth="1"/>)}
      <polyline fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        points="0,50 8,50 12,18 16,82 20,52 28,50 36,50 40,18 44,82 48,52 56,50 64,50 68,18 72,82 76,52 84,50 92,50 96,18 100,82 104,52 112,50 120,50 124,18 128,82 132,52 140,50 148,50 152,18 156,82 160,52 168,50 176,50 180,18 184,82 188,52 196,50 204,50 208,18 212,82 216,52 224,50 232,50 236,18 240,82 244,52 252,50 260,50 264,18 268,82 272,52 280,50 288,50 292,18 296,82 300,52 308,50 316,50 320,18 324,82 328,52 336,50 344,50 348,18 352,82 356,52 364,50 372,50 376,18 380,82 384,52 392,50 400,50 404,18 408,82 412,52 420,50 428,50 432,18 436,82 440,52 448,50 456,50 460,18 464,82 468,52 476,50 484,50 488,18 492,82 496,52 504,50 512,50 516,18 520,82 524,52 532,50 540,50 544,18 548,82 552,52 560,50 568,50 572,18 576,82 580,52 588,50 596,50 600,50"/>
      <text x="10" y="16" fill="rgba(0,212,255,0.5)" fontSize="10" fontFamily="JetBrains Mono,monospace">AVNRT — Narrow QRS Tachycardia, P buried in QRS</text>
    </svg>
  ),
};

const CHAPTER_DIAGRAMS = {
  1: { diagram: ECGDiagrams.NSR, label: "Normal Sinus Rhythm", note: "The baseline all rhythms are compared against. Learn this waveform cold." },
  2: { diagram: ECGDiagrams.NSR, label: "NSR with Labeled Intervals", note: "P wave → PR interval → QRS complex → T wave. Five steps, applied here." },
  3: { diagram: ECGDiagrams.PVC, label: "PVC — Ectopic Beat Example", note: "The wide, early beat is ectopic. The beats around it are sinus. Origin determines appearance." },
  4: { diagram: ECGDiagrams.STach, label: "Sinus Tachycardia", note: "Same P-QRS-T structure as NSR, just faster. Rate ≥101 bpm." },
  5: { diagram: ECGDiagrams.AFib, label: "Atrial Fibrillation", note: "No true P waves. Irregularly irregular ventricular response. The most common sustained arrhythmia." },
  6: { diagram: ECGDiagrams.Junctional, label: "Junctional Rhythm", note: "Inverted P wave follows the QRS — the AV node activated ventricles first, then atria retrogradely." },
  7: { diagram: ECGDiagrams.VTach, label: "Ventricular Tachycardia", note: "Wide, bizarre QRS at 180 bpm. No visible P waves. First question: does this patient have a pulse?" },
  8: { diagram: ECGDiagrams.Wenckebach, label: "Mobitz I (Wenckebach)", note: "PR interval lengthens progressively until a beat is dropped, then the cycle resets." },
  9: { diagram: ECGDiagrams.Paced, label: "Ventricular Paced Rhythm", note: "Vertical pacing spikes precede each wide QRS. The spike is the device firing." },
  10: { diagram: ECGDiagrams.AVNRT, label: "AVNRT", note: "Regular narrow QRS tachycardia at 190 bpm. P waves buried in QRS — not visible." },
  11: { diagram: ECGDiagrams.CompleteBlock, label: "3rd Degree AV Block", note: "Circles = P waves marching independently. Wide QRS = ventricular escape. No relationship between them." },
  12: { diagram: ECGDiagrams.Artifact, label: "Motion Artifact", note: "Sudden chaotic onset, normal rhythm before and after. Always check the patient first." },
  13: { diagram: ECGDiagrams.NSR, label: "Normal Sinus Rhythm", note: "The rhythm you want to see and report. Documentation starts here." },
  14: { diagram: ECGDiagrams.AFlutter, label: "Atrial Flutter", note: "Classic sawtooth flutter waves. Can you identify the conduction ratio?" },
};

// ─── CHAPTER CONTENT ────────────────────────────────────────────────────────
const CONTENT = {
  1:{sections:[{title:"The Four Cardiac Chambers",body:`The heart contains four chambers arranged in two parallel pumps. The right side receives deoxygenated blood from the body and sends it to the lungs; the left side receives oxygenated blood from the lungs and drives it to the body.\n\n• Right Atrium — the arrival chamber, fed by the superior and inferior venae cavae.\n• Right Ventricle — pumps blood through the pulmonary valve to the lungs.\n• Left Atrium — receives oxygenated blood via the pulmonary veins.\n• Left Ventricle — the heart's most powerful chamber, pumping blood through the aortic valve into the aorta.\n\nEach chamber connects to the next via a one-way valve that prevents backflow: tricuspid, pulmonary, mitral, and aortic.`},{title:"The Conduction System",body:`Every beat starts at the sinoatrial (SA) node in the right atrial wall — the heart's primary pacemaker. The signal spreads across both atria (producing the P wave), arrives at the atrioventricular (AV) node, and is deliberately slowed to allow the atria to finish contracting.\n\nFrom the AV node, the signal travels down the Bundle of His, splits into the right and left bundle branches, and fans out through the Purkinje fiber network — triggering simultaneous, coordinated ventricular contraction.\n\nThe full pathway: SA Node → AV Node → Bundle of His → Right/Left Bundle Branches → Purkinje Fibers.\n\nThis sequence repeats on every single beat. Disruption at any station produces a recognizable ECG pattern.`},{title:"Blood Flow in Six Steps",body:`Trace this sequence until it's automatic:\n\n1. Deoxygenated blood enters the right atrium via the superior and inferior venae cavae.\n2. It flows through the tricuspid valve into the right ventricle.\n3. The right ventricle pumps it through the pulmonary valve toward the lungs.\n4. Oxygenated blood returns from the lungs via the pulmonary veins into the left atrium.\n5. It passes through the mitral valve into the left ventricle.\n6. The left ventricle pumps it through the aortic valve into the aorta and out to the body.`},{title:"Why Location Is Everything",body:`The most important principle in rhythm interpretation: where a signal originates determines what it looks like on the ECG strip.\n\nSignals from above the AV node reach the ventricles via the normal His-Purkinje pathway — producing a narrow QRS complex.\n\nSignals from within the ventricular muscle itself spread cell-to-cell, taking longer and producing a wide, bizarre QRS complex.\n\nThis narrow/wide distinction is your first split in rhythm classification on every strip you'll ever read.`}],quiz:[{q:"Where does blood from the body first arrive in the heart?",opts:["Left ventricle","Right atrium","Pulmonary veins","Aorta"],correct:1,exp:"The right atrium receives deoxygenated blood from the body via the superior and inferior venae cavae."},{q:"Which valve sits between the left atrium and left ventricle?",opts:["Tricuspid","Pulmonary","Mitral","Aortic"],correct:2,exp:"The mitral (bicuspid) valve separates the left atrium from the left ventricle."},{q:"What does a wide QRS (>0.12 sec) tell you about signal origin?",opts:["The SA node fired too fast","The signal originated in or below the ventricles","The AV node is blocked","The atria fired early"],correct:1,exp:"A wide QRS means ventricular depolarization took an abnormal, slow path — cell-to-cell spread instead of the fast His-Purkinje route."},{q:"The AV node deliberately slows the cardiac impulse. Why?",opts:["To prevent atrial fibrillation","To allow the atria to finish contracting before the ventricles fire","To increase heart rate","To reset the SA node"],correct:1,exp:"The AV node delay gives the atria time to complete their contraction and push blood into the ventricles before the ventricles fire."},{q:"Which structure fans out across the ventricular walls to trigger simultaneous contraction?",opts:["AV node","Bundle of His","Purkinje fibers","SA node"],correct:2,exp:"The Purkinje fibers are the terminal branches of the conduction system, spreading across both ventricular walls."}]},
  2:{sections:[{title:"The Three ECG Waves",body:`Every normal heartbeat produces three distinct waveforms:\n\n• P Wave — a small, rounded bump representing atrial depolarization. The SA node fires, the signal sweeps across both atria. In Lead II, a healthy P wave is upright and consistent.\n\n• QRS Complex — the ECG's dominant feature representing ventricular depolarization. Q (small dip), R (tall spike), S (downward return).\n\n• T Wave — a gentle, rounded bump following the QRS representing ventricular repolarization — the ventricles resetting electrically for the next beat.`},{title:"Intervals and Measurements",body:`ECG paper runs at 25 mm/sec. Each small box = 0.04 seconds; each large box = 0.20 seconds.\n\n• PR Interval — from start of P wave to start of QRS. Normal: 0.12–0.20 seconds (3–5 small boxes).\n\n• QRS Duration — from start to end of QRS complex. Normal: 0.06–0.12 seconds. Values >0.12 seconds indicate abnormal ventricular conduction.\n\n• QT Interval — from start of QRS to end of T wave. Prolonged QT increases arrhythmia risk.`},{title:"Calculating Heart Rate",body:`Three reliable methods:\n\n1. Six-Second Method — count QRS complexes in 6 seconds, multiply by 10. Works for regular and irregular rhythms.\n\n2. 1500 Method — divide 1500 by the number of small boxes in the R-R interval. Most accurate for regular rhythms.\n\n3. 300 Method — divide 300 by the number of large boxes in the R-R interval. Quick bedside estimate.`},{title:"The 5-Step Rhythm Check",body:`Apply these five steps to every strip in order:\n\n1. Regularity — are the R-R intervals consistent?\n2. Rate — is it 60–100 bpm, above 100, or below 60?\n3. P Wave — is there one before every QRS? Is it upright in Lead II?\n4. PR Interval — is it 0.12–0.20 seconds? Consistent?\n5. QRS Duration — is it 0.06–0.12 seconds (narrow) or >0.12 seconds (wide)?\n\nIn Normal Sinus Rhythm, all five are within normal limits. Every arrhythmia deviates from at least one.`}],quiz:[{q:"What does the PR interval measure?",opts:["Ventricular repolarization time","Atrial-to-ventricular conduction time","Time between T wave and next P wave","QRS plus T wave"],correct:1,exp:"The PR interval measures total conduction time from SA node firing through the AV node to the start of ventricular depolarization. Normal: 0.12–0.20 sec."},{q:"A strip shows 8 QRS complexes in 6 seconds. What is the heart rate?",opts:["80 bpm","60 bpm","96 bpm","48 bpm"],correct:0,exp:"Using the 6-second method: 8 complexes × 10 = 80 bpm."},{q:"Which wave represents ventricular repolarization?",opts:["P wave","QRS complex","T wave","U wave"],correct:2,exp:"The T wave represents ventricular repolarization — the electrical reset that prepares the ventricles for the next beat."},{q:"On standard ECG paper, how long does one large box represent?",opts:["0.04 seconds","0.12 seconds","0.20 seconds","1.00 second"],correct:2,exp:"One large box = 5 small boxes × 0.04 sec = 0.20 seconds."},{q:"A QRS duration of 0.14 seconds indicates:",opts:["Normal ventricular conduction","Abnormal ventricular conduction (wide QRS)","Junctional rhythm","Atrial fibrillation"],correct:1,exp:"Normal QRS duration is 0.06–0.12 sec. At 0.14 sec the QRS is wide — indicating abnormal ventricular depolarization."}]},
  3:{sections:[{title:"Three Mechanisms of Arrhythmia",body:`Every arrhythmia arises from one of three mechanisms:\n\n1. Abnormal Automaticity — a cell fires spontaneously at an abnormal rate.\n2. Reentry — an electrical impulse gets stuck in a loop, re-exciting tissue it already passed through.\n3. Triggered Activity — a prior action potential triggers an abnormal after-depolarization.`},{title:"Escape vs. Ectopic",body:`Ectopic beats fire early — they interrupt the normal rhythm before the next expected SA node beat. They represent enhanced automaticity from a non-sinus focus.\n\nEscape beats fire late — they appear after a pause, when the SA node has failed. They are protective.\n\nRule: ectopic beats are early; escape beats are late. Never suppress an escape rhythm without addressing why the higher pacemaker failed.`},{title:"The Rhythm Family Map",body:`Every rhythm has an origin point in the cardiac anatomy:\n\n• Sinus rhythms (Ch. 4) — SA node. Upright P waves, normal PR, narrow QRS.\n• Atrial rhythms (Ch. 5) — atrial muscle. Abnormal P wave shape, narrow QRS.\n• Junctional rhythms (Ch. 6) — AV node. Inverted, absent, or buried P waves, narrow QRS.\n• Ventricular rhythms (Ch. 7) — ventricular muscle. Wide, bizarre QRS.\n• AV Blocks (Ch. 8) — conduction failure. P waves present, QRS delayed or dropped.\n• Paced rhythms (Ch. 9) — artificial device. Pacing spikes visible.\n• Reentrant SVTs (Ch. 10) — circuit-driven. Very fast, narrow QRS.`},{title:"The Naming Pattern",body:`Once you learn rhythm names in one location, you've learned them for all locations:\n\n• Premature beat (early, single): PAC / PJC / PVC\n• Escape beat (late, single): Atrial / Junctional / Ventricular escape beat\n• Three or more consecutive: Rhythm or Tachycardia depending on rate\n• Tachycardia (≥101 bpm): Atrial Tach / Junctional Tach / Ventricular Tach\n• Fibrillation (chaotic): Atrial Fib / Ventricular Fib`}],quiz:[{q:"A beat that fires before the next expected SA node beat is called:",opts:["An escape beat","An ectopic beat","A fusion beat","A capture beat"],correct:1,exp:"Ectopic beats fire early — they interrupt the normal rhythm."},{q:"Reentry requires which of the following?",opts:["One slow pathway only","Two pathways with different conduction speeds and refractory periods","A blocked AV node","Enhanced SA node automaticity"],correct:1,exp:"Reentry requires two pathways: one slow, one fast — creating a circular loop."},{q:"A junctional escape beat will appear:",opts:["Early, before the next expected beat","Late, after a long pause when higher pacemakers fail","At the same time as the SA node fires","During atrial fibrillation only"],correct:1,exp:"Escape beats are protective — they fire late, after the SA node or higher pacemakers have failed."},{q:"Wide QRS complexes indicate:",opts:["Atrial origin","Normal conduction","Ventricular origin or aberrant conduction","Sinus tachycardia"],correct:2,exp:"A wide QRS (>0.12 sec) indicates the signal traveled an abnormal pathway through the ventricles."}]},
  4:{sections:[{title:"Seven Sinus Rhythms",body:`All seven sinus rhythms share the same DNA: SA node origin, intact conduction, P wave before each QRS, normal PR and narrow QRS. What varies is rate, regularity, and whether beats are missing.\n\n• Normal Sinus Rhythm (NSR) — 60–100 bpm, regular\n• Sinus Tachycardia (ST) — ≥101 bpm, regular\n• Sinus Bradycardia (SB) — <60 bpm, regular\n• Sinus Arrhythmia (SA) — 60–100 bpm, slightly irregular (cyclic with breathing)\n• Sinus Exit Block — gap is exact multiple of R-R\n• Sinus Pause — gap 1.2–2.0 sec, not a clean multiple\n• Sinus Arrest — gap >2.0 sec, SA node may not restart`},{title:"The Signal Failure Trio",body:`Sinus exit block, sinus pause, and sinus arrest all present as a gap in the rhythm. Measure the gap:\n\nSinus Exit Block: Gap = exactly 2× or 3× the normal R-R interval. SA node fired, signal didn't exit.\n\nSinus Pause: Gap longer than one cycle, not a clean multiple. Duration 1.2–2.0 sec. SA node recovers on its own.\n\nSinus Arrest: Gap >2.0 seconds. SA node may not restart. Junctional escape often appears.`},{title:"Strange P Waves — Still Sinus",body:`A common pitfall: assuming an unusual P wave morphology indicates ectopic rhythm. In patients with structural atrial disease, P waves may appear notched, peaked, or biphasic — yet the SA node is still firing.\n\nKey rule: all strange P waves should be considered sinus until proven ectopic.\n\nProof of ectopic origin requires contrast — an ectopic P wave looks different from the baseline P waves in the same strip.`},{title:"Clinical Significance",body:`Rate alone does not determine clinical action — symptoms and context do:\n\n• Sinus Tachycardia — almost always a physiological response. Treat the cause.\n• Sinus Bradycardia — benign in athletes; concerning only if symptomatic.\n• Sinus Arrhythmia — normal physiological variation; no treatment needed.\n• Signal Failures — urgency scales with severity. Sinus arrest with no escape rhythm is a medical emergency.`}],quiz:[{q:"Which sinus rhythm shows a gap that is exactly 2× or 3× the normal R-R interval?",opts:["Sinus arrest","Sinus pause","Sinus exit block","Sinus arrhythmia"],correct:2,exp:"In sinus exit block, the SA node kept firing on schedule but the signal didn't exit the node. The gap is a mathematically clean multiple of the normal R-R interval."},{q:"Sinus tachycardia at 115 bpm in a patient with a fever of 103°F should be:",opts:["Cardioverted immediately","Treated with beta-blockers","Treated by addressing the fever","Left untreated and ignored"],correct:2,exp:"Sinus tachycardia is almost always a compensatory response. The rate will come down when the cause is treated."},{q:"Normal sinus rhythm has a heart rate of:",opts:["40–60 bpm","60–100 bpm","100–150 bpm","Any rate with upright P waves"],correct:1,exp:"NSR is defined as SA node origin at a rate of 60–100 bpm with regular rhythm."},{q:"A 28-year-old runner has a resting HR of 48 bpm with normal P waves, PR and QRS. This is:",opts:["Sinus bradycardia requiring treatment","Junctional rhythm","Sinus bradycardia — normal in an athlete","Third-degree AV block"],correct:2,exp:"Sinus bradycardia in a well-trained athlete is a normal physiological finding — high vagal tone lowers the resting heart rate."}]},
  5:{sections:[{title:"PACs, Escape Beats & Ectopic Atrial Rhythms",body:`Atrial rhythms originate in atrial muscle cells outside the SA node. The QRS remains narrow (normal AV conduction). The P wave looks different — inverted, notched, or biphasic.\n\n• PAC — single early beat from an ectopic atrial focus. Abnormal P wave, narrow QRS, non-compensatory pause.\n• Atrial Escape Beat — single late beat from atrial focus after SA node pause. Protective.\n• EAR — three or more consecutive PAC-like beats at ≤100 bpm.\n• EAT — same as EAR but rate ≥101 bpm.`},{title:"WAP & MAT",body:`Wandering Atrial Pacemaker (WAP): Three or more different P wave morphologies, rate ≤100 bpm, slightly irregular. The pacemaker site shifts between SA node and multiple ectopic atrial foci.\n\nMultifocal Atrial Tachycardia (MAT): Same hallmark (≥3 different P wave morphologies) but rate ≥101 bpm. Irregularly irregular like AF, but discrete P waves precede each QRS. Strongly associated with severe COPD. Not treated with cardioversion.`},{title:"Atrial Flutter & Fibrillation",body:`Atrial Flutter: Rapid regular atrial activation at 250–350 bpm producing classic sawtooth flutter waves — most visible in leads II, III, aVF. Ventricular rate depends on conduction ratio (2:1, 3:1, 4:1).\n\nAtrial Fibrillation (AF): Chaotic disorganized atrial activity at 350–600 bpm. No true P waves — fibrillatory baseline. Ventricular response is irregularly irregular. Most common sustained arrhythmia.`},{title:"AF & Stroke Risk",body:`AF eliminates coordinated atrial contraction. Blood stagnates in the left atrial appendage. Stagnant blood clots. A clot traveling to the brain causes ischemic stroke.\n\nManagement pillars:\n1. Rate control — slow ventricular response using beta-blockers, calcium channel blockers, or digoxin.\n2. Rhythm control — restore sinus rhythm via cardioversion or antiarrhythmic drugs.\n3. Anticoagulation — reduce stroke risk using warfarin or DOACs, guided by CHA₂DS₂-VASc score.`}],quiz:[{q:"What makes atrial fibrillation's ventricular rhythm unique?",opts:["Regular with narrow QRS","Regularly irregular with wide QRS","Irregularly irregular with no true P waves","Regular with sawtooth flutter waves"],correct:2,exp:"AF's hallmark is irregularly irregular ventricular response with no discernible P waves — only a chaotic fibrillatory baseline."},{q:"Atrial flutter typically produces what ECG pattern?",opts:["Flat baseline","Sawtooth flutter waves at 250–350/min","Discrete P waves before each QRS","Fibrillatory baseline"],correct:1,exp:"Atrial flutter produces regular sawtooth-shaped flutter waves at 250–350 per minute, best seen in leads II, III, aVF."},{q:"MAT is distinguished from AF by:",opts:["Rate above 100 bpm","Wide QRS complexes","Discrete P waves before each QRS (≥3 morphologies)","Sawtooth flutter waves"],correct:2,exp:"MAT is irregularly irregular like AF, but has distinct P waves before each QRS — at least 3 different P wave morphologies."},{q:"The primary stroke risk in atrial fibrillation comes from:",opts:["Fast ventricular rate","Blood pooling in the left atrial appendage forming clots","Ventricular fibrillation degenerating from AF","Coronary artery blockage"],correct:1,exp:"Without coordinated atrial contraction, blood stagnates in the left atrial appendage. Clot formation and embolization to the brain causes ischemic stroke."}]},
  6:{sections:[{title:"When the AV Node Takes Over",body:`Junctional rhythms originate at or near the AV node. The QRS remains narrow (normal His-Purkinje conduction). The P wave position is abnormal:\n\n• P before QRS with short PR (<0.12 sec) — AV node activated atria slightly before ventricles\n• P buried in QRS — simultaneous atrial and ventricular activation\n• P after QRS (inverted, retrograde) — ventricles fired first, then atria backward\n• No visible P wave — atrial activation completely hidden`},{title:"Junctional Escape Beat & Rhythm",body:`When the SA node slows or fails, the AV junction fires a backup beat — a junctional escape beat. It arrives late (after a long pause), has the abnormal P wave signature, and a narrow QRS.\n\nThree or more consecutive junctional escape beats produce a junctional escape rhythm (JER) at 40–60 bpm. This is an emergency backup, not a benign finding. Always ask: why did the SA node fail?`},{title:"Accelerated Junctional & Junctional Tachycardia",body:`When the AV junction accelerates above its normal backup rate but stays below 100 bpm, the result is accelerated junctional rhythm (AJR) — rate 61–99 bpm.\n\nAt ≥100 bpm it becomes junctional tachycardia.\n\nIn both cases: P waves are abnormal, PR is short if P is visible, QRS is narrow.\n\nThe AV node should not be the primary pacemaker at any rate — even a normal-looking rate from a junctional source is pathological.`},{title:"Don't Confuse: Short PR + Inverted P",body:`The most common junctional interpretation trap: calling any inverted P wave with a short PR a junctional rhythm.\n\nA low atrial focus also produces inverted P waves with short PR intervals — because atrial depolarization travels upward instead of downward.\n\nTrue junctional signatures: P wave buried in QRS, P wave after QRS, or no P wave at all. A P wave before the QRS — even inverted — could be atrial until proven otherwise.`}],quiz:[{q:"A junctional escape beat appears on the ECG:",opts:["Early, before the expected SA node beat","Late, after a pause when the SA node fails","During atrial fibrillation","As a wide QRS with no P wave"],correct:1,exp:"Junctional escape beats are protective — they fire late, stepping in after the SA node has failed."},{q:"What is the intrinsic rate of the AV junction as a backup pacemaker?",opts:["20–40 bpm","40–60 bpm","60–100 bpm","100–150 bpm"],correct:1,exp:"The AV junction fires at 40–60 bpm as a backup pacemaker."},{q:"A junctional rhythm at 75 bpm is best classified as:",opts:["Normal sinus rhythm","Junctional escape rhythm","Accelerated junctional rhythm","Junctional tachycardia"],correct:2,exp:"The AV junction's normal backup rate is 40–60 bpm. At 75 bpm it is faster than expected — accelerated junctional rhythm."},{q:"Which P wave position definitively confirms junctional origin?",opts:["P before QRS with short PR","P inverted in lead II","P buried in or after the QRS","Any abnormal P wave morphology"],correct:2,exp:"Only a P wave buried in the QRS, following the QRS, or absent entirely points specifically to junctional origin."}]},
  7:{sections:[{title:"PVCs — The Ectopic Ventricular Beat",body:`PVCs are the most common ventricular arrhythmia. They fire early from a ventricular muscle focus, bypassing the His-Purkinje system. The QRS is wide (>0.12 sec) and bizarre.\n\nKey ECG features:\n• Wide QRS (>0.12 sec), unusual morphology\n• No preceding P wave\n• Full compensatory pause after the PVC\n\nPVC patterns:\n• Unifocal — all PVCs look identical\n• Multifocal — PVCs vary in morphology\n• Bigeminy — every other beat is a PVC\n• Trigeminy — every third beat is a PVC\n• Couplet — two consecutive PVCs`},{title:"The Compensatory Pause",body:`When a PVC fires, the SA node keeps firing on its own schedule, completely unaffected. The SA node fires during or just after the PVC — but finds the ventricles refractory and cannot conduct.\n\nThe SA node then fires again at its next scheduled interval — and this time the ventricles respond.\n\nResult: the pause after the PVC plus the PVC itself equals exactly 2× the normal R-R interval. This mathematical precision is the hallmark of PVCs.`},{title:"Ventricular Tachycardia & Fibrillation",body:`Ventricular Tachycardia (VT): Three or more consecutive ventricular beats at ≥101 bpm. Wide, bizarre QRS, AV dissociation. Can be monomorphic or polymorphic.\n\nFirst clinical question: does this patient have a pulse?\n\nTorsades de Pointes (TdP): Polymorphic VT where QRS complexes rotate around the baseline, associated with prolonged QT. Treatment: magnesium sulfate IV.\n\nVentricular Fibrillation (VF): Chaotic disorganized activity with no recognizable QRS. Immediate defibrillation required.`},{title:"SVT with Bundle Branch Block",body:`A wide QRS tachycardia does not always mean VT. A supraventricular rhythm can produce wide QRS if one bundle branch is blocked.\n\nClues favoring SVT with BBB:\n• Upright P waves before every QRS\n• Known prior bundle branch block\n\nClues favoring true VT:\n• AV dissociation\n• Fusion beats or capture beats\n• No prior BBB history\n\nSafety rule: when in doubt, treat wide QRS tachycardia as VT.`}],quiz:[{q:"A full compensatory pause after a PVC means:",opts:["The SA node reset after the PVC","The PVC plus the pause equals exactly 2× the normal R-R interval","The next beat will be narrow","The AV node blocked the PVC"],correct:1,exp:"In a compensatory pause, the SA node never resets. PVC + pause = 2× normal R-R."},{q:"PVC bigeminy means:",opts:["Every other beat is a PVC","Two consecutive PVCs","Three consecutive PVCs","PVCs from multiple foci"],correct:0,exp:"Bigeminy = every other beat. The pattern alternates: normal beat, PVC, normal beat, PVC."},{q:"What is the FIRST question to ask when you see a wide QRS tachycardia?",opts:["Is the QRS monomorphic or polymorphic?","Does this patient have a pulse?","Is there AV dissociation?","What is the exact rate?"],correct:1,exp:"Clinical priority overrides ECG interpretation. A wide QRS tachycardia could be pulseless VT requiring immediate CPR and defibrillation."},{q:"Torsades de Pointes is associated with:",opts:["Short QT interval","Prolonged QT interval and rotating QRS morphology","Narrow QRS tachycardia","Third-degree AV block"],correct:1,exp:"TdP is a polymorphic VT occurring in the setting of prolonged QT. Treatment: IV magnesium sulfate."}]},
  8:{sections:[{title:"First-Degree AV Block",body:`In First-Degree AV Block, every P wave conducts to a QRS — no beats are dropped. The only abnormality is a prolonged PR interval: >0.20 seconds (>5 small boxes). Conduction is slow but intact.\n\nECG: regular rhythm, normal rate, upright P waves, PR consistently >0.20 sec, narrow QRS.\n\nClinical significance: usually benign, often a normal variant or medication effect. No treatment required for isolated first-degree block.`},{title:"Second-Degree AV Block",body:`Mobitz Type I (Wenckebach): PR interval progressively lengthens over successive beats until one P wave fails to conduct — then the cycle resets. Usually occurs at the AV node level. Generally benign.\n\nMobitz Type II: PR intervals are constant on all conducted beats — but periodically a P wave is suddenly not conducted. The constant PR is the critical distinguishing feature. Usually reflects disease below the AV node. Higher risk of progression to complete block. Pacemaker often indicated.`},{title:"High-Grade & Third-Degree AV Block",body:`High-Grade AV Block: More than one consecutive P wave is non-conducted — the ratio is 2:1 or higher. Cannot be definitively classified as Mobitz Type I or II without two consecutive conducted beats.\n\nThird-Degree (Complete) AV Block: No signal crosses from atria to ventricles. P waves appear on schedule but none reach the ventricles. A lower escape pacemaker takes over (junctional = narrow QRS, ventricular = wide QRS). Complete AV dissociation. Medical emergency — pacemaker required.`},{title:"The NCPAC Trap",body:`Non-Conducted PAC (NCPAC): A PAC that fires early enough to find the AV node refractory, producing a P wave with no following QRS. Looks exactly like a dropped beat in AV block.\n\nThe distinction:\n• NCPAC: Non-conducted P wave arrives early, often has different shape, may hide in preceding T wave.\n• AV Block dropped beat: Non-conducted P wave arrives on schedule, identical to all other sinus P waves.\n\nAlways check T waves before diagnosing AV block.`}],quiz:[{q:"In Mobitz Type II, the PR interval on conducted beats is:",opts:["Progressively lengthening","Progressively shortening","Constant (fixed)","Variable and unpredictable"],correct:2,exp:"Mobitz Type II is defined by a constant PR interval on all conducted beats, with sudden non-conducted P waves occurring without warning."},{q:"Third-degree AV block shows:",opts:["Progressively lengthening PR with dropped beats","Complete AV dissociation — P waves and QRS at independent rates","Constant PR with intermittent dropped beats","Prolonged PR with every P wave conducting"],correct:1,exp:"In third-degree block, no sinus P wave ever conducts to the ventricles. Complete AV dissociation."},{q:"What is the first step when you see a P wave not followed by a QRS?",opts:["Diagnose second-degree AV block","Check for a non-conducted PAC hiding in the T wave","Call the physician immediately","Measure the QRS duration"],correct:1,exp:"Before diagnosing any AV block, rule out a NCPAC. Check every T wave before the dropped beat."},{q:"Mobitz Type I (Wenckebach) is most often associated with:",opts:["Disease below the Bundle of His","Anterior MI and bundle branch block","Inferior MI and increased vagal tone","Ventricular muscle disease"],correct:2,exp:"Wenckebach block occurs at the AV node, which receives blood supply from the right coronary artery — the same artery supplying the inferior wall."}]},
  9:{sections:[{title:"Pacemaker Basics",body:`An artificial pacemaker delivers electrical impulses when the natural conduction system fails. Two core functions:\n\n• Sensing — detecting intrinsic cardiac activity. When the heart beats on its own, the pacemaker stands down.\n\n• Pacing — delivering a timed electrical stimulus when no intrinsic beat occurs within the programmed interval.\n\nThe ECG signature: a narrow, sharp vertical pacing spike immediately before the paced P wave or QRS complex.`},{title:"Four Types of Paced Rhythms",body:`• Atrial paced (AAI) — spike before each P wave; normal QRS follows via intact AV conduction.\n• Ventricular paced (VVI) — spike before each QRS; wide, bizarre QRS because pacing lead stimulates ventricular muscle directly.\n• Dual-chamber paced (DDD) — spikes before both P wave and QRS. Maintains AV synchrony.\n• Biventricular paced (CRT) — paces both ventricles simultaneously to restore synchrony in heart failure.\n\nRecognizing pacing spikes is step one. The type follows from where the spike appears.`},{title:"Three Pacemaker Failures",body:`The name of each failure tells you what failed:\n\n• Failure to PACE — no pacing spike when expected. Device didn't fire. Cause: oversensing (mistook something for a heartbeat and inhibited itself).\n\n• Failure to CAPTURE — pacing spike present but not followed by P wave or QRS. Device fired but myocardium didn't respond. Causes: lead displacement, fibrosis, hyperkalemia.\n\n• Failure to SENSE — pacing spike fires too soon after an intrinsic beat. Device missed the patient's own rhythm. Dangerous — R-on-T can trigger VF.`},{title:"Applying the 5 Steps to Paced Rhythms",body:`Before applying the five steps, add a preliminary step:\n\nStep 0 — Look for pacing spikes first. Identify them. Then determine whether they precede P waves, QRS complexes, or both.\n\nThen add Step 6 after the standard five steps: Is there a failure?\n• Missing spikes when expected → failure to pace\n• Spikes without following P/QRS → failure to capture\n• Spikes too close to intrinsic beats → failure to sense`}],quiz:[{q:"A pacing spike appears but no P wave or QRS follows. This is:",opts:["Failure to sense","Failure to pace","Failure to capture","Normal paced rhythm"],correct:2,exp:"Failure to capture: the pacemaker fired (spike present) but the myocardium did not depolarize in response."},{q:"No pacing spike appears when the patient's rate drops below the programmed rate. This is:",opts:["Failure to capture","Failure to sense","Failure to pace","Normal demand pacing"],correct:2,exp:"Failure to pace: the device should have fired but didn't. Likely cause: oversensing."},{q:"Why is failure to sense potentially dangerous?",opts:["It causes the heart rate to become too fast","A pacing spike landing on the T wave can trigger VF (R-on-T)","It always causes failure to capture","It blocks AV conduction"],correct:1,exp:"Failure to sense means the pacemaker fires despite an intrinsic beat — if the spike lands during the T wave, it can trigger VF."},{q:"In a ventricular paced rhythm, why is the QRS always wide?",opts:["The pacemaker delivers too much current","The stimulus bypasses the AV node","The pacing lead stimulates ventricular muscle directly, bypassing the His-Purkinje system","The atria are not paced"],correct:2,exp:"Ventricular pacing delivers stimulus directly to myocardial muscle. The impulse spreads cell-to-cell rather than through the fast His-Purkinje pathway."}]},
  10:{sections:[{title:"Reentry — How the Circuit Sustains Itself",body:`AVNRT and AVRT are both driven by reentry — an electrical impulse trapped in a loop that re-excites tissue it already passed through.\n\nReentry requires:\n• Two parallel pathways with different conduction speeds\n• One pathway conducting faster, one conducting slower\n• Different refractory periods\n\nResult: a circular current running continuously through the loop, producing a regular, rapid, narrow QRS tachycardia.`},{title:"AVNRT — The AV Node's Internal Loop",body:`In AVNRT, the entire reentry circuit exists within or immediately around the AV node — a slow pathway and a fast pathway. The impulse cycles around this loop continuously.\n\nBecause the circuit activates the atria and ventricles almost simultaneously, the retrograde P wave is buried in or fused with the QRS complex.\n\nKey ECG clues:\n• Regular, narrow QRS tachycardia, rate 150–250 bpm\n• No visible P waves, or pseudo-r' in V1\n• Onset sudden; may terminate with vagal maneuvers or adenosine`},{title:"AVRT — The Accessory Pathway",body:`In AVRT, the reentry circuit uses the AV node as one limb and an accessory pathway (AP) as the other.\n\nOrthodromic AVRT (most common): impulse travels down the AV node (narrow QRS), then retrogradely up the AP. Retrograde P waves appear after each QRS in the ST segment.\n\nAntidromic AVRT: impulse travels down the AP — producing a wide QRS. Rarest form.`},{title:"Wolff-Parkinson-White (WPW) Syndrome",body:`WPW is the most clinically important accessory pathway condition. During sinus rhythm:\n• Short PR interval (<0.12 sec)\n• Delta wave (slurred initial QRS deflection)\n• Slightly wide QRS\n\nThe danger: if AF develops, the AP can conduct impulses rapidly at 200–300+ bpm — bypassing the rate-limiting AV node — potentially degenerating into VF.\n\nAV nodal blocking drugs (adenosine, verapamil, diltiazem, digoxin) are CONTRAINDICATED in WPW with AF.\n\nDefinitive treatment: radiofrequency catheter ablation.`}],quiz:[{q:"In AVNRT, P waves are typically:",opts:["Upright before each QRS","Inverted and before each QRS with a short PR","Buried in or fused with the QRS complex","Completely absent (fibrillatory baseline)"],correct:2,exp:"AVNRT's reentry circuit activates atria and ventricles nearly simultaneously — the retrograde P wave is buried in or fused with the QRS."},{q:"What makes WPW dangerous if atrial fibrillation develops?",opts:["The delta waves disappear","The accessory pathway can conduct AF impulses at 200–300+ bpm, bypassing AV node rate-limiting, risking VF","The QRS narrows during AF","AV blocks develop"],correct:1,exp:"The AV node normally limits ventricular response in AF. The accessory pathway in WPW has no such rate-limiting property."},{q:"Orthodromic AVRT produces a narrow QRS because:",opts:["The AP is too slow to conduct","Ventricular conduction travels down the AV node via normal His-Purkinje pathways","The reentry circuit is entirely within the AV node","The atria depolarize before the ventricles"],correct:1,exp:"In orthodromic AVRT, the impulse travels antegrade down the AV node (normal ventricular conduction = narrow QRS)."},{q:"The delta wave in WPW represents:",opts:["Atrial repolarization","Delayed ventricular depolarization","Early ventricular pre-excitation through the accessory pathway","Retrograde atrial activation"],correct:2,exp:"The delta wave is the slurred initial upstroke of the QRS in WPW — early ventricular depolarization through the AP before the normal AV node pathway conducts."}]},
  11:{sections:[{title:"The Master Decision Tree",body:`A systematic approach to any strip, in order:\n\nStep 1 — Assess QRS width first. Narrow (<0.12 sec) = supraventricular. Wide (>0.12 sec) = ventricular or SVT with aberration.\n\nStep 2 — Apply the full 5-step check: Regularity → Rate → P Waves → PR Interval → QRS Duration.\n\nStep 3 — Assess the P wave. Upright? Sinus. Absent/inverted/buried? Junctional or ectopic. Multiple morphologies? WAP/MAT. Sawtooth? Flutter. Fibrillatory baseline? AF.\n\nStep 4 — Assess P-QRS relationship. 1:1? Normal. More P waves than QRS? AV block. P waves and QRS independent? AV dissociation.\n\nStep 5 — Integrate all findings. Name the rhythm. Apply clinical urgency.`},{title:"Approaching Ambiguous Strips",body:`When a strip resists easy classification:\n\n1. Start with what you know. Name what you can: regular or irregular? Narrow or wide? Fast or slow?\n\n2. Measure before you interpret. Calipers prevent eyeballing errors.\n\n3. Compare long rhythm strips. Longer strips reveal cyclical patterns.\n\n4. Use multiple leads. A P wave invisible in Lead II may be clear in V1 or aVR.\n\n5. When still uncertain, describe what you see. Accurate description is more useful than an incorrect diagnosis.`},{title:"Common Diagnostic Traps",body:`Most frequently missed scenarios:\n\n• NCPAC called AV block — check T waves for hidden early P waves.\n• Sinus tachycardia with rate-dependent BBB called VT — find upright P waves before every wide QRS.\n• Low atrial rhythm misidentified as junctional — P before QRS (even inverted) can be atrial.\n• 2:1 AV block typed as Mobitz II — need two consecutive conducted beats to assess PR behavior.\n• Artifact called VF — a conscious patient cannot be in VF.\n• TdP called standard VT — check QT on preceding beats.`},{title:"Building Interpretation Speed",body:`Expert rhythm readers execute the five steps faster — not skip them.\n\n1. Pattern recognition — gestalt should trigger the five steps, not replace them.\n\n2. Organized scanning — move in the same sequence every time: baseline → P waves → QRS → intervals → regularity.\n\n3. Naming aloud — saying the five steps forces completion of each step before the next.\n\n4. Review errors actively — when you misidentify a rhythm, trace back through the five steps and find which step you missed.`}],quiz:[{q:"What should you assess FIRST on any ECG strip?",opts:["Heart rate","P wave morphology","QRS width (narrow vs. wide)","PR interval"],correct:2,exp:"QRS width is the primary branch in the rhythm classification tree. Narrow = supraventricular. Wide = ventricular or aberrant."},{q:"You see a P wave followed by no QRS. Before diagnosing AV block, you should:",opts:["Immediately call the physician","Check the preceding T wave for a hidden early P wave (NCPAC)","Measure the QRS width","Check blood pressure"],correct:1,exp:"A non-conducted PAC (NCPAC) can mimic AV block exactly. Always check T waves before diagnosing dropped beats."},{q:"A wide QRS tachycardia at 180 bpm. The SAFEST clinical assumption is:",opts:["SVT with bundle branch block","Sinus tachycardia with aberrancy","Ventricular tachycardia until proven otherwise","Atrial flutter with 2:1 conduction"],correct:2,exp:"When in doubt with wide QRS tachycardia, treat as VT. Treating SVT-with-BBB as VT is safe. The reverse can be fatal."},{q:"You cannot definitively classify a 2:1 AV block as Mobitz Type I or II because:",opts:["The PR interval is always prolonged in 2:1 block","You need two consecutive conducted beats to assess PR behavior","Mobitz II does not cause 2:1 conduction","The QRS is always wide in 2:1 block"],correct:1,exp:"In 2:1 block, only one P wave conducts per cycle — you cannot observe PR progression or constancy. Report 'high-grade AV block.'"}]},
  12:{sections:[{title:"The Core Rule — Prelude vs. Sudden Onset",body:`The single most reliable rule in artifact recognition: real cardiac events have a prelude; artifact appears suddenly, out of nowhere.\n\nA real arrhythmia develops — the baseline changes progressively or there's a triggering event visible before the rhythm change. An artifact event appears instantaneously — one moment normal, the next chaotic, then instantly normal again.\n\nSecond rule: always check the patient before acting on a strip. A conscious, responsive, talking patient cannot be in VF.`},{title:"60-Hz (AC) Interference",body:`60-Hz interference appears as a thick, fuzzy, regular-appearing baseline with evenly spaced tiny oscillations at 60 per second. Caused by electromagnetic interference from nearby electrical equipment or poor electrode contact.\n\nAppearance: the baseline thickens uniformly. P waves, QRS complexes, and T waves may still be visible but appear embedded in the artifact.\n\nSolution: check electrode placement and skin prep, ensure equipment is grounded, move interfering devices away.`},{title:"Motion & Muscle Artifact",body:`Motion artifact: produced by patient movement. Produces irregular, variable-amplitude waving that mimics AF or VF at higher amplitudes.\n\nMuscle artifact: produced by skeletal muscle activity from tremors. Produces rapid irregular oscillations that can mimic atrial flutter or fine VF.\n\nDistinction: artifact appears suddenly and ends suddenly. Real arrhythmias develop. Look for normal complexes continuing through the apparent artifact.`},{title:"Lead Misplacement & Technical Errors",body:`Limb lead reversal produces characteristic ECG changes:\n\n• Right arm / Left arm reversal — Lead I inverts completely. Leads II and III swap. Most common electrode error.\n\n• Limb leads on chest / Chest leads on limbs — dramatic QRS and axis changes across multiple leads simultaneously.\n\nPoor electrode contact: produces wandering baseline from poor skin contact or dried gel.\n\nRecognition: simultaneous changes across multiple leads with no clinical explanation → consider lead reversal before diagnosing a new arrhythmia.`}],quiz:[{q:"A strip shows sudden-onset chaotic waving. The patient is sitting up talking. The FIRST action is:",opts:["Defibrillate immediately","Call a Code Blue","Assess the patient — a conscious patient cannot be in VF; this is likely artifact","Administer amiodarone"],correct:2,exp:"A conscious, responsive patient cannot be in ventricular fibrillation. Sudden onset plus patient consciousness strongly indicates artifact."},{q:"60-Hz artifact is caused by:",opts:["Patient movement","Electromagnetic interference from electrical equipment","Poor contact between lead wires","Skeletal muscle tremor"],correct:1,exp:"60-Hz (AC) artifact results from electromagnetic coupling from nearby electrical equipment or poor equipment grounding."},{q:"What does motion artifact mimic on the ECG?",opts:["Sinus bradycardia","Normal sinus rhythm","Atrial fibrillation or ventricular fibrillation","Third-degree AV block"],correct:2,exp:"Motion artifact produces irregular, variable-amplitude baseline oscillations. Low amplitude mimics AF; high amplitude can mimic VF."},{q:"Right arm / Left arm lead reversal is recognized by:",opts:["Widened QRS in all leads","Inverted Lead I with swapped Leads II and III","Loss of P waves in all leads","Sawtooth pattern in inferior leads"],correct:1,exp:"RA/LA reversal flips the polarity of Lead I and swaps Leads II and III."}]},
  13:{sections:[{title:"SBAR — The Communication Framework",body:`SBAR (Situation, Background, Assessment, Recommendation) is the standardized communication framework for reporting critical findings.\n\nSituation: "I'm calling about [patient name], bed [#]. The patient is showing [rhythm] on the monitor."\n\nBackground: "The patient is a [age]-year-old with history of [relevant history], currently on [medications]."\n\nAssessment: "Current strip shows [5-step findings]. The rhythm appears to be [description]."\n\nRecommendation: "I am requesting [physician evaluation / STAT ECG / nurse assessment]."\n\nAs a technician, use descriptive factual rhythm language — not a definitive clinical diagnosis.`},{title:"Escalation — When and How",body:`Escalation triggers:\n• New ventricular tachycardia or fibrillation (any duration)\n• New complete AV block or high-grade AV block\n• Sustained SVT with fast ventricular response\n• New AF in a patient not known to have AF\n• Any pacemaker failure\n• Asystole or rate <30 bpm\n• Any rhythm change with patient symptoms\n\nEscalation path: nurse → charge nurse → physician → rapid response team.\n\nDocument every communication: time, person contacted, information given, response received.`},{title:"HIPAA in Cardiac Monitoring",body:`ECG strips are Protected Health Information (PHI):\n\n• Proper disposal: paper strips must be shredded, not placed in regular trash.\n• Screen privacy: monitor screens should be positioned to limit viewing by passersby.\n• Verbal reporting: do not discuss patient rhythm findings in public areas.\n• Documentation: all rhythm interpretations and notifications should be documented in the medical record.\n\nUndocumented communication did not legally happen.`},{title:"Patient Care During Monitoring",body:`• Electrode placement and skin prep: proper preparation is the foundation of a good signal.\n• Patient education: brief reassuring explanation reduces anxiety and improves compliance.\n• Responding to alarms: every alarm warrants response. Never routinely silence alarms without looking at the strip.\n• Recognizing the limits of your role: rhythm interpretation supports patient care — it does not replace clinical assessment. Report findings promptly and accurately.`}],quiz:[{q:"In SBAR communication, the Assessment component should include:",opts:["Your treatment recommendation","The five-step rhythm findings described factually","A definitive clinical diagnosis","Only the heart rate and rhythm name"],correct:1,exp:"Report factual rhythm observations using the 5-step framework. Factual description is within the technician role; clinical diagnosis is not."},{q:"An ECG strip left face-up on a nursing station desk is a:",opts:["Normal clinical workflow","HIPAA violation — ECG strips are Protected Health Information","Acceptable if the patient's name is covered","Required for documentation"],correct:1,exp:"ECG strips contain Protected Health Information (PHI). Leaving them visible in public areas violates HIPAA."},{q:"A new strip shows complete AV block in a patient who had NSR one hour ago. You should:",opts:["Wait for the next scheduled check-in","Document it and check again in 30 minutes","Immediately escalate to nursing staff using SBAR","Apply defibrillator pads yourself"],correct:2,exp:"New complete AV block is a medical emergency. Immediate escalation via SBAR is required."},{q:"Which is an appropriate escalation trigger?",opts:["Sinus arrhythmia in a teenager","NSR with a known unchanged first-degree AV block","New ventricular tachycardia of any duration","Sinus bradycardia at 58 bpm in a sleeping adult"],correct:2,exp:"Any new ventricular tachycardia — even brief, self-terminating runs — requires immediate notification."}]},
  14:{sections:[{title:"Exam Format & Strategy",body:`This final module contains a full-length CRAT-style practice examination.\n\nExam strategy:\n• Apply the 5-step rhythm check to every question — do not guess from gestalt alone.\n• For strip questions: regularity and QRS width first, then P waves, then PR, then classify.\n• Eliminate clearly wrong answers first.\n• Read explanations for every question — even ones you got right.\n\nTarget score: 80% or higher on first attempt. Below 80%? Identify which chapters your missed questions came from, review, then retest in 2 weeks.`},{title:"Key Facts to Know Cold",body:`Normal values:\n• NSR rate: 60–100 bpm | PR interval: 0.12–0.20 sec | QRS duration: 0.06–0.12 sec\n• ECG paper: small box = 0.04 sec, large box = 0.20 sec\n\nEscape pacemaker rates:\n• AV junction: 40–60 bpm | Ventricles: 20–40 bpm\n\nCritical distinctions:\n• Sinus exit block gap = exact multiple of R-R\n• Mobitz I: PR lengthens before drop | Mobitz II: PR constant before drop\n• AVNRT: P buried in QRS | Orthodromic AVRT: P after QRS\n• WPW: short PR + delta wave | AF + WPW → AV nodal blockers contraindicated\n• Compensatory pause: PVC + pause = 2× R-R\n• Failure to capture: spike present, no P or QRS | Failure to pace: no spike when expected`},{title:"Rhythm Classification Quick Reference",body:`Sinus Tachycardia: Regular | >100 bpm | Upright P before QRS | Normal PR | Narrow QRS\nSinus Bradycardia: Regular | <60 bpm | Upright P before QRS | Normal PR | Narrow QRS\nAtrial Fibrillation: Irregularly irregular | Variable | No P waves | None | Narrow QRS\nAtrial Flutter: Regular or irregular | Variable ventricular | Sawtooth waves | Not measurable | Narrow QRS\nJunctional Rhythm: Regular | 40–60 bpm | Inverted/absent/buried P | Short/none | Narrow QRS\nVentricular Tachycardia: Regular | ≥101 bpm | Absent or dissociated P | None | Wide QRS\nFirst-Degree AV Block: Regular | Normal | Upright P before QRS | >0.20 sec | Narrow QRS\nMobitz I: Irregular grouped | Normal | Some non-conducted | Lengthening then drop | Narrow\nMobitz II: Irregular sudden drop | Normal | Some non-conducted | Constant | Narrow or Wide\nThird-Degree: Regular escape | Escape rate | P waves dissociated | None | Narrow or Wide`},{title:"CRAT Exam Day Checklist",body:`The week before:\n• Complete at least one full timed practice run through the Chapter 14 quiz\n• Review every chapter quiz you scored below 80% on\n• Focus extra attention on AV blocks, pacemaker failures, and AVNRT/AVRT\n• Practice the 5-step check on fresh strips until automatic\n\nExam day:\n• Arrive early; review eligibility requirements at cci-online.org\n• Bring required identification\n• Read every question twice before selecting an answer\n• Flag uncertain questions and return to them\n\nAfter the exam:\n• Results typically available immediately or shortly after\n• If retesting: wait required interval, review weak areas, retake`}],quiz:[{q:"A strip shows regular rhythm at 180 bpm, wide QRS, and P waves marching independently of QRS. The rhythm is:",opts:["Sinus tachycardia with BBB","Atrial flutter with 2:1 block","Ventricular tachycardia","Accelerated junctional rhythm"],correct:2,exp:"Wide QRS tachycardia with AV dissociation is ventricular tachycardia until proven otherwise. AV dissociation is a defining feature of VT."},{q:"A strip shows: rate 75 bpm, regular, P waves inverted and after each QRS, narrow QRS. Rhythm is:",opts:["Sinus rhythm with first-degree AV block","Ectopic atrial rhythm","Accelerated junctional rhythm","Orthodromic AVRT"],correct:2,exp:"Inverted P waves after each QRS, narrow QRS, rate 61–99 bpm = accelerated junctional rhythm."},{q:"A pacing spike appears at the expected time but no P wave or QRS follows. This represents:",opts:["Failure to pace","Failure to capture","Failure to sense","Normal demand pacing"],correct:1,exp:"A visible spike with no following P wave or QRS = failure to capture. The device fired but the myocardium didn't respond."},{q:"WPW during atrial fibrillation is treated with:",opts:["Adenosine","Verapamil or diltiazem","Metoprolol","Procainamide or electrical cardioversion"],correct:3,exp:"AV nodal blocking drugs are contraindicated in WPW with AF — they can accelerate conduction through the AP. Procainamide or electrical cardioversion is the treatment."},{q:"Which rhythm has both an irregularly irregular ventricular rate AND discrete P waves before each QRS?",opts:["Atrial fibrillation","Multifocal atrial tachycardia (MAT)","Atrial flutter with variable block","Wandering atrial pacemaker at 120 bpm"],correct:1,exp:"MAT is irregularly irregular (like AF) but has distinct P waves before each QRS — at least 3 different P wave morphologies."}]},
};

// ─── STORAGE HELPERS ────────────────────────────────────────────────────────
const SK = { user:"cc:user", enrolled:"cc:enrolled", progress:"cc:progress", users:"cc:users", waitlist:"cc:waitlist" };
async function stGet(key) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function stSet(key, val) { try { await window.storage.set(key, JSON.stringify(val)); } catch {} }

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Icon = {
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C8.676 1 6 3.676 6 7v2H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V10a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z"/></svg>,
  Check: ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronR: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronL: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Star: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Bell: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#080c14;color:#e8edf5;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:rgba(255,255,255,.02);}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px;}
.btn-p{background:linear-gradient(135deg,#00d4ff,#0099cc);color:#080c14;border:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s;font-family:inherit;letter-spacing:.01em;}
.btn-p:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,212,255,.25);}
.btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-s{background:transparent;color:#7a8a9a;border:1px solid rgba(255,255,255,.1);padding:12px 24px;border-radius:10px;font-weight:500;font-size:14px;cursor:pointer;transition:all .2s;font-family:inherit;}
.btn-s:hover{border-color:rgba(255,255,255,.25);color:#e8edf5;}
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:#0d1420;border:1px solid rgba(255,255,255,.1);border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;}
.input{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 16px;color:#e8edf5;font-size:14px;width:100%;font-family:inherit;outline:none;transition:border .2s;}
.input:focus{border-color:#00d4ff;}.input::placeholder{color:#3a4a5a;}
.tab{background:none;border:none;padding:10px 18px;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;color:#4a5a6a;border-bottom:2px solid transparent;transition:all .2s;}
.tab.active{color:#00d4ff;border-bottom-color:#00d4ff;}
.tag-free{background:rgba(0,212,255,.12);color:#00d4ff;border:1px solid rgba(0,212,255,.25);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;}
.tag-lock{background:rgba(168,85,247,.1);color:#a855f7;border:1px solid rgba(168,85,247,.2);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;}
.tag-exam{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes su{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.su{animation:su .35s ease;}
@keyframes ecgScroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
.ecg-ticker{animation:ecgScroll 14s linear infinite;display:flex;}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.fade{animation:fadeIn .3s ease;}
`;

// ─── PROGRESS RING ───────────────────────────────────────────────────────────
function ProgressRing({ pct, size=80, stroke=6, color="#00d4ff" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition:"stroke-dashoffset .6s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:size*.22, fontWeight:700, color, fontFamily:"'Space Grotesk',sans-serif" }}>{pct}%</span>
      </div>
    </div>
  );
}

// ─── WAITLIST MODAL ──────────────────────────────────────────────────────────
function WaitlistModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    if (!email || !name) { setErr("Please enter your name and email."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Enter a valid email address."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const list = (await stGet(SK.waitlist)) || [];
    if (!list.find(e => e.email === email.toLowerCase())) {
      await stSet(SK.waitlist, [...list, { name: name.trim(), email: email.toLowerCase(), date: new Date().toISOString() }]);
    }
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal su" style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:"32px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, color:"#e8edf5", marginBottom:6 }}>
              {done ? "You're on the list! 🎉" : "Enrollment Opening Soon"}
            </div>
            <div style={{ fontSize:13, color:"#4a5a6a" }}>
              {done ? "We'll email you the moment enrollment opens." : "Be the first to know when Cardiac Cadence opens for enrollment."}
            </div>
          </div>
          <button className="btn-s" style={{ padding:"6px 10px", border:"none", flexShrink:0 }} onClick={onClose}><Icon.X/></button>
        </div>

        {done ? (
          <div style={{ padding:"32px 32px 32px", textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(0,212,255,.1)", border:"2px solid #00d4ff",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <Icon.Check sz={28}/>
            </div>
            <p style={{ fontSize:14, color:"#5a6a7a", marginBottom:24, lineHeight:1.7 }}>
              Thanks, <strong style={{ color:"#e8edf5" }}>{name}</strong>! We'll send a notification to <strong style={{ color:"#00d4ff" }}>{email}</strong> when enrollment opens.
            </p>
            <p style={{ fontSize:13, color:"#3a4a5a" }}>In the meantime, Modules 1 & 2 are free to explore.</p>
            <button className="btn-p" style={{ marginTop:20, padding:"12px 28px" }} onClick={onClose}>Explore Free Modules</button>
          </div>
        ) : (
          <div style={{ padding:"24px 32px 32px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom: err ? 14 : 22 }}>
              <div>
                <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>Your Name</label>
                <input className="input" placeholder="Jane Smith" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
              <div>
                <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>Email Address</label>
                <input className="input" type="email" placeholder="jane@example.com" value={email} onChange={e=>setEmail(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&submit()}/>
              </div>
            </div>
            {err && <div style={{ fontSize:13, color:"#f87171", marginBottom:16, padding:"10px 14px", background:"rgba(248,113,113,.08)", border:"1px solid rgba(248,113,113,.2)", borderRadius:8 }}>{err}</div>}
            <button className="btn-p" style={{ width:"100%", padding:14 }} onClick={submit} disabled={loading}>
              {loading ? <span style={{ display:"inline-block", width:16, height:16, border:"2px solid #080c14", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> : "Notify Me When Enrollment Opens →"}
            </button>
            <p style={{ fontSize:11, color:"#2a3a4a", textAlign:"center", marginTop:10 }}>No spam. One email when enrollment opens. Unsubscribe anytime.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
function Nav({ screen, onGoLanding, onGoDash, onWaitlist }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,12,20,.95)", backdropFilter:"blur(14px)",
      borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 28px", display:"flex", alignItems:"center",
      justifyContent:"space-between", height:62 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={onGoLanding}>
        <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#00d4ff,#0060aa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>♥</div>
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, letterSpacing:"-.02em", color:"#e8edf5", lineHeight:1 }}>Cardiac Cadence</div>
          <div style={{ fontSize:9, color:"#3a4a5a", letterSpacing:".1em", textTransform:"uppercase" }}>ECG Mastery</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        {screen === "dashboard" && (
          <button className="btn-s" style={{ padding:"8px 14px", display:"flex", gap:6, alignItems:"center", fontSize:13 }} onClick={onGoLanding}>
            ← Curriculum
          </button>
        )}
        <button className="btn-s" style={{ padding:"9px 16px", fontSize:13, display:"flex", gap:6, alignItems:"center" }} onClick={onWaitlist}>
          <Icon.Bell/> Get Notified
        </button>
        <button className="btn-p" style={{ padding:"9px 18px", fontSize:13 }} onClick={onWaitlist}>
          Enroll — Coming Soon
        </button>
      </div>
    </nav>
  );
}

// ─── VIDEO PLACEHOLDER ───────────────────────────────────────────────────────
function VideoPlaceholder({ title }) {
  return (
    <div style={{ borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,.08)", marginBottom:8 }}>
      <div style={{ background:"rgba(0,0,0,.4)", height:180, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, cursor:"pointer",
        transition:"background .2s", position:"relative" }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,255,.05)"}
        onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,.4)"}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(0,212,255,.15)", border:"2px solid rgba(0,212,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"#00d4ff" }}>
          <Icon.Play/>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:14, color:"#c0ccda", fontWeight:500 }}>{title}</div>
          <div style={{ fontSize:11, color:"#3a4a5a", marginTop:4 }}>Video lecture coming soon</div>
        </div>
        <div style={{ position:"absolute", top:10, right:10, background:"rgba(245,158,11,.15)", color:"#f59e0b", fontSize:10, padding:"3px 8px", borderRadius:6, fontWeight:600 }}>
          COMING SOON
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ COMPONENT ──────────────────────────────────────────────────────────
function Quiz({ questions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    const score = Math.round((answers.filter((a,i)=>a===questions[i].correct).length/questions.length)*100);
    const passed = score >= 80;
    return (
      <div style={{ textAlign:"center", padding:"32px 0" }} className="su">
        <div style={{ width:80, height:80, borderRadius:"50%", background:passed?"rgba(0,212,255,.1)":"rgba(248,113,113,.1)",
          border:`2px solid ${passed?"#00d4ff":"#f87171"}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:32 }}>
          {passed?"🎯":"📖"}
        </div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:passed?"#00d4ff":"#f59e0b", marginBottom:8 }}>{score}%</div>
        <div style={{ fontSize:15, color:"#6a7d90", marginBottom:24 }}>{passed?"Great work! You've mastered this module.":"Review the sections above and try again."}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, maxWidth:280, margin:"0 auto" }}>
          {questions.map((q,i)=>(
            <div key={i} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13, color:answers[i]===q.correct?"#00d4ff":"#f87171" }}>
              {answers[i]===q.correct?<Icon.Check/>:"✗"} Q{i+1}: {answers[i]===q.correct?"Correct":`Missed (ans: ${String.fromCharCode(65+q.correct)})`}
            </div>
          ))}
        </div>
        <button className="btn-p" style={{ marginTop:24, padding:"12px 28px" }} onClick={()=>onComplete(score)}>Save Score & Continue</button>
      </div>
    );
  }

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (isLast) { setAnswers(newAnswers); setDone(true); }
    else { setAnswers(newAnswers); setIdx(i=>i+1); setSelected(null); setRevealed(false); }
  };

  return (
    <div className="su">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div style={{ fontSize:12, color:"#3a4a5a" }}>Question {idx+1} of {questions.length}</div>
        <div style={{ display:"flex", gap:4 }}>
          {questions.map((_,i)=><div key={i} style={{ width:24, height:4, borderRadius:2, background:i<idx?"#00d4ff":i===idx?"rgba(0,212,255,.4)":"rgba(255,255,255,.06)" }}/>)}
        </div>
      </div>
      <div style={{ fontSize:16, color:"#c0ccda", lineHeight:1.65, marginBottom:24, fontWeight:500 }}>{q.q}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {q.opts.map((opt,i)=>{
          const isSel=selected===i,isCorr=revealed&&i===q.correct,isWrong=revealed&&isSel&&i!==q.correct;
          return (
            <div key={i} onClick={()=>{ if(!revealed) setSelected(i); }}
              style={{ padding:"14px 18px", borderRadius:12, border:`1px solid ${isCorr?"#00d4ff":isWrong?"#f87171":isSel?"rgba(0,212,255,.4)":"rgba(255,255,255,.07)"}`,
                background:isCorr?"rgba(0,212,255,.07)":isWrong?"rgba(248,113,113,.07)":isSel?"rgba(0,212,255,.04)":"rgba(255,255,255,.02)",
                cursor:revealed?"default":"pointer", transition:"all .18s", display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ width:22, height:22, borderRadius:6, background:isCorr?"#00d4ff":isWrong?"#f87171":isSel?"rgba(0,212,255,.2)":"rgba(255,255,255,.06)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                color:isCorr?"#080c14":isWrong?"#080c14":isSel?"#00d4ff":"#3a4a5a", flexShrink:0 }}>
                {String.fromCharCode(65+i)}
              </span>
              <span style={{ fontSize:14, color:isCorr?"#e8edf5":isWrong?"#f87171":isSel?"#c0ccda":"#5a6a7a" }}>{opt}</span>
            </div>
          );
        })}
      </div>
      {revealed && (
        <div style={{ padding:16, background:"rgba(0,212,255,.04)", border:"1px solid rgba(0,212,255,.12)", borderRadius:12, marginBottom:20 }} className="su">
          <div style={{ fontSize:11, color:"#00d4ff", fontWeight:600, letterSpacing:".08em", marginBottom:6 }}>EXPLANATION</div>
          <p style={{ fontSize:13, color:"#6a7d90", lineHeight:1.7 }}>{q.exp}</p>
        </div>
      )}
      <div style={{ display:"flex", gap:12 }}>
        {!revealed && selected!==null && <button className="btn-s" style={{ padding:"10px 20px" }} onClick={()=>setRevealed(true)}>Check Answer</button>}
        {(revealed||selected===null) && <button className="btn-p" style={{ padding:"10px 24px" }} onClick={handleNext} disabled={selected===null}>{isLast?"See Results":"Next Question →"}</button>}
      </div>
    </div>
  );
}

// ─── CHAPTER CARD ────────────────────────────────────────────────────────────
function ChapterCard({ ch, status, score, onClick, compact=false }) {
  const isFree=ch.free, isExam=ch.id===14;
  const tagColor=isFree?"#00d4ff":isExam?"#f59e0b":"#a855f7";
  const statusBadge=status==="completed"?{label:"Completed",color:"#00d4ff",bg:"rgba(0,212,255,.1)"}:status==="in-progress"?{label:"In Progress",color:"#f59e0b",bg:"rgba(245,158,11,.1)"}:null;
  return (
    <div className="card" onClick={onClick}
      style={{ padding:compact?16:24, cursor:"pointer", transition:"all .22s", position:"relative", overflow:"hidden",
        borderColor:status==="completed"?"rgba(0,212,255,.2)":status==="in-progress"?"rgba(245,158,11,.15)":"rgba(255,255,255,.07)" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${tagColor}44`;e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=status==="completed"?"rgba(0,212,255,.2)":status==="in-progress"?"rgba(245,158,11,.15)":"rgba(255,255,255,.07)";e.currentTarget.style.transform="translateY(0)";}}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:status==="completed"?tagColor:"transparent", transition:"background .3s" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:compact?10:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:compact?36:40, height:compact?36:40, borderRadius:10, background:`rgba(${isFree?"0,212,255":isExam?"245,158,11":"168,85,247"},.08)`,
            border:`1px solid ${tagColor}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:compact?16:18, flexShrink:0 }}>{ch.icon}</div>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:tagColor, fontWeight:500, letterSpacing:".1em" }}>MODULE {ch.num}</div>
            <div style={{ fontSize:10, color:"#3a4a5a", marginTop:2 }}>⏱ {ch.dur}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", justifyContent:"flex-end" }}>
          {statusBadge&&<span style={{ background:statusBadge.bg, color:statusBadge.color, fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>{statusBadge.label}</span>}
          {isFree?<span className="tag-free">Free</span>:isExam?<span className="tag-exam">Exam</span>:status?null:<span style={{ color:"#2a3a4a" }}><Icon.Lock/></span>}
        </div>
      </div>
      <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:compact?14:16, fontWeight:600, color:status?"#e8edf5":isFree?"#e8edf5":"#6a7a8a", marginBottom:3, letterSpacing:"-.01em" }}>{ch.title}</h3>
      <div style={{ fontSize:11, color:tagColor, marginBottom:compact?0:10, fontWeight:500 }}>{ch.sub}</div>
      {!compact&&score!=null&&<div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6 }}><Icon.Star/><span style={{ fontSize:12, color:"#5a6a7a" }}>Quiz score: </span><span style={{ fontSize:12, fontWeight:600, color:score>=80?"#00d4ff":score>=60?"#f59e0b":"#f87171" }}>{score}%</span></div>}
    </div>
  );
}

// ─── CHAPTER READER ──────────────────────────────────────────────────────────
function ChapterReader({ ch, enrolled, progress, onBack, onSaveProgress, onWaitlist }) {
  const [tab, setTab] = useState("overview");
  const [sectionIdx, setSectionIdx] = useState(0);
  const content = CONTENT[ch.id];
  const sections = content?.sections || [];
  const questions = content?.quiz || [];
  const prog = progress[ch.id] || {};
  const diagInfo = CHAPTER_DIAGRAMS[ch.id];
  const canAccess = ch.free || enrolled;

  const markComplete = async () => {
    const updated = { ...progress[ch.id], visited:true, completed:true };
    onSaveProgress(ch.id, updated);
  };

  const handleQuizComplete = async (score) => {
    const updated = { ...progress[ch.id], visited:true, quizScore:score, completed:score>=60 };
    onSaveProgress(ch.id, updated);
    setTab("overview");
  };

  return (
    <div style={{ maxWidth:820, margin:"0 auto", padding:"36px 28px 80px" }}>
      <button className="btn-s" style={{ padding:"8px 14px", display:"flex", gap:6, alignItems:"center", fontSize:13, marginBottom:28 }} onClick={onBack}>
        <Icon.ChevronL/> Back
      </button>

      <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:28 }}>
        <div style={{ width:56, height:56, borderRadius:14, background:`rgba(${ch.free?"0,212,255":ch.id===14?"245,158,11":"168,85,247"},.08)`,
          border:`1px solid rgba(${ch.free?"0,212,255":ch.id===14?"245,158,11":"168,85,247"},.2)`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{ch.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:ch.free?"#00d4ff":ch.id===14?"#f59e0b":"#a855f7", fontWeight:500, letterSpacing:".1em" }}>MODULE {ch.num}</span>
            <span style={{ fontSize:11, color:"#2a3a4a" }}>⏱ {ch.dur}</span>
            {prog.completed&&<span style={{ background:"rgba(0,212,255,.1)", color:"#00d4ff", fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>✓ Completed</span>}
          </div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:700, color:"#e8edf5", letterSpacing:"-.02em", marginBottom:4 }}>{ch.title}</h1>
          <div style={{ fontSize:13, color:ch.free?"#00d4ff":ch.id===14?"#f59e0b":"#a855f7" }}>{ch.sub}</div>
        </div>
      </div>

      {/* ECG Diagram */}
      {diagInfo && (
        <div className="card" style={{ padding:20, marginBottom:24 }}>
          <div style={{ fontSize:11, color:"#3a4a5a", fontWeight:600, textTransform:"uppercase", letterSpacing:".1em", marginBottom:12 }}>ECG Reference Strip</div>
          <diagInfo.diagram/>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginTop:12 }}>
            <span style={{ fontSize:11, color:"#00d4ff", flexShrink:0, marginTop:1 }}>▸</span>
            <div>
              <span style={{ fontSize:12, fontWeight:600, color:"#c0ccda" }}>{diagInfo.label} — </span>
              <span style={{ fontSize:12, color:"#4a5a6a" }}>{diagInfo.note}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ borderBottom:"1px solid rgba(255,255,255,.07)", marginBottom:32, display:"flex" }}>
        {["overview","content","video","quiz"].map(t=>(
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t==="video"?"Video Lecture":t.charAt(0).toUpperCase()+t.slice(1)} {t==="quiz"&&prog.quizScore!=null?`(${prog.quizScore}%)`:""}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="su">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:32 }}>
            {[{label:"Duration",val:ch.dur,icon:"⏱"},{label:"Sections",val:`${sections.length} sections`,icon:"📖"},{label:"Quiz Questions",val:`${questions.length} questions`,icon:"✏️"},{label:"Quiz Score",val:prog.quizScore!=null?`${prog.quizScore}%`:"Not taken",icon:"🎯"}].map(s=>(
              <div key={s.label} className="card" style={{ padding:16 }}>
                <div style={{ fontSize:18, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:11, color:"#3a4a5a", fontWeight:500, textTransform:"uppercase", letterSpacing:".08em" }}>{s.label}</div>
                <div style={{ fontSize:16, fontWeight:600, color:"#c0ccda", marginTop:4 }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
            {sections.map((s,i)=>(
              <div key={i} className="card" style={{ padding:18, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }} onClick={()=>{setTab("content");setSectionIdx(i);}}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(0,212,255,.06)", border:"1px solid rgba(0,212,255,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#00d4ff", flexShrink:0 }}>{i+1}</div>
                <div style={{ fontSize:14, fontWeight:500, color:"#c0ccda" }}>{s.title}</div>
                <div style={{ marginLeft:"auto", color:"#2a3a4a" }}><Icon.ChevronR/></div>
              </div>
            ))}
          </div>
          {canAccess && !prog.completed && <button className="btn-p" style={{ padding:"12px 28px" }} onClick={markComplete}>Mark as Complete ✓</button>}
        </div>
      )}

      {tab === "content" && (
        <div className="su">
          {!canAccess ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:600, color:"#c0ccda", marginBottom:8 }}>Premium Content</div>
              <p style={{ color:"#4a5a6a", marginBottom:24 }}>Join the waitlist to be notified when enrollment opens.</p>
              <button className="btn-p" onClick={onWaitlist}>Join Waitlist →</button>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
                {sections.map((_,i)=>(
                  <button key={i} onClick={()=>setSectionIdx(i)}
                    style={{ padding:"6px 14px", borderRadius:8, border:`1px solid ${sectionIdx===i?"#00d4ff":"rgba(255,255,255,.08)"}`,
                      background:sectionIdx===i?"rgba(0,212,255,.08)":"transparent", color:sectionIdx===i?"#00d4ff":"#4a5a6a",
                      cursor:"pointer", fontSize:12, fontWeight:500, fontFamily:"inherit" }}>
                    Section {i+1}
                  </button>
                ))}
              </div>
              <div className="su">
                <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:19, fontWeight:700, color:"#e8edf5", marginBottom:20, letterSpacing:"-.01em" }}>
                  {sections[sectionIdx].title}
                </h2>
                {sections[sectionIdx].body.split("\n\n").map((para,i)=>(
                  <div key={i} style={{ marginBottom:20 }}>
                    {para.trim().startsWith("•")||para.trim().match(/^\d\./) ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {para.split("\n").map((line,j)=>(
                          <div key={j} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                            {(line.startsWith("•")||line.match(/^\d\./))&&<span style={{ color:"#00d4ff", marginTop:3, flexShrink:0 }}>{line.match(/^\d\./)?"→":"•"}</span>}
                            <p style={{ fontSize:15, color:"#6a7d90", lineHeight:1.75 }}>{line.replace(/^[•\d]\.\s*/,"").replace(/^•\s*/,"")}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize:15, color:"#6a7d90", lineHeight:1.8 }}>{para}</p>
                    )}
                  </div>
                ))}
                <div style={{ display:"flex", gap:12, marginTop:32 }}>
                  {sectionIdx>0&&<button className="btn-s" style={{ padding:"10px 18px" }} onClick={()=>setSectionIdx(i=>i-1)}>← Previous</button>}
                  {sectionIdx<sections.length-1
                    ?<button className="btn-p" style={{ padding:"10px 18px" }} onClick={()=>setSectionIdx(i=>i+1)}>Next Section →</button>
                    :<button className="btn-p" style={{ padding:"10px 18px" }} onClick={()=>{setTab("quiz");setSectionIdx(0);}}>Take the Quiz →</button>}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "video" && (
        <div className="su">
          <div style={{ marginBottom:24 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600, color:"#e8edf5", marginBottom:8 }}>Video Lectures</div>
            <p style={{ fontSize:14, color:"#4a5a6a", lineHeight:1.7 }}>Video content is being produced for each module. Subscribe to the waitlist to be notified when videos go live.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {sections.map((s,i)=>(
              <VideoPlaceholder key={i} title={`${i+1}. ${s.title}`}/>
            ))}
          </div>
          <div style={{ marginTop:28, padding:20, background:"rgba(0,212,255,.04)", border:"1px solid rgba(0,212,255,.1)", borderRadius:12, display:"flex", gap:14, alignItems:"center" }}>
            <div style={{ fontSize:24 }}>🎬</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"#c0ccda", marginBottom:4 }}>Videos Coming Soon</div>
              <div style={{ fontSize:13, color:"#4a5a6a" }}>Join the waitlist to be notified when video lectures are released.</div>
            </div>
            <button className="btn-p" style={{ padding:"10px 18px", fontSize:13, flexShrink:0 }} onClick={onWaitlist}>Get Notified</button>
          </div>
        </div>
      )}

      {tab === "quiz" && (
        <div className="su">
          {!canAccess ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:600, color:"#c0ccda", marginBottom:8 }}>Premium Quiz</div>
              <p style={{ color:"#4a5a6a", marginBottom:24 }}>Join the waitlist to be notified when enrollment opens.</p>
              <button className="btn-p" onClick={onWaitlist}>Join Waitlist →</button>
            </div>
          ) : (
            <Quiz questions={questions} onComplete={handleQuizComplete}/>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ progress, onChapterClick, onWaitlist }) {
  const total=CHAPTERS.length;
  const completed=CHAPTERS.filter(c=>progress[c.id]?.completed).length;
  const pct=Math.round((completed/total)*100);
  const avgScore=(()=>{const scored=CHAPTERS.filter(c=>progress[c.id]?.quizScore!=null).map(c=>progress[c.id].quizScore);return scored.length?Math.round(scored.reduce((a,b)=>a+b,0)/scored.length):null;})();
  const getStatus=id=>{const p=progress[id];if(!p)return null;if(p.completed)return "completed";if(p.visited)return "in-progress";return null;};

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 28px 80px" }}>
      <div style={{ marginBottom:40 }}>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:32, fontWeight:700, color:"#e8edf5", letterSpacing:"-.02em" }}>Your Progress</h1>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:48 }}>
        <div className="card" style={{ padding:24, display:"flex", gap:16, alignItems:"center" }}>
          <ProgressRing pct={pct} size={72}/>
          <div>
            <div style={{ fontSize:12, color:"#3a4a5a", fontWeight:500, textTransform:"uppercase", letterSpacing:".08em" }}>Overall Progress</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#e8edf5", marginTop:4 }}>{completed}/{total} modules</div>
          </div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:6 }}>Quiz Average</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:avgScore==null?"#2a3a4a":avgScore>=80?"#00d4ff":avgScore>=60?"#f59e0b":"#f87171" }}>{avgScore!=null?`${avgScore}%`:"—"}</div>
          <div style={{ fontSize:12, color:"#2a3a4a" }}>{avgScore==null?"No quizzes taken yet":avgScore>=80?"On track for CRAT!":"Keep reviewing"}</div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:6 }}>Modules Remaining</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:"#a855f7" }}>{total-completed}</div>
          <div style={{ fontSize:12, color:"#2a3a4a" }}>of {total} total</div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:6 }}>CRAT Readiness</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:pct>=80?"#00d4ff":"#f59e0b" }}>{pct>=80?"Ready!":pct>=50?"Getting there":"Just started"}</div>
          <div style={{ fontSize:12, color:"#2a3a4a" }}>{pct>=80?"Take the practice exam!":"Complete more modules"}</div>
        </div>
      </div>
      <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600, color:"#e8edf5", marginBottom:16 }}>All Modules</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {CHAPTERS.map(ch=><ChapterCard key={ch.id} ch={ch} status={getStatus(ch.id)} score={progress[ch.id]?.quizScore} onClick={()=>onChapterClick(ch)} compact/>)}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ enrolled, progress, onChapterClick, onWaitlist }) {
  const free=CHAPTERS.filter(c=>c.free);
  const paid=CHAPTERS.filter(c=>!c.free);
  const getStatus=id=>{const p=progress[id];if(!p)return null;if(p.completed)return "completed";if(p.visited)return "in-progress";return null;};

  return (
    <div>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"90px 28px 70px", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,.07)", border:"1px solid rgba(0,212,255,.18)", borderRadius:20, padding:"6px 16px", marginBottom:28, fontSize:13, color:"#00d4ff", fontWeight:500 }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#00d4ff", display:"inline-block" }}/>
          Free Preview: Modules 1 & 2 Open Now
        </div>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(34px,6vw,64px)", fontWeight:700, letterSpacing:"-.03em", lineHeight:1.08, color:"#f0f4f8", marginBottom:22 }}>
          Read Every ECG Strip<br/><span style={{ color:"#00d4ff" }}>With Confidence</span>
        </h1>
        <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#5a6a7a", lineHeight:1.75, maxWidth:560, margin:"0 auto 36px" }}>
          A complete, logic-first course in cardiac rhythm interpretation — from anatomy to arrhythmias to CRAT exam prep. 14 modules, interactive quizzes, SVG rhythm diagrams, and video lectures coming soon.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-p" style={{ padding:"14px 28px", fontSize:15 }} onClick={()=>document.getElementById("curriculum").scrollIntoView({behavior:"smooth"})}>
            Start Free Preview →
          </button>
          <button className="btn-s" style={{ padding:"14px 28px", fontSize:15, display:"flex", gap:8, alignItems:"center" }} onClick={onWaitlist}>
            <Icon.Bell/> Get Notified at Launch
          </button>
        </div>

        {/* Coming Soon Banner */}
        <div style={{ marginTop:40, padding:"16px 24px", background:"rgba(245,158,11,.05)", border:"1px solid rgba(245,158,11,.2)", borderRadius:14, display:"inline-flex", gap:12, alignItems:"center" }}>
          <span style={{ fontSize:18 }}>🚀</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#f59e0b" }}>Full Enrollment Opening Soon</div>
            <div style={{ fontSize:12, color:"#5a4a2a" }}>Join the waitlist — be first in line when all 14 modules unlock.</div>
          </div>
          <button className="btn-p" style={{ padding:"8px 16px", fontSize:12, flexShrink:0 }} onClick={onWaitlist}>Join Waitlist</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:48, maxWidth:640, marginLeft:"auto", marginRight:"auto" }}>
          {[{v:"14",l:"Modules"},{v:"40+",l:"Rhythm Types"},{v:"100+",l:"Quiz Questions"},{v:"100%",l:"CRAT Aligned"}].map(s=>(
            <div key={s.l} className="card" style={{ padding:"16px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:700, color:"#00d4ff" }}>{s.v}</div>
              <div style={{ fontSize:11, color:"#3a4a5a", marginTop:4, fontWeight:500, textTransform:"uppercase", letterSpacing:".08em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ECG Ticker */}
      <div style={{ overflow:"hidden", height:56, borderTop:"1px solid rgba(255,255,255,.04)", borderBottom:"1px solid rgba(255,255,255,.04)", display:"flex", alignItems:"center" }}>
        <div className="ecg-ticker" style={{ width:"200%" }}>
          {[...Array(4)].map((_,i)=>(
            <svg key={i} viewBox="0 0 1600 56" style={{ width:800, height:56, color:"#00d4ff", opacity:.15, flexShrink:0 }} preserveAspectRatio="none">
              <polyline points="0,28 100,28 115,28 125,6 145,50 158,28 170,28 270,28 285,28 295,6 315,50 328,28 340,28 440,28 455,28 465,6 485,50 498,28 510,28 610,28 625,28 635,6 655,50 668,28 680,28 780,28 795,28 805,6 825,50 838,28 850,28 950,28 965,28 975,6 995,50 1008,28 1020,28 1120,28 1135,28 1145,6 1165,50 1178,28 1190,28 1290,28 1305,28 1315,6 1335,50 1348,28 1360,28 1460,28 1600,28"
                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ))}
        </div>
      </div>

      {/* Curriculum */}
      <div id="curriculum" style={{ maxWidth:1100, margin:"0 auto", padding:"72px 28px" }}>
        {/* Free */}
        <div style={{ marginBottom:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
            <span className="tag-free">Free Preview</span>
            <div style={{ height:1, flex:1, background:"rgba(0,212,255,.12)" }}/>
          </div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:"#e8edf5", marginBottom:4, letterSpacing:"-.02em" }}>Start Here — No Account Required</h2>
          <p style={{ color:"#4a5a6a", fontSize:14, marginBottom:28 }}>Full content, SVG rhythm diagrams, and quizzes — open immediately.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
            {free.map(ch=><ChapterCard key={ch.id} ch={ch} status={getStatus(ch.id)} score={progress[ch.id]?.quizScore} onClick={()=>onChapterClick(ch)}/>)}
          </div>
        </div>

        {/* Paid */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
            <span className="tag-lock">Full Course</span>
            <div style={{ height:1, flex:1, background:"rgba(168,85,247,.1)" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:14, marginBottom:28 }}>
            <div>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:"#e8edf5", marginBottom:4, letterSpacing:"-.02em" }}>Complete Curriculum</h2>
              <p style={{ color:"#4a5a6a", fontSize:14 }}>12 advanced modules + CRAT practice exam. Enrollment opening soon.</p>
            </div>
            <button className="btn-p" style={{ display:"flex", gap:8, alignItems:"center" }} onClick={onWaitlist}>
              <Icon.Bell/> Join Waitlist
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
            {paid.map(ch=><ChapterCard key={ch.id} ch={ch} status={enrolled?getStatus(ch.id):null} score={enrolled?progress[ch.id]?.quizScore:null} onClick={()=>onChapterClick(ch)}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [enrolled] = useState(false); // Set to true when ready to open enrollment
  const [progress, setProgress] = useState({});
  const [screen, setScreen] = useState("landing");
  const [activeChapter, setActiveChapter] = useState(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await stGet(SK.progress);
      if (p) setProgress(p);
      setLoaded(true);
    })();
  }, []);

  const saveProgress = useCallback(async (chapterId, data) => {
    const updated = { ...progress, [chapterId]: data };
    setProgress(updated);
    await stSet(SK.progress, updated);
  }, [progress]);

  const handleChapterClick = (ch) => {
    if (!ch.free && !enrolled) { setShowWaitlist(true); return; }
    setActiveChapter(ch);
    if (!progress[ch.id]?.completed) {
      const updated = { ...progress, [ch.id]: { ...progress[ch.id], visited:true } };
      setProgress(updated);
      stSet(SK.progress, updated);
    }
    setScreen("reader");
  };

  if (!loaded) return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#080c14", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{CSS}</style>
      <div style={{ width:36, height:36, border:"3px solid rgba(0,212,255,.2)", borderTopColor:"#00d4ff", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#080c14", color:"#e8edf5", minHeight:"100vh" }}>
      <style>{CSS}</style>
      <Nav screen={screen} onGoLanding={()=>setScreen("landing")} onGoDash={()=>setScreen("dashboard")} onWaitlist={()=>setShowWaitlist(true)}/>

      {screen==="landing" && <Landing enrolled={enrolled} progress={progress} onChapterClick={handleChapterClick} onWaitlist={()=>setShowWaitlist(true)}/>}
      {screen==="dashboard" && <Dashboard progress={progress} onChapterClick={handleChapterClick} onWaitlist={()=>setShowWaitlist(true)}/>}
      {screen==="reader" && activeChapter && (
        <ChapterReader ch={activeChapter} enrolled={enrolled} progress={progress}
          onBack={()=>setScreen(enrolled?"dashboard":"landing")}
          onSaveProgress={saveProgress}
          onWaitlist={()=>setShowWaitlist(true)}/>
      )}

      {showWaitlist && <WaitlistModal onClose={()=>setShowWaitlist(false)}/>}
    </div>
  );
}
