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

// ─── CHAPTER CONTENT ───────────────────────────────────────────────────────
const CONTENT = {
  1: {
    sections: [
      { title:"The Four Cardiac Chambers", body:`The heart contains four chambers arranged in two parallel pumps. The right side receives deoxygenated blood from the body and sends it to the lungs; the left side receives oxygenated blood from the lungs and drives it to the body.\n\n• Right Atrium — the arrival chamber, fed by the superior and inferior venae cavae.\n• Right Ventricle — pumps blood through the pulmonary valve to the lungs.\n• Left Atrium — receives oxygenated blood via the pulmonary veins.\n• Left Ventricle — the heart's most powerful chamber, pumping blood through the aortic valve into the aorta.\n\nEach chamber connects to the next via a one-way valve that prevents backflow: tricuspid (right atrium → right ventricle), pulmonary, mitral, and aortic.` },
      { title:"The Conduction System", body:`Every beat starts at the sinoatrial (SA) node in the right atrial wall — the heart's primary pacemaker. The signal spreads across both atria (producing the P wave), arrives at the atrioventricular (AV) node at the junction between atria and ventricles, and is deliberately slowed to allow the atria to finish contracting.\n\nFrom the AV node, the signal travels down the Bundle of His, splits into the right and left bundle branches, and fans out through the Purkinje fiber network — triggering simultaneous, coordinated ventricular contraction.\n\nThe full pathway: SA Node → AV Node → Bundle of His → Right/Left Bundle Branches → Purkinje Fibers.\n\nThis sequence repeats on every single beat. Disruption at any station produces a recognizable ECG pattern — which is why mastering the anatomy is the first step in mastering rhythm interpretation.` },
      { title:"Blood Flow in Six Steps", body:`Trace this sequence until it's automatic:\n\n1. Deoxygenated blood enters the right atrium via the superior and inferior venae cavae.\n2. It flows through the tricuspid valve into the right ventricle.\n3. The right ventricle pumps it through the pulmonary valve into the pulmonary arteries, toward the lungs.\n4. Oxygenated blood returns from the lungs via the pulmonary veins into the left atrium.\n5. It passes through the mitral valve into the left ventricle.\n6. The left ventricle pumps it through the aortic valve into the aorta and out to the body.\n\nNotice that steps 1–3 are right-sided and steps 4–6 are left-sided. The two sides work simultaneously — every heartbeat moves blood through both circuits at once.` },
      { title:"Why Location Is Everything", body:`The most important principle in rhythm interpretation: where a signal originates determines what it looks like on the ECG strip.\n\nSignals from above the AV node (SA node, atria, AV junction) reach the ventricles via the normal His-Purkinje pathway. The result is a narrow QRS complex — fast, coordinated ventricular depolarization.\n\nSignals from within the ventricular muscle itself cannot use the normal fast pathway. They spread cell-to-cell, taking longer and producing a wide, bizarre QRS complex.\n\nThis narrow/wide distinction is your first split in rhythm classification on every strip you'll ever read. Learn the anatomy, and the ECG logic follows automatically.` },
    ],
    quiz: [
      { q:"Where does blood from the body first arrive in the heart?", opts:["Left ventricle","Right atrium","Pulmonary veins","Aorta"], correct:1, exp:"The right atrium receives deoxygenated blood from the body via the superior and inferior venae cavae — it's always the entry point." },
      { q:"Which valve sits between the left atrium and left ventricle?", opts:["Tricuspid","Pulmonary","Mitral","Aortic"], correct:2, exp:"The mitral (bicuspid) valve separates the left atrium from the left ventricle and prevents backflow during ventricular contraction." },
      { q:"What does a wide QRS (>0.12 sec) tell you about signal origin?", opts:["The SA node fired too fast","The signal originated in or below the ventricles","The AV node is blocked","The atria fired early"], correct:1, exp:"A wide QRS means ventricular depolarization took an abnormal, slow path — cell-to-cell spread — instead of the fast His-Purkinje route. This happens when the signal originates in ventricular muscle." },
      { q:"The AV node deliberately slows the cardiac impulse. Why?", opts:["To prevent atrial fibrillation","To allow the atria to finish contracting before the ventricles fire","To increase heart rate","To reset the SA node"], correct:1, exp:"The AV node delay (0.12–0.20 sec) gives the atria time to complete their contraction and push blood into the ventricles before the ventricles fire — maximizing stroke volume." },
      { q:"Which structure fans out across the ventricular walls to trigger simultaneous contraction?", opts:["AV node","Bundle of His","Purkinje fibers","SA node"], correct:2, exp:"The Purkinje fibers are the terminal branches of the conduction system, spreading across both ventricular walls to ensure nearly simultaneous depolarization — producing the coordinated, powerful ventricular contraction." },
    ],
  },
  2: {
    sections: [
      { title:"The Three ECG Waves", body:`Every normal heartbeat produces three distinct waveforms on the ECG strip:\n\n• P Wave — a small, rounded bump representing atrial depolarization. The SA node fires, the signal sweeps across both atria causing them to contract. In Lead II, a healthy P wave is upright and consistent. No P wave = SA node is not in charge.\n\n• QRS Complex — the ECG's dominant feature. A Q (small downward dip), R (tall upward spike), and S (downward return). Together they represent ventricular depolarization — the moment the ventricles contract and push blood out. Not all three components are always visible; what matters is recognizing the complex as a unit.\n\n• T Wave — a gentle, rounded bump following the QRS. Represents ventricular repolarization — the ventricles resetting electrically for the next beat. A normal T wave is upright and slightly asymmetric.` },
      { title:"Intervals and Measurements", body:`ECG paper runs at 25 mm/sec. Each small box = 0.04 seconds; each large box = 0.20 seconds. Five large boxes = 1 second. Understanding the grid is essential for measuring intervals correctly.\n\nKey intervals:\n\n• PR Interval — measured from the start of the P wave to the start of the QRS complex. Represents total atrial-to-ventricular conduction time (including AV node delay). Normal: 0.12–0.20 seconds (3–5 small boxes).\n\n• QRS Duration — measured from the start to the end of the QRS complex. Normal: 0.06–0.12 seconds (1.5–3 small boxes). Values >0.12 seconds indicate abnormal ventricular conduction.\n\n• QT Interval — from start of QRS to end of T wave. Represents total ventricular electrical activity. Corrected for rate (QTc); prolonged QT increases arrhythmia risk.` },
      { title:"Calculating Heart Rate", body:`Three reliable methods for any strip:\n\n1. Six-Second Method — count the QRS complexes in a 6-second strip (usually marked with tick marks at the top), then multiply by 10. Works for regular and irregular rhythms.\n\n2. 1500 Method — divide 1500 by the number of small boxes between two consecutive R peaks (R-R interval in small boxes). Most accurate for regular rhythms.\n\n3. 300 Method — divide 300 by the number of large boxes in the R-R interval. Quick bedside estimate for regular rhythms.\n\nFor irregular rhythms (like atrial fibrillation), always use the 6-second method — the other methods only work when R-R intervals are consistent.` },
      { title:"The 5-Step Rhythm Check", body:`Apply these five steps to every strip in order — this is your systematic framework for all 14 modules:\n\n1. Regularity — are the R-R intervals consistent? Measure three consecutive R-R intervals and compare. Regular, slightly irregular, or irregularly irregular?\n\n2. Rate — count the ventricular rate. Is it 60–100 bpm (normal), above 100 (tachycardia), or below 60 (bradycardia)?\n\n3. P Wave — is there a P wave before every QRS? Is it upright in Lead II? Are all P waves identical in shape?\n\n4. PR Interval — is it 0.12–0.20 seconds? Consistent? Lengthening progressively? Or variable?\n\n5. QRS Duration — is it 0.06–0.12 seconds (narrow)? Or >0.12 seconds (wide/abnormal)?\n\nIn Normal Sinus Rhythm (NSR), all five are within normal limits. Every arrhythmia deviates from at least one.` },
    ],
    quiz: [
      { q:"What does the PR interval measure?", opts:["Ventricular repolarization time","Atrial-to-ventricular conduction time","Time between T wave and next P wave","QRS duration plus T wave"], correct:1, exp:"The PR interval starts at the beginning of the P wave and ends at the start of the QRS. It measures total conduction time from SA node firing through the AV node to the start of ventricular depolarization. Normal: 0.12–0.20 sec." },
      { q:"A strip shows 8 QRS complexes in 6 seconds. What is the heart rate?", opts:["80 bpm","60 bpm","96 bpm","48 bpm"], correct:0, exp:"Using the 6-second method: 8 complexes × 10 = 80 bpm." },
      { q:"Which wave represents ventricular repolarization?", opts:["P wave","QRS complex","T wave","U wave"], correct:2, exp:"The T wave follows the QRS and represents ventricular repolarization — the electrical reset that prepares the ventricles for the next beat." },
      { q:"On standard ECG paper, how long does one large box represent?", opts:["0.04 seconds","0.12 seconds","0.20 seconds","1.00 second"], correct:2, exp:"One large box = 5 small boxes × 0.04 sec = 0.20 seconds. Five large boxes = 1 full second." },
      { q:"A QRS duration of 0.14 seconds indicates:", opts:["Normal ventricular conduction","Abnormal ventricular conduction (wide QRS)","Junctional rhythm","Atrial fibrillation"], correct:1, exp:"Normal QRS duration is 0.06–0.12 sec. At 0.14 sec (>0.12 sec), the QRS is wide — indicating abnormal ventricular depolarization, such as bundle branch block or ventricular origin." },
    ],
  },
  3: {
    sections: [
      { title:"Three Mechanisms of Arrhythmia", body:`Every arrhythmia arises from one of three mechanisms:\n\n1. Abnormal Automaticity — a cell or group of cells fires spontaneously at an abnormal rate. Can be enhanced (firing faster than normal) or depressed (firing slower). Example: an ectopic atrial focus accelerating beyond the SA node's rate.\n\n2. Reentry — an electrical impulse gets stuck in a loop, circling a circuit and re-exciting tissue it already passed through. Requires two pathways with different conduction speeds and refractory periods. Responsible for most sustained SVTs and ventricular tachycardia.\n\n3. Triggered Activity — a prior action potential triggers an abnormal after-depolarization that reaches threshold and fires. Associated with digitalis toxicity, hypokalemia, and long QT syndrome.` },
      { title:"Escape vs. Ectopic — The Critical Distinction", body:`Not all non-sinus beats are pathological. Understanding why a beat fired is as important as knowing where it came from.\n\nEctopic beats fire early — they interrupt the normal rhythm before the next expected SA node beat. They represent enhanced automaticity from a non-sinus focus that has outpaced the SA node. Examples: PACs, PJCs, PVCs.\n\nEscape beats fire late — they appear after a pause, when the SA node has failed or slowed enough that a lower pacemaker fires to prevent a dangerous long gap. They are protective. Examples: atrial escape beats, junctional escape beats, ventricular escape beats.\n\nRule: ectopic beats are early; escape beats are late. Never suppress an escape rhythm without addressing the reason the higher pacemaker failed.` },
      { title:"The Rhythm Family Map", body:`Every rhythm has a home — an origin point in the cardiac anatomy. The origin determines the ECG signature:\n\n• Sinus rhythms (Ch. 4) — SA node origin. Upright P waves, normal PR, narrow QRS.\n• Atrial rhythms (Ch. 5) — atrial muscle origin. Abnormal P wave shape, narrow QRS.\n• Junctional rhythms (Ch. 6) — AV node origin. Inverted, absent, or buried P waves, narrow QRS.\n• Ventricular rhythms (Ch. 7) — ventricular muscle origin. Wide, bizarre QRS, P waves absent or dissociated.\n• AV Blocks (Ch. 8) — conduction failure between atria and ventricles. P waves present, QRS may be delayed or dropped.\n• Paced rhythms (Ch. 9) — artificial device origin. Pacing spikes visible before P wave or QRS.\n• Reentrant SVTs (Ch. 10) — circuit-driven. Very fast, narrow QRS, hidden P waves.` },
      { title:"The Naming Pattern", body:`Once you learn rhythm names in one location, you've learned them for all locations. The naming follows a consistent pattern:\n\n• Premature beat (early, single): PAC / PJC / PVC\n• Escape beat (late, single): Atrial escape beat / Junctional escape beat / Ventricular escape beat\n• Three or more consecutive: Rhythm or Tachycardia, depending on rate\n• Tachycardia (≥101 bpm, sustained): Atrial Tach / Junctional Tach / Ventricular Tach\n• Fibrillation (chaotic, sustained): Atrial Fib / Ventricular Fib\n\nLearn the pattern once — apply it to every location.` },
    ],
    quiz: [
      { q:"A beat that fires before the next expected SA node beat is called:", opts:["An escape beat","An ectopic beat","A fusion beat","A capture beat"], correct:1, exp:"Ectopic beats fire early — they interrupt the normal rhythm because a non-SA focus depolarized spontaneously before the SA node's next scheduled discharge." },
      { q:"Reentry requires which of the following?", opts:["One slow pathway only","Two pathways with different conduction speeds and refractory periods","A blocked AV node","Enhanced SA node automaticity"], correct:1, exp:"Reentry requires two pathways: one conducting slowly (allowing the other to recover), creating a circular loop. This is the mechanism behind most SVTs and ventricular tachycardia." },
      { q:"A junctional escape beat will appear:", opts:["Early, before the next expected beat","Late, after a long pause when higher pacemakers fail","At the same time as the SA node fires","During atrial fibrillation only"], correct:1, exp:"Escape beats are protective — they fire late, after the SA node or higher pacemakers have failed to produce a beat in time. Suppressing them without addressing the underlying failure is dangerous." },
      { q:"Wide QRS complexes in a rhythm strip indicate:", opts:["Atrial origin","Normal conduction","Ventricular origin or aberrant conduction","Sinus tachycardia"], correct:2, exp:"A wide QRS (>0.12 sec) indicates the signal traveled an abnormal pathway through the ventricles — either originating in ventricular muscle, or conducting aberrantly through the normal system." },
    ],
  },
  4: {
    sections: [
      { title:"Seven Sinus Rhythms — One Framework", body:`All seven sinus rhythms share the same DNA: the SA node is the origin, conduction through the AV node and bundle branches is intact, and the result is a P wave before each QRS with a normal PR interval and narrow QRS. What varies is rate, regularity, and whether any beats are missing.\n\nRate variations:\n• Normal Sinus Rhythm (NSR) — 60–100 bpm, regular\n• Sinus Tachycardia (ST) — ≥101 bpm, regular\n• Sinus Bradycardia (SB) — <60 bpm, regular\n\nRegularity variation:\n• Sinus Arrhythmia (SA) — 60–100 bpm, slightly irregular (cyclic with breathing)\n\nSignal failures (gaps in the ECG):\n• Sinus Exit Block — gap is an exact multiple of normal R-R interval\n• Sinus Pause — gap is 1.2–2.0 seconds, not a clean multiple\n• Sinus Arrest — gap is >2.0 seconds, SA node may not restart` },
      { title:"Distinguishing the Signal Failure Trio", body:`Sinus exit block, sinus pause, and sinus arrest all present as a gap in the rhythm — a stretch of ECG with no P-QRS-T complexes. Distinguishing them requires measuring the gap:\n\nSinus Exit Block: The SA node kept firing on schedule but the signal failed to exit the node. The gap is almost exactly 2× or 3× the normal R-R interval. Mathematically precise — the beat count just skipped.\n\nSinus Pause: The SA node stopped firing temporarily. The gap is longer than one normal cycle but not a clean multiple of the R-R. Duration: roughly 1.2–2.0 seconds. SA node recovers on its own.\n\nSinus Arrest: The SA node stops for >2.0 seconds — sometimes much longer. Not a clean multiple. The SA node may not restart at all, requiring a lower escape pacemaker (typically junctional) to step in.\n\nClinical rule: measure the gap first, every time.` },
      { title:"Strange P Waves — Still Sinus Until Proven Otherwise", body:`A common pitfall: assuming an unusual P wave morphology indicates an ectopic rhythm. In patients with structural atrial disease or atrial enlargement, P waves may appear notched (bifid), peaked, biphasic, or wider than expected — and yet the SA node is still firing.\n\nKey rule: all strange P waves should be considered sinus until proven ectopic.\n\nProof of ectopic origin requires contrast: an ectopic P wave looks different from the baseline P waves in the same strip. If every P wave looks the same — even if strange — the rhythm is sinus from an abnormal heart.\n\nThis rule protects against misidentifying NSR from a patient with left atrial enlargement as an ectopic atrial rhythm.` },
      { title:"Clinical Significance at the Bedside", body:`Rate alone does not determine clinical action — symptoms and context do:\n\n• Sinus Tachycardia — almost always a physiological response (pain, fever, dehydration, blood loss, anxiety). Treat the cause, not the rate.\n• Sinus Bradycardia — benign in athletes and during sleep; concerning only if symptomatic (dizziness, syncope, hypotension). Atropine if symptomatic and confirmed.\n• Sinus Arrhythmia — normal physiological variation; no treatment needed.\n• Signal Failures — urgency scales with severity: exit block and brief pauses warrant monitoring; sinus arrest with no escape rhythm is a medical emergency requiring pacemaker evaluation.` },
    ],
    quiz: [
      { q:"Which sinus rhythm shows a gap that is exactly 2× or 3× the normal R-R interval?", opts:["Sinus arrest","Sinus pause","Sinus exit block","Sinus arrhythmia"], correct:2, exp:"In sinus exit block, the SA node kept firing on its schedule but the signal didn't exit the node. The gap is a mathematically clean multiple of the normal R-R interval — because the pacemaker never stopped counting." },
      { q:"Sinus tachycardia at 115 bpm in a patient with a fever of 103°F should be:", opts:["Cardioverted immediately","Treated with beta-blockers","Treated by addressing the fever (the underlying cause)","Left untreated and ignored"], correct:2, exp:"Sinus tachycardia is almost always a compensatory response. The rate will come down when the cause is treated. Suppressing the rate without addressing the cause can be harmful." },
      { q:"Normal sinus rhythm has a heart rate of:", opts:["40–60 bpm","60–100 bpm","100–150 bpm","Any rate with upright P waves"], correct:1, exp:"NSR is defined as SA node origin (upright P waves, normal PR, narrow QRS) at a rate of 60–100 bpm with regular rhythm." },
      { q:"A 28-year-old runner has a resting HR of 48 bpm, upright P waves, PR of 0.16 sec, QRS of 0.08 sec. What is the rhythm?", opts:["Sinus bradycardia — requires treatment","Junctional rhythm","Sinus bradycardia — normal in an athlete","Third-degree AV block"], correct:2, exp:"Sinus bradycardia in a well-trained athlete is a normal physiological finding — high vagal tone lowers the resting heart rate. All five steps confirm sinus origin; only the rate is slow. Context eliminates concern." },
    ],
  },
  5: {
    sections: [
      { title:"PACs, Escape Beats & Ectopic Atrial Rhythms", body:`Atrial rhythms originate in atrial muscle cells outside the SA node. Because the signal still reaches the ventricles through the normal AV node and His-Purkinje pathway, the QRS remains narrow. The P wave, however, looks different — inverted, notched, biphasic, or flattened — because atrial depolarization travels an abnormal route.\n\n• PAC (Premature Atrial Contraction) — a single early beat from an ectopic atrial focus. Early abnormal P wave, narrow QRS, usually followed by a non-compensatory pause.\n\n• Atrial Escape Beat — a single late beat from an atrial focus that fires after an SA node pause. Protective; arrives after a long gap.\n\n• Ectopic Atrial Rhythm (EAR) — three or more consecutive PAC-like beats at ≤100 bpm. A consistent but abnormal P wave morphology.\n\n• Ectopic Atrial Tachycardia (EAT) — same as EAR but rate ≥101 bpm. No triggering PAC visible at onset.` },
      { title:"WAP, MAT — When Multiple Foci Fire", body:`Wandering Atrial Pacemaker (WAP): Three or more different P wave morphologies in the same rhythm strip, rate ≤100 bpm, slightly irregular R-R intervals. The pacemaker site shifts between the SA node and multiple ectopic atrial foci — hence "wandering." Clinically benign in most patients; associated with increased vagal tone.\n\nMultifocal Atrial Tachycardia (MAT): Same hallmark (≥3 different P wave morphologies) but rate ≥101 bpm. Irregularly irregular like atrial fibrillation, but discrete P waves precede each QRS. Strongly associated with severe COPD and pulmonary disease. Not treated with cardioversion — treat the underlying pulmonary condition and optimize oxygenation.` },
      { title:"Atrial Flutter & Atrial Fibrillation", body:`Atrial Flutter: Rapid, regular atrial activation at 250–350 bpm producing the classic sawtooth (flutter wave) pattern — most visible in leads II, III, and aVF. The AV node cannot conduct every atrial impulse and blocks some, producing a ventricular rate that depends on the conduction ratio (2:1, 3:1, 4:1). A 2:1 flutter with atrial rate of 300 bpm = ventricular rate of 150 bpm.\n\nAtrial Fibrillation (AF): Chaotic, disorganized atrial electrical activity at 350–600 "beats" per minute — so fast and irregular that no true P waves form. The baseline shows fibrillatory waves. The ventricular response is irregularly irregular (the defining feature). AF is the most common sustained arrhythmia and the leading cause of cardioembolic stroke — blood pools in the left atrial appendage, forms clots, and can travel to the brain.` },
      { title:"AF & Stroke Risk — The Core Clinical Link", body:`AF eliminates coordinated atrial contraction. Without the "atrial kick," blood stagnates in the left atrial appendage — a small pouch with slow flow. Stagnant blood clots. A clot breaking free and traveling to the brain causes an ischemic stroke.\n\nManagement pillars:\n1. Rate control — slow the ventricular response to a tolerable rate (typically <110 bpm at rest) using beta-blockers, calcium channel blockers, or digoxin.\n2. Rhythm control — attempt to restore sinus rhythm via cardioversion or antiarrhythmic drugs.\n3. Anticoagulation — reduce stroke/PE risk using warfarin or direct oral anticoagulants (DOACs), guided by the CHA₂DS₂-VASc score.\n\nFor the ECG technician: document the rhythm accurately and report promptly. The clinical team makes anticoagulation decisions.` },
    ],
    quiz: [
      { q:"What makes atrial fibrillation's ventricular rhythm unique?", opts:["Regular with narrow QRS","Regularly irregular with wide QRS","Irregularly irregular with no true P waves","Regular with sawtooth flutter waves"], correct:2, exp:"AF's hallmark is irregularly irregular ventricular response with no discernible P waves — only a chaotic fibrillatory baseline. The AV node receives random impulses and conducts them randomly, producing the characteristic irregular R-R intervals." },
      { q:"Atrial flutter typically produces what ECG pattern in leads II, III, aVF?", opts:["Flat baseline","Sawtooth flutter waves at 250–350/min","Discrete P waves before each QRS","Fibrillatory baseline"], correct:1, exp:"Atrial flutter produces regular sawtooth-shaped flutter waves at 250–350 per minute, best seen in the inferior leads (II, III, aVF). The AV node conducts every 2nd, 3rd, or 4th flutter wave to the ventricles." },
      { q:"MAT (Multifocal Atrial Tachycardia) is distinguished from AF by:", opts:["Rate above 100 bpm","Wide QRS complexes","Discrete P waves before each QRS (≥3 different morphologies)","Sawtooth flutter waves"], correct:2, exp:"MAT is irregularly irregular like AF, but has distinct P waves before each QRS — at least 3 different P wave morphologies visible. AF has no true P waves at all." },
      { q:"The primary stroke risk in atrial fibrillation comes from:", opts:["Fast ventricular rate damaging the myocardium","Blood pooling in the left atrial appendage forming clots","Ventricular fibrillation degenerating from AF","Coronary artery blockage from rapid conduction"], correct:1, exp:"Without coordinated atrial contraction, blood stagnates in the left atrial appendage. Clot formation follows, and embolization to the brain causes ischemic stroke — the primary morbidity risk of AF." },
    ],
  },
  6: {
    sections: [
      { title:"When the AV Node Takes Over", body:`Junctional rhythms originate at or near the AV node — the junction between the atria and ventricles. Because the AV node sits at the center of the conduction system, it can activate the ventricles normally (narrow QRS via the His-Purkinje system) while activating the atria abnormally — either before, during, or after ventricular depolarization.\n\nThis produces the defining feature of all junctional rhythms: abnormal P wave position.\n\n• P wave before QRS with short PR (<0.12 sec) — AV node activated atria slightly before ventricles\n• P wave buried in QRS — simultaneous atrial and ventricular activation\n• P wave after QRS (inverted, retrograde) — AV node activated ventricles first, then atria backward\n• No visible P wave — atrial activation completely hidden\n\nIn all cases, the QRS remains narrow — because ventricular conduction is normal.` },
      { title:"Junctional Escape Beat & Junctional Escape Rhythm", body:`When the SA node slows or fails, the AV junction fires a backup beat — a junctional escape beat. It arrives late (after a long pause), has the abnormal P wave signature described above, and a narrow QRS. It's protective — the conduction system's failsafe.\n\nIf the SA node continues to fail, three or more consecutive junctional escape beats produce a junctional escape rhythm (JER, also called junctional rhythm — JR) at 40–60 bpm. This is an emergency backup, not a benign finding. The question is always: why did the SA node fail?\n\nCommon causes: vagal episodes, inferior MI (which can affect SA and AV node blood supply), medication effects (beta-blockers, digoxin, amiodarone), sick sinus syndrome.` },
      { title:"Accelerated Junctional Rhythm & Junctional Tachycardia", body:`When the AV junction accelerates above its normal backup rate but stays below 100 bpm, the result is accelerated junctional rhythm (AJR) — rate 61–99 bpm. When it reaches ≥100 bpm, it becomes junctional tachycardia.\n\nIn both cases: P waves are abnormal (inverted, buried, or absent), PR is short if P is visible, QRS is narrow.\n\nClinical context:\n• AJR is often seen after inferior MI, cardiac surgery, or digitalis toxicity\n• Junctional tachycardia shares these causes and may also reflect enhanced junction automaticity from electrolyte disturbances\n• The AV node should not be the primary pacemaker at any rate — so even a "normal-looking" rate from a junctional source is pathological by definition` },
      { title:"Don't Confuse: Short PR + Inverted P vs. Low Atrial Rhythm", body:`The most common junctional interpretation trap: calling any inverted P wave with a short PR interval a junctional rhythm.\n\nA low atrial focus (PAC from the bottom of the atria, EAR from a low atrial site, or WAP) also produces inverted P waves with short PR intervals — because the atrial depolarization wave travels upward toward the SA node instead of downward. The P wave looks exactly like retrograde atrial activation from a junctional beat.\n\nThe distinction cannot be made from the ECG strip alone when the P wave appears before the QRS.\n\nTrue junctional signatures: P wave buried in the QRS, P wave after the QRS, or no P wave at all. A P wave that precedes the QRS — even with a short PR and inverted morphology — could be atrial until proven otherwise.` },
    ],
    quiz: [
      { q:"A junctional escape beat appears on the ECG:", opts:["Early, before the expected SA node beat","Late, after a pause when the SA node fails","During atrial fibrillation","As a wide QRS with no P wave"], correct:1, exp:"Junctional escape beats are protective — they fire late, stepping in after the SA node has failed to produce a beat in time. Early beats are ectopic; late beats are escape." },
      { q:"What is the intrinsic rate of the AV junction as a backup pacemaker?", opts:["20–40 bpm","40–60 bpm","60–100 bpm","100–150 bpm"], correct:1, exp:"The AV junction fires at 40–60 bpm as a backup pacemaker. This is faster than the ventricular escape rate (20–40 bpm) but slower than the SA node (60–100 bpm), which is why it only takes over when the SA node fails." },
      { q:"A junctional rhythm at 75 bpm is best classified as:", opts:["Normal sinus rhythm","Junctional escape rhythm","Accelerated junctional rhythm","Junctional tachycardia"], correct:2, exp:"The AV junction's normal backup rate is 40–60 bpm. A junctional origin at 61–99 bpm is faster than expected — hence accelerated junctional rhythm (AJR)." },
      { q:"Which P wave position definitively confirms junctional (vs. low atrial) origin?", opts:["P wave before QRS with short PR","P wave inverted in lead II","P wave buried in or after the QRS","Any abnormal P wave morphology"], correct:2, exp:"A P wave before the QRS — even inverted with a short PR — could be a low atrial focus. Only a P wave buried in the QRS, following the QRS, or absent entirely points specifically and definitively to junctional origin." },
    ],
  },
  7: {
    sections: [
      { title:"PVCs — The Ectopic Ventricular Beat", body:`Premature Ventricular Contractions (PVCs) are the most common ventricular arrhythmia. They fire early from a ventricular muscle focus, bypassing the His-Purkinje system. Because conduction spreads cell-to-cell rather than through the fast pathway, the QRS is wide (>0.12 sec) and bizarre-looking — the signature of all ventricular rhythms.\n\nKey ECG features of a PVC:\n• Wide QRS (>0.12 sec), unusual morphology\n• No preceding P wave (or a dissociated P wave that didn't cause it)\n• Full compensatory pause after the PVC (the SA node keeps its schedule, fires during the refractory period, then delivers the next beat on time — the pause + PVC = exactly 2× the normal R-R interval)\n\nPVC patterns:\n• Unifocal — all PVCs look identical (same focus)\n• Multifocal — PVCs vary in morphology (multiple foci)\n• Bigeminy — every other beat is a PVC\n• Trigeminy — every third beat is a PVC\n• Couplet — two consecutive PVCs` },
      { title:"The Compensatory Pause Explained", body:`When a PVC fires, the ventricles depolarize early and independently. The SA node, completely unaffected, continues firing on its own schedule. The SA node fires during or just after the PVC — but finds the ventricles in their refractory period and cannot conduct. The beat is blocked.\n\nThe SA node then fires again at its next scheduled interval — and this time the ventricles respond normally. The result: the pause after the PVC, plus the PVC itself, equals exactly 2× the normal R-R interval. The SA node never reset. This mathematical precision — the full compensatory pause — is the hallmark of PVCs.\n\nContrast with PACs and PJCs: those early beats travel retrogradely into or through the SA node and reset it. The next SA node beat comes earlier than expected — a non-compensatory pause.` },
      { title:"Ventricular Tachycardia & Fibrillation", body:`Ventricular Tachycardia (VT): Three or more consecutive ventricular beats at ≥101 bpm. Wide, bizarre QRS complexes, AV dissociation (P waves and QRS marching independently). Can be monomorphic (all QRS complexes look the same — reentrant mechanism) or polymorphic (QRS morphology varies).\n\nFirst clinical question with any wide QRS tachycardia: does this patient have a pulse? VT with pulse is treated differently than pulseless VT (→ defibrillation, CPR).\n\nSpecial form — Torsades de Pointes (TdP): A polymorphic VT where the QRS complexes rotate around the baseline, initiated by R-on-T and associated with prolonged QT. Treatment: magnesium sulfate IV, remove the offending drug/electrolyte cause. NOT treated with standard antiarrhythmics.\n\nVentricular Fibrillation (VF): Chaotic, disorganized ventricular electrical activity with no recognizable QRS — only coarse or fine irregular waving. No effective cardiac output. Immediate defibrillation is required. This is cardiac arrest.` },
      { title:"SVT with Bundle Branch Block — The Wide QRS Mimic", body:`A wide QRS tachycardia does not always mean ventricular tachycardia. A supraventricular rhythm (sinus tachycardia, SVT, atrial flutter) can produce wide QRS complexes if one bundle branch is blocked — either as a pre-existing condition or due to rate-dependent block.\n\nClues favoring SVT with BBB:\n• Upright P waves before every QRS (SA node still in charge)\n• Pattern identical to known prior bundle branch block on old ECG\n• Clinical history of pre-existing BBB\n\nClues favoring true VT:\n• AV dissociation — P waves marching independently of QRS\n• Fusion beats — occasional narrow QRS when SA node briefly captures ventricles\n• Capture beats — narrow QRS interrupting the wide tachycardia\n• No prior BBB history\n\nSafety rule: when in doubt, treat wide QRS tachycardia as VT. Treating SVT-with-BBB like VT is safer than the reverse.` },
    ],
    quiz: [
      { q:"A full compensatory pause after a PVC means:", opts:["The SA node reset after the PVC","The PVC plus the pause equals exactly 2× the normal R-R interval","The next beat will be narrow","The AV node blocked the PVC"], correct:1, exp:"In a compensatory pause, the SA node never resets — it keeps firing on its own schedule. The PVC occurs during one cycle, the SA node fires but finds the ventricles refractory, then delivers the next beat on schedule. PVC + pause = 2× normal R-R." },
      { q:"PVC bigeminy means:", opts:["Every other beat is a PVC","Two consecutive PVCs","Three consecutive PVCs","PVCs from multiple foci"], correct:0, exp:"Bigeminy = every other beat. In PVC bigeminy, the pattern alternates: normal beat, PVC, normal beat, PVC — the bi (two) refers to the two-beat repeating cycle." },
      { q:"What is the FIRST question to ask when you see a wide QRS tachycardia?", opts:["Is the QRS monomorphic or polymorphic?","Does this patient have a pulse?","Is there AV dissociation?","What is the exact rate?"], correct:1, exp:"Clinical priority overrides ECG interpretation. A wide QRS tachycardia could be pulseless VT requiring immediate CPR and defibrillation, or a stable rhythm requiring different management. Assess the patient first." },
      { q:"Torsades de Pointes is associated with:", opts:["Short QT interval","Prolonged QT interval and rotating QRS morphology","Narrow QRS tachycardia","Third-degree AV block"], correct:1, exp:"TdP (French: 'twisting of the points') is a polymorphic VT occurring in the setting of prolonged QT. The QRS complexes appear to rotate around the isoelectric baseline. Treatment: IV magnesium sulfate and QT-prolonging drug removal." },
    ],
  },
  8: {
    sections: [
      { title:"First-Degree AV Block", body:`In First-Degree AV Block, every P wave conducts to a QRS — no beats are dropped. The only abnormality is a prolonged PR interval: >0.20 seconds (>5 small boxes). The conduction is slow but intact.\n\nECG: regular rhythm, normal rate, upright P waves, PR interval consistently >0.20 sec, narrow QRS.\n\nClinical significance: usually benign, often a normal variant or medication effect (beta-blockers, digoxin, calcium channel blockers). No treatment required for isolated first-degree block. Document and move on — but note it, because a patient with first-degree block who develops symptoms needs reassessment.` },
      { title:"Second-Degree AV Block — Mobitz Type I & Type II", body:`In Second-Degree AV Block, some — but not all — P waves conduct to the ventricles. The ones that don't produce a dropped QRS complex (a P wave with no QRS following it).\n\nMobitz Type I (Wenckebach): The PR interval progressively lengthens over successive beats until one P wave fails to conduct — then the cycle resets. The key feature is the changing PR interval. Usually occurs at the AV node level. Generally benign; often associated with inferior MI, increased vagal tone, or medications. The group beating pattern (progressively lengthening PR, then a dropped beat, then restart) is recognizable once you know to look for it.\n\nMobitz Type II: PR intervals are constant on all conducted beats — but periodically a P wave is suddenly not conducted with no warning (no PR lengthening). The constant PR is the critical distinguishing feature. Usually reflects disease below the AV node (bundle of His or bundle branches). More dangerous than Type I — higher risk of progression to complete (third-degree) block. Pacemaker is often indicated.` },
      { title:"High-Grade & Third-Degree AV Block", body:`High-Grade AV Block (Second-Degree): More than one consecutive P wave is non-conducted — the ratio is 2:1 or higher. Cannot be definitively classified as Mobitz Type I or II without seeing two consecutive conducted beats to assess PR behavior.\n\nThird-Degree (Complete) AV Block: No signal crosses from atria to ventricles. The SA node fires the atria normally (P waves appear on schedule), but none of those impulses reach the ventricles. A lower escape pacemaker takes over:\n• Junctional escape pacemaker → narrow QRS, 40–60 bpm\n• Ventricular escape pacemaker → wide QRS, 20–40 bpm\n\nThe result is complete AV dissociation — P waves and QRS complexes march at completely different rates with no relationship. P waves never capture QRS complexes. This is a medical emergency. Pacemaker placement is almost always required.` },
      { title:"The NCPAC Trap — Rule Out Before Calling AV Block", body:`Non-Conducted PAC (NCPAC): A PAC that fires early enough to find the AV node refractory and fails to conduct — producing a P wave with no following QRS. Looks exactly like a dropped beat in second-degree AV block.\n\nThe distinction:\n• NCPAC: The non-conducted P wave arrives early and usually has a different shape (ectopic morphology). Look for it hiding in the preceding T wave — it deforms the T wave contour. The surrounding rhythm is normal sinus.\n• AV Block dropped beat: The non-conducted P wave arrives on schedule and looks identical to all other sinus P waves.\n\nAlways check the T waves before diagnosing AV block. Calling a NCPAC an AV block is a common and consequential error.` },
    ],
    quiz: [
      { q:"In Mobitz Type II, the PR interval on conducted beats is:", opts:["Progressively lengthening","Progressively shortening","Constant (fixed)","Variable and unpredictable"], correct:2, exp:"Mobitz Type II is defined by a constant PR interval on all conducted beats, with sudden non-conducted P waves occurring without warning. This constancy differentiates it from Type I (Wenckebach), where the PR lengthens before each dropped beat." },
      { q:"Third-degree AV block shows:", opts:["Progressively lengthening PR with dropped beats","Complete AV dissociation — P waves and QRS at independent rates","Constant PR with intermittent dropped beats","Prolonged PR with every P wave conducting"], correct:1, exp:"In third-degree (complete) AV block, no sinus P wave ever conducts to the ventricles. P waves march at the SA node rate; QRS complexes march at the escape pacemaker rate. They have no relationship — complete AV dissociation." },
      { q:"What is the first step when you see a dropped QRS (P wave not followed by a QRS)?", opts:["Diagnose second-degree AV block","Check for a non-conducted PAC hiding in the T wave","Call the physician immediately","Measure the QRS duration"], correct:1, exp:"Before diagnosing any form of AV block, rule out a non-conducted PAC (NCPAC). NCPACs look identical to dropped beats — an early, sometimes deformed P wave in the preceding T wave is the clue. Check every T wave before the dropped beat." },
      { q:"Mobitz Type I (Wenckebach) is most often associated with:", opts:["Disease below the Bundle of His","Anterior MI and bundle branch block","Inferior MI and increased vagal tone","Ventricular muscle disease"], correct:2, exp:"Wenckebach block occurs at the AV node, which receives blood supply from the right coronary artery — the same artery supplying the inferior wall. Inferior MI and increased vagal tone are the most common causes." },
    ],
  },
  9: {
    sections: [
      { title:"Pacemaker Basics — Sensing and Pacing", body:`An artificial pacemaker delivers electrical impulses to maintain an adequate heart rate when the natural conduction system fails. Every pacemaker has two core functions:\n\n• Sensing — detecting intrinsic cardiac activity. When the heart beats on its own, the pacemaker stands down (inhibits itself) and does not fire. This prevents competition between the pacemaker and the patient's own rhythm.\n\n• Pacing — delivering a timed electrical stimulus when no intrinsic beat occurs within the programmed escape interval.\n\nThe ECG signature of pacemaker firing: a narrow, sharp vertical line called a pacing spike — visible immediately before the paced P wave or QRS complex.\n\nThe interplay between sensing and pacing — and failures of either function — is the key to reading paced ECG strips.` },
      { title:"Four Types of Paced Rhythms", body:`Pacemakers can pace the atria, ventricles, or both:\n\n• Atrial paced (AAI) — spike before each P wave; normal QRS follows via intact AV conduction. Used when the SA node fails but AV conduction is intact.\n\n• Ventricular paced (VVI) — spike before each QRS; wide, bizarre QRS because pacing lead stimulates ventricular muscle directly. Used when ventricular pacing is needed regardless of atrial activity.\n\n• Dual-chamber paced (DDD) — spikes before both P wave and QRS. Atrial spike triggers AV delay, then ventricular spike fires. Maintains AV synchrony.\n\n• Biventricular paced (CRT) — paces both ventricles simultaneously to restore synchrony in heart failure with bundle branch block. May show three spikes or two closely timed spikes.\n\nRecognizing pacing spikes is step one. The type follows from where the spike appears relative to P and QRS.` },
      { title:"Three Pacemaker Failures", body:`The name of each failure tells you exactly what failed:\n\n• Failure to PACE — the pacemaker should have fired, but no pacing spike appears when expected. The patient's own rhythm is too slow or absent, but the device did not fire. Cause: oversensing (the device detected something — artifact, T waves, muscle potentials — and mistook it for a heartbeat, so it inhibited itself).\n\n• Failure to CAPTURE — a pacing spike appears but is not followed by a P wave or QRS. The device fired but the myocardium did not respond. Causes: lead displacement or dislodgement, lead fracture, myocardial fibrosis at the lead tip, hyperkalemia, or battery depletion.\n\n• Failure to SENSE — a pacing spike fires too soon after an intrinsic beat — the pacemaker didn't detect the patient's own rhythm. Causes: undersensing (intrinsic signal too small, or sensitivity threshold set incorrectly). Dangerous because a spike landing on the T wave (R-on-T) can trigger ventricular fibrillation.` },
      { title:"Applying the 5 Steps to Paced Rhythms", body:`Before applying the five steps to any paced rhythm strip, add a preliminary step:\n\nStep 0 — Look for pacing spikes. Identify them first. Then determine whether they precede P waves, QRS complexes, or both.\n\nThen apply the standard five steps:\n1. Regularity — is the paced rate regular?\n2. Rate — is the rate appropriate for the programmed setting?\n3. P Wave — is there an atrial spike and P wave? Does P follow spike appropriately?\n4. PR Interval — in dual-chamber pacing, is the AV delay consistent?\n5. QRS Duration — atrial paced QRS should be narrow (if AV conduction intact); ventricular paced QRS is always wide.\n\nThen add Step 6: Is there a failure? Check for missing spikes, spikes without capture, or spikes too close to intrinsic beats.` },
    ],
    quiz: [
      { q:"A pacing spike appears but no P wave or QRS follows. This is:", opts:["Failure to sense","Failure to pace","Failure to capture","Normal paced rhythm"], correct:2, exp:"Failure to capture: the pacemaker fired (spike present) but the myocardium did not depolarize in response. No P wave or QRS follows the spike. Causes include lead displacement, fibrosis at the lead tip, and hyperkalemia." },
      { q:"No pacing spike appears when the patient's heart rate drops below the programmed rate. This is:", opts:["Failure to capture","Failure to sense","Failure to pace","Normal demand pacing"], correct:2, exp:"Failure to pace: the device should have fired (rate too slow, no intrinsic beat) but didn't. The likely cause is oversensing — the pacemaker detected something (artifact, T waves) and mistakenly inhibited itself." },
      { q:"Why is failure to sense potentially dangerous?", opts:["It causes the heart rate to become too fast","A pacing spike landing on the T wave can trigger ventricular fibrillation (R-on-T)","It always causes failure to capture","It blocks AV conduction"], correct:1, exp:"Failure to sense means the pacemaker fires despite an intrinsic beat — if the spike lands during ventricular repolarization (the T wave), it can trigger the R-on-T phenomenon and precipitate ventricular fibrillation." },
      { q:"In a ventricular paced rhythm, why is the QRS complex always wide?", opts:["The pacemaker delivers too much current","The stimulus bypasses the AV node","The pacing lead stimulates ventricular muscle directly, bypassing the His-Purkinje system","The atria are not paced"], correct:2, exp:"Ventricular pacing delivers the stimulus directly to myocardial muscle. The impulse spreads cell-to-cell rather than through the fast His-Purkinje pathway — producing wide, bizarre QRS morphology identical to a PVC or ventricular rhythm." },
    ],
  },
  10: {
    sections: [
      { title:"Reentry — How the Circuit Sustains Itself", body:`AVNRT and AVRT are the two most common paroxysmal supraventricular tachycardias (SVTs). Both are driven by reentry — an electrical impulse trapped in a loop that re-excites tissue it already passed through, sustaining a rapid rhythm indefinitely until the circuit is broken.\n\nReentry requires:\n• Two parallel pathways with different conduction speeds\n• One pathway conducting faster, one conducting slower\n• Different refractory periods, allowing the impulse to travel down one and return up the other before it recovers\n\nThe result: a circular current running continuously through the loop, producing a regular, rapid, narrow QRS tachycardia (because ventricular conduction is via the normal His-Purkinje system in both AVNRT and orthodromic AVRT).` },
      { title:"AVNRT — The AV Node's Internal Loop", body:`In AVNRT, the entire reentry circuit exists within or immediately around the AV node. There are two functional pathways within the AV node — a slow pathway (conducts slowly, recovers fast) and a fast pathway (conducts fast, recovers slowly). The impulse cycles around this loop continuously.\n\nBecause the circuit activates the atria and ventricles almost simultaneously (the loop completes very quickly), the retrograde P wave is buried in or fused with the QRS complex.\n\nKey ECG clues:\n• Regular, narrow QRS tachycardia, rate 150–250 bpm\n• No visible P waves, or a pseudo-r' in V1 (a small notch at the end of the QRS from retrograde P activation)\n• RP interval shorter than PR interval\n• Onset typically sudden; may terminate with vagal maneuvers or adenosine\n\nAVNRT is the most common SVT. It is not immediately life-threatening but causes significant palpitations, anxiety, and can reduce cardiac output at very high rates.` },
      { title:"AVRT — The Accessory Pathway", body:`In AVRT, the reentry circuit uses the AV node as one limb and an accessory pathway (AP) — an abnormal muscle strand bypassing the AV node — as the other. The circuit is larger than AVNRT.\n\nOrthodromic AVRT (most common form): impulse travels down the AV node (narrow QRS — normal ventricular conduction), then retrogradely up the AP, activating the atria after the ventricles. Retrograde P waves appear after each QRS — in the ST segment — visible and distinct from the QRS.\n\nAntidromic AVRT: impulse travels down the AP and up the AV node — producing a wide QRS (pre-excited, aberrant ventricular conduction). Rarest form.\n\nKey distinction from AVNRT: in AVRT, the P wave appears after the QRS (RP > PR is NOT required; the P is visible in the ST segment). In AVNRT, the P wave is buried in or at the very end of the QRS.` },
      { title:"Wolff-Parkinson-White (WPW) Syndrome", body:`WPW is the most clinically important accessory pathway condition. The AP conducts antegrade (from atria to ventricles) at baseline, producing a short PR interval and a delta wave — a slurred upstroke at the start of the QRS representing early ventricular pre-excitation through the AP.\n\nDuring sinus rhythm, WPW shows:\n• Short PR interval (<0.12 sec)\n• Delta wave (slurred initial QRS deflection)\n• Slightly wide QRS (from pre-excitation)\n\nThe danger in WPW: if atrial fibrillation develops, the AP can conduct the AF impulses rapidly to the ventricles at rates of 200–300+ bpm — bypassing the rate-limiting AV node. This can degenerate into ventricular fibrillation. AV nodal blocking drugs (adenosine, verapamil, diltiazem, digoxin) are contraindicated in WPW with AF — they can accelerate conduction through the AP.\n\nDefinitive treatment: radiofrequency catheter ablation of the accessory pathway.` },
    ],
    quiz: [
      { q:"In AVNRT, P waves are typically:", opts:["Upright before each QRS","Inverted and before each QRS with a short PR","Buried in or fused with the QRS complex","Completely absent (fibrillatory baseline)"], correct:2, exp:"AVNRT's reentry circuit activates atria and ventricles nearly simultaneously — the retrograde P wave is buried in or fused with the QRS. A pseudo-r' notch in V1 is a key clue when visible." },
      { q:"What makes WPW dangerous if atrial fibrillation develops?", opts:["The delta waves disappear","The accessory pathway can conduct AF impulses at 200–300+ bpm, bypassing AV node rate-limiting, risking VF","The QRS narrows during AF","AV blocks develop due to AP competition"], correct:1, exp:"The AV node normally limits ventricular response in AF. The accessory pathway in WPW has no such rate-limiting property — it can conduct every atrial impulse, driving the ventricles at lethal rates that can degenerate into VF." },
      { q:"Orthodromic AVRT produces a narrow QRS because:", opts:["The AP is too slow to conduct","Ventricular conduction travels down the AV node via normal His-Purkinje pathways","The reentry circuit is entirely within the AV node","The atria depolarize before the ventricles"], correct:1, exp:"In orthodromic AVRT, the impulse travels antegrade down the AV node (normal ventricular conduction = narrow QRS) and retrograde up the AP. The narrow QRS confirms normal ventricular activation." },
      { q:"The delta wave in WPW represents:", opts:["Atrial repolarization","Delayed ventricular depolarization","Early ventricular pre-excitation through the accessory pathway","Retrograde atrial activation"], correct:2, exp:"The delta wave is the slurred initial upstroke of the QRS in WPW. It represents early ventricular depolarization through the AP before the normal AV node pathway conducts — ventricular pre-excitation." },
    ],
  },
  11: {
    sections: [
      { title:"The Master Decision Tree", body:`A systematic approach to any strip, in order:\n\nStep 1 — Assess the QRS width first. Narrow QRS (<0.12 sec)? The rhythm is supraventricular. Wide QRS (>0.12 sec)? It could be ventricular, or supraventricular with BBB/aberration.\n\nStep 2 — Apply the full 5-step check: Regularity → Rate → P Waves → PR Interval → QRS Duration.\n\nStep 3 — Assess the P wave. Present and upright? Sinus origin. Absent, inverted, or buried? Junctional or ectopic. Multiple morphologies? WAP/MAT. Sawtooth? Flutter. Fibrillatory baseline? AF.\n\nStep 4 — Assess the P-QRS relationship. 1:1 (one P per QRS)? Normal conduction. More P waves than QRS? AV block. P waves and QRS independent? AV dissociation (third-degree block or VT).\n\nStep 5 — Integrate rate, regularity, and all above to name the rhythm. Apply clinical urgency.` },
      { title:"Approaching Ambiguous Strips", body:`Some strips resist easy classification. A disciplined approach prevents premature conclusions:\n\n1. Start with what you know. Name what you can: regular or irregular? Narrow or wide? Fast or slow? Any P waves visible?\n\n2. Measure before you interpret. Calipers (or dividers) are essential for precise R-R and P-P measurement. Eyeballing intervals leads to errors.\n\n3. Compare long rhythm strips. A 6-second strip may not show the pattern clearly. Longer strips reveal cyclical patterns (Wenckebach), intermittent events (NCPACs), or dissociation.\n\n4. Use multiple leads simultaneously. A P wave invisible in Lead II may be clear in V1 or aVR. Never interpret a rhythm from a single lead if alternatives are available.\n\n5. When still uncertain, describe what you see. A technician who accurately describes "wide QRS tachycardia at 180 bpm with no visible P waves" is more useful than one who guesses "VT" without the systematic observations supporting it.` },
      { title:"Common Diagnostic Traps", body:`The most frequently missed or misidentified rhythm scenarios:\n\n• NCPAC called AV block — check T waves for hidden early P waves before diagnosing any dropped beat.\n• Sinus tachycardia with rate-dependent BBB called VT — find the upright P waves before every wide QRS.\n• Low atrial or junctional rhythm misidentified — a P wave before a QRS (even inverted, even with short PR) can be atrial. Only P in/after QRS or absent P is definitively junctional.\n• 2:1 AV block typed as Mobitz II — you cannot type a 2:1 block without two consecutive conducted beats showing PR behavior. Report "high-grade AV block" and let the clinician determine further.\n• Artifact called VF — motion artifact produces chaotic waving that mimics VF. A conscious, moving patient cannot be in VF. Check the patient before acting on the strip.\n• TdP called standard VT — check QT on preceding beats and look for rotating QRS morphology. Treatment differs critically.` },
      { title:"Building Interpretation Speed", body:`Expert rhythm readers do not skip steps — they execute them faster. Speed comes from:\n\n1. Pattern recognition — after seeing hundreds of strips, the gestalt (overall visual pattern) registers immediately. But gestalt should trigger the five steps, not replace them.\n\n2. Organized scanning — train your eye to move in the same sequence every time: baseline → P waves → QRS morphology → intervals → regularity. Consistency prevents omissions.\n\n3. Naming aloud — saying the five steps and their values out loud (even internally) forces completion of each step before the next. Prevents skipping.\n\n4. Review errors actively — when you misidentify a rhythm, trace back through the five steps and find which step you skipped or misinterpreted. Most errors are step failures, not knowledge failures.` },
    ],
    quiz: [
      { q:"What should you assess FIRST on any ECG strip?", opts:["Heart rate","P wave morphology","QRS width (narrow vs. wide)","PR interval"], correct:2, exp:"QRS width is the primary branch in the rhythm classification tree. Narrow QRS → supraventricular origin. Wide QRS → ventricular or supraventricular with aberrant conduction. This single assessment immediately narrows the differential." },
      { q:"You see a P wave followed by no QRS. Before diagnosing AV block, you should:", opts:["Immediately call the physician","Check the preceding T wave for a hidden early P wave (NCPAC)","Measure the QRS width","Check the patient's blood pressure"], correct:1, exp:"A non-conducted PAC (NCPAC) can mimic AV block exactly. The NCPAC's P wave hides in the preceding T wave, deforming its contour. Always check for this before diagnosing second-degree block." },
      { q:"A wide QRS tachycardia at 180 bpm. The SAFEST clinical assumption is:", opts:["SVT with bundle branch block","Sinus tachycardia with aberrancy","Ventricular tachycardia until proven otherwise","Atrial flutter with 2:1 conduction"], correct:2, exp:"When in doubt with wide QRS tachycardia, treat as VT. Treating SVT-with-BBB as VT is safe. Treating VT as SVT (with calcium channel blockers, for example) can be fatal." },
      { q:"You cannot definitively classify a 2:1 AV block as Mobitz Type I or II because:", opts:["The PR interval is always prolonged in 2:1 block","You need two consecutive conducted beats to assess PR behavior — only one is visible per cycle","Mobitz II does not cause 2:1 conduction ratios","The QRS is always wide in 2:1 block"], correct:1, exp:"Mobitz I (Wenckebach) and Mobitz II are distinguished by PR behavior across consecutive conducted beats. In 2:1 block, only one P wave conducts per cycle — you cannot observe PR progression or constancy. Report 'high-grade AV block.'" },
    ],
  },
  12: {
    sections: [
      { title:"The Core Rule — Prelude vs. Sudden Onset", body:`The single most reliable rule in artifact recognition: real cardiac events have a prelude; artifact appears suddenly, out of nowhere.\n\nA real arrhythmia (VT, AF, flutter) develops — the baseline changes progressively, or there's a triggering event visible on the strip before the rhythm change. An artifact event appears instantaneously — one moment the strip is normal, the next it's chaotic, then it's instantly normal again. Real electrical events in the heart cannot start and stop that abruptly.\n\nSecond rule: always check the patient before acting on a strip. Artifact can be indistinguishable from VF on the ECG. A conscious, responsive, talking patient cannot be in VF. Assess the patient first, every time.` },
      { title:"60-Hz (AC) Interference", body:`60-Hz interference (also called AC artifact or powerline artifact) appears as a thick, fuzzy, regular-appearing baseline with evenly spaced, tiny oscillations at 60 per second. It is caused by electromagnetic interference from nearby electrical equipment, improperly grounded equipment, or poor electrode contact allowing electrical current to couple into the ECG leads.\n\nAppearance: the baseline thickens uniformly — the P waves, QRS complexes, and T waves may still be visible but appear embedded in the artifact. The 60-Hz oscillations are evenly spaced and very regular.\n\nSolution: check electrode placement and skin prep, ensure equipment is grounded, move interfering devices away from the patient.` },
      { title:"Motion & Muscle Artifact", body:`Motion artifact: produced by patient movement — repositioning, shivering, or seizure activity. Produces irregular, variable-amplitude waving on the baseline that mimics atrial fibrillation or, at higher amplitudes, ventricular fibrillation. Key distinction: motion artifact follows the movement — it starts and stops with the patient's motion, and the rhythm before and after is normal sinus.\n\nMuscle artifact (somatic tremor): produced by skeletal muscle electrical activity from tremors (Parkinson's disease, anxiety, shivering). Produces rapid, irregular oscillations superimposed on the ECG. Can mimic atrial flutter or fine VF.\n\nDistinction from real arrhythmias: artifact appears suddenly, ends suddenly, and the ECG is normal before and after. Real arrhythmias develop. Look for regular P-QRS-T complexes continuing through the apparent artifact — if you can see normal complexes underneath the chaos, it's artifact.` },
      { title:"Lead Misplacement & Technical Errors", body:`Limb lead reversal and misplacement produce characteristic ECG changes:\n\n• Right arm / Left arm reversal — Lead I inverts completely (inverted P and T waves, QRS may appear negative). Leads II and III swap. The most common electrode error.\n\n• Limb leads on chest / Chest leads on limbs — dramatic QRS and axis changes across multiple leads simultaneously.\n\nPoor electrode contact: produces wandering baseline (baseline drift) from poor skin contact, patient sweating, or dried gel. The baseline rises and falls slowly, obscuring waveforms.\n\nCommon recognition approach: if changes appear simultaneously across multiple leads with no clinical explanation, consider lead reversal or electrode error before diagnosing a new arrhythmia or conduction abnormality.` },
    ],
    quiz: [
      { q:"A strip shows sudden-onset chaotic waving with no recognizable QRS complexes. The patient is sitting up talking to a nurse. The FIRST action is:", opts:["Defibrillate immediately","Call a Code Blue","Assess the patient — a conscious patient cannot be in VF; this is likely artifact","Administer amiodarone"], correct:2, exp:"A conscious, responsive patient cannot be in ventricular fibrillation. The sudden onset, combined with patient consciousness, strongly indicates motion artifact or lead displacement. Always check the patient before acting on the strip." },
      { q:"60-Hz artifact is caused by:", opts:["Patient movement","Electromagnetic interference from electrical equipment","Poor contact between lead wires","Skeletal muscle tremor"], correct:1, exp:"60-Hz (AC) artifact results from electromagnetic coupling from nearby electrical equipment or poor equipment grounding into the ECG leads. It produces a uniformly thickened, fuzzy baseline at 60 oscillations per second." },
      { q:"What does motion artifact mimic on the ECG?", opts:["Sinus bradycardia","Normal sinus rhythm","Atrial fibrillation or ventricular fibrillation (depending on amplitude)","Third-degree AV block"], correct:2, exp:"Motion artifact produces irregular, variable-amplitude baseline oscillations. Low amplitude mimics AF; high amplitude can mimic VF. The sudden onset/offset and patient consciousness distinguish it from real arrhythmias." },
      { q:"Right arm / Left arm lead reversal is recognized by:", opts:["Widened QRS in all leads","Inverted Lead I with swapped Leads II and III","Loss of P waves in all leads","Sawtooth pattern in inferior leads"], correct:1, exp:"RA/LA reversal flips the polarity of Lead I (P and T waves invert, QRS may invert) and swaps Leads II and III. If Lead I shows inverted P waves with no clinical cause, check electrode placement first." },
    ],
  },
  13: {
    sections: [
      { title:"SBAR — The Communication Framework", body:`SBAR (Situation, Background, Assessment, Recommendation) is the standardized communication framework for reporting critical findings in clinical settings. Using SBAR ensures the receiving clinician gets organized, relevant information in a predictable format — reducing miscommunication that can delay treatment.\n\nSituation: "I'm calling about [patient name], bed [#]. The patient is showing [rhythm name] on the monitor."\n\nBackground: "The patient is a [age]-year-old with history of [relevant history], currently on [relevant medications]. Baseline rhythm was [prior rhythm]."\n\nAssessment: "Current strip shows [5-step findings: rate, regularity, P wave, PR, QRS]. The rhythm appears to be [description — use descriptive language if uncertain of exact name]."\n\nRecommendation: "I am requesting [physician evaluation / telemetry increase / STAT ECG / nurse assessment]."\n\nAs a technician, your Assessment uses descriptive, factual rhythm language — not a definitive clinical diagnosis. Reporting "wide QRS tachycardia at 180 bpm with AV dissociation" is appropriate. Declaring "the patient has ventricular tachycardia requiring defibrillation" oversteps the technician role.` },
      { title:"Escalation — When and How", body:`Escalation protocols vary by institution, but the general principle is consistent: any rhythm change that could indicate hemodynamic compromise requires immediate notification.\n\nEscalation triggers:\n• New ventricular tachycardia or fibrillation (any duration)\n• New complete AV block or high-grade AV block\n• Sustained SVT (AVNRT, AVRT, atrial flutter with fast ventricular response)\n• New AF in a patient not known to have AF\n• Pacemaker failure of any type\n• Asystole or rate <30 bpm\n• Any rhythm change accompanied by patient symptoms (chest pain, shortness of breath, altered consciousness)\n\nEscalation path: nurse → charge nurse → physician → rapid response team (per institutional protocol). Document every communication: time, person contacted, information given, response received.` },
      { title:"HIPAA in Cardiac Monitoring", body:`The Health Insurance Portability and Accountability Act (HIPAA) applies to every aspect of cardiac monitoring work:\n\n• ECG strips are Protected Health Information (PHI). They carry patient identity through demographics printed on the strip or embedded in the file. Treat every strip as confidential.\n\n• Proper disposal: paper strips must be shredded, not placed in regular trash. Electronic records must be deleted per institutional policy.\n\n• Screen privacy: monitor screens visible to passersby in hallways or common areas should be positioned to limit viewing, or screensavers should activate promptly.\n\n• Verbal reporting: do not discuss patient rhythm findings in public areas (elevators, cafeterias, hallways). Use private spaces for phone or verbal communications.\n\n• Documentation: all rhythm interpretations and notifications should be documented in the patient's medical record. Undocumented communication did not legally happen.` },
      { title:"Patient Care During Monitoring", body:`Rhythm interpretation does not occur in isolation — the patient is attached to the equipment and depends on the technician's attention:\n\n• Electrode placement and skin prep: proper skin preparation (shaving, cleaning, abrading) is the foundation of a good signal. Poor prep causes artifact; artifact causes misinterpretation.\n\n• Patient education: patients on telemetry often feel anxious about "being watched." Brief, reassuring explanation of monitoring purpose and what to expect reduces anxiety and improves compliance with lead precautions.\n\n• Responding to alarms: alarm fatigue is a documented patient safety problem. Every alarm warrants response — either addressing the cause or silencing a false alarm after verifying the patient is stable. Never routinely silence alarms without looking at the strip.\n\n• Recognizing the limits of your role: rhythm interpretation is a clinical skill used to support patient care, not to replace clinical assessment. Report findings promptly and accurately. Let the clinical team make treatment decisions.` },
    ],
    quiz: [
      { q:"In SBAR communication, the Assessment component should include:", opts:["Your treatment recommendation","The five-step rhythm findings described factually","A definitive clinical diagnosis","Only the heart rate and rhythm name"], correct:1, exp:"In your Assessment, report factual rhythm observations using the 5-step framework: rate, regularity, P wave findings, PR interval, QRS duration, and a descriptive interpretation. Factual description is within the technician role; clinical diagnosis is not." },
      { q:"An ECG strip left face-up on a nursing station desk is a:", opts:["Normal clinical workflow","HIPAA violation — ECG strips are Protected Health Information","Acceptable if the patient's name is covered","Required for documentation purposes"], correct:1, exp:"ECG strips contain Protected Health Information (PHI). Leaving them visible in public or semi-public areas violates HIPAA. All PHI must be handled, stored, and disposed of per institutional privacy policy." },
      { q:"A new strip shows complete AV block in a patient who had NSR one hour ago. You should:", opts:["Wait for the next scheduled check-in with the nurse","Document it and check again in 30 minutes","Immediately escalate to the nursing staff using SBAR","Apply the defibrillator pads yourself"], correct:2, exp:"New complete (third-degree) AV block is a medical emergency — it can cause severe hemodynamic compromise and may require emergency pacing. Immediate escalation via SBAR is required. This is not a watchful-waiting situation." },
      { q:"Which of the following is an appropriate escalation trigger for a monitoring technician?", opts:["Sinus arrhythmia in a teenager","NSR with a first-degree AV block (known, unchanged)","New ventricular tachycardia of any duration","Sinus bradycardia at 58 bpm in a sleeping adult"], correct:2, exp:"Any new ventricular tachycardia — even brief, self-terminating runs — requires immediate notification. VT can degenerate into VF without warning, and the treating team needs to know it occurred." },
    ],
  },
  14: {
    sections: [
      { title:"Exam Format & Strategy", body:`This final module contains a full-length CRAT-style practice examination. The real CRAT exam tests your ability to identify and interpret cardiac rhythms accurately, understand ECG measurement, and apply clinical knowledge about arrhythmia significance.\n\nExam strategy:\n• Apply the 5-step rhythm check to every question — do not guess from gestalt alone.\n• For strip interpretation questions: regularity and QRS width first, then P waves, then PR, then classify.\n• For clinical significance questions: know the urgency level of each rhythm family.\n• Eliminate clearly wrong answers first — in a 4-option question, eliminating two often makes the correct answer obvious.\n• Read answer explanations for every question you miss — and every question you get right. The explanation teaches the reasoning, not just the answer.\n\nTarget score: 80% or higher on first attempt. Score below 80%? Identify which chapters your missed questions came from, review those chapters, then retest in 2 weeks.` },
      { title:"Key Facts to Know Cold", body:`These are the numbers and definitions that appear most frequently on CRAT-style exams:\n\nNormal values:\n• NSR rate: 60–100 bpm | PR interval: 0.12–0.20 sec | QRS duration: 0.06–0.12 sec\n• ECG paper: small box = 0.04 sec, large box = 0.20 sec\n\nEscape pacemaker rates:\n• AV junction: 40–60 bpm | Ventricles: 20–40 bpm\n\nCritical rhythm distinctions:\n• Sinus exit block gap = exact multiple of R-R | Sinus pause gap = NOT a multiple\n• Sinus arrest gap >2.0 sec, may not restart\n• Mobitz I: PR lengthens before drop | Mobitz II: PR constant before drop\n• Complete (3rd degree) AV block: P waves and QRS completely independent\n• AVNRT: P buried in QRS | Orthodromic AVRT: P after QRS in ST segment\n• WPW: short PR + delta wave | Danger: AF + WPW → AV nodal blockers contraindicated\n• Compensatory pause (PVC): PVC + pause = 2× R-R\n• Failure to capture: spike present, no P or QRS | Failure to pace: no spike when expected\n• Failure to sense: spike fires too soon after intrinsic beat` },
      { title:"Rhythm Classification Quick Reference", body:`Use this table for final review — classify each rhythm by the five steps:\n\nSinus Tachycardia: Regular | >100 bpm | Upright P before QRS | Normal PR | Narrow QRS\nSinus Bradycardia: Regular | <60 bpm | Upright P before QRS | Normal PR | Narrow QRS\nAtrial Fibrillation: Irregularly irregular | Variable | No P waves (fibrillatory) | None | Narrow QRS\nAtrial Flutter: Regular or irregular | Variable ventricular | Sawtooth flutter waves | Not measurable | Narrow QRS\nJunctional Rhythm: Regular | 40–60 bpm | Inverted/absent/buried P | Short/none | Narrow QRS\nVentricular Tachycardia: Regular | ≥101 bpm | Absent or dissociated P | None | Wide QRS >0.12\nFirst-Degree AV Block: Regular | Normal | Upright P before QRS | >0.20 sec | Narrow QRS\nMobitz I: Irregular (grouped) | Normal | Upright P, some non-conducted | Lengthening then drop | Narrow QRS\nMobitz II: Irregular (sudden drop) | Normal | Upright P, some non-conducted | Constant | Narrow or Wide QRS\nThird-Degree: Regular (escape) | Escape rate | P waves and QRS dissociated | None | Narrow or Wide QRS` },
      { title:"CRAT Exam Day Checklist", body:`The week before your exam:\n• Complete at least one full timed practice run through the Chapter 14 quiz\n• Review every chapter quiz you scored below 80% on\n• Focus extra attention on AV blocks, pacemaker failures, and the AVNRT/AVRT distinction — consistently high-frequency exam topics\n• Practice the 5-step check on fresh strips until the sequence is automatic\n\nExam day:\n• Arrive early; review eligibility requirements at cci-online.org\n• Bring required identification documents\n• Read every question twice before selecting an answer\n• Apply the 5-step check even when the rhythm looks immediately obvious — confirmation prevents careless errors\n• Flag uncertain questions and return to them; don't spend excess time on a single question\n\nAfter the exam:\n• Results are typically available immediately or shortly after completion\n• If you need to retest: wait the required interval, review weak areas, retake` },
    ],
    quiz: [
      { q:"A strip shows regular rhythm at 180 bpm, wide QRS, and P waves marching independently of QRS complexes. The rhythm is:", opts:["Sinus tachycardia with bundle branch block","Atrial flutter with 2:1 block","Ventricular tachycardia","Accelerated junctional rhythm"], correct:2, exp:"Wide QRS tachycardia with AV dissociation (P waves and QRS marching independently) is ventricular tachycardia until proven otherwise. AV dissociation is a defining feature of VT and differentiates it from SVT with BBB (which has P waves tracking the QRS)." },
      { q:"A strip shows: rate 75 bpm, regular, P waves inverted and occurring after each QRS. PR interval cannot be measured. QRS narrow. Rhythm is:", opts:["Sinus rhythm with first-degree AV block","Ectopic atrial rhythm","Accelerated junctional rhythm","Orthodromic AVRT"], correct:2, exp:"Inverted P waves occurring after each QRS, narrow QRS, rate 61–99 bpm = accelerated junctional rhythm. The AV node is the pacemaker (inverted P, no true PR), firing at a rate faster than its normal 40–60 bpm backup rate." },
      { q:"A pacing spike appears at the expected time but no P wave or QRS follows. The width of subsequent intrinsic QRS is normal. This represents:", opts:["Failure to pace","Failure to capture","Failure to sense","Normal demand pacing"], correct:1, exp:"A visible spike with no following P wave or QRS = failure to capture. The device fired, but the myocardium didn't respond. The subsequent normal QRS confirms intrinsic beats are present — the pacemaker simply failed to trigger a response when it fired." },
      { q:"WPW during atrial fibrillation is treated with:", opts:["Adenosine","Verapamil or diltiazem","Metoprolol","Procainamide or electrical cardioversion"], correct:3, exp:"AV nodal blocking drugs (adenosine, verapamil, diltiazem, digoxin, beta-blockers) are contraindicated in WPW with AF — they block the AV node but can paradoxically accelerate conduction through the AP, increasing ventricular rate to dangerous levels. Procainamide or electrical cardioversion is the treatment." },
      { q:"Which rhythm has both an irregularly irregular ventricular rate AND discrete P waves before each QRS?", opts:["Atrial fibrillation","Multifocal atrial tachycardia (MAT)","Atrial flutter with variable block","Wandering atrial pacemaker at 120 bpm"], correct:1, exp:"MAT is irregularly irregular (like AF) but has distinct P waves before each QRS — at least 3 different P wave morphologies. AF has no true P waves. Recognizing this distinction is critical because MAT treatment targets the underlying pulmonary disease, not the rhythm itself." },
    ],
  },
};

