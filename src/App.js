import { useState } from "react";

// ─── BRAND COLORS ─────────────────────────────────────────────────────────────
const C = {
  bg:           "#0e1628",
  surface:      "#182243",
  surfaceLight: "#1e2d54",
  border:       "#243060",
  teal:         "#01999E",
  tealSoft:     "#94D2B9",
  tealSat:      "#68d1a5",
  white:        "#f5f3ef",
  grey:         "#d1d2d2",
  greyDim:      "#8a9bb8",
  warning:      "#f59e0b",
  danger:       "#ef4444",
};

// ─── KETAMINE ROA DATA ────────────────────────────────────────────────────────
const KETAMINE_ROAS = {
  lozenge: {
    id: "lozenge", label: "Lozenge / Troche", unit: "mg", bioavailability: "25–30%",
    doses: { threshold: 50, light: 100, moderate: 200, strong: 300, heavy: 450 },
    onset: 20, peak: 60, duration: 90,
    notes: "Hold under tongue for 15–20 minutes without swallowing. Bioavailability is 25–30% — significantly lower than injection routes. Most common route for at-home ketamine therapy programs. Onset is slower and experience more gradual than IM or IV.",
    effects: {
      light:    ["Mild relaxation and mood lift", "Slight dreaminess and dissociation", "Mild analgesia"],
      moderate: ["Moderate dissociation", "Dreamlike, floating sensations", "Emotional openness", "Mild visual distortions"],
      strong:   ["Strong dissociation", "Approaching K-hole territory", "Significant perceptual changes", "Out-of-body sensations possible"],
      heavy:    ["Deep dissociative experience", "K-hole possible", "Complete detachment from surroundings", "Amnesia possible"]
    },
    safety: ["Do not swallow the lozenge — hold sublingually for absorption", "Effects are less predictable than IV due to variable absorption", "Avoid driving for at least 4–6 hours after use", "Do not combine with alcohol, benzodiazepines, or opioids"],
    sources: ["source_ketamine_rolan_2014", "source_ketamine_chong_2009", "source_ketamine_statpearls"]
  },
  insufflation: {
    id: "insufflation", label: "Insufflation (Nasal)", unit: "mg", bioavailability: "45–50%",
    doses: { threshold: 20, light: 40, moderate: 75, strong: 120, heavy: 200 },
    onset: 5, peak: 20, duration: 60,
    notes: "Bioavailability is approximately 45–50%, roughly double that of sublingual routes. Onset is rapid — effects typically felt within 5–10 minutes. Nasal irritation is common with repeated use.",
    effects: {
      light:    ["Quick onset dissociation", "Mild euphoria and numbness", "Pain relief"],
      moderate: ["Moderate dissociation", "Perceptual distortions", "Euphoria and floating sensation"],
      strong:   ["Strong dissociation", "K-hole threshold", "Significant visual and sensory changes"],
      heavy:    ["K-hole — complete dissociation from physical reality", "Amnesia possible", "Full immersive dissociative experience"]
    },
    safety: ["Nasal mucosa damage with chronic use — allow time between uses", "Bioavailability is variable depending on nasal condition", "Faster onset means intensity can escalate quickly — start low", "Do not combine with other depressants"],
    sources: ["source_ketamine_schoevers_2016", "source_ketamine_statpearls", "source_ketamine_andrade_2017"]
  },
  iv: {
    id: "iv", label: "Intravenous (IV)", unit: "mg/kg", bioavailability: "100%",
    doses: { threshold: 0.1, light: 0.25, moderate: 0.5, strong: 0.75, heavy: 1.5 },
    onset: 0.5, peak: 5, duration: 30,
    notes: "100% bioavailability — the gold standard for precision dosing. For depression, typically administered as 0.5 mg/kg over 40–45 minutes in a clinical setting. Onset within 30–60 seconds. Must only be administered by medical professionals.",
    effects: {
      light:    ["Rapid mild dissociation", "Analgesia and calm", "Mild perceptual changes"],
      moderate: ["Strong dissociation within minutes", "Dreamlike states", "Significant perceptual distortion"],
      strong:   ["Deep K-hole experience", "Complete dissociation from body and surroundings", "Out-of-body experiences"],
      heavy:    ["Anesthetic depth possible", "Complete unconsciousness at high doses", "Medical supervision absolutely required"]
    },
    safety: ["Medical supervision and cardiac monitoring required", "Respiratory depression risk — airway management must be available", "Only administered by trained medical professionals", "Rapid onset means effects can be overwhelming without preparation"],
    sources: ["source_ketamine_murrough_2013", "source_ketamine_statpearls", "source_ketamine_fond_2014"]
  },
  im: {
    id: "im", label: "Intramuscular (IM)", unit: "mg/kg", bioavailability: "93%",
    doses: { threshold: 0.1, light: 0.25, moderate: 0.5, strong: 0.75, heavy: 1.0 },
    onset: 5, peak: 15, duration: 60,
    notes: "93% bioavailability — nearly as effective as IV with a slightly slower onset. Common in clinical ketamine therapy. Injected into the deltoid or gluteal muscle. Peak plasma levels within 5–30 minutes.",
    effects: {
      light:    ["Mild dissociation within 5 minutes", "Euphoria and warmth", "Mild analgesia"],
      moderate: ["Moderate to strong dissociation", "Dreamlike, floating states", "Emotional processing facilitated"],
      strong:   ["Deep dissociation", "K-hole territory", "Profound introspective or transcendent states"],
      heavy:    ["Complete dissociation", "Significant amnesia possible", "Requires clinical supervision and monitoring"]
    },
    safety: ["Must be administered by a trained medical professional", "Injection site reactions possible", "Faster onset than sublingual — intensity can be sudden", "Do not combine with CNS depressants"],
    sources: ["source_ketamine_statpearls", "source_ketamine_fond_2014", "source_ketamine_chilukuri_2014"]
  }
};

