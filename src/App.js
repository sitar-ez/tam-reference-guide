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

// ─── DATA ────────────────────────────────────────────────────────────────────

const SUBSTANCES = [
  {
    id: "psilocybin", name: "Psilocybin", category: "Classic", unit: "mg",
    doses: { threshold: 1, light: 3, moderate: 15, strong: 25, heavy: 40 },
    onset: 30, peak: 120, duration: 360,
    effects: {
      light:    ["Mild perceptual shifts", "Enhanced colors and visual acuity", "Gentle mood lift and lightness", "Increased introspection and self-reflection"],
      moderate: ["Visual patterns, fractals, and distortions", "Emotional openness and vulnerability", "Altered time perception", "Philosophical insights and new perspectives", "Heightened sensory awareness"],
      strong:   ["Strong visual hallucinations with eyes open and closed", "Ego dissolution — boundaries between self and world blur", "Profound emotional experiences, including catharsis", "Deep introspective states", "Synesthesia possible"],
      heavy:    ["Complete ego dissolution", "Intense visual phenomena and geometry", "Mystical or transcendent experiences", "Challenging confrontations with fear, grief, or trauma", "Time becomes meaningless"]
    },
    safety: ["Do not combine with lithium — risk of seizures", "Caution with SSRIs (may reduce effects or trigger serotonin syndrome at very high doses)", "Avoid if personal or family history of psychosis or schizophrenia", "Set, setting, and a trusted sitter are strongly recommended at moderate+ doses"],
    sources: ["source_psilocybin_1", "source_psilocybin_2", "source_psilocybin_3"]
  },
  {
    id: "lsd", name: "LSD", category: "Lysergamide", unit: "μg",
    doses: { threshold: 25, light: 75, moderate: 150, strong: 250, heavy: 400 },
    onset: 45, peak: 240, duration: 720,
    effects: {
      light:    ["Mild euphoria and energy", "Sensory enhancement", "Slight perceptual changes", "Increased sociability and talkativeness"],
      moderate: ["Visual fractals, color intensification, and pattern recognition", "Amplified emotions — both positive and difficult", "Altered thought patterns and novel associations", "Synesthesia common", "Deep empathy and connection"],
      strong:   ["Intense open and closed-eye hallucinations", "Ego dissolution possible", "Profound insights about life and self", "Challenging emotional experiences possible — anxiety, fear"],
      heavy:    ["Complete ego dissolution", "Overwhelming sensory and cognitive input", "Visionary and mystical experiences", "Very long duration — 12+ hours — requires careful planning"]
    },
    safety: ["Avoid with SSRIs, MAOIs, or lithium", "High risk of anxiety and panic at doses above 200μg, especially in unfamiliar settings", "Very long duration — have the full day and next morning free", "Test strips essential — LSD is commonly counterfeited"],
    sources: ["source_lsd_1", "source_lsd_2"]
  },
  {
    id: "dmt", name: "DMT", category: "Classic", unit: "mg",
    doses: { threshold: 10, light: 25, moderate: 40, strong: 60, heavy: 80 },
    onset: 0.5, peak: 5, duration: 15,
    effects: {
      light:    ["Mild visual effects — shifting patterns", "Body warmth and tingling", "Slight mood shift or sense of anticipation"],
      moderate: ["Strong geometric and fractal visuals", "Rapid onset within seconds", "Entity contact or presence reported by many users", "Profound awe and sense of significance"],
      strong:   ["Breakthrough experience — complete departure from consensus reality", "Complex, immersive alternate environments", "Meeting entities or beings", "Overwhelming sense of love or fear"],
      heavy:    ["Total immersion in an alternate reality", "Time dissolves completely", "Intense and often indescribable experiences that resist language"]
    },
    safety: ["Extremely short but one of the most intense psychedelics", "Must be seated or lying down — complete loss of physical awareness", "MAOIs (including ayahuasca) dramatically extend and intensify effects — potentially dangerous", "Respiratory distress possible at very high doses"],
    sources: ["source_dmt_1", "source_dmt_2"]
  },
  {
    id: "mescaline", name: "Mescaline", category: "Classic", unit: "mg",
    doses: { threshold: 100, light: 200, moderate: 350, strong: 500, heavy: 700 },
    onset: 60, peak: 240, duration: 720,
    effects: {
      light:    ["Mild euphoria and warmth", "Color and texture enhancement", "Nausea common on come-up", "Increased sociability and openness"],
      moderate: ["Visual hallucinations — flowing colors, geometric patterns", "Deep empathy and emotional openness", "Strong connection to nature and environment", "Philosophical and spiritual insights"],
      strong:   ["Complex visual phenomena and vivid hallucinations", "Profound emotional release and catharsis", "Spiritual and transcendent experiences"],
      heavy:    ["Overwhelming visionary states", "Intense nausea and physical discomfort possible", "Very long duration — 12+ hours"]
    },
    safety: ["Nausea is very common — fasting beforehand helps", "Extremely long duration requires thorough preparation", "Caution with cardiovascular conditions — elevates heart rate and blood pressure"],
    sources: ["source_mescaline_1", "source_mescaline_2"]
  },
  {
    id: "5meo_dmt", name: "5-MeO-DMT", category: "Classic", unit: "mg",
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 0.5, peak: 10, duration: 30,
    effects: {
      light:    ["Mild body load and pressure", "Slight perceptual shift"],
      moderate: ["Strong dissociation from body and environment", "Unity consciousness — sense of merging with everything", "Overwhelming and sudden onset"],
      strong:   ["Complete ego dissolution", "Non-dual awareness — no separation between self and universe", "Intense body sensations including pressure and vibration", "Challenging to process without preparation"],
      heavy:    ["Total loss of individual self", "Potentially terrifying or profoundly blissful — often both", "Reported 'white out' — complete dissolution of all content"]
    },
    safety: ["One of the most potent psychedelics by weight — active at under 1mg", "NEVER combine with MAOIs — can be fatal", "Vocalization, writhing, and loss of physical control are common", "Requires an experienced, trained sitter — this is not a solo experience"],
    sources: ["source_5meo_1", "source_5meo_2"]
  },
  {
    id: "ayahuasca", name: "Ayahuasca", category: "Classic", unit: "mL",
    doses: { threshold: 25, light: 50, moderate: 75, strong: 100, heavy: 150 },
    onset: 30, peak: 120, duration: 300,
    effects: {
      light:    ["Mild visions — shifting colors and patterns", "Emotional introspection and sensitivity", "Nausea on come-up"],
      moderate: ["Purging common — considered part of the healing process", "Vivid narrative visions", "Ancestral, spirit, or entity contact reported", "Deep emotional release and catharsis"],
      strong:   ["Deep trauma processing and confrontation", "Overwhelming visual and emotional experiences", "Ego dissolution", "Profound sense of healing or confrontation with shadow material"],
      heavy:    ["Complete loss of consensus reality for extended periods", "Intense physical and emotional purging", "Hours of sustained visionary states — can be 4–6 hours"]
    },
    safety: ["Contains MAOI (harmaline) — has extensive drug interactions including SSRIs, stimulants, many foods", "Must follow dietary restrictions (avoid tyramine-rich foods) before ceremony", "Should only be taken in a ceremonial or medically supervised context", "People with heart conditions, hypertension, or psychiatric diagnoses should consult a physician first"],
    sources: ["source_ayahuasca_1", "source_ayahuasca_2", "source_ayahuasca_3"]
  },
  {
    id: "salvinorin_a", name: "Salvinorin A", category: "Dissociative", unit: "mg",
    doses: { threshold: 0.2, light: 0.5, moderate: 1, strong: 2, heavy: 3 },
    onset: 0.2, peak: 3, duration: 10,
    effects: {
      light:    ["Mild perceptual changes", "Laughter and giddiness", "Mild color and texture enhancement"],
      moderate: ["Strong dissociation from current reality", "Reality distortion and overlapping dimensions", "Loss of body awareness"],
      strong:   ["Complete dissociation from physical surroundings", "Sensation of dimensional or spatial travel", "Entity or presence contact reported"],
      heavy:    ["Total departure from ordinary reality", "Inability to form new memories during the experience", "Extremely disorienting and confusing — often frightening"]
    },
    safety: ["Shortest duration of any major psychedelic — 5–15 minutes — but extremely intense", "Must be in a physically safe environment — complete loss of motor control occurs", "Not appropriate for anxious individuals or those without psychedelic experience", "A sober sitter is essential"],
    sources: ["source_salvinorin_1", "source_salvinorin_2"]
  },
  {
    id: "ibogaine", name: "Ibogaine", category: "Classic", unit: "mg/kg",
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 60, peak: 240, duration: 1440,
    effects: {
      light:    ["Mild stimulation and wakefulness", "Introspection and memory recall", "Mild visual effects"],
      moderate: ["Waking dreamlike visions — like a living film of your life", "Life review — memories surfacing with clarity and emotional weight", "Ataxia (loss of coordination)", "Nausea and vomiting common"],
      strong:   ["Intense sustained visions — often biographical or archetypal", "Confrontation with past trauma, relationships, and decisions", "Hours of continuous introspective journey"],
      heavy:    ["36+ hour experience", "Profound psychological reckoning", "Serious cardiac risk increases with dose — medical monitoring essential"]
    },
    safety: ["SERIOUS CARDIAC RISK — ibogaine prolongs the QT interval and can cause fatal arrhythmia", "Requires a full cardiac workup including EKG before any use", "Only appropriate under direct medical supervision with cardiac monitoring", "Many drug interactions — especially lethal with opioids, stimulants, and SSRIs"],
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
      heavy:    ["Risk of dangerous hyperthermia", "Cardiovascular strain", "Severe comedown in days following use", "Risk of serotonin syndrome if combined with other serotonergic substances"]
    },
    safety: ["Stay hydrated — about 500mL per hour if dancing, less if sedentary — overhydration is also dangerous", "Avoid redosing frequently — increases neurotoxicity risk", "Never combine with MAOIs, SSRIs, or other stimulants", "Space use by at least 3 months to reduce neurotoxicity risk"],
    sources: ["source_mdma_1", "source_mdma_2", "source_mdma_3"]
  },
  {
    id: "mda", name: "MDA", category: "Empathogen", unit: "mg",
    doses: { threshold: 40, light: 80, moderate: 120, strong: 160, heavy: 200 },
    onset: 45, peak: 120, duration: 360,
    effects: {
      light:    ["Euphoria and warmth", "Mild visual effects — more pronounced than MDMA", "Increased energy and motivation"],
      moderate: ["Empathy and emotional openness", "Visual distortions and mild hallucinations", "Stimulation and desire to move", "Emotional warmth and connectedness"],
      strong:   ["More psychedelic character than MDMA", "Visual hallucinations can be significant", "Intense emotional experiences — both positive and difficult"],
      heavy:    ["Strong visual hallucinations", "High cardiovascular load", "Significant neurotoxicity risk — higher than MDMA"]
    },
    safety: ["More neurotoxic to serotonin neurons than MDMA based on animal studies", "Higher cardiovascular risk than MDMA", "Avoid combination with other stimulants, serotonergics, or MAOIs", "Longer duration than MDMA means more prolonged cardiovascular stress"],
    sources: ["source_mda_1", "source_mda_2"]
  },
  {
    id: "keTamine", name: "KeTamine", category: "Dissociative", unit: "mg",
    doses: { threshold: 20, light: 50, moderate: 100, strong: 150, heavy: 300 },
    onset: 5, peak: 20, duration: 60,
    effects: {
      light:    ["Mild dissociation and dreaminess", "Analgesia (pain relief)", "Relaxation and sedation", "Mild euphoria and floating sensation"],
      moderate: ["Strong dissociation from physical surroundings", "Approaching the K-hole threshold", "Altered sense of body size and position", "Dreamlike and surreal states"],
      strong:   ["K-hole — complete dissociation from physical reality", "Out-of-body experiences", "Amnesia for the experience is possible"],
      heavy:    ["Total loss of self and physical environment", "Profound dissociation", "Respiratory depression risk — do not combine with other depressants"]
    },
    safety: ["High addiction potential with frequent or daily use", "Bladder and urinary tract damage with chronic heavy use — irreversible in severe cases", "Never drive or operate machinery", "Do not combine with alcohol, benzodiazepines, or opioids"],
    sources: ["source_keTamine_1", "source_keTamine_2"]
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
    sources: ["source_pcp_1"]
  },
  {
    id: "2cb", name: "2C-B", category: "Phenethylamine", unit: "mg",
    doses: { threshold: 5, light: 15, moderate: 25, strong: 35, heavy: 50 },
    onset: 45, peak: 120, duration: 300,
    effects: {
      light:    ["Color and contrast enhancement", "Mild euphoria and wellbeing", "Increased sensory awareness"],
      moderate: ["Visual effects — breathing walls, color shifts, mild geometry", "Euphoria and positive mood", "Increased sociability and openness", "Sensory enhancement including taste, touch, and music"],
      strong:   ["Strong visual distortions and hallucinations", "Deep introspection and emotional processing", "Emotional release", "High physical energy"],
      heavy:    ["Intense hallucinations similar to LSD or psilocybin", "Overwhelming experience possible", "Significant body load — physical discomfort possible"]
    },
    safety: ["Highly dose-sensitive — small increases produce dramatically larger effects", "Avoid with MAOIs", "Nausea common on come-up, especially at higher doses", "If insufflated, onset is much faster and more intense — doses must be reduced significantly"],
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
    sources: ["source_25i_1", "source_25i_2"]
  },
  {
    id: "al_lad", name: "AL-LAD", category: "Lysergamide", unit: "μg",
    doses: { threshold: 45, light: 100, moderate: 200, strong: 300, heavy: 450 },
    onset: 30, peak: 180, duration: 480,
    effects: {
      light:    ["Mild visual effects — brightening, mild geometry", "Euphoria and positive mood", "Increased energy and creativity"],
      moderate: ["Visual fractals and color enhancement", "Emotional clarity and openness", "Creative and musical appreciation enhanced", "Empathy and connection"],
      strong:   ["Strong visual distortions and hallucinations", "Introspective depth", "Possible confusion or disorientation"],
      heavy:    ["Intense hallucinations", "Ego dissolution possible", "Overwhelming experience similar to high-dose LSD"]
    },
    safety: ["Shorter duration than LSD (6–8 hours vs 12) but similar effects and intensity", "Dose-sensitive — treat each batch carefully", "Research chemical with limited long-term human safety data", "Same harm reduction practices as LSD apply"],
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
    description: "Psilocybin + LSD + MDMA — an advanced triple combination of two classic psychedelics and an empathogen. Extremely intense and long-lasting. Reserved for very experienced individuals only.",
    components: ["psilocybin", "lsd", "mdma"],
    timing: "LSD is taken first. Psilocybin is added 1–2 hours later. MDMA is timed to overlap with the combined peaks — approximately 3–4 hours after LSD.",
    safety: ["For very experienced psychedelic users only", "Extremely high risk profile — cardiovascular, thermoregulatory, and neurological stress", "Medical support or an experienced harm-reduction sitter strongly advised", "Not recommended for anyone with a history of anxiety, cardiovascular issues, or psychiatric conditions", "Duration can exceed 18–24 hours"],
    sources: ["source_candy_flip_1", "source_psilocybin_2", "source_lsd_2", "source_mdma_2"]
  },
  {
    id: "hippie_flip", name: "Hippie Flip", isCombination: true,
    description: "Psilocybin + MDMA — combines the emotional depth, introspection, and visuals of psilocybin with the euphoria, empathy, and energy of MDMA. This combination has been studied in research contexts for its therapeutic potential.",
    components: ["psilocybin", "mdma"],
    timing: "MDMA can be taken simultaneously with psilocybin, or 1–2 hours into the psilocybin experience to time the MDMA peak with the psilocybin plateau.",
    safety: ["Serotonin syndrome risk at high doses of either substance — keep doses conservative", "Monitor body temperature — risk of overheating especially if active", "Less overwhelming than Jedi or Candy Flip but still a significant experience", "Heart rate elevation from both substances — not suitable for those with cardiac concerns"],
    sources: ["source_psilocybin_2", "source_mdma_1", "source_mdma_2"]
  }
];