// ─── STORAGE HELPERS ────────────────────────────────────────────────────────
const SK = { user:"pc:user", enrolled:"pc:enrolled", progress:"pc:progress", users:"pc:users" };

async function stGet(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function stSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ─── ICON COMPONENTS ────────────────────────────────────────────────────────
const Icon = {
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C8.676 1 6 3.676 6 7v2H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V10a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z"/></svg>,
  Check: ({sz=14}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronR: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronL: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Star: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Trophy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="18" width="12" height="4"/></svg>,
};

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#080c14;color:#e8edf5;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:rgba(255,255,255,0.02);}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px;}
.btn-p{background:linear-gradient(135deg,#00d4ff,#0099cc);color:#080c14;border:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s;font-family:inherit;letter-spacing:.01em;}
.btn-p:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,212,255,.25);}
.btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-s{background:transparent;color:#7a8a9a;border:1px solid rgba(255,255,255,.1);padding:12px 24px;border-radius:10px;font-weight:500;font-size:14px;cursor:pointer;transition:all .2s;font-family:inherit;}
.btn-s:hover{border-color:rgba(255,255,255,.25);color:#e8edf5;}
.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:#0d1420;border:1px solid rgba(255,255,255,.1);border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;}
.input{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 16px;color:#e8edf5;font-size:14px;width:100%;font-family:inherit;outline:none;transition:border .2s;}
.input:focus{border-color:#00d4ff;}
.input::placeholder{color:#3a4a5a;}
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
`;

// ─── PROGRESS RING ───────────────────────────────────────────────────────────
function ProgressRing({ pct, size=80, stroke=6, color="#00d4ff", label="" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset .6s ease" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:size*.22, fontWeight:700, color, fontFamily:"'Space Grotesk', sans-serif" }}>{pct}%</span>
        {label && <span style={{ fontSize:9, color:"#3a4a5a", marginTop:1 }}>{label}</span>}
      </div>
    </div>
  );
}

// ─── CHAPTER CARD ────────────────────────────────────────────────────────────
function ChapterCard({ ch, status, score, onClick, compact=false }) {
  const isFree = ch.free;
  const isExam = ch.id === 14;
  const tagColor = isFree ? "#00d4ff" : isExam ? "#f59e0b" : "#a855f7";
  const bgTag = isFree ? "rgba(0,212,255,.08)" : isExam ? "rgba(245,158,11,.06)" : "rgba(168,85,247,.06)";

  const statusBadge = status === "completed"
    ? { label:"Completed", color:"#00d4ff", bg:"rgba(0,212,255,.1)" }
    : status === "in-progress"
    ? { label:"In Progress", color:"#f59e0b", bg:"rgba(245,158,11,.1)" }
    : null;

  return (
    <div className="card" onClick={onClick}
      style={{ padding: compact ? 16 : 24, cursor:"pointer", transition:"all .22s", position:"relative", overflow:"hidden",
        borderColor: status === "completed" ? "rgba(0,212,255,.2)" : status === "in-progress" ? "rgba(245,158,11,.15)" : "rgba(255,255,255,.07)",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${tagColor}44`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = status==="completed" ? "rgba(0,212,255,.2)" : status==="in-progress" ? "rgba(245,158,11,.15)" : "rgba(255,255,255,.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background: status==="completed" ? tagColor : "transparent", transition:"background .3s" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:compact?10:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:compact?36:40, height:compact?36:40, borderRadius:10, background:bgTag, border:`1px solid ${tagColor}33`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:compact?16:18, flexShrink:0 }}>{ch.icon}</div>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:tagColor, fontWeight:500, letterSpacing:".1em" }}>MODULE {ch.num}</div>
            <div style={{ fontSize:10, color:"#3a4a5a", marginTop:2 }}>⏱ {ch.dur}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", justifyContent:"flex-end" }}>
          {statusBadge && <span style={{ background:statusBadge.bg, color:statusBadge.color, fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>{statusBadge.label}</span>}
          {isFree ? <span className="tag-free">Free</span> : isExam ? <span className="tag-exam">Exam</span> : status ? null : <span style={{ color:"#2a3a4a" }}><Icon.Lock/></span>}
        </div>
      </div>
      <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:compact?14:16, fontWeight:600, color: status ? "#e8edf5" : isFree ? "#e8edf5" : "#6a7a8a", marginBottom:3, letterSpacing:"-.01em" }}>{ch.title}</h3>
      <div style={{ fontSize:11, color:tagColor, marginBottom:compact?0:10, fontWeight:500 }}>{ch.sub}</div>
      {!compact && score !== null && score !== undefined && (
        <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6 }}>
          <Icon.Star/><span style={{ fontSize:12, color:"#5a6a7a" }}>Quiz score: </span>
          <span style={{ fontSize:12, fontWeight:600, color: score>=80 ? "#00d4ff" : score>=60 ? "#f59e0b" : "#f87171" }}>{score}%</span>
        </div>
      )}
    </div>
  );
}

// ─── AUTH MODAL ──────────────────────────────────────────────────────────────
function AuthModal({ onClose, onSuccess, initMode="signup" }) {
  const [mode, setMode] = useState(initMode);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); if (!email || !pass || (mode==="signup" && !name)) { setErr("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr("Enter a valid email address."); return; }
    if (pass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const users = (await stGet(SK.users)) || [];
    if (mode === "signup") {
      if (users.find(u => u.email === email)) { setErr("An account with this email already exists."); setLoading(false); return; }
      const user = { name: name.trim(), email: email.toLowerCase().trim() };
      await stSet(SK.users, [...users, { ...user, pass }]);
      await stSet(SK.user, user);
      onSuccess(user);
    } else {
      const found = users.find(u => u.email === email.toLowerCase().trim() && u.pass === pass);
      if (!found) { setErr("Email or password incorrect."); setLoading(false); return; }
      const user = { name: found.name, email: found.email };
      await stSet(SK.user, user);
      onSuccess(user);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal su" style={{ maxWidth:420 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:"28px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#e8edf5" }}>
            {mode==="signup" ? "Create Your Account" : "Welcome Back"}
          </div>
          <button className="btn-s" style={{ padding:"6px 10px", border:"none" }} onClick={onClose}><Icon.X/></button>
        </div>
        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,.07)", marginTop:20, padding:"0 28px" }}>
          {["signup","login"].map(m => <button key={m} className={`tab ${mode===m?"active":""}`} onClick={() => { setMode(m); setErr(""); }}>{m==="signup"?"Sign Up":"Log In"}</button>)}
        </div>
        <div style={{ padding:28 }}>
          {mode==="signup" && (
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>Full Name</label>
              <input className="input" placeholder="Jane Smith" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
          )}
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>Email</label>
            <input className="input" type="email" placeholder="jane@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div style={{ marginBottom: err ? 14 : 22 }}>
            <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>Password</label>
            <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          {err && <div style={{ fontSize:13, color:"#f87171", marginBottom:16, padding:"10px 14px", background:"rgba(248,113,113,.08)", border:"1px solid rgba(248,113,113,.2)", borderRadius:8 }}>{err}</div>}
          <button className="btn-p" style={{ width:"100%", padding:14 }} onClick={submit} disabled={loading}>
            {loading ? <span style={{ display:"inline-block", width:16, height:16, border:"2px solid #080c14", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .7s linear infinite" }}/> : mode==="signup" ? "Create Account" : "Log In"}
          </button>
          <p style={{ fontSize:12, color:"#2a3a4a", textAlign:"center", marginTop:14 }}>
            {mode==="signup" ? "Already have an account? " : "Don't have an account? "}
            <span style={{ color:"#00d4ff", cursor:"pointer", fontWeight:500 }} onClick={()=>{setMode(mode==="signup"?"login":"signup");setErr("");}}>
              {mode==="signup" ? "Log In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PAYWALL / STRIPE MODAL ──────────────────────────────────────────────────
function PaywallModal({ user, onClose, onSuccess, onNeedAuth }) {
  const [plan, setPlan] = useState("full");
  const [step, setStep] = useState("pricing"); // pricing | card | processing | success
  const [card, setCard] = useState({ num:"", exp:"", cvc:"", name:"" });
  const [err, setErr] = useState("");

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const pay = async () => {
    setErr("");
    const rawNum = card.num.replace(/\s/g,"");
    if (rawNum.length < 16) { setErr("Enter a valid 16-digit card number."); return; }
    if (card.exp.length < 5) { setErr("Enter a valid expiry date (MM/YY)."); return; }
    if (card.cvc.length < 3) { setErr("Enter a valid CVC."); return; }
    if (!card.name.trim()) { setErr("Enter the name on your card."); return; }
    setStep("processing");
    await new Promise(r => setTimeout(r, 2200));
    setStep("success");
    await stSet(SK.enrolled, true);
    setTimeout(() => onSuccess(), 1400);
  };

  const price = plan==="full" ? "$79" : "$19/mo";

  if (step === "processing") return (
    <div className="modal-bg">
      <div className="modal su" style={{ maxWidth:360, padding:48, textAlign:"center" }}>
        <div style={{ width:56, height:56, border:"3px solid rgba(0,212,255,.2)", borderTopColor:"#00d4ff", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 24px" }}/>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600, color:"#e8edf5", marginBottom:8 }}>Processing Payment</div>
        <div style={{ fontSize:13, color:"#4a5a6a" }}>Securely charging {price}…</div>
      </div>
    </div>
  );

  if (step === "success") return (
    <div className="modal-bg">
      <div className="modal su" style={{ maxWidth:360, padding:48, textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(0,212,255,.1)", border:"2px solid #00d4ff", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
          <Icon.Check sz={28}/>
        </div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#e8edf5", marginBottom:8 }}>You're Enrolled!</div>
        <div style={{ fontSize:14, color:"#4a5a6a" }}>All 14 modules are now unlocked. Redirecting to your dashboard…</div>
      </div>
    </div>
  );

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal su" onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"28px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#e8edf5" }}>
              {step==="pricing" ? "Unlock Full Course" : "Secure Checkout"}
            </div>
            {step==="card" && <div style={{ fontSize:12, color:"#4a5a6a", marginTop:4 }}>PulseCode · {price} · {plan==="full"?"One-time":"Monthly"}</div>}
          </div>
          <button className="btn-s" style={{ padding:"6px 10px", border:"none" }} onClick={onClose}><Icon.X/></button>
        </div>

        {step === "pricing" && (
          <div style={{ padding:28 }}>
            {!user && (
              <div style={{ padding:14, background:"rgba(0,212,255,.05)", border:"1px solid rgba(0,212,255,.15)", borderRadius:12, marginBottom:20 }}>
                <div style={{ fontSize:13, color:"#7a9daa", marginBottom:8 }}>You'll need an account to enroll.</div>
                <button className="btn-p" style={{ padding:"8px 16px", fontSize:13 }} onClick={onNeedAuth}>Create Free Account →</button>
              </div>
            )}
            {[
              { id:"full", label:"Full Course Access", price:"$79", detail:"All 14 modules · CRAT practice exam · Lifetime access", badge:"BEST VALUE" },
              { id:"monthly", label:"Monthly Access", price:"$19/mo", detail:"Full course access · Cancel anytime", badge:null },
            ].map(p => (
              <div key={p.id} onClick={()=>setPlan(p.id)}
                style={{ border:`2px solid ${plan===p.id?"#00d4ff":"rgba(255,255,255,.08)"}`, borderRadius:14, padding:18, cursor:"pointer",
                  background:plan===p.id?"rgba(0,212,255,.04)":"transparent", transition:"all .2s", marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontWeight:600, color:"#e8edf5", fontSize:15 }}>{p.label}</span>
                      {p.badge && <span style={{ background:"rgba(0,212,255,.15)", color:"#00d4ff", fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>{p.badge}</span>}
                    </div>
                    <div style={{ fontSize:12, color:"#4a5a6a" }}>{p.detail}</div>
                  </div>
                  <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, color:plan===p.id?"#00d4ff":"#4a5a6a" }}>{p.price}</div>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
              {["Modules 3–14 unlocked instantly","CRAT practice exam (100+ questions)","Detailed answer explanations","Lifetime access — study at your pace"].map(f => (
                <div key={f} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13, color:"#5a6a7a" }}>
                  <span style={{ color:"#00d4ff" }}><Icon.Check/></span>{f}
                </div>
              ))}
            </div>
            <button className="btn-p" style={{ width:"100%", padding:14, fontSize:15 }}
              onClick={() => { if (!user) { onNeedAuth(); } else { setStep("card"); } }}>
              Continue to Payment → {price}
            </button>
            <p style={{ fontSize:11, color:"#2a3a4a", textAlign:"center", marginTop:10 }}>30-day money-back guarantee · SSL encrypted</p>
          </div>
        )}

        {step === "card" && (
          <div style={{ padding:28 }}>
            <div style={{ padding:14, background:"rgba(0,212,255,.04)", border:"1px solid rgba(0,212,255,.1)", borderRadius:10, marginBottom:20, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, color:"#5a7a8a" }}>Enrolled as {user?.email}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#00d4ff" }}>{price}</span>
            </div>
            {[
              { label:"Card Number", key:"num", placeholder:"1234 5678 9012 3456", fmt:fmtCard, maxLen:19, type:"tel" },
              { label:"Name on Card", key:"name", placeholder:"Jane Smith", fmt:v=>v, maxLen:60, type:"text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>{f.label}</label>
                <input className="input" type={f.type} placeholder={f.placeholder} value={card[f.key]} maxLength={f.maxLen}
                  onChange={e=>setCard(c=>({...c,[f.key]:f.fmt(e.target.value)}))}/>
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom: err ? 14 : 22 }}>
              <div>
                <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>Expiry Date</label>
                <input className="input" type="tel" placeholder="MM/YY" value={card.exp} maxLength={5}
                  onChange={e=>setCard(c=>({...c,exp:fmtExp(e.target.value)}))}/>
              </div>
              <div>
                <label style={{ fontSize:12, color:"#4a5a6a", fontWeight:500, display:"block", marginBottom:6 }}>CVC</label>
                <input className="input" type="tel" placeholder="123" value={card.cvc} maxLength={4}
                  onChange={e=>setCard(c=>({...c,cvc:e.target.value.replace(/\D/g,"").slice(0,4)}))}/>
              </div>
            </div>
            {err && <div style={{ fontSize:13, color:"#f87171", marginBottom:16, padding:"10px 14px", background:"rgba(248,113,113,.08)", border:"1px solid rgba(248,113,113,.2)", borderRadius:8 }}>{err}</div>}
            <button className="btn-p" style={{ width:"100%", padding:14, fontSize:15 }} onClick={pay}>
              🔒 Pay {price} Securely
            </button>
            <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:14 }}>
              {["VISA","MC","AMEX","DISC"].map(b=><span key={b} style={{ fontSize:10, color:"#2a3a4a", fontWeight:600, letterSpacing:".05em" }}>{b}</span>)}
            </div>
            <p style={{ fontSize:11, color:"#1a2a3a", textAlign:"center", marginTop:8 }}>
              256-bit SSL encryption · 30-day money-back guarantee
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NAV BAR ─────────────────────────────────────────────────────────────────
function Nav({ user, enrolled, screen, onGoLanding, onGoDash, onLogin, onEnroll, onLogout }) {
  return (
    <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,12,20,.95)", backdropFilter:"blur(14px)",
      borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 28px", display:"flex", alignItems:"center",
      justifyContent:"space-between", height:62 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={onGoLanding}>
        <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#00d4ff,#0060aa)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
        <div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:16, letterSpacing:"-.02em", color:"#e8edf5", lineHeight:1 }}>PulseCode</div>
          <div style={{ fontSize:9, color:"#3a4a5a", letterSpacing:".1em", textTransform:"uppercase" }}>ECG Mastery</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        {user ? (
          <>
            {enrolled && (
              <button className="btn-s" style={{ padding:"8px 14px", display:"flex", gap:6, alignItems:"center", fontSize:13 }} onClick={onGoDash}>
                <Icon.Dashboard/> Dashboard
              </button>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:"rgba(0,212,255,.1)", border:"1px solid rgba(0,212,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#00d4ff", fontSize:12 }}>
                {user.name[0].toUpperCase()}
              </div>
              <div style={{ display:"flex", flexDirection:"column" }}>
                <span style={{ fontSize:12, color:"#c0ccda", fontWeight:500 }}>{user.name.split(" ")[0]}</span>
                <span style={{ fontSize:10, color:"#3a4a5a", cursor:"pointer" }} onClick={onLogout}>Log out</span>
              </div>
            </div>
            {!enrolled && <button className="btn-p" style={{ padding:"9px 18px", fontSize:13 }} onClick={onEnroll}>Enroll Now</button>}
          </>
        ) : (
          <>
            <button className="btn-s" style={{ padding:"9px 16px", fontSize:13 }} onClick={onLogin}>Log In</button>
            <button className="btn-p" style={{ padding:"9px 18px", fontSize:13 }} onClick={onEnroll}>Enroll — $79</button>
          </>
        )}
      </div>
    </nav>
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
    const score = Math.round((answers.filter((a,i)=>a===questions[i].correct).length / questions.length) * 100);
    const passed = score >= 80;
    return (
      <div style={{ textAlign:"center", padding:"32px 0" }} className="su">
        <div style={{ width:80, height:80, borderRadius:"50%", background: passed ? "rgba(0,212,255,.1)" : "rgba(248,113,113,.1)",
          border:`2px solid ${passed?"#00d4ff":"#f87171"}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:32 }}>
          {passed ? "🎯" : "📖"}
        </div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color: passed?"#00d4ff":"#f59e0b", marginBottom:8 }}>{score}%</div>
        <div style={{ fontSize:15, color:"#6a7d90", marginBottom:24 }}>
          {passed ? "Great work! You've mastered this module." : "Review the sections above and try again."}
        </div>
        <div style={{ display:"flex", gap:8, flexDirection:"column", maxWidth:280, margin:"0 auto" }}>
          {questions.map((q, i) => (
            <div key={i} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13, color: answers[i]===q.correct?"#00d4ff":"#f87171" }}>
              {answers[i]===q.correct ? <Icon.Check/> : "✗"} Q{i+1}: {answers[i]===q.correct ? "Correct" : `Missed (ans: ${String.fromCharCode(65+q.correct)})`}
            </div>
          ))}
        </div>
        <button className="btn-p" style={{ marginTop:24, padding:"12px 28px" }} onClick={()=>onComplete(score)}>
          Save Score & Continue
        </button>
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
          {questions.map((_,i) => <div key={i} style={{ width:24, height:4, borderRadius:2, background: i<idx?"#00d4ff":i===idx?"rgba(0,212,255,.4)":"rgba(255,255,255,.06)" }}/>)}
        </div>
      </div>
      <div style={{ fontSize:16, color:"#c0ccda", lineHeight:1.65, marginBottom:24, fontWeight:500 }}>{q.q}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {q.opts.map((opt, i) => {
          const isSelected = selected===i;
          const isCorrect = revealed && i===q.correct;
          const isWrong = revealed && isSelected && i!==q.correct;
          return (
            <div key={i} onClick={()=>{ if(!revealed){ setSelected(i); } }}
              style={{ padding:"14px 18px", borderRadius:12, border:`1px solid ${isCorrect?"#00d4ff":isWrong?"#f87171":isSelected?"rgba(0,212,255,.4)":"rgba(255,255,255,.07)"}`,
                background:isCorrect?"rgba(0,212,255,.07)":isWrong?"rgba(248,113,113,.07)":isSelected?"rgba(0,212,255,.04)":"rgba(255,255,255,.02)",
                cursor:revealed?"default":"pointer", transition:"all .18s", display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ width:22, height:22, borderRadius:6, background:isCorrect?"#00d4ff":isWrong?"#f87171":isSelected?"rgba(0,212,255,.2)":"rgba(255,255,255,.06)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                color:isCorrect?"#080c14":isWrong?"#080c14":isSelected?"#00d4ff":"#3a4a5a", flexShrink:0 }}>
                {String.fromCharCode(65+i)}
              </span>
              <span style={{ fontSize:14, color:isCorrect?"#e8edf5":isWrong?"#f87171":isSelected?"#c0ccda":"#5a6a7a" }}>{opt}</span>
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
        {!revealed && selected!==null && (
          <button className="btn-s" style={{ padding:"10px 20px" }} onClick={()=>setRevealed(true)}>Check Answer</button>
        )}
        {(revealed || selected===null) && (
          <button className="btn-p" style={{ padding:"10px 24px" }} onClick={handleNext} disabled={selected===null}>
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CHAPTER READER ──────────────────────────────────────────────────────────
function ChapterReader({ ch, enrolled, progress, onBack, onSaveProgress }) {
  const [tab, setTab] = useState("overview");
  const [sectionIdx, setSectionIdx] = useState(0);
  const content = CONTENT[ch.id];
  const sections = content?.sections || [];
  const questions = content?.quiz || [];
  const prog = progress[ch.id] || {};

  const markComplete = async () => {
    const updated = { ...progress[ch.id], visited:true, completed:true };
    onSaveProgress(ch.id, updated);
  };

  const handleQuizComplete = async (score) => {
    const updated = { ...progress[ch.id], visited:true, quizScore:score, completed:score>=60 };
    onSaveProgress(ch.id, updated);
    setTab("overview");
  };

  const canAccess = ch.free || enrolled;

  return (
    <div style={{ maxWidth:820, margin:"0 auto", padding:"36px 28px 80px" }}>
      {/* Back */}
      <button className="btn-s" style={{ padding:"8px 14px", display:"flex", gap:6, alignItems:"center", fontSize:13, marginBottom:28 }} onClick={onBack}>
        <Icon.ChevronL/> Back
      </button>

      {/* Header */}
      <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:28 }}>
        <div style={{ width:56, height:56, borderRadius:14, background:`rgba(${ch.free?"0,212,255":ch.id===14?"245,158,11":"168,85,247"},.08)`,
          border:`1px solid rgba(${ch.free?"0,212,255":ch.id===14?"245,158,11":"168,85,247"},.2)`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{ch.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:ch.free?"#00d4ff":ch.id===14?"#f59e0b":"#a855f7", fontWeight:500, letterSpacing:".1em" }}>MODULE {ch.num}</span>
            <span style={{ fontSize:11, color:"#2a3a4a" }}>⏱ {ch.dur}</span>
            {prog.completed && <span style={{ background:"rgba(0,212,255,.1)", color:"#00d4ff", fontSize:10, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>✓ Completed</span>}
          </div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:700, color:"#e8edf5", letterSpacing:"-.02em", marginBottom:4 }}>{ch.title}</h1>
          <div style={{ fontSize:13, color:ch.free?"#00d4ff":ch.id===14?"#f59e0b":"#a855f7" }}>{ch.sub}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:"1px solid rgba(255,255,255,.07)", marginBottom:32, display:"flex" }}>
        {["overview","content","quiz"].map(t=>(
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)} {t==="quiz" && prog.quizScore!=null && `(${prog.quizScore}%)`}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="su">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:32 }}>
            {[
              { label:"Duration", val:ch.dur, icon:"⏱" },
              { label:"Sections", val:`${sections.length} sections`, icon:"📖" },
              { label:"Quiz Questions", val:`${questions.length} questions`, icon:"✏️" },
              { label:"Quiz Score", val: prog.quizScore!=null ? `${prog.quizScore}%` : "Not taken", icon:"🎯" },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding:16 }}>
                <div style={{ fontSize:18, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:11, color:"#3a4a5a", fontWeight:500, textTransform:"uppercase", letterSpacing:".08em" }}>{s.label}</div>
                <div style={{ fontSize:16, fontWeight:600, color:"#c0ccda", marginTop:4 }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
            {sections.map((s,i)=>(
              <div key={i} className="card" style={{ padding:18, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }}
                onClick={()=>{setTab("content");setSectionIdx(i);}}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(0,212,255,.06)", border:"1px solid rgba(0,212,255,.12)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#00d4ff", flexShrink:0 }}>{i+1}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:"#c0ccda" }}>{s.title}</div>
                </div>
                <div style={{ marginLeft:"auto", color:"#2a3a4a" }}><Icon.ChevronR/></div>
              </div>
            ))}
          </div>
          {canAccess && !prog.completed && (
            <button className="btn-p" style={{ padding:"12px 28px" }} onClick={markComplete}>Mark as Complete ✓</button>
          )}
        </div>
      )}

      {tab === "content" && (
        <div className="su">
          {!canAccess ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:600, color:"#c0ccda", marginBottom:8 }}>Premium Content</div>
              <p style={{ color:"#4a5a6a", marginBottom:24 }}>Enroll to access all module content and quizzes.</p>
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
                {sections[sectionIdx].body.split("\n\n").map((para, i) => (
                  <div key={i} style={{ marginBottom:20 }}>
                    {para.trim().startsWith("•") ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {para.split("\n").map((line,j)=>(
                          <div key={j} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                            {line.startsWith("•") && <span style={{ color:"#00d4ff", marginTop:3, flexShrink:0 }}>•</span>}
                            <p style={{ fontSize:15, color:line.startsWith("•")?"#6a7d90":"#5a6a7a", lineHeight:1.75 }}>{line.replace(/^•\s*/,"")}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize:15, color:"#6a7d90", lineHeight:1.8 }}>{para}</p>
                    )}
                  </div>
                ))}
                <div style={{ display:"flex", gap:12, marginTop:32 }}>
                  {sectionIdx > 0 && <button className="btn-s" style={{ padding:"10px 18px" }} onClick={()=>setSectionIdx(i=>i-1)}>← Previous</button>}
                  {sectionIdx < sections.length-1
                    ? <button className="btn-p" style={{ padding:"10px 18px" }} onClick={()=>setSectionIdx(i=>i+1)}>Next Section →</button>
                    : <button className="btn-p" style={{ padding:"10px 18px" }} onClick={()=>{setTab("quiz");setSectionIdx(0);}}>Take the Quiz →</button>}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "quiz" && (
        <div className="su">
          {!canAccess ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:600, color:"#c0ccda", marginBottom:8 }}>Premium Quiz</div>
              <p style={{ color:"#4a5a6a" }}>Enroll to access interactive quizzes with explanations and score tracking.</p>
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
function Dashboard({ user, progress, onChapterClick }) {
  const total = CHAPTERS.length;
  const completed = CHAPTERS.filter(c=>progress[c.id]?.completed).length;
  const pct = Math.round((completed/total)*100);
  const avgScore = (() => {
    const scored = CHAPTERS.filter(c=>progress[c.id]?.quizScore!=null).map(c=>progress[c.id].quizScore);
    return scored.length ? Math.round(scored.reduce((a,b)=>a+b,0)/scored.length) : null;
  })();

  const getStatus = (id) => {
    const p = progress[id];
    if (!p) return null;
    if (p.completed) return "completed";
    if (p.visited) return "in-progress";
    return null;
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 28px 80px" }}>
      {/* Welcome */}
      <div style={{ marginBottom:40 }}>
        <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:4 }}>Welcome back,</div>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:32, fontWeight:700, color:"#e8edf5", letterSpacing:"-.02em" }}>{user.name} 👋</h1>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:48 }}>
        <div className="card" style={{ padding:24, display:"flex", gap:16, alignItems:"center" }}>
          <ProgressRing pct={pct} size={72} label="done"/>
          <div>
            <div style={{ fontSize:12, color:"#3a4a5a", fontWeight:500, textTransform:"uppercase", letterSpacing:".08em" }}>Overall Progress</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:700, color:"#e8edf5", marginTop:4 }}>{completed}/{total} modules</div>
          </div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:6 }}>Quiz Average</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color: avgScore==null?"#2a3a4a":avgScore>=80?"#00d4ff":avgScore>=60?"#f59e0b":"#f87171" }}>
            {avgScore != null ? `${avgScore}%` : "—"}
          </div>
          <div style={{ fontSize:12, color:"#2a3a4a" }}>{avgScore==null?"No quizzes taken yet":avgScore>=80?"On track for CRAT!":"Keep reviewing"}</div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:6 }}>Modules Remaining</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color:"#a855f7" }}>{total-completed}</div>
          <div style={{ fontSize:12, color:"#2a3a4a" }}>of {total} total modules</div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <div style={{ fontSize:13, color:"#3a4a5a", marginBottom:6 }}>CRAT Readiness</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, color: pct>=80?"#00d4ff":"#f59e0b" }}>
            {pct >= 80 ? "Ready!" : pct >= 50 ? "Getting there" : "Just started"}
          </div>
          <div style={{ fontSize:12, color:"#2a3a4a" }}>{pct >= 80 ? "Take the practice exam!" : "Complete more modules"}</div>
        </div>
      </div>

      {/* Next up */}
      {(() => {
        const next = CHAPTERS.find(c => !progress[c.id]?.completed);
        if (!next) return (
          <div style={{ padding:24, background:"rgba(0,212,255,.05)", border:"1px solid rgba(0,212,255,.15)", borderRadius:16, marginBottom:40, display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ fontSize:32 }}>🎉</div>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, color:"#e8edf5", marginBottom:4 }}>Course Complete!</div>
              <div style={{ fontSize:14, color:"#5a7a8a" }}>You've completed all 14 modules. Good luck on the CRAT exam!</div>
            </div>
          </div>
        );
        return (
          <div style={{ marginBottom:40 }}>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600, color:"#e8edf5", marginBottom:14 }}>Continue Learning</h2>
            <div className="card" onClick={()=>onChapterClick(next)} style={{ padding:20, cursor:"pointer", display:"flex", gap:16, alignItems:"center",
              border:"1px solid rgba(0,212,255,.2)", background:"rgba(0,212,255,.03)", transition:"all .2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(0,212,255,.06)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(0,212,255,.03)"}>
              <div style={{ width:48, height:48, borderRadius:12, background:"rgba(0,212,255,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{next.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#00d4ff", letterSpacing:".1em", marginBottom:4 }}>UP NEXT · MODULE {next.num}</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:600, color:"#e8edf5" }}>{next.title}</div>
                <div style={{ fontSize:12, color:"#4a5a6a" }}>{next.sub} · {next.dur}</div>
              </div>
              <div style={{ color:"#00d4ff" }}><Icon.ChevronR/></div>
            </div>
          </div>
        );
      })()}

      {/* All chapters */}
      <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:600, color:"#e8edf5", marginBottom:16 }}>All Modules</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {CHAPTERS.map(ch => (
          <ChapterCard key={ch.id} ch={ch} status={getStatus(ch.id)} score={progress[ch.id]?.quizScore}
            onClick={()=>onChapterClick(ch)} compact/>
        ))}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ enrolled, progress, onChapterClick, onEnroll }) {
  const free = CHAPTERS.filter(c=>c.free);
  const paid = CHAPTERS.filter(c=>!c.free);
  const getStatus = id => { const p=progress[id]; if(!p)return null; if(p.completed)return "completed"; if(p.visited)return "in-progress"; return null; };

  return (
    <div>
      {/* Hero */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"90px 28px 70px", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(0,212,255,.07)", border:"1px solid rgba(0,212,255,.18)", borderRadius:20, padding:"6px 16px", marginBottom:28, fontSize:13, color:"#00d4ff", fontWeight:500 }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"#00d4ff",display:"inline-block",animation:"spin 2s linear infinite",filter:"blur(0)" }}/>
          Free Preview: Modules 1 & 2 Open Now
        </div>
        <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"clamp(34px,6vw,64px)", fontWeight:700, letterSpacing:"-.03em", lineHeight:1.08, color:"#f0f4f8", marginBottom:22 }}>
          Read Every ECG Strip<br/><span style={{ color:"#00d4ff" }}>With Confidence</span>
        </h1>
        <p style={{ fontSize:"clamp(15px,2vw,18px)", color:"#5a6a7a", lineHeight:1.75, maxWidth:560, margin:"0 auto 36px" }}>
          A complete, logic-first course in cardiac rhythm interpretation — from anatomy to arrhythmias to CRAT exam prep. 14 modules, interactive quizzes, and a full practice exam.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-p" style={{ padding:"14px 28px", fontSize:15 }} onClick={()=>document.getElementById("curriculum").scrollIntoView({behavior:"smooth"})}>
            Start Free Preview →
          </button>
          <button className="btn-s" style={{ padding:"14px 28px", fontSize:15 }} onClick={onEnroll}>
            View Pricing
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:56, maxWidth:640, marginLeft:"auto", marginRight:"auto" }}>
          {[{v:"14",l:"Modules"},{v:"40+",l:"Rhythm Types"},{v:"100+",l:"Quiz Questions"},{v:"100%",l:"CRAT Aligned"}].map(s=>(
            <div key={s.l} className="card" style={{ padding:"16px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:700, color:"#00d4ff" }}>{s.v}</div>
              <div style={{ fontSize:11, color:"#3a4a5a", marginTop:4, fontWeight:500, textTransform:"uppercase", letterSpacing:".08em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ECG ticker */}
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
        {/* Free modules */}
        <div style={{ marginBottom:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
            <span className="tag-free">Free Preview</span>
            <div style={{ height:1, flex:1, background:"rgba(0,212,255,.12)" }}/>
          </div>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:"#e8edf5", marginBottom:4, letterSpacing:"-.02em" }}>Start Here — No Account Required</h2>
          <p style={{ color:"#4a5a6a", fontSize:14, marginBottom:28 }}>Full content and quizzes, open immediately.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
            {free.map(ch=><ChapterCard key={ch.id} ch={ch} status={getStatus(ch.id)} score={progress[ch.id]?.quizScore} onClick={()=>onChapterClick(ch)}/>)}
          </div>
        </div>

        {/* Paid modules */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
            <span className="tag-lock">Full Course</span>
            <div style={{ height:1, flex:1, background:"rgba(168,85,247,.1)" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:14, marginBottom:28 }}>
            <div>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:"#e8edf5", marginBottom:4, letterSpacing:"-.02em" }}>Complete Curriculum</h2>
              <p style={{ color:"#4a5a6a", fontSize:14 }}>12 advanced modules + CRAT practice exam. One enrollment, lifetime access.</p>
            </div>
            {!enrolled && <button className="btn-p" onClick={onEnroll}>Unlock All 14 Modules — $79</button>}
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
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState({});
  const [screen, setScreen] = useState("landing"); // landing | dashboard | reader
  const [activeChapter, setActiveChapter] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    (async () => {
      const u = await stGet(SK.user);
      const e = await stGet(SK.enrolled);
      const p = await stGet(SK.progress);
      if (u) setUser(u);
      if (e) setEnrolled(true);
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
    if (!ch.free && !enrolled) { setShowPaywall(true); return; }
    setActiveChapter(ch);
    // Mark as visited
    if (!progress[ch.id]?.completed) {
      const updated = { ...progress, [ch.id]: { ...progress[ch.id], visited:true } };
      setProgress(updated);
      stSet(SK.progress, updated);
    }
    setScreen("reader");
  };

  const handleAuthSuccess = (u) => { setUser(u); setShowAuth(false); };
  const handleEnrollSuccess = async () => {
    setEnrolled(true);
    setShowPaywall(false);
    await stSet(SK.enrolled, true);
    setScreen("dashboard");
  };

  const handleLogout = async () => {
    await stSet(SK.user, null);
    setUser(null); setEnrolled(false); setScreen("landing");
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
      <Nav user={user} enrolled={enrolled} screen={screen}
        onGoLanding={()=>setScreen("landing")}
        onGoDash={()=>setScreen("dashboard")}
        onLogin={()=>setShowAuth(true)}
        onEnroll={()=>setShowPaywall(true)}
        onLogout={handleLogout}/>

      {screen === "landing" && <Landing enrolled={enrolled} progress={progress} onChapterClick={handleChapterClick} onEnroll={()=>setShowPaywall(true)}/>}
      {screen === "dashboard" && <Dashboard user={user} progress={progress} onChapterClick={handleChapterClick}/>}
      {screen === "reader" && activeChapter && (
        <ChapterReader ch={activeChapter} enrolled={enrolled} progress={progress}
          onBack={()=>setScreen(enrolled?"dashboard":"landing")}
          onSaveProgress={saveProgress}/>
      )}

      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onSuccess={handleAuthSuccess}/>}
      {showPaywall && (
        <PaywallModal user={user} onClose={()=>setShowPaywall(false)}
          onSuccess={handleEnrollSuccess}
          onNeedAuth={()=>{ setShowPaywall(false); setShowAuth(true); }}/>
      )}
    </div>
  );
}