// ─── 5-MEO-DMT SOURCE DATA ────────────────────────────────────────────────────
const MEO_SOURCES = {
  toad: {
    id: "toad", label: "Toad Venom (Bufo alvarius)", unit: "mg",
    doses: { threshold: 5, light: 15, moderate: 30, strong: 50, heavy: 75 },
    onset: 0.3, peak: 5, duration: 20,
    notes: "Dried secretion from the parotoid glands of the Sonoran Desert toad (Incilius alvarius). Contains 5-MeO-DMT at roughly 10–30% of dry weight alongside other active alkaloids including bufotenine, bufotalin, and catecholamines. Potency varies significantly between individual toads — dosing by weight of venom is inherently imprecise. Doses listed are for dried venom, not pure 5-MeO-DMT content.",
    effects: {
      light:    ["Mild body load and tingling", "Slight warmth and perceptual shift", "Light mood elevation"],
      moderate: ["Moderate dissociation", "Onset of unity sensations", "Body pressure and vibration", "Emotional warmth and openness"],
      strong:   ["Complete ego dissolution", "Non-dual awareness — self and universe merge", "Intense physical sensations and pressure", "Vocalization and involuntary movement common"],
      heavy:    ["Total loss of self", "Overwhelming experience — often beyond description", "Complete departure from ordinary reality", "Additional cardiovascular risk from co-occurring alkaloids in venom"]
    },
    safety: [
      "Potency is highly variable — 5-MeO-DMT content ranges from 10–30% of dried venom by weight; dosing is inherently imprecise",
      "Contains cardioactive bufagins and catecholamines in addition to 5-MeO-DMT — additional cardiac risk compared to synthetic",
      "NEVER combine with MAOIs — potentially fatal",
      "Ecological concern: harvesting stresses wild toad populations; synthetic 5-MeO-DMT is an ecologically responsible alternative",
      "A trained sitter is essential — complete loss of motor control is common"
    ],
    sources: ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical"]
  },
  synthetic: {
    id: "synthetic", label: "Synthetic (Pure)", unit: "mg",
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 0.3, peak: 5, duration: 20,
    notes: "Pure synthesized 5-MeO-DMT hydrochloride or freebase. Precise dosing — 5mg is always 5mg. Preferred in clinical research for this reason. No entourage alkaloids means a cleaner pharmacological profile and lower cardiovascular risk than toad venom. Also the ecologically responsible choice.",
    effects: {
      light:    ["Mild body load and pressure", "Slight perceptual shift"],
      moderate: ["Strong dissociation from body and environment", "Unity consciousness — sense of merging with everything", "Overwhelming and sudden onset"],
      strong:   ["Complete ego dissolution", "Non-dual awareness — no separation between self and universe", "Intense body sensations including pressure and vibration", "Challenging to process without preparation"],
      heavy:    ["Total loss of individual self", "Potentially terrifying or profoundly blissful — often both", "Reported 'white out' — complete dissolution of all content"]
    },
    safety: [
      "One of the most potent psychedelics by weight — active at 1mg",
      "NEVER combine with MAOIs — can be fatal",
      "Vocalization, writhing, and loss of physical control are common",
      "Requires an experienced, trained sitter — not appropriate for solo use",
      "Precise dosing makes this safer than toad venom for experienced facilitators"
    ],
    sources: ["source_5meo_1", "source_5meo_2", "source_5meo_reckweg", "source_5meo_clinical"]
  }
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SUBSTANCES = [
  {
    id: "psilocybin", name: "Psilocybin", category: "Tryptamine", unit: "mg",
    doses: { threshold: 1, light: 3, moderate: 15, strong: 25, heavy: 40 },
    onset: 30, peak: 120, duration: 360,
    effects: {
      light:    ["Mild perceptual shifts", "Enhanced colors and visual acuity", "Gentle mood lift and lightness", "Increased introspection and self-reflection"],
      moderate: ["Visual patterns, fractals, and distortions", "Emotional openness and vulnerability", "Altered time perception", "Philosophical insights and new perspectives"],
      strong:   ["Strong visual hallucinations with eyes open and closed", "Ego dissolution — boundaries between self and world blur", "Profound emotional experiences, including catharsis", "Synesthesia possible"],
      heavy:    ["Complete ego dissolution", "Intense visual phenomena and geometry", "Mystical or transcendent experiences", "Challenging confrontations with fear, grief, or trauma"]
    },
    safety: ["Do not combine with lithium — risk of seizures", "Caution with SSRIs (may reduce effects or trigger serotonin syndrome at high doses)", "Avoid if personal or family history of psychosis or schizophrenia", "Set, setting, and a trusted sitter strongly recommended at moderate+ doses"],
    boosterInfo: "A booster of 25–50% of the initial dose taken 60–90 minutes in can extend the peak and plateau phase. Rapid tolerance develops, so boosters are less effective than the initial dose.",
    sources: ["source_psilocybin_1", "source_psilocybin_2", "source_psilocybin_3", "source_redosing_1"]
  },
  {
    id: "lsd", name: "LSD", category: "Lysergamide", unit: "μg",
    doses: { threshold: 25, light: 75, moderate: 150, strong: 300, heavy: 600 },
    onset: 45, peak: 240, duration: 720,
    effects: {
      light:    ["Mild euphoria and energy", "Sensory enhancement", "Slight perceptual changes", "Increased sociability and talkativeness"],
      moderate: ["Visual fractals, color intensification, and pattern recognition", "Amplified emotions — both positive and difficult", "Synesthesia common", "Deep empathy and connection"],
      strong:   ["Intense open and closed-eye hallucinations", "Ego dissolution possible", "Profound insights about life and self", "Challenging emotional experiences — anxiety, fear possible"],
      heavy:    ["Complete ego dissolution", "Overwhelming sensory and cognitive input", "Visionary and mystical experiences", "Very long duration — 12–18 hours at high doses"]
    },
    safety: ["Avoid with SSRIs, MAOIs, or lithium", "High risk of anxiety at doses above 200μg in unfamiliar settings", "Very long duration — have the full day and next morning free", "Test strips essential — LSD is commonly counterfeited", "Doses above 400μg should only be approached by very experienced individuals"],
    boosterInfo: "Not generally recommended — extends an already very long experience to 16–20 hours. Rapid tolerance also reduces effectiveness. If used, 60–90 minutes is the optimal window.",
    sources: ["source_lsd_1", "source_lsd_2", "source_redosing_1", "source_lsd_tolerance"]
  },
  {
    id: "dmt", name: "DMT", category: "Tryptamine", unit: "mg",
    doses: { threshold: 10, light: 25, moderate: 40, strong: 60, heavy: 80 },
    onset: 0.5, peak: 5, duration: 15,
    effects: {
      light:    ["Mild visual effects — shifting patterns", "Body warmth and tingling", "Slight mood shift or sense of anticipation"],
      moderate: ["Strong geometric and fractal visuals", "Rapid onset within seconds", "Entity contact or presence reported by many users", "Profound awe and sense of significance"],
      strong:   ["Breakthrough experience — complete departure from consensus reality", "Complex, immersive alternate environments", "Meeting entities or beings", "Overwhelming sense of love or fear"],
      heavy:    ["Total immersion in an alternate reality", "Time dissolves completely", "Intense and often indescribable experiences that resist language"]
    },
    safety: ["Extremely short but one of the most intense psychedelics", "Must be seated or lying down — complete loss of physical awareness", "MAOIs dramatically extend and intensify effects — potentially dangerous", "Respiratory distress possible at very high doses"],
    boosterInfo: "Due to its extremely short duration (10–15 minutes), booster dosing is unusual. Redosing immediately after the experience is possible since tolerance doesn't build rapidly. Wait for effects to fully subside before considering a second dose.",
    sources: ["source_dmt_1", "source_dmt_2"]
  },
  {
    id: "mescaline", name: "Mescaline", category: "Phenethylamine", unit: "mg",
    doses: { threshold: 100, light: 200, moderate: 350, strong: 500, heavy: 700 },
    onset: 60, peak: 240, duration: 720,
    effects: {
      light:    ["Mild euphoria and warmth", "Color and texture enhancement", "Nausea common on come-up", "Increased sociability and openness"],
      moderate: ["Visual hallucinations — flowing colors, geometric patterns", "Deep empathy and emotional openness", "Strong connection to nature and environment", "Philosophical and spiritual insights"],
      strong:   ["Complex visual phenomena and vivid hallucinations", "Profound emotional release and catharsis", "Spiritual and transcendent experiences"],
      heavy:    ["Overwhelming visionary states", "Intense nausea and physical discomfort possible", "Very long duration — 12+ hours"]
    },
    safety: ["Nausea is very common — fasting beforehand helps", "Extremely long duration requires thorough preparation", "Caution with cardiovascular conditions — elevates heart rate and blood pressure"],
    boosterInfo: "Uncommon due to already very long duration (10–12 hours). A booster taken 1–2 hours in can deepen the experience but will significantly extend total duration.",
    sources: ["source_mescaline_1", "source_mescaline_2"]
  },
  {
    id: "5meo_dmt", name: "5-MeO-DMT", category: "Tryptamine", unit: "mg",
    is5MeO: true,
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 0.3, peak: 5, duration: 20,
    effects: {
      light:    ["Mild body load and pressure", "Slight perceptual shift"],
      moderate: ["Strong dissociation from body and environment", "Unity consciousness", "Overwhelming and sudden onset"],
      strong:   ["Complete ego dissolution", "Non-dual awareness", "Intense body sensations", "Challenging to process without preparation"],
      heavy:    ["Total loss of individual self", "Potentially terrifying or profoundly blissful", "Reported 'white out' — complete dissolution of all content"]
    },
    safety: ["One of the most potent psychedelics by weight — active at 1mg", "NEVER combine with MAOIs — can be fatal", "Vocalization, writhing, and loss of physical control are common", "Requires an experienced, trained sitter"],
    boosterInfo: "Booster dosing with 5-MeO-DMT is not recommended. The experience is already overwhelming at active doses. Redosing carries significant risk given the intensity and unpredictability.",
    sources: ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical"]
  },
  {
    id: "ayahuasca", name: "Ayahuasca", category: "Tryptamine", unit: "mL",
    doses: { threshold: 25, light: 50, moderate: 75, strong: 100, heavy: 150 },
    onset: 30, peak: 120, duration: 300,
    effects: {
      light:    ["Mild visions — shifting colors and patterns", "Emotional introspection and sensitivity", "Nausea on come-up"],
      moderate: ["Purging common — considered part of the healing process", "Vivid narrative visions", "Ancestral, spirit, or entity contact reported", "Deep emotional release and catharsis"],
      strong:   ["Deep trauma processing and confrontation", "Overwhelming visual and emotional experiences", "Ego dissolution", "Profound sense of healing or confrontation with shadow material"],
      heavy:    ["Complete loss of consensus reality for extended periods", "Intense physical and emotional purging", "Hours of sustained visionary states — can be 4–6 hours"]
    },
    safety: ["Contains MAOI (harmaline) — extensive drug interactions including SSRIs, stimulants, many foods", "Must follow dietary restrictions (avoid tyramine-rich foods) before ceremony", "Should only be taken in a ceremonial or medically supervised context", "People with heart conditions, hypertension, or psychiatric diagnoses should consult a physician first"],
    boosterInfo: "In ceremonial contexts, a second cup is sometimes offered 1–2 hours in. This is typically at the facilitator's or shaman's discretion. Self-directed booster dosing outside ceremony is not recommended.",
    sources: ["source_ayahuasca_1", "source_ayahuasca_2", "source_ayahuasca_3"]
  },
  {
    id: "salvinorin_a", name: "Salvinorin A", category: "Terpenoid", unit: "mg",
    doses: { threshold: 0.2, light: 0.5, moderate: 1, strong: 2, heavy: 3 },
    onset: 0.2, peak: 3, duration: 10,
    effects: {
      light:    ["Mild perceptual changes", "Laughter and giddiness", "Mild color and texture enhancement"],
      moderate: ["Strong dissociation from current reality", "Reality distortion and overlapping dimensions", "Loss of body awareness"],
      strong:   ["Complete dissociation from physical surroundings", "Sensation of dimensional or spatial travel", "Entity or presence contact reported"],
      heavy:    ["Total departure from ordinary reality", "Inability to form new memories during experience", "Extremely disorienting and confusing — often frightening"]
    },
    safety: ["Shortest duration of any major psychedelic — 5–15 minutes — but extremely intense", "Must be in a physically safe environment — complete loss of motor control occurs", "Not appropriate for anxious individuals or those without experience", "A sober sitter is essential"],
    boosterInfo: "Due to its extremely short duration, booster dosing is unusual. If a deeper experience is desired, this is better addressed through initial dosing.",
    sources: ["source_salvinorin_1", "source_salvinorin_2"]
  },
  {
    id: "ibogaine", name: "Ibogaine", category: "Indole Alkaloid", unit: "mg/kg",
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 60, peak: 240, duration: 1440,
    effects: {
      light:    ["Mild stimulation and wakefulness", "Introspection and memory recall", "Mild visual effects"],
      moderate: ["Waking dreamlike visions — like a living film of your life", "Life review — memories surfacing with clarity and emotional weight", "Ataxia (loss of coordination)", "Nausea and vomiting common"],
      strong:   ["Intense sustained visions — often biographical or archetypal", "Confrontation with past trauma, relationships, and decisions", "Hours of continuous introspective journey"],
      heavy:    ["36+ hour experience", "Profound psychological reckoning", "Serious cardiac risk increases with dose — medical monitoring essential"]
    },
    safety: ["SERIOUS CARDIAC RISK — ibogaine prolongs the QT interval and can cause fatal arrhythmia", "Requires a full cardiac workup including EKG before any use", "Only appropriate under direct medical supervision with cardiac monitoring", "Many drug interactions — especially lethal with opioids, stimulants, and SSRIs"],
    boosterInfo: "Booster dosing with ibogaine carries serious cardiac risk. Any supplemental dosing must be conducted under direct medical supervision only.",
    sources: ["source_ibogaine_1", "source_ibogaine_2"]
  },
  {
    id: "mdma", name: "MDMA", category: "Empathogen", unit: "mg",
    doses: { threshold: 50, light: 80, moderate: 120, strong: 150, heavy: 200 },
    onset: 45, peak: 90, duration: 240,
    effects: {
      light:    ["Mild euphoria and warmth", "Increased sociability and verbal flow", "Slight sensory enhancement"],
      moderate: ["Strong empathy and emotional connection to others", "Euphoria and sense of well-being", "Increased physical energy", "Emotional openness", "Tactile enhancement"],
      strong:   ["Intense euphoria", "Profound emotional bonding with people present", "Potential anxiety, jaw clenching, or overheating", "Strong stimulant effects"],
      heavy:    ["Risk of dangerous hyperthermia", "Cardiovascular strain", "Severe comedown in days following", "Risk of serotonin syndrome if combined with other serotonergics"]
    },
    safety: ["Stay hydrated — about 500mL per hour if dancing, less if sedentary — overhydration is also dangerous", "Avoid frequent redosing — increases neurotoxicity risk", "Never combine with MAOIs, SSRIs, or other stimulants", "Space use by at least 3 months to reduce neurotoxicity risk"],
    boosterInfo: "A small booster (half the initial dose) taken 60–90 minutes in is common. Keep boosters to 50–75mg maximum. Redosing MDMA significantly increases neurotoxicity risk and worsens the comedown.",
    sources: ["source_mdma_1", "source_mdma_2", "source_mdma_3"]
  },
  {
    id: "mda", name: "MDA", category: "Empathogen", unit: "mg",
    doses: { threshold: 40, light: 80, moderate: 120, strong: 160, heavy: 200 },
    onset: 45, peak: 120, duration: 360,
    effects: {
      light:    ["Euphoria and warmth", "Mild visual effects — more pronounced than MDMA", "Increased energy and motivation"],
      moderate: ["Empathy and emotional openness", "Visual distortions and mild hallucinations", "Stimulation and desire to move"],
      strong:   ["More psychedelic character than MDMA", "Visual hallucinations can be significant", "Intense emotional experiences — both positive and difficult"],
      heavy:    ["Strong visual hallucinations", "High cardiovascular load", "Significant neurotoxicity risk — higher than MDMA"]
    },
    safety: ["More neurotoxic to serotonin neurons than MDMA based on animal studies", "Higher cardiovascular risk than MDMA", "Avoid combination with other stimulants, serotonergics, or MAOIs", "Longer duration means more prolonged cardiovascular stress"],
    boosterInfo: "Booster dosing with MDA is not recommended due to its higher neurotoxicity profile and already longer duration compared to MDMA.",
    sources: ["source_mda_1", "source_mda_2"]
  },
  {
    id: "ketamine", name: "Ketamine", category: "Dissociative", unit: "mg",
    isKetamine: true,
    doses: { threshold: 20, light: 50, moderate: 100, strong: 150, heavy: 300 },
    onset: 5, peak: 20, duration: 60,
    effects: {
      light:    ["Mild dissociation and dreaminess", "Analgesia (pain relief)", "Relaxation and sedation", "Mild euphoria and floating sensation"],
      moderate: ["Strong dissociation from physical surroundings", "Approaching the K-hole threshold", "Altered sense of body size and position", "Dreamlike and surreal states"],
      strong:   ["K-hole — complete dissociation from physical reality", "Out-of-body experiences", "Amnesia for the experience is possible"],
      heavy:    ["Total loss of self and physical environment", "Profound dissociation", "Respiratory depression risk — do not combine with other depressants"]
    },
    safety: ["High addiction potential with frequent or daily use", "Bladder and urinary tract damage with chronic heavy use — irreversible in severe cases", "Never drive or operate machinery", "Do not combine with alcohol, benzodiazepines, or opioids"],
    boosterInfo: "Booster dosing is route-dependent. For lozenge/troche, a supplemental 25–50% of the initial dose may be taken 45–60 minutes in. For IM/IV, supplemental dosing should only be administered by medical professionals.",
    sources: ["source_ketamine_1", "source_ketamine_2", "source_ketamine_statpearls", "source_ketamine_rolan_2014"]
  },
  {
    id: "pcp", name: "PCP", category: "Dissociative", unit: "mg",
    doses: { threshold: 1, light: 3, moderate: 8, strong: 15, heavy: 25 },
    onset: 5, peak: 30, duration: 360,
    effects: {
      light:    ["Mild dissociation and numbness", "Euphoria and mood elevation", "Slight perceptual distortions"],
      moderate: ["Strong dissociation from surroundings", "Analgesia — complete insensitivity to pain", "Perceptual distortions and disorganized thinking"],
      strong:   ["Complete dissociation from reality", "Psychosis-like states — paranoia, hallucinations", "Extreme disorientation and confusion"],
      heavy:    ["Severe psychosis", "Agitation, aggression, or violent behavior possible", "Medical emergency risk"]
    },
    safety: ["High risk of psychosis and erratic behavior at moderate to high doses", "Very long and highly unpredictable duration — can last 6–24 hours", "Extremely high addiction potential", "Analgesia means physical injuries may not be felt during the experience"],
    boosterInfo: "Booster dosing with PCP is extremely inadvisable. The unpredictable duration and psychosis risk are already high at standard doses.",
    sources: ["source_pcp_1"]
  },
  {
    id: "2cb", name: "2C-B", category: "Phenethylamine", unit: "mg",
    doses: { threshold: 5, light: 15, moderate: 25, strong: 35, heavy: 50 },
    onset: 45, peak: 120, duration: 300,
    effects: {
      light:    ["Color and contrast enhancement", "Mild euphoria and wellbeing", "Increased sensory awareness"],
      moderate: ["Visual effects — breathing walls, color shifts, mild geometry", "Euphoria and positive mood", "Sensory enhancement including taste, touch, and music"],
      strong:   ["Strong visual distortions and hallucinations", "Deep introspection and emotional processing", "Emotional release", "High physical energy"],
      heavy:    ["Intense hallucinations similar to LSD or psilocybin", "Overwhelming experience possible", "Significant body load — physical discomfort possible"]
    },
    safety: ["Highly dose-sensitive — small increases produce dramatically larger effects", "Avoid with MAOIs", "Nausea common on come-up, especially at higher doses", "If insufflated, onset is much faster — doses must be reduced significantly"],
    boosterInfo: "2C-B is highly dose-sensitive, making booster dosing risky. A small booster (5–10mg) taken 45–60 minutes in is feasible, but err heavily on the side of caution given the steep dose-response curve.",
    sources: ["source_2cb_1", "source_2cb_2"]
  },
  {
    id: "25i_nbome", name: "25I-NBOMe", category: "Phenethylamine", unit: "μg",
    doses: { threshold: 200, light: 500, moderate: 900, strong: 1500, heavy: 2000 },
    onset: 30, peak: 120, duration: 480,
    effects: {
      light:    ["Visual effects and color enhancement", "Stimulation and alertness", "Mood change — euphoria or anxiety"],
      moderate: ["Strong visual hallucinations", "Pronounced stimulant effects", "Vasoconstriction — cold hands and feet"],
      strong:   ["Intense hallucinations comparable to high-dose LSD", "Significant tachycardia and hypertension", "Stimulant overdrive — agitation possible"],
      heavy:    ["Severe cardiovascular strain", "Seizure risk", "Medical emergency — multiple fatalities reported at this dose range"]
    },
    safety: ["⚠ ASSOCIATED WITH MULTIPLE CONFIRMED FATALITIES — extreme caution required", "Vasoconstriction can be severe and medically dangerous", "Frequently sold on blotter as LSD — always reagent test before use", "Bitter taste under the tongue is a warning sign — LSD is tasteless"],
    boosterInfo: "⚠ Booster dosing with 25I-NBOMe is extremely dangerous and not recommended under any circumstances. This substance has caused fatalities at doses that were thought to be manageable.",
    sources: ["source_25i_1", "source_25i_2"]
  },
  {
    id: "al_lad", name: "AL-LAD", category: "Lysergamide", unit: "μg",
    doses: { threshold: 45, light: 100, moderate: 200, strong: 300, heavy: 450 },
    onset: 30, peak: 180, duration: 480,
    effects: {
      light:    ["Mild visual effects — brightening, mild geometry", "Euphoria and positive mood", "Increased energy and creativity"],
      moderate: ["Visual fractals and color enhancement", "Emotional clarity and openness", "Creative and musical appreciation enhanced"],
      strong:   ["Strong visual distortions and hallucinations", "Introspective depth", "Possible confusion or disorientation"],
      heavy:    ["Intense hallucinations", "Ego dissolution possible", "Overwhelming experience similar to high-dose LSD"]
    },
    safety: ["Shorter duration than LSD (6–8 hours vs 12) but similar effects and intensity", "Dose-sensitive — treat each batch carefully", "Research chemical with limited long-term human safety data", "Same harm reduction practices as LSD apply"],
    boosterInfo: "A small booster (50–75μg) taken 60–90 minutes in is feasible. The shorter duration makes this more manageable than LSD boosters.",
    sources: ["source_al_lad_1"]
  }
];

const COMBINATIONS = [
  {
    id: "candy_flip", name: "Candy Flip", isCombination: true,
    description: "LSD + MDMA — produces an extremely euphoric, visually enhanced empathogenic experience. The MDMA empathy and energy combined with LSD visuals and insight can be powerfully synergistic but also overwhelming.",
    components: ["lsd", "mdma"],
    timing: "MDMA is typically taken 3–4 hours into the LSD experience, timed so both substances are peaking simultaneously.",
    safety: ["Very high body temperature risk — hyperthermia is a serious danger", "Extreme cardiovascular load from both substances", "Serotonin syndrome risk if doses are high", "Very long experience — 14–18 hours total", "Hydration is essential but do not overhydrate", "Not recommended for beginners"],
    sources: ["source_candy_flip_1", "source_mdma_2", "source_lsd_2"]
  },
  {
    id: "jedi_flip", name: "Jedi Flip", isCombination: true,
    description: "Psilocybin + LSD + MDMA — an advanced triple combination. Extremely intense and long-lasting. Reserved for very experienced individuals only.",
    components: ["psilocybin", "lsd", "mdma"],
    timing: "LSD is taken first. Psilocybin is added 1–2 hours later. MDMA is timed to overlap with the combined peaks — approximately 3–4 hours after LSD.",
    safety: ["For very experienced psychedelic users only", "Extremely high risk profile — cardiovascular, thermoregulatory, and neurological stress", "Medical support or an experienced harm-reduction sitter strongly advised", "Not recommended for anyone with a history of anxiety, cardiovascular issues, or psychiatric conditions", "Duration can exceed 18–24 hours"],
    sources: ["source_candy_flip_1", "source_psilocybin_2", "source_lsd_2", "source_mdma_2"]
  },
  {
    id: "hippie_flip", name: "Hippie Flip", isCombination: true,
    description: "Psilocybin + MDMA — combines the emotional depth, introspection, and visuals of psilocybin with the euphoria, empathy, and energy of MDMA. Has been studied in research contexts for therapeutic potential.",
    components: ["psilocybin", "mdma"],
    timing: "MDMA can be taken simultaneously with psilocybin, or 1–2 hours into the psilocybin experience to time the MDMA peak with the psilocybin plateau.",
    safety: ["Serotonin syndrome risk at high doses — keep doses conservative", "Monitor body temperature — risk of overheating especially if active", "Heart rate elevation from both substances — not suitable for those with cardiac concerns"],
    sources: ["source_psilocybin_2", "source_mdma_1", "source_mdma_2"]
  }
];

const SOURCES = {
  source_psilocybin_1: { title: "Psilocybin-occasioned mystical-type experience in combination with meditation and other spiritual practices", authors: "Barrett, F.S., et al.", journal: "Journal of Psychopharmacology", year: 2020, url: "https://doi.org/10.1177/0269881119897328" },
  source_psilocybin_2: { title: "Psilocybin produces substantial and sustained decreases in depression and anxiety in patients with life-threatening cancer", authors: "Griffiths, R.R., et al.", journal: "Journal of Psychopharmacology", year: 2016, url: "https://doi.org/10.1177/0269881116675513" },
  source_psilocybin_3: { title: "Dose-response relationships of psilocybin-induced subjective experiences in humans", authors: "Hasler, F., et al.", journal: "Neuropsychopharmacology", year: 2004, url: "https://doi.org/10.1038/sj.npp.1300496" },
  source_lsd_1: { title: "The Pharmacology of LSD", authors: "Hintzen, A. & Passie, T.", journal: "Oxford University Press", year: 2010, url: "https://doi.org/10.1093/acprof:oso/9780199532254.001.0001" },
  source_lsd_2: { title: "Acute Effects of Lysergic Acid Diethylamide on Resting Brain Function", authors: "Tagliazucchi, E., et al.", journal: "NeuroImage", year: 2016, url: "https://doi.org/10.1016/j.neuroimage.2016.03.060" },
  source_lsd_tolerance: { title: "Cross tolerance between LSD and psilocybin", authors: "Isbell, H., et al.", journal: "Psychopharmacologia", year: 1961, url: "https://doi.org/10.1007/BF00407974" },
  source_dmt_1: { title: "N,N-dimethyltryptamine (DMT), an endogenous hallucinogen: past, present, and future research", authors: "Barker, S.A.", journal: "Frontiers in Neuroscience", year: 2018, url: "https://doi.org/10.3389/fnins.2018.00536" },
  source_dmt_2: { title: "Human pharmacology of ayahuasca: subjective and cardiovascular effects", authors: "Riba, J., et al.", journal: "Journal of Pharmacology and Experimental Therapeutics", year: 2003, url: "https://doi.org/10.1124/jpet.103.049882" },
  source_mescaline_1: { title: "Mescaline: A Systematic Review of Human Studies", authors: "Metzner, R.", journal: "Journal of Psychoactive Drugs", year: 2004, url: "https://doi.org/10.1080/02791072.2004.10399952" },
  source_mescaline_2: { title: "Psychological and cognitive effects of long-term peyote use among Native Americans", authors: "Halpern, J.H., et al.", journal: "Biological Psychiatry", year: 2005, url: "https://doi.org/10.1016/j.biopsych.2004.11.024" },
  source_5meo_1: { title: "Acute and subacute effects of 5-methoxy-N,N-dimethyltryptamine in a human population", authors: "Davis, A.K., et al.", journal: "Journal of Psychopharmacology", year: 2018, url: "https://doi.org/10.1177/0269881118769010" },
  source_5meo_2: { title: "5-MeO-DMT: Overview of pharmacology and effects", authors: "Ott, J.", journal: "Journal of Psychoactive Drugs", year: 2001, url: "https://doi.org/10.1080/02791072.2001.10399999" },
  source_5meo_uthaug: { title: "A single inhalation of vapor from dried toad secretion containing 5-MeO-DMT in a naturalistic setting is related to sustained enhancement of satisfaction with life", authors: "Uthaug, M.V., et al.", journal: "Psychopharmacology", year: 2019, url: "https://doi.org/10.1007/s00213-019-05236-w" },
  source_5meo_davis: { title: "Intensity of Mystical Experiences Occasioned by 5-MeO-DMT and Comparison With a Prior Psilocybin Study", authors: "Davis, A.K., et al.", journal: "Frontiers in Psychology", year: 2018, url: "https://doi.org/10.3389/fpsyg.2018.02459" },
  source_5meo_reckweg: { title: "A Phase 1, Dose-Ranging Study to Assess Safety and Psychoactive Effects of a Vaporized 5-MeO-DMT Formulation (GH001) in Healthy Volunteers", authors: "Reckweg, J., et al.", journal: "Frontiers in Pharmacology", year: 2021, url: "https://doi.org/10.3389/fphar.2021.760671" },
  source_5meo_clinical: { title: "The clinical pharmacology and potential therapeutic applications of 5-methoxy-N,N-dimethyltryptamine (5-MeO-DMT)", authors: "Reckweg, J., et al.", journal: "Journal of Neurochemistry", year: 2022, url: "https://doi.org/10.1111/jnc.15587" },
  source_ayahuasca_1: { title: "The Pharmacology of Ayahuasca: A Review", authors: "McKenna, D.J.", journal: "Pharmacology, Biochemistry and Behavior", year: 2004, url: "https://doi.org/10.1016/j.pbb.2004.01.025" },
  source_ayahuasca_2: { title: "Therapeutic potential of ayahuasca: a prospective observational study", authors: "Domínguez-Clavé, E., et al.", journal: "Psychopharmacology", year: 2016, url: "https://doi.org/10.1007/s00213-016-4375-x" },
  source_ayahuasca_3: { title: "The Therapeutic Use of Ayahuasca", authors: "Labate, B.C. & Cavnar, C. (Eds.)", journal: "Springer", year: 2014, url: "https://doi.org/10.1007/978-3-642-40426-9" },
  source_salvinorin_1: { title: "Salvinorin A: A Potent Naturally Occurring Nonnitrogenous Kappa Opioid Selective Agonist", authors: "Roth, B.L., et al.", journal: "Proceedings of the National Academy of Sciences", year: 2002, url: "https://doi.org/10.1073/pnas.182234399" },
  source_salvinorin_2: { title: "Salvia divinorum and salvinorin A: new pharmacologic findings", authors: "Valdés, L.J., et al.", journal: "Journal of Ethnopharmacology", year: 1994, url: "https://doi.org/10.1016/0378-8741(94)90168-6" },
  source_ibogaine_1: { title: "Ibogaine and Noribogaine in the Treatment of Opioid Use Disorder", authors: "Noller, G.E., et al.", journal: "The American Journal on Addictions", year: 2018, url: "https://doi.org/10.1111/ajad.12717" },
  source_ibogaine_2: { title: "Cardiac Safety Concerns for Ibogaine Treatment of Opioid Use Disorder", authors: "Koenig, X. & Hilber, K.", journal: "Molecules", year: 2015, url: "https://doi.org/10.3390/molecules20022208" },
  source_mdma_1: { title: "Efficacy and Safety of MDMA-Assisted Psychotherapy for PTSD", authors: "Mithoefer, M.C., et al.", journal: "Psychopharmacology", year: 2019, url: "https://doi.org/10.1007/s00213-019-05249-5" },
  source_mdma_2: { title: "The pharmacology of MDMA in humans", authors: "Green, A.R., et al.", journal: "Pharmacological Reviews", year: 2003, url: "https://doi.org/10.1124/pr.55.3.3" },
  source_mdma_3: { title: "MDMA-assisted therapy for severe PTSD: a randomized, double-blind, placebo-controlled phase 3 study", authors: "Mitchell, J.M., et al.", journal: "Nature Medicine", year: 2021, url: "https://doi.org/10.1038/s41591-021-01336-3" },
  source_mda_1: { title: "Subjective effects and pharmacokinetics of MDA and MDMA", authors: "Baggott, M.J., et al.", journal: "Journal of Psychopharmacology", year: 2012, url: "https://doi.org/10.1177/0269881112446532" },
  source_mda_2: { title: "Neurotoxicity of MDMA and MDA to brain serotonin neurons", authors: "Ricaurte, G.A. & McCann, U.D.", journal: "Annals of the New York Academy of Sciences", year: 2000, url: "https://doi.org/10.1111/j.1749-6632.2000.tb06480.x" },
  source_ketamine_1: { title: "Ketamine: A review of its pharmacological properties and use in psychiatry", authors: "Fond, G., et al.", journal: "Neuroscience & Biobehavioral Reviews", year: 2014, url: "https://doi.org/10.1016/j.neubiorev.2014.05.005" },
  source_ketamine_2: { title: "Ketamine for treatment-resistant depression: a randomized controlled trial", authors: "Murrough, J.W., et al.", journal: "Biological Psychiatry", year: 2013, url: "https://doi.org/10.1016/j.biopsych.2013.05.022" },
  source_ketamine_fond_2014: { title: "Ketamine administration in depressive disorders: A systematic review and meta-analysis", authors: "Fond, G., et al.", journal: "Psychopharmacology", year: 2014, url: "https://doi.org/10.1007/s00213-014-3664-5" },
  source_ketamine_statpearls: { title: "Ketamine — StatPearls", authors: "Rosenbaum, S.B., et al.", journal: "StatPearls Publishing / NCBI Bookshelf", year: 2024, url: "https://www.ncbi.nlm.nih.gov/books/NBK470357/" },
  source_ketamine_rolan_2014: { title: "The absolute bioavailability of racemic ketamine from a novel sublingual formulation", authors: "Rolan, P., et al.", journal: "British Journal of Clinical Pharmacology", year: 2014, url: "https://doi.org/10.1111/bcp.12264" },
  source_ketamine_chong_2009: { title: "Development of a sublingual/oral formulation of ketamine for use in neuropathic pain", authors: "Chong, C., et al.", journal: "Clinical Drug Investigation", year: 2009, url: "https://doi.org/10.2165/00044011-200929050-00004" },
  source_ketamine_schoevers_2016: { title: "Oral ketamine for the treatment of pain and treatment-resistant depression", authors: "Schoevers, R.A., et al.", journal: "British Journal of Psychiatry", year: 2016, url: "https://doi.org/10.1192/bjp.bp.115.165498" },
  source_ketamine_andrade_2017: { title: "Ketamine for Depression, 4: In What Dose, at What Rate, by What Route, for How Long, and at What Frequency?", authors: "Andrade, C.", journal: "Journal of Clinical Psychiatry", year: 2017, url: "https://doi.org/10.4088/JCP.17f11738" },
  source_ketamine_chilukuri_2014: { title: "Intramuscular Ketamine in Acute Depression", authors: "Chilukuri, H., et al.", journal: "Indian Journal of Psychological Medicine", year: 2014, url: "https://doi.org/10.4103/0253-7176.127249" },
  source_ketamine_murrough_2013: { title: "Antidepressant Efficacy of Ketamine in Treatment-Resistant Major Depression", authors: "Murrough, J.W., et al.", journal: "American Journal of Psychiatry", year: 2013, url: "https://doi.org/10.1176/appi.ajp.2013.13030392" },
  source_pcp_1: { title: "Phencyclidine: mechanisms of action and history", authors: "Meltzer, H.Y., et al.", journal: "European Archives of Psychiatry and Clinical Neuroscience", year: 1999, url: "https://doi.org/10.1007/s004060050064" },
  source_2cb_1: { title: "First pharmacological and clinical study of 2C-B as a new psychoactive substance", authors: "Papaseit, E., et al.", journal: "British Journal of Clinical Pharmacology", year: 2018, url: "https://doi.org/10.1111/bcp.13511" },
  source_2cb_2: { title: "PiHKAL: A Chemical Love Story", authors: "Shulgin, A. & Shulgin, A.", journal: "Transform Press", year: 1991, url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml" },
  source_25i_1: { title: "25I-NBOMe: Clinical and laboratory findings in a series of overdose cases", authors: "Wood, D.M., et al.", journal: "Clinical Toxicology", year: 2015, url: "https://doi.org/10.3109/15563650.2014.990778" },
  source_25i_2: { title: "NBOMe compounds: A review of pharmacology, epidemiology and analytical methods", authors: "Zuba, D. & Byrska, B.", journal: "Drug Testing and Analysis", year: 2013, url: "https://doi.org/10.1002/dta.1468" },
  source_al_lad_1: { title: "AL-LAD and related lysergamides: In vitro and in vivo pharmacology", authors: "Brandt, S.D., et al.", journal: "Drug Testing and Analysis", year: 2017, url: "https://doi.org/10.1002/dta.2125" },
  source_candy_flip_1: { title: "Psychedelics and the human serotonergic system", authors: "Nichols, D.E.", journal: "Pharmacology & Therapeutics", year: 2004, url: "https://doi.org/10.1016/j.pharmthera.2004.01.003" },
  source_redosing_1: { title: "Drug–drug interactions involving classic psychedelics: A systematic review", authors: "Calder, A.E. & Hasler, G.", journal: "Frontiers in Psychiatry", year: 2024, url: "https://doi.org/10.3389/fpsyt.2024.1339607" }
};

// ─── SOURCE INDEX: which sources belong to each substance ────────────────────
const SUBSTANCE_SOURCE_MAP = {
  psilocybin:   ["source_psilocybin_1", "source_psilocybin_2", "source_psilocybin_3", "source_redosing_1"],
  lsd:          ["source_lsd_1", "source_lsd_2", "source_lsd_tolerance", "source_redosing_1"],
  dmt:          ["source_dmt_1", "source_dmt_2"],
  mescaline:    ["source_mescaline_1", "source_mescaline_2"],
  "5meo_dmt":   ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical"],
  ayahuasca:    ["source_ayahuasca_1", "source_ayahuasca_2", "source_ayahuasca_3"],
  salvinorin_a: ["source_salvinorin_1", "source_salvinorin_2"],
  ibogaine:     ["source_ibogaine_1", "source_ibogaine_2"],
  mdma:         ["source_mdma_1", "source_mdma_2", "source_mdma_3"],
  mda:          ["source_mda_1", "source_mda_2"],
  ketamine:     ["source_ketamine_1", "source_ketamine_2", "source_ketamine_fond_2014", "source_ketamine_statpearls", "source_ketamine_rolan_2014", "source_ketamine_chong_2009", "source_ketamine_schoevers_2016", "source_ketamine_andrade_2017", "source_ketamine_chilukuri_2014", "source_ketamine_murrough_2013"],
  pcp:          ["source_pcp_1"],
  "2cb":        ["source_2cb_1", "source_2cb_2"],
  "25i_nbome":  ["source_25i_1", "source_25i_2"],
  al_lad:       ["source_al_lad_1"],
  candy_flip:   ["source_candy_flip_1", "source_mdma_2", "source_lsd_2"],
  jedi_flip:    ["source_candy_flip_1", "source_psilocybin_2", "source_lsd_2", "source_mdma_2"],
  hippie_flip:  ["source_psilocybin_2", "source_mdma_1", "source_mdma_2"],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getDoseCategory(doses, dose) {
  const d = doses;
  if (dose < d.threshold) return "sub-threshold";
  if (dose < d.light) return "light";
  if (dose < d.moderate) return "moderate";
  if (dose < d.strong) return "strong";
  return "heavy";
}

function getDoseCategoryLabel(doses, dose) {
  const d = doses;
  if (dose < d.threshold) return { label: "Sub-threshold", color: C.greyDim };
  if (dose < d.light)     return { label: "Threshold",     color: C.tealSoft };
  if (dose < d.moderate)  return { label: "Light",         color: C.teal };
  if (dose < d.strong)    return { label: "Moderate",      color: C.tealSat };
  if (dose < d.heavy)     return { label: "Strong",        color: C.warning };
  return                         { label: "Heavy",         color: C.danger };
}

function generateCurve(onset, peak, duration, maxIntensity, booster) {
  const totalTime = booster
    ? Math.max(duration, booster.time + booster.duration) + 30
    : duration + 30;
  const points = [];
  for (let t = 0; t <= totalTime; t += 2) {
    let intensity = 0;
    if (t >= onset) {
      const rampTime = Math.max(1, peak - onset);
      const decayTime = Math.max(1, duration - peak);
      intensity = t <= peak
        ? maxIntensity * ((t - onset) / rampTime)
        : maxIntensity * Math.exp(-(t - peak) / (decayTime * 0.7));
    }
    if (booster && t >= booster.time) {
      const bt = t - booster.time;
      const bMax = booster.intensity;
      const bPeak = Math.max(1, booster.peak);
      const bDur = Math.max(1, booster.duration);
      const bI = bt <= bPeak
        ? bMax * (bt / bPeak)
        : bMax * Math.exp(-(bt - bPeak) / (bDur * 0.5));
      intensity = Math.min(10, intensity + bI);
    }
    points.push({ t, v: Math.max(0, intensity) });
  }
  return points;
}

// ─── INTENSITY GRAPH ─────────────────────────────────────────────────────────

function IntensityGraph({ src, dose, booster }) {
  const W = 600, H = 200, PL = 38, PR = 16, PT = 14, PB = 32;
  const doseRatio = Math.max(0.05, dose / src.doses.heavy);
  const maxInt = Math.min(10, doseRatio * 8 + 1);
  const boosterData = booster?.enabled
    ? { time: booster.time, intensity: Math.min(6, (booster.dose / src.doses.moderate) * 4), peak: src.peak, duration: src.duration }
    : null;
  const points = generateCurve(src.onset, src.peak, src.duration, maxInt, boosterData);
  const maxT = points[points.length - 1].t;
  const xS = t => PL + (t / maxT) * (W - PL - PR);
  const yS = v => PT + (1 - v / 10) * (H - PT - PB);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xS(p.t).toFixed(1)} ${yS(p.v).toFixed(1)}`).join(" ");
  const areaD = pathD + ` L ${xS(maxT).toFixed(1)} ${yS(0).toFixed(1)} L ${xS(0).toFixed(1)} ${yS(0).toFixed(1)} Z`;
  const hourTicks = [];
  for (let h = 0; h * 60 <= maxT; h++) hourTicks.push(h);
  return (
    <div style={{ background: C.bg, borderRadius: 12, padding: "14px 16px 10px", marginTop: 14, border: `1px solid ${C.border}` }}>
      <div style={{ color: C.greyDim, fontSize: 10, marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif" }}>Intensity Over Time</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0.4" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0,2,4,6,8,10].map(v => <line key={v} x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke={C.border} strokeWidth="1" />)}
        <path d={areaD} fill="url(#tg)" />
        <path d={pathD} fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {boosterData && <>
          <line x1={xS(boosterData.time)} y1={PT} x2={xS(boosterData.time)} y2={H-PB} stroke={C.tealSat} strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={xS(boosterData.time)+4} y={PT+11} fill={C.tealSat} fontSize="9" fontFamily="'Merriweather Sans', sans-serif">booster</text>
        </>}
        <line x1={PL} y1={PT} x2={PL} y2={H-PB} stroke={C.border} strokeWidth="1" />
        <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke={C.border} strokeWidth="1" />
        {[0,2,4,6,8,10].map(v => <text key={v} x={PL-5} y={yS(v)+3} textAnchor="end" fill={C.greyDim} fontSize="9" fontFamily="'Merriweather Sans', sans-serif">{v}</text>)}
        {hourTicks.map(h => <text key={h} x={xS(h*60)} y={H-PB+13} textAnchor="middle" fill={C.greyDim} fontSize="9" fontFamily="'Merriweather Sans', sans-serif">{h}h</text>)}
        <text x={PL-26} y={PT+(H-PT-PB)/2} textAnchor="middle" fill={C.greyDim} fontSize="9" fontFamily="'Merriweather Sans', sans-serif" transform={`rotate(-90,${PL-26},${PT+(H-PT-PB)/2})`}>Intensity</text>
      </svg>
    </div>
  );
}

// ─── SUBSTANCE GRID ───────────────────────────────────────────────────────────

function SubstanceGrid({ substances, combinations, selected, onSelect }) {
  const [tab, setTab] = useState("substances");
  const tabBtn = (active, label, onClick) => (
    <button onClick={onClick} style={{ flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 600, fontFamily: "'Merriweather Sans', sans-serif", background: active ? C.teal : "transparent", color: active ? C.bg : C.greyDim, border: "none", cursor: "pointer", borderRadius: 8, transition: "all 0.18s ease" }}>{label}</button>
  );
  return (
    <div style={{ marginTop: 20, background: C.surface, borderRadius: 16, padding: 18, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.bg, borderRadius: 10, padding: 4 }}>
        {tabBtn(tab === "substances", "Single Substances", () => setTab("substances"))}
        {tabBtn(tab === "combinations", "Combinations", () => setTab("combinations"))}
      </div>
      {tab === "substances" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {substances.map(s => {
            const isSel = selected?.id === s.id;
            return (
              <button key={s.id} onClick={() => onSelect(s)} style={{ padding: "11px 8px", background: isSel ? C.teal : C.surfaceLight, color: isSel ? C.bg : C.tealSoft, border: `1px solid ${isSel ? C.teal : C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: isSel ? 700 : 500, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "center", lineHeight: 1.25, transition: "all 0.15s ease", boxShadow: isSel ? `0 0 14px ${C.teal}66` : "none" }}>
                <div>{s.name}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{s.category}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {combinations.map(c => {
            const isSel = selected?.id === c.id;
            const compNames = c.components.map(id => substances.find(s => s.id === id)?.name).join(" + ");
            return (
              <button key={c.id} onClick={() => onSelect(c)} style={{ padding: "13px 16px", background: isSel ? C.tealSat : C.surfaceLight, color: isSel ? C.bg : C.tealSoft, border: `1px solid ${isSel ? C.tealSat : C.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left", lineHeight: 1.3, transition: "all 0.15s ease", boxShadow: isSel ? `0 0 14px ${C.tealSat}55` : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{compNames}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DOSE SLIDER ─────────────────────────────────────────────────────────────

function DoseSlider({ label, value, min, max, step, unit, onChange, accentColor, doseLabel }) {
  const acc = accentColor || C.teal;
  const nudge = (mult) => {
    const newVal = Math.max(min, Math.min(max, parseFloat((value + mult * step).toFixed(6))));
    onChange(newVal);
  };
  const btnStyle = (size) => ({
    width: size === "lg" ? 32 : 28, height: 30, borderRadius: 8, border: `1px solid ${C.border}`,
    background: C.surfaceLight, color: C.tealSoft, cursor: "pointer",
    fontSize: size === "lg" ? 14 : 11, display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 0.12s", letterSpacing: size === "sm" ? "-2px" : "0",
    fontFamily: "monospace"
  });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: C.greyDim, fontSize: 13, fontFamily: "'Merriweather Sans', sans-serif" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {doseLabel && <span style={{ color: doseLabel.color, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>{doseLabel.label}</span>}
          <span style={{ color: C.white, fontWeight: 700, fontSize: 15, fontFamily: "'Merriweather Sans', sans-serif" }}>{value.toFixed(value < 1 ? 2 : 1)} {unit}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <button onClick={() => nudge(-10)} style={btnStyle("sm")}>◀◀</button>
        <button onClick={() => nudge(-1)} style={btnStyle("lg")}>◀</button>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: acc, cursor: "pointer" }} />
        <button onClick={() => nudge(1)} style={btnStyle("lg")}>▶</button>
        <button onClick={() => nudge(10)} style={btnStyle("sm")}>▶▶</button>
      </div>
    </div>
  );
}

// ─── SOURCES MODAL ────────────────────────────────────────────────────────────

function SourcesModal({ sourceIds, onClose }) {
  const sources = sourceIds.map(id => ({ id, ...SOURCES[id] })).filter(s => s.title);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 16, padding: 26, maxWidth: 600, width: "100%", maxHeight: "80vh", overflowY: "auto", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: C.tealSoft, fontFamily: "'Merriweather', serif", margin: 0, fontSize: 18 }}>References & Sources</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.greyDim, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {sources.map((s, i) => (
          <div key={i} style={{ marginBottom: 12, padding: "13px 14px", background: C.bg, borderRadius: 10, borderLeft: `3px solid ${C.teal}` }}>
            <div style={{ color: C.white, fontSize: 13, fontWeight: 600, marginBottom: 4, fontFamily: "'Merriweather', serif" }}>[{i+1}] {s.title}</div>
            <div style={{ color: C.grey, fontSize: 12, marginBottom: 5, fontFamily: "'Merriweather Sans', sans-serif" }}>{s.authors} — <em>{s.journal}</em>, {s.year}</div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontSize: 11, wordBreak: "break-all", fontFamily: "'Merriweather Sans', sans-serif" }}>{s.url}</a>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: 12, background: C.surfaceLight, borderRadius: 8 }}>
          <p style={{ color: C.greyDim, fontSize: 11, margin: 0, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>All information is derived from published peer-reviewed scientific literature. No information is generated without a verified source.</p>
        </div>
      </div>
    </div>
  );
}

// ─── ALL REFERENCES MODAL ─────────────────────────────────────────────────────

function AllReferencesModal({ substances, combinations, onClose }) {
  const [activeId, setActiveId] = useState(null);
  const all = [...substances, ...combinations];
  const active = activeId ? all.find(s => s.id === activeId) : null;
  const sourceIds = activeId ? (SUBSTANCE_SOURCE_MAP[activeId] || []) : [];
  const sources = sourceIds.map(id => ({ id, ...SOURCES[id] })).filter(s => s.title);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 16, padding: 26, maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: C.tealSoft, fontFamily: "'Merriweather', serif", margin: 0, fontSize: 18 }}>
            {active ? (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
                {active.name}
              </span>
            ) : "All References & Sources"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.greyDim, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {!active ? (
          <>
            <p style={{ color: C.greyDim, fontSize: 12, marginBottom: 16, fontFamily: "'Merriweather Sans', sans-serif" }}>Select a molecule to view all its references and sources.</p>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Merriweather Sans', sans-serif" }}>Single Substances</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {substances.map(s => (
                  <button key={s.id} onClick={() => setActiveId(s.id)} style={{ padding: "10px 8px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "center", lineHeight: 1.25, transition: "all 0.15s" }}>
                    <div>{s.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{(SUBSTANCE_SOURCE_MAP[s.id] || []).length} sources</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, marginTop: 16, fontFamily: "'Merriweather Sans', sans-serif" }}>Combinations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {combinations.map(c => (
                  <button key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: "12px 14px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.65 }}>{(SUBSTANCE_SOURCE_MAP[c.id] || []).length} sources</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            {sources.length === 0 ? (
              <p style={{ color: C.greyDim, fontFamily: "'Merriweather Sans', sans-serif" }}>No sources found for this molecule.</p>
            ) : sources.map((s, i) => (
              <div key={i} style={{ marginBottom: 12, padding: "13px 14px", background: C.bg, borderRadius: 10, borderLeft: `3px solid ${C.teal}` }}>
                <div style={{ color: C.white, fontSize: 13, fontWeight: 600, marginBottom: 4, fontFamily: "'Merriweather', serif" }}>[{i+1}] {s.title}</div>
                <div style={{ color: C.grey, fontSize: 12, marginBottom: 5, fontFamily: "'Merriweather Sans', sans-serif" }}>{s.authors} — <em>{s.journal}</em>, {s.year}</div>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontSize: 11, wordBreak: "break-all", fontFamily: "'Merriweather Sans', sans-serif" }}>{s.url}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const SL = { color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif", marginBottom: 14 };

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [selected, setSelected] = useState(SUBSTANCES[0]);
  const [dose, setDose] = useState(SUBSTANCES[0].doses.moderate);
  const [comboDoses, setComboDoses] = useState({});
  const [showSources, setShowSources] = useState(false);
  const [showAllRefs, setShowAllRefs] = useState(false);
  const [booster, setBooster] = useState({ enabled: false, time: 60, dose: 0 });
  const [selectedRoa, setSelectedRoa] = useState("lozenge");
  const [selectedMeoSource, setSelectedMeoSource] = useState("synthetic");

  const isCombination = !!selected?.isCombination;
  const isKetamine = !!selected?.isKetamine;
  const is5MeO = !!selected?.is5MeO;
  const roaData = isKetamine ? KETAMINE_ROAS[selectedRoa] : null;
  const meoData = is5MeO ? MEO_SOURCES[selectedMeoSource] : null;
  const activeSrc = meoData || roaData || selected;
  const activeDoses = activeSrc?.doses;
  const activeUnit = activeSrc?.unit;

  const comboSubstances = isCombination
    ? selected.components.map(id => SUBSTANCES.find(s => s.id === id)).filter(Boolean)
    : [];

  const handleSelect = (item) => {
    setSelected(item);
    if (item.isCombination) {
      const defaults = {};
      item.components.forEach(id => {
        const s = SUBSTANCES.find(x => x.id === id);
        if (s) defaults[s.id] = s.doses.moderate;
      });
      setComboDoses(defaults);
    } else {
      const d = item.is5MeO ? MEO_SOURCES[selectedMeoSource].doses : item.isKetamine ? KETAMINE_ROAS[selectedRoa].doses : item.doses;
      setDose(d.moderate);
      setBooster(b => ({ ...b, dose: d.light, time: Math.round((item.is5MeO ? MEO_SOURCES[selectedMeoSource] : item.isKetamine ? KETAMINE_ROAS[selectedRoa] : item).peak * 0.5) }));
    }
  };

  const handleRoaChange = (roaId) => {
    setSelectedRoa(roaId);
    const roa = KETAMINE_ROAS[roaId];
    setDose(roa.doses.moderate);
    setBooster(b => ({ ...b, dose: roa.doses.light, time: Math.round(roa.peak * 0.5) }));
  };

  const handleMeoSourceChange = (srcId) => {
    setSelectedMeoSource(srcId);
    const src = MEO_SOURCES[srcId];
    setDose(src.doses.moderate);
    setBooster(b => ({ ...b, dose: src.doses.light, time: Math.round(src.peak * 0.5) }));
  };

  const allSourceIds = [...new Set([...(selected?.sources || []), ...(roaData?.sources || []), ...(meoData?.sources || [])])];
  const effectsCat = !isCombination ? getDoseCategory(activeDoses || selected.doses, dose) : "moderate";
  const currentEffects = !isCombination
    ? ((meoData || roaData || selected).effects[effectsCat] || (meoData || roaData || selected).effects.moderate)
    : null;
  const doseLabel = !isCombination ? getDoseCategoryLabel(activeDoses || selected.doses, dose) : null;
  const doseStep = activeDoses ? Math.max(0.001, (activeDoses.heavy * 1.5) / 200) : 1;
  const boosterStep = activeDoses ? Math.max(0.001, activeDoses.moderate / 100) : 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Merriweather Sans', sans-serif", paddingBottom: 60 }}>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Merriweather+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "22px 20px 18px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Merriweather', serif", fontWeight: 700, color: C.tealSoft, marginBottom: 4, fontSize: "clamp(15px,3.5vw,20px)", letterSpacing: "0.02em" }}>
          Tam Integration
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(14px,3vw,17px)", fontWeight: 400, fontFamily: "'Merriweather', serif", fontStyle: "italic", color: C.grey, lineHeight: 1.35 }}>
          Guide to Popular Molecules
        </h1>
        <p style={{ margin: "7px 0 0", color: C.greyDim, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>Evidence-based psychedelic substance reference</p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>

        <SubstanceGrid substances={SUBSTANCES} combinations={COMBINATIONS} selected={selected} onSelect={handleSelect} />

        {selected && (
          <>
            {/* Badge */}
            <div style={{ margin: "18px 0 0", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 13px", borderRadius: 20, background: isCombination ? `${C.tealSat}22` : `${C.teal}22`, color: isCombination ? C.tealSat : C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>
                {isCombination ? "Combination" : activeSrc.category || selected.category}
              </span>
              <span style={{ color: C.white, fontSize: 17, fontWeight: 700, fontFamily: "'Merriweather', serif" }}>{selected.name}</span>
            </div>

            {/* Combination description */}
            {isCombination && (
              <div style={{ margin: "12px 0 0", padding: 16, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <p style={{ margin: "0 0 12px", color: C.grey, fontSize: 13, lineHeight: 1.7, fontFamily: "'Merriweather', serif", fontWeight: 300 }}>{selected.description}</p>
                <div style={{ padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                  <span style={{ color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif", fontWeight: 700 }}>TIMING: </span>
                  <span style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{selected.timing}</span>
                </div>
              </div>
            )}

            {/* Ketamine ROA Selector */}
            {isKetamine && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={SL}>Route of Administration</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                  {Object.values(KETAMINE_ROAS).map(roa => {
                    const active = selectedRoa === roa.id;
                    return (
                      <button key={roa.id} onClick={() => handleRoaChange(roa.id)} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: active ? C.teal : C.surfaceLight, color: active ? C.bg : C.tealSoft, border: `1px solid ${active ? C.teal : C.border}`, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left", transition: "all 0.15s", boxShadow: active ? `0 0 12px ${C.teal}55` : "none" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{roa.label}</div>
                        <div style={{ fontSize: 10, opacity: 0.75 }}>Bioavailability: {roa.bioavailability}</div>
                      </button>
                    );
                  })}
                </div>
                {roaData && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `2px solid ${C.teal}55` }}>
                    <p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>{roaData.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* 5-MeO-DMT Source Selector */}
            {is5MeO && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={SL}>Source / Preparation</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                  {Object.values(MEO_SOURCES).map(src => {
                    const active = selectedMeoSource === src.id;
                    return (
                      <button key={src.id} onClick={() => handleMeoSourceChange(src.id)} style={{ padding: "11px 12px", borderRadius: 10, cursor: "pointer", background: active ? C.teal : C.surfaceLight, color: active ? C.bg : C.tealSoft, border: `1px solid ${active ? C.teal : C.border}`, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left", transition: "all 0.15s", boxShadow: active ? `0 0 12px ${C.teal}55` : "none" }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{src.label}</div>
                      </button>
                    );
                  })}
                </div>
                {meoData && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `2px solid ${C.teal}55` }}>
                    <p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>{meoData.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Dosage */}
            <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={SL}>{isCombination ? "Component Dosages" : "Dosage"}</div>
              {isCombination ? comboSubstances.map(s => {
                const cDose = comboDoses[s.id] ?? s.doses.moderate;
                const dl = getDoseCategoryLabel(s.doses, cDose);
                const cStep = Math.max(0.001, (s.doses.heavy * 1.5) / 200);
                return (
                  <div key={s.id} style={{ marginBottom: 20 }}>
                    <div style={{ color: C.tealSoft, fontSize: 13, fontWeight: 600, marginBottom: 8, fontFamily: "'Merriweather Sans', sans-serif" }}>{s.name}</div>
                    <DoseSlider label={s.name} value={cDose} min={0} max={s.doses.heavy * 1.5} step={cStep} unit={s.unit}
                      onChange={val => setComboDoses(prev => ({ ...prev, [s.id]: val }))} doseLabel={dl} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.greyDim, marginTop: 6, fontFamily: "'Merriweather Sans', sans-serif", paddingLeft: 68, paddingRight: 68 }}>
                      <span>Light {s.doses.light}</span><span>Mod {s.doses.moderate}</span><span>Heavy {s.doses.heavy}</span>
                    </div>
                  </div>
                );
              }) : (
                <>
                  <DoseSlider label="Primary Dose" value={dose} min={0} max={(activeDoses?.heavy || 100) * 1.5} step={doseStep} unit={activeUnit || "mg"}
                    onChange={setDose} doseLabel={doseLabel} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.greyDim, marginTop: 6, fontFamily: "'Merriweather Sans', sans-serif", paddingLeft: 68, paddingRight: 68 }}>
                    <span>Light {activeDoses?.light}</span><span>Mod {activeDoses?.moderate}</span><span>Heavy {activeDoses?.heavy}</span>
                  </div>
                </>
              )}
            </div>

            {/* Booster */}
            {!isCombination && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: booster.enabled ? 16 : 0 }}>
                  <div>
                    <div style={SL}>Booster Dose</div>
                    {!booster.enabled && <div style={{ color: C.greyDim, fontSize: 12, lineHeight: 1.5, marginTop: -10, maxWidth: 380, fontFamily: "'Merriweather Sans', sans-serif" }}>A supplemental dose taken 60–90 min in to extend or deepen the experience.</div>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                    {["Yes", "No"].map(opt => {
                      const isActive = opt === "Yes" ? booster.enabled : !booster.enabled;
                      return (
                        <button key={opt} onClick={() => setBooster(b => ({ ...b, enabled: opt === "Yes" }))} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, fontFamily: "'Merriweather Sans', sans-serif", cursor: "pointer", border: `1px solid ${isActive ? C.teal : C.border}`, background: isActive ? C.teal : C.surfaceLight, color: isActive ? C.bg : C.greyDim, transition: "all 0.15s" }}>{opt}</button>
                      );
                    })}
                  </div>
                </div>
                {booster.enabled && (
                  <>
                    {selected.boosterInfo && (
                      <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `2px solid ${C.tealSat}55`, marginBottom: 16 }}>
                        <p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>{selected.boosterInfo}</p>
                      </div>
                    )}
                    <div style={{ marginBottom: 16 }}>
                      <DoseSlider label="Time after initial dose" value={booster.time}
                        min={15} max={Math.round(activeSrc.duration * 0.7)} step={5} unit="min"
                        onChange={val => setBooster(b => ({ ...b, time: val }))} accentColor={C.tealSat} />
                    </div>
                    <DoseSlider label="Booster amount" value={booster.dose}
                      min={0} max={activeDoses?.moderate || 50} step={boosterStep} unit={activeUnit || "mg"}
                      onChange={val => setBooster(b => ({ ...b, dose: val }))} accentColor={C.tealSat} />
                    <div style={{ marginTop: 8, fontSize: 11, color: C.greyDim, fontFamily: "'Merriweather Sans', sans-serif", paddingLeft: 68 }}>Suggested: 25–50% of initial dose</div>
                  </>
                )}
              </div>
            )}

            {/* Graph */}
            {!isCombination && <IntensityGraph src={activeSrc} dose={dose} booster={booster} />}

            {/* Timeline */}
            {!isCombination && (
              <div style={{ margin: "14px 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { label: "Onset",    value: activeSrc.onset < 5 ? `${Math.round(activeSrc.onset * 60)}s` : `${activeSrc.onset}m` },
                  { label: "Peak",     value: `${activeSrc.peak}m` },
                  { label: "Duration", value: `${(activeSrc.duration / 60).toFixed(1)}h` }
                ].map(item => (
                  <div key={item.label} style={{ background: C.surface, borderRadius: 12, padding: "13px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
                    <div style={{ color: C.greyDim, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "'Merriweather Sans', sans-serif" }}>{item.label}</div>
                    <div style={{ color: C.tealSoft, fontWeight: 700, fontSize: 16, fontFamily: "'Merriweather Sans', sans-serif" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Effects */}
            {currentEffects && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={SL}>Expected Effects</div>
                  {doseLabel && <span style={{ padding: "3px 11px", borderRadius: 12, background: `${doseLabel.color}22`, color: doseLabel.color, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>{doseLabel.label}</span>}
                </div>
                {currentEffects.map((effect, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, marginBottom: 6, borderLeft: `2px solid ${C.teal}55` }}>
                    <span style={{ color: C.teal, fontSize: 13, marginTop: 1, flexShrink: 0 }}>◆</span>
                    <span style={{ color: C.grey, fontSize: 13, lineHeight: 1.5, fontFamily: "'Merriweather Sans', sans-serif" }}>{effect}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Combination effects */}
            {isCombination && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={SL}>Key Effects by Component</div>
                {comboSubstances.map(s => {
                  const cDose = comboDoses[s.id] ?? s.doses.moderate;
                  const cat = getDoseCategory(s.doses, cDose);
                  const eff = s.effects[cat] || s.effects.moderate;
                  return (
                    <div key={s.id} style={{ marginBottom: 18 }}>
                      <div style={{ color: C.tealSoft, fontSize: 12, fontWeight: 700, marginBottom: 8, fontFamily: "'Merriweather Sans', sans-serif" }}>{s.name}</div>
                      {eff.slice(0, 3).map((e, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, padding: "8px 12px", background: C.bg, borderRadius: 8, marginBottom: 5, borderLeft: `2px solid ${C.teal}55` }}>
                          <span style={{ color: C.teal, flexShrink: 0 }}>◆</span>
                          <span style={{ color: C.grey, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Safety */}
            <div style={{ margin: "14px 0 0", background: "#160e00", borderRadius: 16, padding: 20, border: "1px solid #3d2800" }}>
              <div style={{ ...SL, color: C.warning }}>⚠ Safety Considerations</div>
              {(isKetamine && roaData ? [...selected.safety, ...roaData.safety] : is5MeO && meoData ? meoData.safety : selected.safety).map((note, i) => (
                <div key={i} style={{ padding: "10px 12px", background: "rgba(245,158,11,0.07)", borderRadius: 8, borderLeft: "3px solid #f59e0b", marginBottom: 8 }}>
                  <span style={{ color: "#fcd34d", fontSize: 13, lineHeight: 1.5, fontFamily: "'Merriweather Sans', sans-serif" }}>{note}</span>
                </div>
              ))}
            </div>

            {/* Source buttons */}
            <button onClick={() => setShowSources(true)} style={{ margin: "14px 0 0", width: "100%", padding: 14, background: `${C.teal}18`, border: `1px solid ${C.teal}55`, borderRadius: 12, color: C.teal, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📚 View Sources & References ({allSourceIds.length})
            </button>
            <button onClick={() => setShowAllRefs(true)} style={{ margin: "8px 0 0", width: "100%", padding: 14, background: `${C.tealSoft}12`, border: `1px solid ${C.tealSoft}44`, borderRadius: 12, color: C.tealSoft, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📖 View All References & Sources
            </button>
          </>
        )}

        {/* Disclaimer */}
        <div style={{ margin: "28px 0 0", background: C.surface, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
          <div style={{ ...SL, color: C.tealSoft }}>Important Disclaimer</div>
          <p style={{ color: C.greyDim, fontSize: 12, lineHeight: 1.8, margin: "0 0 12px", fontFamily: "'Merriweather Sans', sans-serif" }}>
            <strong style={{ color: C.grey }}>This is not therapy.</strong> This is a service for healthy individuals who are looking for additional resources to support their growth. This is <strong style={{ color: C.grey }}>NOT</strong> intended to be group therapy nor any form of professional therapeutic intervention.
          </p>
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />
          <p style={{ color: C.greyDim, fontSize: 12, lineHeight: 1.8, margin: 0, fontFamily: "'Merriweather Sans', sans-serif" }}>
            We don't encourage or condone any illegal activities. Do not come to the group looking to purchase, sell, share or use of any illegal substances. Don't share information about illegal activities. You may be asked to leave if you do not adhere to this request. Thank you for making sure that our group stays safe for everyone.
          </p>
        </div>

        {/* Footer */}
        <div style={{ margin: "16px 0 0", textAlign: "center", padding: "18px 0 8px" }}>
          <p style={{ margin: "0 0 6px", color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>
            © {new Date().getFullYear()} Tam Integration. All rights reserved.
          </p>
          <p style={{ margin: 0, color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>
            To learn more about Tam Integration, visit{" "}
            <a href="https://tamintegration.com" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: "none", borderBottom: `1px solid ${C.teal}55` }}>tamintegration.com</a>
          </p>
        </div>

      </div>

      {showSources && <SourcesModal sourceIds={allSourceIds} onClose={() => setShowSources(false)} />}
      {showAllRefs && <AllReferencesModal substances={SUBSTANCES} combinations={COMBINATIONS} onClose={() => setShowAllRefs(false)} />}
    </div>
  );
}