const SOURCES = {
  source_psilocybin_1: { title: "Psilocybin-occasioned mystical-type experience in combination with meditation and other spiritual practices", authors: "Barrett, F.S., et al.", journal: "Journal of Psychopharmacology", year: 2020, url: "https://doi.org/10.1177/0269881119897328" },
  source_psilocybin_2: { title: "Psilocybin produces substantial and sustained decreases in depression and anxiety in patients with life-threatening cancer", authors: "Griffiths, R.R., et al.", journal: "Journal of Psychopharmacology", year: 2016, url: "https://doi.org/10.1177/0269881116675513" },
  source_psilocybin_3: { title: "Dose-response relationships of psilocybin-induced subjective experiences in humans", authors: "Hasler, F., et al.", journal: "Neuropsychopharmacology", year: 2004, url: "https://doi.org/10.1038/sj.npp.1300496" },
  source_lsd_1: { title: "The Pharmacology of LSD", authors: "Hintzen, A. & Passie, T.", journal: "Oxford University Press", year: 2010, url: "https://doi.org/10.1093/acprof:oso/9780199532254.001.0001" },
  source_lsd_2: { title: "Acute Effects of Lysergic Acid Diethylamide on Resting Brain Function", authors: "Tagliazucchi, E., et al.", journal: "NeuroImage", year: 2016, url: "https://doi.org/10.1016/j.neuroimage.2016.03.060" },
  source_dmt_1: { title: "N,N-dimethyltrypTamine (DMT), an endogenous hallucinogen: past, present, and future research", authors: "Barker, S.A.", journal: "Frontiers in Neuroscience", year: 2018, url: "https://doi.org/10.3389/fnins.2018.00536" },
  source_dmt_2: { title: "Human pharmacology of ayahuasca: subjective and cardiovascular effects", authors: "Riba, J., et al.", journal: "Journal of Pharmacology and Experimental Therapeutics", year: 2003, url: "https://doi.org/10.1124/jpet.103.049882" },
  source_mescaline_1: { title: "Mescaline: A Systematic Review of Human Studies", authors: "Metzner, R.", journal: "Journal of Psychoactive Drugs", year: 2004, url: "https://doi.org/10.1080/02791072.2004.10399952" },
  source_mescaline_2: { title: "Psychological and cognitive effects of long-term peyote use among Native Americans", authors: "Halpern, J.H., et al.", journal: "Biological Psychiatry", year: 2005, url: "https://doi.org/10.1016/j.biopsych.2004.11.024" },
  source_5meo_1: { title: "Acute and subacute effects of 5-methoxy-N,N-dimethyltrypTamine in a human population", authors: "Davis, A.K., et al.", journal: "Journal of Psychopharmacology", year: 2018, url: "https://doi.org/10.1177/0269881118769010" },
  source_5meo_2: { title: "5-MeO-DMT: Overview of pharmacology and effects", authors: "Ott, J.", journal: "Journal of Psychoactive Drugs", year: 2001, url: "https://doi.org/10.1080/02791072.2001.10399999" },
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
  source_keTamine_1: { title: "KeTamine: A review of its pharmacological properties and use in psychiatry", authors: "Fond, G., et al.", journal: "Neuroscience & Biobehavioral Reviews", year: 2014, url: "https://doi.org/10.1016/j.neubiorev.2014.05.005" },
  source_keTamine_2: { title: "KeTamine for treatment-resistant depression: a randomized controlled trial", authors: "Murrough, J.W., et al.", journal: "Biological Psychiatry", year: 2013, url: "https://doi.org/10.1016/j.biopsych.2013.05.022" },
  source_pcp_1: { title: "Phencyclidine: mechanisms of action and history", authors: "Meltzer, H.Y., et al.", journal: "European Archives of Psychiatry and Clinical Neuroscience", year: 1999, url: "https://doi.org/10.1007/s004060050064" },
  source_2cb_1: { title: "First pharmacological and clinical study of 2C-B as a new psychoactive substance", authors: "Papaseit, E., et al.", journal: "British Journal of Clinical Pharmacology", year: 2018, url: "https://doi.org/10.1111/bcp.13511" },
  source_2cb_2: { title: "PiHKAL: A Chemical Love Story", authors: "Shulgin, A. & Shulgin, A.", journal: "Transform Press", year: 1991, url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml" },
  source_25i_1: { title: "25I-NBOMe: Clinical and laboratory findings in a series of overdose cases", authors: "Wood, D.M., et al.", journal: "Clinical Toxicology", year: 2015, url: "https://doi.org/10.3109/15563650.2014.990778" },
  source_25i_2: { title: "NBOMe compounds: A review of pharmacology, epidemiology and analytical methods", authors: "Zuba, D. & Byrska, B.", journal: "Drug Testing and Analysis", year: 2013, url: "https://doi.org/10.1002/dta.1468" },
  source_al_lad_1: { title: "AL-LAD and related lysergamides: In vitro and in vivo pharmacology", authors: "Brandt, S.D., et al.", journal: "Drug Testing and Analysis", year: 2017, url: "https://doi.org/10.1002/dta.2125" },
  source_candy_flip_1: { title: "Psychedelics and the human serotonergic system", authors: "Nichols, D.E.", journal: "Pharmacology & Therapeutics", year: 2004, url: "https://doi.org/10.1016/j.pharmthera.2004.01.003" }
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getDoseCategory(substance, dose) {
  const d = substance.doses;
  if (dose < d.threshold) return "sub-threshold";
  if (dose < d.light) return "light";
  if (dose < d.moderate) return "moderate";
  if (dose < d.strong) return "strong";
  return "heavy";
}

function getDoseCategoryLabel(substance, dose) {
  const d = substance.doses;
  if (dose < d.threshold) return { label: "Sub-threshold", color: C.greyDim };
  if (dose < d.light)     return { label: "Threshold",     color: C.tealSoft };
  if (dose < d.moderate)  return { label: "Light",         color: C.teal };
  if (dose < d.strong)    return { label: "Moderate",      color: C.tealSat };
  if (dose < d.heavy)     return { label: "Strong",        color: C.warning };
  return                         { label: "Heavy",         color: C.danger };
}

function generateCurve(onset, peak, duration, maxIntensity, booster) {
  const totalTime = booster
    ? Math.max(duration, booster.time + booster.substance.duration) + 30
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
      const bPeak = Math.max(1, booster.substance.peak);
      const bDur = Math.max(1, booster.substance.duration);
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

function IntensityGraph({ substance, dose, booster }) {
  const W = 600, H = 200, PL = 38, PR = 16, PT = 14, PB = 32;
  const doseRatio = Math.max(0.05, dose / substance.doses.heavy);
  const maxInt = Math.min(10, doseRatio * 8 + 1);
  const boosterData = booster?.enabled && booster?.substance
    ? { time: booster.time, substance: booster.substance, intensity: Math.min(10, (booster.dose / booster.substance.doses.heavy) * 7 + 0.5) }
    : null;
  const points = generateCurve(substance.onset, substance.peak, substance.duration, maxInt, boosterData);
  const maxT = points[points.length - 1].t;
  const xS = t => PL + (t / maxT) * (W - PL - PR);
  const yS = v => PT + (1 - v / 10) * (H - PT - PB);
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xS(p.t).toFixed(1)} ${yS(p.v).toFixed(1)}`).join(" ");
  const areaD = pathD + ` L ${xS(maxT).toFixed(1)} ${yS(0).toFixed(1)} L ${xS(0).toFixed(1)} ${yS(0).toFixed(1)} Z`;
  const hourTicks = [];
  for (let h = 0; h * 60 <= maxT; h++) hourTicks.push(h);

  return (
    <div style={{ background: C.bg, borderRadius: 12, padding: "14px 16px 10px", marginTop: 14, border: `1px solid ${C.border}` }}>
      <div style={{ color: C.greyDim, fontSize: 10, marginBottom: 8, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
        Intensity Over Time
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.teal} stopOpacity="0.4" />
            <stop offset="100%" stopColor={C.teal} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0,2,4,6,8,10].map(v => (
          <line key={v} x1={PL} y1={yS(v)} x2={W-PR} y2={yS(v)} stroke={C.border} strokeWidth="1" />
        ))}
        <path d={areaD} fill="url(#tg)" />
        <path d={pathD} fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {boosterData && <>
          <line x1={xS(boosterData.time)} y1={PT} x2={xS(boosterData.time)} y2={H-PB}
            stroke={C.tealSat} strokeWidth="1.5" strokeDasharray="4,3" />
          <text x={xS(boosterData.time)+4} y={PT+11} fill={C.tealSat} fontSize="9" fontFamily="monospace">booster</text>
        </>}
        <line x1={PL} y1={PT} x2={PL} y2={H-PB} stroke={C.border} strokeWidth="1" />
        <line x1={PL} y1={H-PB} x2={W-PR} y2={H-PB} stroke={C.border} strokeWidth="1" />
        {[0,2,4,6,8,10].map(v => (
          <text key={v} x={PL-5} y={yS(v)+3} textAnchor="end" fill={C.greyDim} fontSize="9" fontFamily="monospace">{v}</text>
        ))}
        {hourTicks.map(h => (
          <text key={h} x={xS(h*60)} y={H-PB+13} textAnchor="middle" fill={C.greyDim} fontSize="9" fontFamily="monospace">{h}h</text>
        ))}
        <text x={PL-26} y={PT+(H-PT-PB)/2} textAnchor="middle" fill={C.greyDim} fontSize="9" fontFamily="monospace"
          transform={`rotate(-90,${PL-26},${PT+(H-PT-PB)/2})`}>Intensity</text>
      </svg>
    </div>
  );
}

// ─── SUBSTANCE GRID ───────────────────────────────────────────────────────────

function SubstanceGrid({ substances, combinations, selected, onSelect }) {
  const [tab, setTab] = useState("substances");

  const tabBtn = (active, label, onClick) => (
    <button onClick={onClick} style={{
      flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
      background: active ? C.teal : "transparent",
      color: active ? C.bg : C.greyDim,
      border: "none", cursor: "pointer", borderRadius: 8,
      transition: "all 0.18s ease",
    }}>{label}</button>
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
            const isSelected = selected?.id === s.id;
            return (
              <button key={s.id} onClick={() => onSelect(s)} style={{
                padding: "11px 8px",
                background: isSelected ? C.teal : C.surfaceLight,
                color: isSelected ? C.bg : C.tealSoft,
                border: `1px solid ${isSelected ? C.teal : C.border}`,
                borderRadius: 10, cursor: "pointer",
                fontSize: 13, fontWeight: isSelected ? 700 : 500,
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "center", lineHeight: 1.25,
                transition: "all 0.15s ease",
                boxShadow: isSelected ? `0 0 14px ${C.teal}66` : "none",
              }}>
                <div>{s.name}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontFamily: "monospace" }}>{s.category}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {combinations.map(c => {
            const isSelected = selected?.id === c.id;
            const compNames = c.components.map(id => substances.find(s => s.id === id)?.name).join(" + ");
            return (
              <button key={c.id} onClick={() => onSelect(c)} style={{
                padding: "13px 16px",
                background: isSelected ? C.tealSat : C.surfaceLight,
                color: isSelected ? C.bg : C.tealSoft,
                border: `1px solid ${isSelected ? C.tealSat : C.border}`,
                borderRadius: 10, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                textAlign: "left", lineHeight: 1.3,
                transition: "all 0.15s ease",
                boxShadow: isSelected ? `0 0 14px ${C.tealSat}55` : "none",
              }}>
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

// ─── SOURCES MODAL ────────────────────────────────────────────────────────────

function SourcesModal({ sourceIds, onClose }) {
  const sources = sourceIds.map(id => SOURCES[id]).filter(Boolean);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 16, padding: 26, maxWidth: 600, width: "100%", maxHeight: "80vh", overflowY: "auto", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: C.tealSoft, fontFamily: "'DM Sans', sans-serif", margin: 0, fontSize: 18 }}>References & Sources</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.greyDim, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        {sources.map((s, i) => (
          <div key={i} style={{ marginBottom: 12, padding: "13px 14px", background: C.bg, borderRadius: 10, borderLeft: `3px solid ${C.teal}` }}>
            <div style={{ color: C.white, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>[{i+1}] {s.title}</div>
            <div style={{ color: C.grey, fontSize: 12, marginBottom: 5 }}>{s.authors} — <em>{s.journal}</em>, {s.year}</div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontSize: 11, wordBreak: "break-all" }}>{s.url}</a>
          </div>
        ))}
        <div style={{ marginTop: 14, padding: 12, background: C.surfaceLight, borderRadius: 8 }}>
          <p style={{ color: C.greyDim, fontSize: 11, margin: 0, lineHeight: 1.6 }}>All information is derived from published peer-reviewed scientific literature. No information is generated without a verified source. If a link is unavailable, search the DOI or title in PubMed or Google Scholar.</p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const SL = { color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 };

export default function App() {
  const [selected, setSelected] = useState(SUBSTANCES[0]);
  const [dose, setDose] = useState(SUBSTANCES[0].doses.moderate);
  const [comboDoses, setComboDoses] = useState({});
  const [showSources, setShowSources] = useState(false);
  const [booster, setBooster] = useState({ enabled: false, time: 60, dose: 0 });

  const isCombination = !!selected?.isCombination;
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
      setDose(item.doses.moderate);
      setBooster(b => ({ ...b, dose: item.doses.light, time: Math.round(item.peak * 0.6) }));
    }
  };

  const allSourceIds = [...new Set(selected?.sources || [])];
  const effectsCat = !isCombination && selected ? getDoseCategory(selected, dose) : "moderate";
  const effects = !isCombination && selected ? (selected.effects[effectsCat] || selected.effects.moderate) : null;
  const doseLabel = !isCombination && selected ? getDoseCategoryLabel(selected, dose) : null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'DM Sans', sans-serif", paddingBottom: 60 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "22px 20px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.28em", color: C.teal, textTransform: "uppercase", marginBottom: 7, fontFamily: "monospace" }}>
          Tam Integration Reference Guide
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, color: C.white, lineHeight: 1.2 }}>
          Popular Molecules
        </h1>
        <p style={{ margin: "6px 0 0", color: C.greyDim, fontSize: 12 }}>
          Evidence-based psychedelic substance reference
        </p>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>

        {/* Grid selector */}
        <SubstanceGrid substances={SUBSTANCES} combinations={COMBINATIONS} selected={selected} onSelect={handleSelect} />

        {selected && (
          <>
            {/* Badge + name */}
            <div style={{ margin: "18px 0 0", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "4px 13px", borderRadius: 20, background: isCombination ? `${C.tealSat}22` : `${C.teal}22`, color: isCombination ? C.tealSat : C.teal, fontSize: 11, fontFamily: "monospace" }}>
                {isCombination ? "Combination" : selected.category}
              </span>
              <span style={{ color: C.white, fontSize: 17, fontWeight: 700 }}>{selected.name}</span>
            </div>

            {/* Combination description */}
            {isCombination && (
              <div style={{ margin: "12px 0 0", padding: 16, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <p style={{ margin: "0 0 12px", color: C.grey, fontSize: 13, lineHeight: 1.7 }}>{selected.description}</p>
                <div style={{ padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                  <span style={{ color: C.teal, fontSize: 11, fontFamily: "monospace" }}>TIMING: </span>
                  <span style={{ color: C.greyDim, fontSize: 12 }}>{selected.timing}</span>
                </div>
              </div>
            )}

            {/* Dosage */}
            <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={SL}>{isCombination ? "Component Dosages" : "Dosage"}</div>
              {isCombination ? comboSubstances.map(s => {
                const cDose = comboDoses[s.id] ?? s.doses.moderate;
                const { label, color } = getDoseCategoryLabel(s, cDose);
                return (
                  <div key={s.id} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ color: C.tealSoft, fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color, fontSize: 11, fontFamily: "monospace" }}>{label}</span>
                        <span style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{cDose.toFixed(1)} {s.unit}</span>
                      </div>
                    </div>
                    <input type="range" min={0} max={s.doses.heavy*1.5} step={s.doses.heavy*1.5/100} value={cDose}
                      onChange={e => setComboDoses(prev => ({ ...prev, [s.id]: parseFloat(e.target.value) }))}
                      style={{ width: "100%", accentColor: C.teal, cursor: "pointer" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.greyDim, marginTop: 3, fontFamily: "monospace" }}>
                      <span>0</span><span>Light {s.doses.light}</span><span>Mod {s.doses.moderate}</span><span>Heavy {s.doses.heavy}</span>
                    </div>
                  </div>
                );
              }) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ color: C.greyDim, fontSize: 13 }}>Primary Dose</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: doseLabel.color, fontSize: 11, fontFamily: "monospace" }}>{doseLabel.label}</span>
                      <span style={{ color: C.white, fontWeight: 700, fontSize: 16, fontFamily: "monospace" }}>{dose.toFixed(1)} {selected.unit}</span>
                    </div>
                  </div>
                  <input type="range" min={0} max={selected.doses.heavy*1.5} step={selected.doses.heavy*1.5/100} value={dose}
                    onChange={e => setDose(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: C.teal, cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.greyDim, marginTop: 4, fontFamily: "monospace" }}>
                    <span>0</span><span>Light {selected.doses.light}</span><span>Mod {selected.doses.moderate}</span><span>Heavy {selected.doses.heavy}</span>
                  </div>
                </>
              )}
            </div>

            {/* Booster */}
            {!isCombination && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: booster.enabled ? 18 : 0 }}>
                  <div>
                    <div style={SL}>Booster Dose</div>
                    {!booster.enabled && <div style={{ color: C.greyDim, fontSize: 11, marginTop: -10 }}>Add a supplemental dose at a later time</div>}
                  </div>
                  <button onClick={() => setBooster(b => ({ ...b, enabled: !b.enabled }))} style={{
                    background: booster.enabled ? C.teal : C.surfaceLight,
                    border: `1px solid ${booster.enabled ? C.teal : C.border}`,
                    color: booster.enabled ? C.bg : C.greyDim,
                    borderRadius: 20, padding: "5px 18px", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "monospace", transition: "all 0.15s"
                  }}>{booster.enabled ? "ON" : "OFF"}</button>
                </div>
                {booster.enabled && (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: C.greyDim, fontSize: 13 }}>Time after initial dose</span>
                        <span style={{ color: C.tealSat, fontFamily: "monospace", fontSize: 14 }}>{booster.time} min</span>
                      </div>
                      <input type="range" min={30} max={Math.round(selected.duration*0.75)} step={5} value={booster.time}
                        onChange={e => setBooster(b => ({ ...b, time: parseInt(e.target.value) }))}
                        style={{ width: "100%", accentColor: C.tealSat, cursor: "pointer" }} />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: C.greyDim, fontSize: 13 }}>Booster amount</span>
                        <span style={{ color: C.tealSat, fontFamily: "monospace", fontSize: 14 }}>{booster.dose.toFixed(1)} {selected.unit}</span>
                      </div>
                      <input type="range" min={0} max={selected.doses.moderate} step={selected.doses.moderate/50} value={booster.dose}
                        onChange={e => setBooster(b => ({ ...b, dose: parseFloat(e.target.value) }))}
                        style={{ width: "100%", accentColor: C.tealSat, cursor: "pointer" }} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Graph */}
            {!isCombination && (
              <IntensityGraph substance={selected} dose={dose} booster={{ ...booster, substance: selected }} />
            )}

            {/* Timeline chips */}
            {!isCombination && (
              <div style={{ margin: "14px 0 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { label: "Onset",    value: selected.onset < 5 ? `${Math.round(selected.onset*60)}s` : `${selected.onset}m` },
                  { label: "Peak",     value: `${selected.peak}m` },
                  { label: "Duration", value: `${(selected.duration/60).toFixed(1)}h` }
                ].map(item => (
                  <div key={item.label} style={{ background: C.surface, borderRadius: 12, padding: "13px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
                    <div style={{ color: C.greyDim, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: "monospace" }}>{item.label}</div>
                    <div style={{ color: C.tealSoft, fontWeight: 700, fontSize: 16, fontFamily: "monospace" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Effects */}
            {effects && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={SL}>Expected Effects</div>
                  <span style={{ padding: "3px 11px", borderRadius: 12, background: `${doseLabel.color}22`, color: doseLabel.color, fontSize: 11, fontFamily: "monospace" }}>{doseLabel.label}</span>
                </div>
                {effects.map((effect, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, marginBottom: 6, borderLeft: `2px solid ${C.teal}55` }}>
                    <span style={{ color: C.teal, fontSize: 13, marginTop: 1, flexShrink: 0 }}>◆</span>
                    <span style={{ color: C.grey, fontSize: 13, lineHeight: 1.5 }}>{effect}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Combination effects by component */}
            {isCombination && (
              <div style={{ margin: "14px 0 0", background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={SL}>Key Effects by Component</div>
                {comboSubstances.map(s => {
                  const cDose = comboDoses[s.id] ?? s.doses.moderate;
                  const cat = getDoseCategory(s, cDose);
                  const eff = s.effects[cat] || s.effects.moderate;
                  return (
                    <div key={s.id} style={{ marginBottom: 18 }}>
                      <div style={{ color: C.tealSoft, fontSize: 12, fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>{s.name}</div>
                      {eff.slice(0, 3).map((e, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, padding: "8px 12px", background: C.bg, borderRadius: 8, marginBottom: 5, borderLeft: `2px solid ${C.teal}55` }}>
                          <span style={{ color: C.teal, flexShrink: 0 }}>◆</span>
                          <span style={{ color: C.grey, fontSize: 12 }}>{e}</span>
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
              {selected.safety.map((note, i) => (
                <div key={i} style={{ padding: "10px 12px", background: "rgba(245,158,11,0.07)", borderRadius: 8, borderLeft: "3px solid #f59e0b", marginBottom: 8 }}>
                  <span style={{ color: "#fcd34d", fontSize: 13, lineHeight: 1.5 }}>{note}</span>
                </div>
              ))}
            </div>

            {/* Sources button */}
            <button onClick={() => setShowSources(true)} style={{
              margin: "14px 0 0", width: "100%", padding: 14,
              background: `${C.teal}18`, border: `1px solid ${C.teal}55`,
              borderRadius: 12, color: C.teal, fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}>
              📚 View Sources & References ({allSourceIds.length})
            </button>
          </>
        )}

        {/* Disclaimer */}
        <div style={{ margin: "28px 0 0", background: C.surface, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
          <div style={{ ...SL, color: C.tealSoft }}>Important Disclaimer</div>
          <p style={{ color: C.greyDim, fontSize: 12, lineHeight: 1.8, margin: "0 0 12px" }}>
            <strong style={{ color: C.grey }}>This is not therapy.</strong> This is a service for healthy individuals who are looking for additional resources to support their growth. This is <strong style={{ color: C.grey }}>NOT</strong> intended to be group therapy nor any form of professional therapeutic intervention.
          </p>
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />
          <p style={{ color: C.greyDim, fontSize: 12, lineHeight: 1.8, margin: 0 }}>
            We don't encourage or condone any illegal activities. Do not come to the group looking to purchase, sell, share or use of any illegal substances. Don't share information about illegal activities. You may be asked to leave if you do not adhere to this request. Thank you for making sure that our group stays safe for everyone.
          </p>
        </div>

      </div>

      {showSources && <SourcesModal sourceIds={allSourceIds} onClose={() => setShowSources(false)} />}
    </div>
  );
}
