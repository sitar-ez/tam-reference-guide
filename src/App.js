import { useState, useRef, useEffect, useCallback } from "react";

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
  danger:       "#ef4445",
};

// ─── KETAMINE ROA DATA ────────────────────────────────────────────────────────
const KETAMINE_ROAS = {
  lozenge: {
    id: "lozenge", label: "Lozenge / Troche", unit: "mg", bioavailability: "25–30%",
    doses: { threshold: 50, light: 100, moderate: 200, strong: 300, heavy: 450 },
    onset: 20, peak: 60, duration: 90,
    notes: "Hold under tongue for 15–20 minutes without swallowing. Bioavailability is 25–30% — significantly lower than injection routes. Most common route for at-home ketamine therapy programs.",
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
    safety: ["Nasal mucosa damage with chronic use", "Bioavailability is variable depending on nasal condition", "Faster onset means intensity can escalate quickly — start low", "Do not combine with other depressants"],
    sources: ["source_ketamine_schoevers_2016", "source_ketamine_statpearls", "source_ketamine_andrade_2017"]
  },
  iv: {
    id: "iv", label: "Intravenous (IV)", unit: "mg/kg", bioavailability: "100%",
    doses: { threshold: 0.1, light: 0.25, moderate: 0.5, strong: 0.75, heavy: 1.5 },
    onset: 0.5, peak: 5, duration: 30,
    notes: "100% bioavailability — the gold standard for precision dosing. For depression, typically 0.5 mg/kg over 40–45 minutes in a clinical setting. Onset within 30–60 seconds. Must only be administered by medical professionals.",
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
    notes: "Dried secretion from the parotoid glands of the Sonoran Desert toad (Incilius alvarius). Contains 5-MeO-DMT at roughly 10–30% of dry weight alongside bufotenine, bufotalin, and catecholamines. Potency varies significantly — dosing by venom weight is inherently imprecise. Doses listed are for dried venom, not pure 5-MeO-DMT content.",
    effects: {
      light:    ["Mild body load and tingling", "Slight warmth and perceptual shift", "Light mood elevation"],
      moderate: ["Moderate dissociation", "Onset of unity sensations", "Body pressure and vibration", "Emotional warmth and openness"],
      strong:   ["Complete ego dissolution", "Non-dual awareness — self and universe merge", "Intense physical sensations and pressure", "Vocalization and involuntary movement common"],
      heavy:    ["Total loss of self", "Overwhelming experience — often beyond description", "Complete departure from ordinary reality", "Additional cardiovascular risk from co-occurring alkaloids"]
    },
    safety: ["Potency is highly variable — 5-MeO-DMT content ranges from 10–30% of dried venom; dosing is inherently imprecise", "Contains cardioactive bufagins and catecholamines — additional cardiac risk compared to synthetic", "NEVER combine with MAOIs — potentially fatal", "Ecological concern: harvesting stresses wild toad populations; synthetic is the ecologically responsible choice", "A trained sitter is essential — complete loss of motor control is common"],
    sources: ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical"]
  },
  synthetic: {
    id: "synthetic", label: "Synthetic (Pure)", unit: "mg",
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 0.3, peak: 5, duration: 20,
    notes: "Pure synthesized 5-MeO-DMT. Precise dosing — 5mg is always 5mg. Preferred in clinical research. No entourage alkaloids means a cleaner pharmacological profile and lower cardiovascular risk than toad venom. Also the ecologically responsible choice.",
    effects: {
      light:    ["Mild body load and pressure", "Slight perceptual shift"],
      moderate: ["Strong dissociation from body and environment", "Unity consciousness — sense of merging with everything", "Overwhelming and sudden onset"],
      strong:   ["Complete ego dissolution", "Non-dual awareness — no separation between self and universe", "Intense body sensations including pressure and vibration"],
      heavy:    ["Total loss of individual self", "Potentially terrifying or profoundly blissful — often both", "Reported 'white out' — complete dissolution of all content"]
    },
    safety: ["One of the most potent psychedelics by weight — active at 1mg", "NEVER combine with MAOIs — can be fatal", "Vocalization, writhing, and loss of physical control are common", "Requires an experienced, trained sitter — not appropriate for solo use", "Precise dosing makes this safer than toad venom for experienced facilitators"],
    sources: ["source_5meo_1", "source_5meo_2", "source_5meo_reckweg", "source_5meo_clinical"]
  }
};

// ─── SUBSTANCE DATA ───────────────────────────────────────────────────────────
const SUBSTANCES = [
  {
    id: "psilocybin", name: "Psilocybin", category: "Tryptamine", unit: "mg",
    doses: { threshold: 1, light: 3, moderate: 15, strong: 25, heavy: 40 },
    onset: 30, peak: 120, duration: 360,
    history: "Psilocybin is the prodrug of psilocin, the active compound found naturally in over 200 species of fungi, primarily of the genus Psilocybe. Indigenous Mesoamerican cultures — particularly the Mazatec people of Oaxaca, Mexico — have used psilocybin mushrooms in healing ceremonies called veladas for thousands of years. The Mazatec healer María Sabina became the first indigenous practitioner to allow outsiders to participate in these ceremonies, leading to the 1957 Life magazine article by R. Gordon Wasson that introduced psilocybin mushrooms to Western culture. Swiss chemist Albert Hofmann isolated and synthesized psilocybin in 1958, opening the door to psychiatric research. Timothy Leary and Richard Alpert conducted the Harvard Psilocybin Project in the early 1960s, studying its effects on personality, creativity, and spiritual experience. Following scheduling in the 1970s, research effectively halted for three decades. The current renaissance — led by Johns Hopkins, NYU, and Imperial College London — has produced compelling evidence for psilocybin in treating depression, addiction, anxiety, and end-of-life distress.",
    effects: {
      light:    ["Mild perceptual shifts", "Enhanced colors and visual acuity", "Gentle mood lift and lightness", "Increased introspection"],
      moderate: ["Visual patterns, fractals, and distortions", "Emotional openness and vulnerability", "Altered time perception", "Philosophical insights"],
      strong:   ["Strong visual hallucinations", "Ego dissolution — boundaries between self and world blur", "Profound emotional experiences, catharsis", "Synesthesia possible"],
      heavy:    ["Complete ego dissolution", "Intense visual phenomena and geometry", "Mystical or transcendent experiences", "Challenging confrontations with fear, grief, or trauma"]
    },
    safety: ["Do not combine with lithium — risk of seizures", "Caution with SSRIs (may reduce effects or trigger serotonin syndrome at high doses)", "Avoid if personal or family history of psychosis or schizophrenia", "Set, setting, and a trusted sitter strongly recommended at moderate+ doses"],
    boosterInfo: "A booster of 25–50% of the initial dose taken 60–90 minutes in can extend the peak and plateau phase. Rapid tolerance develops, so boosters are less effective than the initial dose.",
    sources: ["source_psilocybin_1", "source_psilocybin_2", "source_psilocybin_3", "source_redosing_1"],
    historySources: ["source_psilocybin_history_1", "source_psilocybin_history_2"]
  },
  {
    id: "lsd", name: "LSD", category: "Lysergamide", unit: "μg",
    doses: { threshold: 25, light: 75, moderate: 150, strong: 300, heavy: 600 },
    onset: 45, peak: 240, duration: 720,
    history: "Lysergic acid diethylamide (LSD-25) was first synthesized by Swiss chemist Albert Hofmann at Sandoz Laboratories in Basel on November 16, 1938, while searching for a respiratory and circulatory stimulant. Initially set aside, Hofmann returned to the compound in 1943 and accidentally absorbed a small amount through his fingertips, experiencing the world's first LSD trip on April 16th — a date now known as 'Bicycle Day,' named for his ride home. Sandoz released LSD commercially in 1947 as Delysid, marketing it to psychiatrists as an aid to psychotherapy and as a tool to induce model psychosis for research. By the early 1960s, thousands of clinical studies had been published exploring its use in treating alcoholism, anxiety, and depression. Figures like Aldous Huxley, Cary Grant, and the Beatles used LSD, while figures like Timothy Leary and Ken Kesey helped propel it into mainstream counterculture. The cultural and political backlash led to its Schedule I classification in 1968, effectively halting research for decades. Today, a robust scientific renaissance at institutions including Johns Hopkins, NYU, and the Multidisciplinary Association for Psychedelic Studies (MAPS) is re-examining LSD's therapeutic potential.",
    effects: {
      light:    ["Mild euphoria and energy", "Sensory enhancement", "Slight perceptual changes", "Increased sociability"],
      moderate: ["Visual fractals, color intensification", "Amplified emotions", "Synesthesia common", "Deep empathy and connection"],
      strong:   ["Intense open and closed-eye hallucinations", "Ego dissolution possible", "Profound insights", "Challenging emotional experiences possible"],
      heavy:    ["Complete ego dissolution", "Overwhelming sensory and cognitive input", "Visionary and mystical experiences", "Very long duration — 12–18 hours at high doses"]
    },
    safety: ["Avoid with SSRIs, MAOIs, or lithium", "High risk of anxiety at doses above 200μg in unfamiliar settings", "Very long duration — have the full day and next morning free", "Test strips essential — LSD is commonly counterfeited", "Doses above 400μg should only be approached by very experienced individuals"],
    boosterInfo: "Not generally recommended — extends an already very long experience to 16–20 hours. Rapid tolerance also reduces effectiveness. If used, 60–90 minutes is the optimal window.",
    sources: ["source_lsd_1", "source_lsd_2", "source_redosing_1", "source_lsd_tolerance"],
    historySources: ["source_lsd_history_1", "source_lsd_history_2"]
  },
  {
    id: "dmt", name: "DMT", category: "Tryptamine", unit: "mg",
    doses: { threshold: 10, light: 25, moderate: 40, strong: 60, heavy: 80 },
    onset: 0.5, peak: 5, duration: 15,
    history: "N,N-Dimethyltryptamine (DMT) is a tryptamine molecule found throughout the natural world — in plants, animals, and possibly endogenously in humans. Its psychedelic properties were first published by ethnobotanist Richard Evans Schultes in 1946, based on study of the Virola genus used in indigenous Amazonian snuffs. Hungarian chemist Stephen Szára first documented its psychedelic effects in humans in 1956 after synthesizing it and self-administering it. DMT has been used for millennia in South American shamanic traditions in the form of snuffs (yopo, epená) and in ayahuasca brews. The publication of Rick Strassman's groundbreaking research at the University of New Mexico in the 1990s — detailed in his 2000 book DMT: The Spirit Molecule — brought DMT to mainstream scientific and popular attention. Strassman controversially proposed that DMT might be produced endogenously in the pineal gland, a theory that remains unconfirmed but widely discussed. The 'breakthrough' experience, characterized by contact with entities and complete departure from consensus reality, has made DMT one of the most discussed and enigmatic psychedelics.",
    effects: {
      light:    ["Mild visual effects — shifting patterns", "Body warmth and tingling", "Slight mood shift"],
      moderate: ["Strong geometric and fractal visuals", "Rapid onset within seconds", "Entity contact reported", "Profound awe"],
      strong:   ["Breakthrough — complete departure from consensus reality", "Complex alternate environments", "Meeting entities", "Overwhelming sense of love or fear"],
      heavy:    ["Total immersion in alternate reality", "Time dissolves completely", "Intense and often indescribable experiences"]
    },
    safety: ["Extremely short but one of the most intense psychedelics", "Must be seated or lying down — complete loss of physical awareness", "MAOIs dramatically extend and intensify effects — potentially dangerous", "Respiratory distress possible at very high doses"],
    boosterInfo: "Due to its extremely short duration (10–15 minutes), booster dosing is unusual. Wait for effects to fully subside before considering a second dose.",
    sources: ["source_dmt_1", "source_dmt_2"],
    historySources: ["source_dmt_history_1"]
  },
  {
    id: "mescaline", name: "Mescaline", category: "Phenethylamine", unit: "mg",
    doses: { threshold: 100, light: 200, moderate: 350, strong: 500, heavy: 700 },
    onset: 60, peak: 240, duration: 720,
    history: "Mescaline (3,4,5-trimethoxyphenethylamine) is a phenethylamine psychedelic found primarily in the peyote cactus (Lophophora williamsii) and secondarily in San Pedro (Echinopsis pachanoi) and Peruvian torch cacti. It holds the distinction of being one of the first psychedelics to be isolated and chemically characterized — German pharmacologist Arthur Heffter isolated it from peyote in 1897. Mescaline has been used in ceremonial and healing contexts by indigenous peoples of Mexico and the American Southwest for at least 5,700 years — among the longest documented continuous uses of any psychedelic substance. The Native American Church, formally incorporated in 1918, continues to use mescaline-containing peyote as its central sacrament and is legally protected in the United States. In 1952–1954, Aldous Huxley famously experimented with mescaline, documenting his experience in The Doors of Perception — one of the most influential books in psychedelic history. Alexander 'Sasha' Shulgin synthesized hundreds of mescaline analogs (detailed in PiHKAL, 1991), profoundly expanding the field of psychedelic pharmacology.",
    effects: {
      light:    ["Mild euphoria and warmth", "Color and texture enhancement", "Nausea common on come-up", "Increased sociability"],
      moderate: ["Visual hallucinations — flowing colors, geometric patterns", "Deep empathy and emotional openness", "Strong connection to nature", "Philosophical and spiritual insights"],
      strong:   ["Complex visual phenomena and vivid hallucinations", "Profound emotional release", "Spiritual and transcendent experiences"],
      heavy:    ["Overwhelming visionary states", "Intense nausea possible", "Very long duration — 12+ hours"]
    },
    safety: ["Nausea is very common — fasting beforehand helps", "Extremely long duration requires thorough preparation", "Caution with cardiovascular conditions — elevates heart rate and blood pressure"],
    boosterInfo: "Uncommon due to already very long duration (10–12 hours). A booster taken 1–2 hours in can deepen the experience but will significantly extend total duration.",
    sources: ["source_mescaline_1", "source_mescaline_2"],
    historySources: ["source_mescaline_history_1", "source_mescaline_history_2"]
  },
  {
    id: "peyote", name: "Peyote", category: "Phenethylamine", unit: "buttons",
    doses: { threshold: 2, light: 4, moderate: 8, strong: 12, heavy: 16 },
    onset: 60, peak: 240, duration: 720,
    history: "Peyote (Lophophora williamsii) is a small, spineless cactus native to the Chihuahuan Desert of northern Mexico and southern Texas. It is one of the most anciently used psychoactive plants on Earth — archaeological evidence dates ceremonial use to approximately 5,700 years ago (3780–3660 BCE). The plant contains over 50 alkaloids including mescaline (3–6% of dry weight), pellotine, anhalonidine, and hordenine. For the Wixaritari (Huichol) people, peyote is the very soul of their religion — considered a divine sacrament connecting them to their principal deities. Their annual pilgrimage to Wirikuta, the sacred site of peyote in the high desert of San Luis Potosí, is one of the world's most profound living examples of plant-based spiritual practice. The Native American Church, formally incorporated in Oklahoma in 1918, uses peyote as its central sacrament across over 40 tribes in North America. Peyote was classified as a Schedule I substance in the US in 1970, though NAC members remain legally protected in their ceremonial use. The plant is critically slow-growing — up to 30 years to reach golf-ball size in the wild — and populations are under significant pressure from overharvesting.",
    effects: {
      light:    ["Mild euphoria and warmth", "Color and texture enhancement", "Nausea on come-up", "Increased sociability and openness"],
      moderate: ["Visual hallucinations — flowing colors, geometric patterns", "Deep empathy and emotional openness", "Connection to nature and the sacred", "Philosophical and spiritual insights"],
      strong:   ["Complex visual phenomena and vivid hallucinations", "Profound emotional release and catharsis", "Deep spiritual and transcendent experiences"],
      heavy:    ["Overwhelming visionary states", "Intense nausea and physical discomfort possible", "Very long duration — 12+ hours"]
    },
    safety: ["Nausea and vomiting are very common — fasting beforehand helps significantly", "Extremely bitter taste — buttons are often chewed raw or made into tea", "Extremely long duration requires thorough preparation", "Caution with cardiovascular conditions — elevates heart rate and blood pressure", "Endangered cactus — overharvesting is an ongoing ecological concern"],
    boosterInfo: "In ceremonial contexts, additional buttons are sometimes taken as the experience plateaus. A supplemental dose 1–2 hours in can deepen the experience, but will significantly extend the already very long duration.",
    sources: ["source_mescaline_1", "source_mescaline_2", "source_peyote_1", "source_peyote_2"],
    historySources: ["source_peyote_history_1", "source_peyote_history_2"]
  },
  {
    id: "5meo_dmt", name: "5-MeO-DMT", category: "Tryptamine", unit: "mg",
    is5MeO: true,
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 0.3, peak: 5, duration: 20,
    history: "5-Methoxy-N,N-dimethyltryptamine (5-MeO-DMT) is a naturally occurring tryptamine found in dozens of plant species and in the parotoid gland venom of the Sonoran Desert toad (Incilius alvarius, formerly Bufo alvarius). Its synthesis was first described in 1936 by Hoshino and Shimodaira, though its psychedelic properties in humans were not formally documented until Alexander Shulgin reported them in 1970, later detailed in his 1997 book TiHKAL (Tryptamines I Have Known and Loved). The toad as a source was first described publicly in 1984 in an underground pamphlet by Ken Nelson (writing as Albert Most) titled 'Bufo Alvarius: The Psychedelic Toad of the Sonoran Desert.' Indigenous cultures of the Amazon and Orinoco regions have long used 5-MeO-DMT in ceremonial snuffs (yopo, epená) derived from Anadenanthera and Virola plants. The toad-venom practice — often called 'Bufo' — became culturally prominent in the 2010s, boosted by media coverage and figures like Joe Rogan. The growing demand has created serious ecological pressure on toad populations, prompting advocates including the original pamphlet author Ken Nelson to call for a switch to synthetic 5-MeO-DMT. Phase 1 clinical trials of synthetic 5-MeO-DMT (GH001) were published in 2021 by Reckweg et al., demonstrating safety and psychoactive profiles in healthy volunteers.",
    effects: {
      light:    ["Mild body load and pressure", "Slight perceptual shift"],
      moderate: ["Strong dissociation from body and environment", "Unity consciousness", "Overwhelming and sudden onset"],
      strong:   ["Complete ego dissolution", "Non-dual awareness", "Intense body sensations", "Challenging to process without preparation"],
      heavy:    ["Total loss of individual self", "Potentially terrifying or profoundly blissful", "Reported 'white out' — complete dissolution of all content"]
    },
    safety: ["One of the most potent psychedelics by weight — active at 1mg", "NEVER combine with MAOIs — can be fatal", "Vocalization, writhing, and loss of physical control are common", "Requires an experienced, trained sitter"],
    boosterInfo: "Booster dosing with 5-MeO-DMT is not recommended. The experience is already overwhelming at active doses.",
    sources: ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical"],
    historySources: ["source_5meo_history_1", "source_5meo_reckweg"]
  },
  {
    id: "ayahuasca", name: "Ayahuasca", category: "Tryptamine", unit: "mL",
    doses: { threshold: 25, light: 50, moderate: 75, strong: 100, heavy: 150 },
    onset: 30, peak: 120, duration: 300,
    history: "Ayahuasca is a psychoactive brew traditionally prepared by combining the bark of the Banisteriopsis caapi vine (containing harmala alkaloids that act as MAO inhibitors) with the leaves of Psychotria viridis or Diplopterys cabrerana (which contain DMT). The oral DMT becomes psychoactive because the MAO inhibitors in the vine prevent its breakdown in the gut. The word 'ayahuasca' comes from Quechua and means 'vine of the soul' or 'vine of the dead.' It has been used for healing and divination by indigenous Amazonian peoples for centuries — possibly millennia — and continues today as a living tradition among groups including the Shipibo-Conibo, Huni Kuin, and Shuar. In Brazil, ayahuasca is the sacrament of syncretic religious movements including Santo Daime (founded 1930) and União do Vegetal (founded 1961), both of which have achieved legal recognition in Brazil and have branches in the United States, where religious ayahuasca use received federal protection in 2006. The global retreat industry that grew in the 2010s and 2020s has brought millions of people into contact with ayahuasca outside of indigenous and religious frameworks, with emerging research documenting potential benefits for depression, addiction, PTSD, and grief.",
    effects: {
      light:    ["Mild visions — shifting colors and patterns", "Emotional introspection and sensitivity", "Nausea on come-up"],
      moderate: ["Purging common — considered part of the healing process", "Vivid narrative visions", "Entity contact reported", "Deep emotional release"],
      strong:   ["Deep trauma processing", "Overwhelming visual and emotional experiences", "Ego dissolution", "Profound healing or confrontation with shadow material"],
      heavy:    ["Complete loss of consensus reality for extended periods", "Intense physical and emotional purging", "Hours of sustained visionary states — can be 4–6 hours"]
    },
    safety: ["Contains MAOI (harmaline) — extensive drug interactions including SSRIs, stimulants, many foods", "Must follow dietary restrictions (avoid tyramine-rich foods) before ceremony", "Should only be taken in a ceremonial or medically supervised context", "People with heart conditions, hypertension, or psychiatric diagnoses should consult a physician first"],
    boosterInfo: "In ceremonial contexts, a second cup is sometimes offered 1–2 hours in. This is typically at the facilitator's discretion. Self-directed booster dosing outside ceremony is not recommended.",
    sources: ["source_ayahuasca_1", "source_ayahuasca_2", "source_ayahuasca_3"],
    historySources: ["source_ayahuasca_history_1", "source_ayahuasca_history_2"]
  },
  {
    id: "salvinorin_a", name: "Salvinorin A", category: "Terpenoid", unit: "mg",
    doses: { threshold: 0.2, light: 0.5, moderate: 1, strong: 2, heavy: 3 },
    onset: 0.2, peak: 3, duration: 10,
    history: "Salvinorin A is the primary active compound in Salvia divinorum, a plant native to a small region of the Mazatec Sierra in Oaxaca, Mexico. The Mazatec people — the same culture that introduced psilocybin mushrooms to the West — use Salvia divinorum (which they call 'Ska María Pastora' or 'Hierba de la Pastora') as a shamanic healing plant, consumed by chewing fresh leaves or drinking pressed leaf juice rather than smoking. The psychoactive properties of Salvia divinorum were first documented by ethnobotanists R. Gordon Wasson and Albert Hofmann in 1962. Salvinorin A was first isolated in 1982 by botanist Leander Valdés III and fully characterized in the early 1990s. Crucially, salvinorin A is unique among naturally occurring psychedelics in being a potent and selective kappa-opioid receptor agonist — rather than the 5-HT2A serotonergic mechanism shared by all other classic psychedelics. This makes it pharmacologically one-of-a-kind. Despite its intensity, Salvia divinorum is not scheduled federally in the United States, though many individual states have restricted it. Its uncontrolled and casual recreational use — often smoked by inexperienced users — has led to numerous difficult experiences due to the abrupt and overwhelming nature of high-dose salvinorin A.",
    effects: {
      light:    ["Mild perceptual changes", "Laughter and giddiness", "Mild color and texture enhancement"],
      moderate: ["Strong dissociation from current reality", "Reality distortion and overlapping dimensions", "Loss of body awareness"],
      strong:   ["Complete dissociation from physical surroundings", "Sensation of dimensional or spatial travel", "Entity or presence contact reported"],
      heavy:    ["Total departure from ordinary reality", "Inability to form new memories during experience", "Extremely disorienting and confusing — often frightening"]
    },
    safety: ["Shortest duration of any major psychedelic — 5–15 minutes — but extremely intense", "Must be in a physically safe environment — complete loss of motor control occurs", "Not appropriate for anxious individuals or those without experience", "A sober sitter is essential"],
    boosterInfo: "Due to its extremely short duration, booster dosing is unusual. If a deeper experience is desired, this is better addressed through initial dosing.",
    sources: ["source_salvinorin_1", "source_salvinorin_2"],
    historySources: ["source_salvinorin_history_1"]
  },
  {
    id: "ibogaine", name: "Ibogaine", category: "Indole Alkaloid", unit: "mg/kg",
    doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 },
    onset: 60, peak: 240, duration: 1440,
    history: "Ibogaine is a naturally occurring psychoactive alkaloid found in the bark of the Tabernanthe iboga shrub native to the rainforests of Central Africa, primarily Gabon and Cameroon. Iboga has been used for centuries — and possibly millennia — by Bwiti practitioners in Gabon and neighboring countries as the central sacrament of their initiation ceremonies. The full initiation ceremony, which involves consuming large amounts of iboga bark over multiple days, is considered one of the most intense and sacred ritual practices in the world. Ibogaine was first isolated in 1901 by Dybowski and Landrin, and was briefly marketed in France in the 1930s under the name Lambarène as a mild stimulant. Its powerful psychedelic properties were documented more formally in the 1960s. The most significant modern development was the 1962 discovery by Howard Lotsof — a heroin addict — that ibogaine appeared to eliminate his opioid cravings and withdrawal symptoms after a single dose. This observation launched decades of research into ibogaine as a treatment for opioid use disorder, addiction, and PTSD. Clinical use expanded significantly in Mexico, New Zealand, and Europe, where it operates in legal or gray-market contexts. Its cardiac risk profile (QT prolongation) remains the primary obstacle to formal regulatory approval.",
    effects: {
      light:    ["Mild stimulation and wakefulness", "Introspection and memory recall", "Mild visual effects"],
      moderate: ["Waking dreamlike visions — like a living film of your life", "Life review — memories surfacing with emotional weight", "Ataxia", "Nausea and vomiting common"],
      strong:   ["Intense sustained visions — often biographical or archetypal", "Confrontation with past trauma, relationships, and decisions", "Hours of continuous introspective journey"],
      heavy:    ["36+ hour experience", "Profound psychological reckoning", "Serious cardiac risk increases with dose — medical monitoring essential"]
    },
    safety: ["SERIOUS CARDIAC RISK — ibogaine prolongs the QT interval and can cause fatal arrhythmia", "Requires a full cardiac workup including EKG before any use", "Only appropriate under direct medical supervision with cardiac monitoring", "Many drug interactions — especially lethal with opioids, stimulants, and SSRIs"],
    boosterInfo: "Booster dosing with ibogaine carries serious cardiac risk. Any supplemental dosing must be conducted under direct medical supervision only.",
    sources: ["source_ibogaine_1", "source_ibogaine_2"],
    historySources: ["source_ibogaine_history_1"]
  },
  {
    id: "mdma", name: "MDMA", category: "Empathogen", unit: "mg",
    doses: { threshold: 50, light: 80, moderate: 120, strong: 150, heavy: 200 },
    onset: 45, peak: 90, duration: 240,
    history: "3,4-Methylenedioxymethamphetamine (MDMA) was first synthesized in 1912 by German chemist Anton Köllisch at Merck, originally as an intermediate in synthesizing a hemostatic agent — not as a drug itself. It sat largely forgotten for decades. In 1976, Alexander 'Sasha' Shulgin — known as the 'godfather of MDMA' — re-synthesized it and first tried it himself, recognizing its profound psychotherapeutic potential and introducing it to therapist Leo Zeff, who in turn introduced it to an estimated 4,000 therapists and patients in the late 1970s and early 1980s. Therapists valued it for its ability to reduce fear and defensiveness while enhancing empathy, openness, and communication — ideal for trauma processing. MDMA was placed on Schedule I in the US in 1985 over the protests of researchers and therapists who argued it had documented therapeutic value. Despite scheduling, it became one of the most widely used recreational drugs in the 1990s rave culture, known as Ecstasy or Molly. MAPS began Phase 3 clinical trials of MDMA-assisted therapy for PTSD in 2018, with results published in Nature Medicine in 2021 showing an unprecedented 67% of participants no longer met PTSD criteria after treatment.",
    effects: {
      light:    ["Mild euphoria and warmth", "Increased sociability", "Slight sensory enhancement"],
      moderate: ["Strong empathy and emotional connection", "Euphoria and well-being", "Increased physical energy", "Emotional openness", "Tactile enhancement"],
      strong:   ["Intense euphoria", "Profound emotional bonding", "Potential anxiety, jaw clenching, or overheating", "Strong stimulant effects"],
      heavy:    ["Risk of dangerous hyperthermia", "Cardiovascular strain", "Severe comedown in days following", "Risk of serotonin syndrome"]
    },
    safety: ["Stay hydrated — about 500mL per hour if dancing, less if sedentary — overhydration is also dangerous", "Avoid frequent redosing — increases neurotoxicity risk", "Never combine with MAOIs, SSRIs, or other stimulants", "Space use by at least 3 months to reduce neurotoxicity risk"],
    boosterInfo: "A small booster (half the initial dose) taken 60–90 minutes in is common. Keep boosters to 50–75mg maximum. Redosing MDMA significantly increases neurotoxicity risk and worsens the comedown.",
    sources: ["source_mdma_1", "source_mdma_2", "source_mdma_3"],
    historySources: ["source_mdma_history_1", "source_mdma_history_2"]
  },
  {
    id: "mda", name: "MDA", category: "Empathogen", unit: "mg",
    doses: { threshold: 40, light: 80, moderate: 120, strong: 160, heavy: 200 },
    onset: 45, peak: 120, duration: 360,
    history: "3,4-Methylenedioxyamphetamine (MDA), known on the street as 'the Love Drug' or 'sass', predates MDMA and was first synthesized in 1910 by G. Mannich and W. Jacobsohn. Its psychoactive properties were first studied systematically by Gordon Alles — the discoverer of amphetamine — in 1959, who self-experimented with it and reported euphoria and sensory amplification. MDA was used in psychotherapy in the 1960s — particularly by physicians including Claudio Naranjo, who investigated it as a psychotherapeutic adjunct and documented his findings in The Healing Journey (1973). Like MDMA, it was placed on Schedule I in 1970 under the Controlled Substances Act. MDA has a more pronouncedly psychedelic character than MDMA — producing stronger visual effects alongside its empathogenic properties — as well as a longer duration (6–8 hours) and a steeper neurotoxicity profile based on animal studies. Alexander Shulgin documented MDA and many of its analogs in PiHKAL (1991). While less studied in modern clinical research than MDMA, it remains an important reference point in the pharmacology of entactogens.",
    effects: {
      light:    ["Euphoria and warmth", "Mild visual effects", "Increased energy and motivation"],
      moderate: ["Empathy and emotional openness", "Visual distortions and mild hallucinations", "Stimulation and desire to move"],
      strong:   ["More psychedelic character than MDMA", "Visual hallucinations can be significant", "Intense emotional experiences"],
      heavy:    ["Strong visual hallucinations", "High cardiovascular load", "Significant neurotoxicity risk — higher than MDMA"]
    },
    safety: ["More neurotoxic to serotonin neurons than MDMA based on animal studies", "Higher cardiovascular risk than MDMA", "Avoid combination with other stimulants, serotonergics, or MAOIs", "Longer duration means more prolonged cardiovascular stress"],
    boosterInfo: "Booster dosing with MDA is not recommended due to its higher neurotoxicity profile and already longer duration.",
    sources: ["source_mda_1", "source_mda_2"],
    historySources: ["source_mda_history_1"]
  },
  {
    id: "ketamine", name: "Ketamine", category: "Dissociative", unit: "mg",
    isKetamine: true,
    doses: { threshold: 20, light: 50, moderate: 100, strong: 150, heavy: 300 },
    onset: 5, peak: 20, duration: 60,
    history: "Ketamine was first synthesized in 1962 by Calvin Stevens at Parke-Davis, and was patented in 1963. It was developed as a rapid-onset dissociative anesthetic intended to replace phencyclidine (PCP), which had an unacceptable psychiatric side effect profile. The FDA approved ketamine as an anesthetic in 1970, and it was widely used on battlefields during the Vietnam War for emergency surgery. Its combination of analgesia, anesthesia, and relative respiratory safety made it a valuable tool in both human and veterinary medicine. Its dissociative and psychedelic properties led to recreational use beginning in the 1970s and 1980s — documented extensively by John Lilly, who used it in combination with float tanks, and Marcia Moore, whose book Journeys into the Bright World (1978) detailed ketamine's mystical and psychological dimensions. The pivotal clinical development came in 2000, when researchers Carlos Zarate and Dennis Charney at the National Institute of Mental Health demonstrated that sub-anesthetic IV ketamine produced rapid antidepressant effects within hours — a breakthrough for a field accustomed to antidepressants taking weeks to work. This led to the 2019 FDA approval of esketamine (Spravato) nasal spray for treatment-resistant depression, and to the rapid growth of ketamine infusion clinics.",
    effects: {
      light:    ["Mild dissociation and dreaminess", "Analgesia", "Relaxation and sedation", "Mild euphoria and floating sensation"],
      moderate: ["Strong dissociation from physical surroundings", "Approaching the K-hole threshold", "Altered sense of body size", "Dreamlike and surreal states"],
      strong:   ["K-hole — complete dissociation from physical reality", "Out-of-body experiences", "Amnesia possible"],
      heavy:    ["Total loss of self and physical environment", "Profound dissociation", "Respiratory depression risk — do not combine with other depressants"]
    },
    safety: ["High addiction potential with frequent or daily use", "Bladder and urinary tract damage with chronic heavy use — irreversible in severe cases", "Never drive or operate machinery", "Do not combine with alcohol, benzodiazepines, or opioids"],
    boosterInfo: "Booster dosing is route-dependent. For lozenge/troche, a supplemental 25–50% of the initial dose may be taken 45–60 minutes in. For IM/IV, supplemental dosing should only be administered by medical professionals.",
    sources: ["source_ketamine_1", "source_ketamine_2", "source_ketamine_statpearls", "source_ketamine_rolan_2014"],
    historySources: ["source_ketamine_history_1", "source_ketamine_history_2"]
  },
  {
    id: "pcp", name: "PCP", category: "Dissociative", unit: "mg",
    doses: { threshold: 1, light: 3, moderate: 8, strong: 15, heavy: 25 },
    onset: 5, peak: 30, duration: 360,
    history: "Phencyclidine (PCP, or 1-(1-phenylcyclohexyl)piperidine) was synthesized in 1956 by Victor Maddox and first developed as a general anesthetic by Parke-Davis under the name Sernyl. It was tested in clinical trials in the early 1960s but was withdrawn from human use by 1965 due to its severe psychiatric side effects — including prolonged agitation, hallucinations, delirium, and psychosis — particularly during emergence from anesthesia. It continued to be used in veterinary medicine (as Sernylan) until the 1970s. PCP became a major recreational drug in the 1970s and early 1980s under names including 'angel dust,' 'killer weed,' and 'sherm.' Its reputation for inducing unpredictable, violent behavior — though often exaggerated by media — contributed to widespread moral panic. PCP was scheduled as a Schedule II substance in 1978. Pharmacologically, PCP is notable as the prototype NMDA receptor antagonist, and its model of psychosis was instrumental in shaping the glutamatergic hypothesis of schizophrenia, which remains influential in psychiatric research today.",
    effects: {
      light:    ["Mild dissociation and numbness", "Euphoria and mood elevation", "Slight perceptual distortions"],
      moderate: ["Strong dissociation from surroundings", "Analgesia — complete insensitivity to pain", "Perceptual distortions and disorganized thinking"],
      strong:   ["Complete dissociation from reality", "Psychosis-like states — paranoia, hallucinations", "Extreme disorientation"],
      heavy:    ["Severe psychosis", "Agitation, aggression, or violent behavior possible", "Medical emergency risk"]
    },
    safety: ["High risk of psychosis and erratic behavior at moderate to high doses", "Very long and highly unpredictable duration — can last 6–24 hours", "Extremely high addiction potential", "Analgesia means physical injuries may not be felt during the experience"],
    boosterInfo: "Booster dosing with PCP is extremely inadvisable. The unpredictable duration and psychosis risk are already high at standard doses.",
    sources: ["source_pcp_1"],
    historySources: ["source_pcp_history_1"]
  },
  {
    id: "2cb", name: "2C-B", category: "Phenethylamine", unit: "mg",
    doses: { threshold: 5, light: 15, moderate: 25, strong: 35, heavy: 50 },
    onset: 45, peak: 120, duration: 300,
    history: "2,5-Dimethoxy-4-bromophenethylamine (2C-B) was first synthesized by Alexander 'Sasha' Shulgin in 1974 and is documented in detail in his landmark 1991 book PiHKAL (Phenethylamines I Have Known and Loved). Shulgin considered 2C-B one of his most interesting and therapeutically valuable discoveries — the '2C' in the name refers to the two-carbon chain separating the benzene ring from the amine group, a structural class he systematically explored. In the late 1970s and 1980s, 2C-B was used by therapists as a psychotherapy adjunct, valued for its combination of clear-headed awareness and emotional openness. Following the scheduling of MDMA in 1985, 2C-B briefly became available commercially in Germany under the brand name Nexus as an MDMA substitute. It was placed on Schedule I in the United States in 1994. 2C-B is notable for its particularly steep dose-response curve — the difference between a mild and overwhelming experience can be as little as 5–10mg — and for its pronounced visual effects relative to its overall intensity.",
    effects: {
      light:    ["Color and contrast enhancement", "Mild euphoria and wellbeing", "Increased sensory awareness"],
      moderate: ["Visual effects — breathing walls, color shifts, mild geometry", "Euphoria and positive mood", "Sensory enhancement"],
      strong:   ["Strong visual distortions and hallucinations", "Deep introspection", "Emotional release", "High physical energy"],
      heavy:    ["Intense hallucinations similar to LSD or psilocybin", "Overwhelming experience possible", "Significant body load"]
    },
    safety: ["Highly dose-sensitive — small increases produce dramatically larger effects", "Avoid with MAOIs", "Nausea common on come-up at higher doses", "If insufflated, onset is much faster — doses must be reduced significantly"],
    boosterInfo: "2C-B is highly dose-sensitive, making booster dosing risky. A small booster (5–10mg) taken 45–60 minutes in is feasible, but err heavily on the side of caution.",
    sources: ["source_2cb_1", "source_2cb_2"],
    historySources: ["source_2cb_history_1"]
  },
  {
    id: "25i_nbome", name: "25I-NBOMe", category: "Phenethylamine", unit: "μg",
    doses: { threshold: 200, light: 500, moderate: 900, strong: 1500, heavy: 2000 },
    onset: 30, peak: 120, duration: 480,
    history: "25I-NBOMe (2,5-dimethoxy-4-iodophenethylamine-N-(2-methoxybenzyl)) is a synthetic derivative of 2C-I first synthesized in 2003 by Ralf Heim at the Free University of Berlin, and further characterized by pharmacologist David Nichols' lab in 2010 as a potent 5-HT2A receptor agonist useful as a research tool. It was never intended for human consumption. Around 2010–2011, it emerged in illicit markets — often sold on blotter paper as LSD — and quickly gained notoriety for its very high potency (active in the microgram range) and dangerously narrow therapeutic window. Between 2012 and 2015, multiple fatalities were attributed to 25I-NBOMe and related NBOMe compounds (25B-NBOMe, 25C-NBOMe), primarily from cardiovascular crisis. The substance's widespread use as a fraudulent LSD substitute — it is tasteless and colorless in microgram amounts, though bitter in larger amounts — contributed to numerous cases of accidental overdose by users who believed they were taking LSD. It was placed on Schedule I in the US in 2013. Reagent test kits (Ehrlich, Hofmann) remain an essential harm reduction tool for distinguishing LSD from NBOMe compounds.",
    effects: {
      light:    ["Visual effects and color enhancement", "Stimulation and alertness", "Mood change — euphoria or anxiety"],
      moderate: ["Strong visual hallucinations", "Pronounced stimulant effects", "Vasoconstriction — cold hands and feet"],
      strong:   ["Intense hallucinations comparable to high-dose LSD", "Significant tachycardia and hypertension", "Stimulant overdrive — agitation possible"],
      heavy:    ["Severe cardiovascular strain", "Seizure risk", "Medical emergency — multiple fatalities reported at this dose range"]
    },
    safety: ["⚠ ASSOCIATED WITH MULTIPLE CONFIRMED FATALITIES — extreme caution required", "Vasoconstriction can be severe and medically dangerous", "Frequently sold on blotter as LSD — always reagent test before use", "Bitter taste under the tongue is a warning sign — LSD is tasteless"],
    boosterInfo: "⚠ Booster dosing with 25I-NBOMe is extremely dangerous and not recommended under any circumstances.",
    sources: ["source_25i_1", "source_25i_2"],
    historySources: ["source_25i_history_1"]
  }
];

const COMBINATIONS = [
  {
    id: "candy_flip", name: "Candy Flip", isCombination: true,
    description: "LSD + MDMA — produces an extremely euphoric, visually enhanced empathogenic experience.",
    components: ["lsd", "mdma"],
    timing: "MDMA is typically taken 3–4 hours into the LSD experience, timed so both substances are peaking simultaneously.",
    history: "The 'candy flip' emerged from rave and club culture of the late 1980s and 1990s, where LSD and MDMA were both widely available and commonly co-used. The combination became popular because the MDMA was believed to smooth LSD's edge while the LSD was said to extend and deepen the MDMA experience beyond its typical 4-hour duration. The name derives from the playful, candy-like quality of the combined euphoria. No formal clinical research has specifically studied this combination; its pharmacology is inferred from the individual compound profiles and receptor interactions. The serotonergic synergy between 5-HT2A agonism (LSD) and serotonin release (MDMA) is believed to underlie both the enhanced effects and the elevated risk of serotonin toxicity at higher doses.",
    safety: ["Very high body temperature risk — hyperthermia is a serious danger", "Extreme cardiovascular load from both substances", "Serotonin syndrome risk if doses are high", "Very long experience — 14–18 hours total", "Hydration is essential but do not overhydrate", "Not recommended for beginners"],
    sources: ["source_candy_flip_1", "source_mdma_2", "source_lsd_2"],
    historySources: ["source_candy_flip_1"]
  },
  {
    id: "jedi_flip", name: "Jedi Flip", isCombination: true,
    description: "Psilocybin + LSD + MDMA — an advanced triple combination. Extremely intense and long-lasting. Reserved for very experienced individuals only.",
    components: ["psilocybin", "lsd", "mdma"],
    timing: "LSD is taken first. Psilocybin is added 1–2 hours later. MDMA is timed to overlap with the combined peaks — approximately 3–4 hours after LSD.",
    history: "The 'Jedi flip' is a third-generation combination building on the candy flip, adding psilocybin for a tri-combination that is considered one of the most intense psychedelic experiences achievable through oral substances. The name is a riff on the 'candy flip' with an escalation implied by the 'Jedi' designation — a cultural signal for the highest level of psychedelic experience. It is almost entirely a product of online psychedelic communities (particularly Erowid and Reddit's r/PsychedelicStudies) and is discussed far more often than it is practiced. There is no formal research specifically on this combination.",
    safety: ["For very experienced psychedelic users only", "Extremely high risk profile — cardiovascular, thermoregulatory, and neurological stress", "Medical support or an experienced harm-reduction sitter strongly advised", "Not recommended for anyone with a history of anxiety, cardiovascular issues, or psychiatric conditions", "Duration can exceed 18–24 hours"],
    sources: ["source_candy_flip_1", "source_psilocybin_2", "source_lsd_2", "source_mdma_2"],
    historySources: ["source_psilocybin_2", "source_lsd_1"]
  },
  {
    id: "hippie_flip", name: "Hippie Flip", isCombination: true,
    description: "Psilocybin + MDMA — combines the emotional depth, introspection, and visuals of psilocybin with the euphoria, empathy, and energy of MDMA.",
    components: ["psilocybin", "mdma"],
    timing: "MDMA can be taken simultaneously with psilocybin, or 1–2 hours into the psilocybin experience to time the MDMA peak with the psilocybin plateau.",
    history: "The 'hippie flip' (also called 'flower flipping') is a widely used combination in both recreational and therapeutic contexts. Unlike the candy and jedi flips, this combination has genuine research interest — the combination of MDMA's fear-reducing, prosocial effects with psilocybin's introspective and mystical properties is a logical candidate for psychedelic-assisted therapy. MAPS and other researchers have explored MDMA + psilocybin as a potential therapeutic pairing, with the MDMA theorized to reduce anxiety during the psilocybin experience while the psilocybin deepens the introspective work. The combination is more manageable than LSD-based combinations because psilocybin has a shorter duration and less stimulant character.",
    safety: ["Serotonin syndrome risk at high doses — keep doses conservative", "Monitor body temperature — risk of overheating especially if active", "Heart rate elevation from both substances — not suitable for those with cardiac concerns"],
    sources: ["source_psilocybin_2", "source_mdma_1", "source_mdma_2"],
    historySources: ["source_psilocybin_2", "source_mdma_1"]
  }
];

// ─── SOURCES ─────────────────────────────────────────────────────────────────
const SOURCES = {
  source_psilocybin_1: { title: "Psilocybin-occasioned mystical-type experience in combination with meditation and other spiritual practices", authors: "Barrett, F.S., et al.", journal: "Journal of Psychopharmacology", year: 2020, url: "https://doi.org/10.1177/0269881119897328" },
  source_psilocybin_2: { title: "Psilocybin produces substantial and sustained decreases in depression and anxiety in patients with life-threatening cancer", authors: "Griffiths, R.R., et al.", journal: "Journal of Psychopharmacology", year: 2016, url: "https://doi.org/10.1177/0269881116675513" },
  source_psilocybin_3: { title: "Dose-response relationships of psilocybin-induced subjective experiences in humans", authors: "Hasler, F., et al.", journal: "Neuropsychopharmacology", year: 2004, url: "https://doi.org/10.1038/sj.npp.1300496" },
  source_psilocybin_history_1: { title: "The Psilocybin Story: How Magic Mushrooms Became a Medical Treatment", authors: "Pollan, M.", journal: "How to Change Your Mind, Penguin Press", year: 2018, url: "https://michaelpollan.com/books/how-to-change-your-mind/" },
  source_psilocybin_history_2: { title: "Seeking the Magic Mushroom", authors: "Wasson, R.G.", journal: "Life Magazine", year: 1957, url: "https://doi.org/10.1177/0269881116675513" },
  source_lsd_1: { title: "The Pharmacology of LSD", authors: "Hintzen, A. & Passie, T.", journal: "Oxford University Press", year: 2010, url: "https://doi.org/10.1093/acprof:oso/9780199532254.001.0001" },
  source_lsd_2: { title: "Acute Effects of Lysergic Acid Diethylamide on Resting Brain Function", authors: "Tagliazucchi, E., et al.", journal: "NeuroImage", year: 2016, url: "https://doi.org/10.1016/j.neuroimage.2016.03.060" },
  source_lsd_tolerance: { title: "Cross tolerance between LSD and psilocybin", authors: "Isbell, H., et al.", journal: "Psychopharmacologia", year: 1961, url: "https://doi.org/10.1007/BF00407974" },
  source_lsd_history_1: { title: "LSD: My Problem Child", authors: "Hofmann, A.", journal: "McGraw-Hill", year: 1980, url: "https://maps.org/research-archive/books/lsd_my_problem_child.pdf" },
  source_lsd_history_2: { title: "Psychedelics in Psychiatry — History and Research", authors: "Nichols, D.E.", journal: "Pharmacological Reviews", year: 2016, url: "https://doi.org/10.1124/pr.115.011478" },
  source_dmt_1: { title: "N,N-dimethyltryptamine (DMT), an endogenous hallucinogen: past, present, and future research", authors: "Barker, S.A.", journal: "Frontiers in Neuroscience", year: 2018, url: "https://doi.org/10.3389/fnins.2018.00536" },
  source_dmt_2: { title: "Human pharmacology of ayahuasca: subjective and cardiovascular effects", authors: "Riba, J., et al.", journal: "Journal of Pharmacology and Experimental Therapeutics", year: 2003, url: "https://doi.org/10.1124/jpet.103.049882" },
  source_dmt_history_1: { title: "DMT: The Spirit Molecule", authors: "Strassman, R.", journal: "Park Street Press", year: 2001, url: "https://www.rickstrassman.com/dmt-the-spirit-molecule/" },
  source_mescaline_1: { title: "Mescaline: A Systematic Review of Human Studies", authors: "Metzner, R.", journal: "Journal of Psychoactive Drugs", year: 2004, url: "https://doi.org/10.1080/02791072.2004.10399952" },
  source_mescaline_2: { title: "Psychological and cognitive effects of long-term peyote use among Native Americans", authors: "Halpern, J.H., et al.", journal: "Biological Psychiatry", year: 2005, url: "https://doi.org/10.1016/j.biopsych.2004.11.024" },
  source_mescaline_history_1: { title: "The Doors of Perception", authors: "Huxley, A.", journal: "Chatto & Windus", year: 1954, url: "https://maps.org/research-archive/books/DoorsofPerception.pdf" },
  source_mescaline_history_2: { title: "PiHKAL: A Chemical Love Story", authors: "Shulgin, A. & Shulgin, A.", journal: "Transform Press", year: 1991, url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml" },
  source_peyote_1: { title: "An Overview on the Hallucinogenic Peyote and Its Alkaloid Mescaline: The Importance of Context, Ceremony and Culture", authors: "Klewer, M., et al.", journal: "Pharmaceuticals", year: 2023, url: "https://doi.org/10.3390/ph16121829" },
  source_peyote_2: { title: "Pharmacokinetic and Pharmacodynamic Aspects of Peyote and Mescaline: Clinical and Forensic Repercussions", authors: "Dinis-Oliveira, R.J., et al.", journal: "Current Molecular Pharmacology", year: 2019, url: "https://doi.org/10.2174/1874467212666190829103209" },
  source_peyote_history_1: { title: "Peyote (Lophophora williamsii): From prehistory to the present", authors: "El-Seedi, H.R., et al.", journal: "Journal of Ethnopharmacology", year: 2005, url: "https://doi.org/10.1016/j.jep.2005.04.022" },
  source_peyote_history_2: { title: "Native American Church and Peyote Use: Cultural and Legal Context", authors: "Anderson, E.F.", journal: "Lophophora: The Peyote Cactus", year: 1996, url: "https://doi.org/10.2307/2998929" },
  source_5meo_1: { title: "Acute and subacute effects of 5-methoxy-N,N-dimethyltryptamine in a human population", authors: "Davis, A.K., et al.", journal: "Journal of Psychopharmacology", year: 2018, url: "https://doi.org/10.1177/0269881118769010" },
  source_5meo_2: { title: "5-MeO-DMT: Overview of pharmacology and effects", authors: "Ott, J.", journal: "Journal of Psychoactive Drugs", year: 2001, url: "https://doi.org/10.1080/02791072.2001.10399999" },
  source_5meo_uthaug: { title: "A single inhalation of vapor from dried toad secretion containing 5-MeO-DMT in a naturalistic setting is related to sustained enhancement of satisfaction with life", authors: "Uthaug, M.V., et al.", journal: "Psychopharmacology", year: 2019, url: "https://doi.org/10.1007/s00213-019-05236-w" },
  source_5meo_davis: { title: "Intensity of Mystical Experiences Occasioned by 5-MeO-DMT and Comparison With a Prior Psilocybin Study", authors: "Davis, A.K., et al.", journal: "Frontiers in Psychology", year: 2018, url: "https://doi.org/10.3389/fpsyg.2018.02459" },
  source_5meo_reckweg: { title: "A Phase 1, Dose-Ranging Study to Assess Safety and Psychoactive Effects of a Vaporized 5-MeO-DMT Formulation (GH001)", authors: "Reckweg, J., et al.", journal: "Frontiers in Pharmacology", year: 2021, url: "https://doi.org/10.3389/fphar.2021.760671" },
  source_5meo_clinical: { title: "The clinical pharmacology and potential therapeutic applications of 5-MeO-DMT", authors: "Reckweg, J., et al.", journal: "Journal of Neurochemistry", year: 2022, url: "https://doi.org/10.1111/jnc.15587" },
  source_5meo_history_1: { title: "Bufo Alvarius: The Psychedelic Toad of the Sonoran Desert", authors: "Most, A. (Nelson, K.)", journal: "Self-published pamphlet", year: 1984, url: "https://erowid.org/animals/toads/bufo_alvarius_psychedelic_toad.pdf" },
  source_ayahuasca_1: { title: "The Pharmacology of Ayahuasca: A Review", authors: "McKenna, D.J.", journal: "Pharmacology, Biochemistry and Behavior", year: 2004, url: "https://doi.org/10.1016/j.pbb.2004.01.025" },
  source_ayahuasca_2: { title: "Therapeutic potential of ayahuasca: a prospective observational study", authors: "Domínguez-Clavé, E., et al.", journal: "Psychopharmacology", year: 2016, url: "https://doi.org/10.1007/s00213-016-4375-x" },
  source_ayahuasca_3: { title: "The Therapeutic Use of Ayahuasca", authors: "Labate, B.C. & Cavnar, C. (Eds.)", journal: "Springer", year: 2014, url: "https://doi.org/10.1007/978-3-642-40426-9" },
  source_ayahuasca_history_1: { title: "Ayahuasca: Pharmacology, Neuroscience and Therapeutic Potential", authors: "Frecska, E., et al.", journal: "Brain Research Bulletin", year: 2016, url: "https://doi.org/10.1016/j.brainresbull.2016.03.002" },
  source_ayahuasca_history_2: { title: "The Religious Uses of Ayahuasca in Brazil: The UDV and Santo Daime", authors: "Labate, B.C.", journal: "Journal of Psychoactive Drugs", year: 2011, url: "https://doi.org/10.1080/02791072.2011.605647" },
  source_salvinorin_1: { title: "Salvinorin A: A Potent Naturally Occurring Nonnitrogenous Kappa Opioid Selective Agonist", authors: "Roth, B.L., et al.", journal: "Proceedings of the National Academy of Sciences", year: 2002, url: "https://doi.org/10.1073/pnas.182234399" },
  source_salvinorin_2: { title: "Salvia divinorum and salvinorin A: new pharmacologic findings", authors: "Valdés, L.J., et al.", journal: "Journal of Ethnopharmacology", year: 1994, url: "https://doi.org/10.1016/0378-8741(94)90168-6" },
  source_salvinorin_history_1: { title: "Hallucinogenic plants of the Mazatec: Salvia divinorum", authors: "Wasson, R.G.", journal: "Botanical Museum Leaflets, Harvard University", year: 1962, url: "https://doi.org/10.5962/p.295494" },
  source_ibogaine_1: { title: "Ibogaine and Noribogaine in the Treatment of Opioid Use Disorder", authors: "Noller, G.E., et al.", journal: "The American Journal on Addictions", year: 2018, url: "https://doi.org/10.1111/ajad.12717" },
  source_ibogaine_2: { title: "Cardiac Safety Concerns for Ibogaine Treatment of Opioid Use Disorder", authors: "Koenig, X. & Hilber, K.", journal: "Molecules", year: 2015, url: "https://doi.org/10.3390/molecules20022208" },
  source_ibogaine_history_1: { title: "Ibogaine: Complex Pharmacokinetics, Concerns for Safety, and Preliminary Efficacy Measures", authors: "Mash, D.C., et al.", journal: "Annals of the New York Academy of Sciences", year: 2000, url: "https://doi.org/10.1111/j.1749-6632.2000.tb06493.x" },
  source_mdma_1: { title: "Efficacy and Safety of MDMA-Assisted Psychotherapy for PTSD", authors: "Mithoefer, M.C., et al.", journal: "Psychopharmacology", year: 2019, url: "https://doi.org/10.1007/s00213-019-05249-5" },
  source_mdma_2: { title: "The pharmacology of MDMA in humans", authors: "Green, A.R., et al.", journal: "Pharmacological Reviews", year: 2003, url: "https://doi.org/10.1124/pr.55.3.3" },
  source_mdma_3: { title: "MDMA-assisted therapy for severe PTSD: a randomized, double-blind, placebo-controlled phase 3 study", authors: "Mitchell, J.M., et al.", journal: "Nature Medicine", year: 2021, url: "https://doi.org/10.1038/s41591-021-01336-3" },
  source_mdma_history_1: { title: "MDMA: A Short Course in Human Pharmacology", authors: "Shulgin, A.T.", journal: "PiHKAL, Transform Press", year: 1991, url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml" },
  source_mdma_history_2: { title: "The History of MDMA as an Underground Drug in the United States, 1960–1981", authors: "Benzenhöfer, U. & Passie, T.", journal: "Journal of Psychoactive Drugs", year: 2010, url: "https://doi.org/10.1080/02791072.2010.10400697" },
  source_mda_1: { title: "Subjective effects and pharmacokinetics of MDA and MDMA", authors: "Baggott, M.J., et al.", journal: "Journal of Psychopharmacology", year: 2012, url: "https://doi.org/10.1177/0269881112446532" },
  source_mda_2: { title: "Neurotoxicity of MDMA and MDA to brain serotonin neurons", authors: "Ricaurte, G.A. & McCann, U.D.", journal: "Annals of the New York Academy of Sciences", year: 2000, url: "https://doi.org/10.1111/j.1749-6632.2000.tb06480.x" },
  source_mda_history_1: { title: "The Healing Journey: New Approaches to Consciousness", authors: "Naranjo, C.", journal: "Pantheon Books", year: 1973, url: "https://www.goodreads.com/book/show/1337484.The_Healing_Journey" },
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
  source_ketamine_history_1: { title: "Ketamine: The First Quarter Century", authors: "White, P.F., et al.", journal: "Anesthesia & Analgesia", year: 1982, url: "https://doi.org/10.1213/00000539-198204000-00002" },
  source_ketamine_history_2: { title: "Rapid and longer-term antidepressant effects of repeated ketamine infusions", authors: "Murrough, J.W., et al.", journal: "Biological Psychiatry", year: 2013, url: "https://doi.org/10.1016/j.biopsych.2012.06.022" },
  source_pcp_1: { title: "Phencyclidine: mechanisms of action and history", authors: "Meltzer, H.Y., et al.", journal: "European Archives of Psychiatry and Clinical Neuroscience", year: 1999, url: "https://doi.org/10.1007/s004060050064" },
  source_pcp_history_1: { title: "Angel Dust: Phencyclidine from Discovery to Disrepute", authors: "Domino, E.F.", journal: "Drug and Alcohol Dependence", year: 1980, url: "https://doi.org/10.1016/0376-8716(80)90031-3" },
  source_2cb_1: { title: "First pharmacological and clinical study of 2C-B as a new psychoactive substance", authors: "Papaseit, E., et al.", journal: "British Journal of Clinical Pharmacology", year: 2018, url: "https://doi.org/10.1111/bcp.13511" },
  source_2cb_2: { title: "PiHKAL: A Chemical Love Story", authors: "Shulgin, A. & Shulgin, A.", journal: "Transform Press", year: 1991, url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml" },
  source_2cb_history_1: { title: "PiHKAL: A Chemical Love Story", authors: "Shulgin, A. & Shulgin, A.", journal: "Transform Press", year: 1991, url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml" },
  source_25i_1: { title: "25I-NBOMe: Clinical and laboratory findings in a series of overdose cases", authors: "Wood, D.M., et al.", journal: "Clinical Toxicology", year: 2015, url: "https://doi.org/10.3109/15563650.2014.990778" },
  source_25i_2: { title: "NBOMe compounds: A review of pharmacology, epidemiology and analytical methods", authors: "Zuba, D. & Byrska, B.", journal: "Drug Testing and Analysis", year: 2013, url: "https://doi.org/10.1002/dta.1468" },
  source_25i_history_1: { title: "Characterization of novel psychoactive substances: The NBOMe series", authors: "Rickli, A., et al.", journal: "Neuropharmacology", year: 2015, url: "https://doi.org/10.1016/j.neuropharm.2015.01.017" },
  source_candy_flip_1: { title: "Psychedelics and the human serotonergic system", authors: "Nichols, D.E.", journal: "Pharmacology & Therapeutics", year: 2004, url: "https://doi.org/10.1016/j.pharmthera.2004.01.003" },
  source_redosing_1: { title: "Drug–drug interactions involving classic psychedelics: A systematic review", authors: "Calder, A.E. & Hasler, G.", journal: "Frontiers in Psychiatry", year: 2024, url: "https://doi.org/10.3389/fpsyt.2024.1339607" }
};

// ─── SOURCE MAP ───────────────────────────────────────────────────────────────
const SUBSTANCE_SOURCE_MAP = {
  psilocybin:   ["source_psilocybin_1", "source_psilocybin_2", "source_psilocybin_3", "source_redosing_1", "source_psilocybin_history_1", "source_psilocybin_history_2"],
  lsd:          ["source_lsd_1", "source_lsd_2", "source_lsd_tolerance", "source_redosing_1", "source_lsd_history_1", "source_lsd_history_2"],
  dmt:          ["source_dmt_1", "source_dmt_2", "source_dmt_history_1"],
  mescaline:    ["source_mescaline_1", "source_mescaline_2", "source_mescaline_history_1", "source_mescaline_history_2"],
  peyote:       ["source_mescaline_1", "source_mescaline_2", "source_peyote_1", "source_peyote_2", "source_peyote_history_1", "source_peyote_history_2"],
  "5meo_dmt":   ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical", "source_5meo_history_1"],
  ayahuasca:    ["source_ayahuasca_1", "source_ayahuasca_2", "source_ayahuasca_3", "source_ayahuasca_history_1", "source_ayahuasca_history_2"],
  salvinorin_a: ["source_salvinorin_1", "source_salvinorin_2", "source_salvinorin_history_1"],
  ibogaine:     ["source_ibogaine_1", "source_ibogaine_2", "source_ibogaine_history_1"],
  mdma:         ["source_mdma_1", "source_mdma_2", "source_mdma_3", "source_mdma_history_1", "source_mdma_history_2"],
  mda:          ["source_mda_1", "source_mda_2", "source_mda_history_1"],
  ketamine:     ["source_ketamine_1", "source_ketamine_2", "source_ketamine_fond_2014", "source_ketamine_statpearls", "source_ketamine_rolan_2014", "source_ketamine_chong_2009", "source_ketamine_schoevers_2016", "source_ketamine_andrade_2017", "source_ketamine_chilukuri_2014", "source_ketamine_murrough_2013", "source_ketamine_history_1", "source_ketamine_history_2"],
  pcp:          ["source_pcp_1", "source_pcp_history_1"],
  "2cb":        ["source_2cb_1", "source_2cb_2", "source_2cb_history_1"],
  "25i_nbome":  ["source_25i_1", "source_25i_2", "source_25i_history_1"],
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
  const totalTime = booster ? Math.max(duration, booster.time + booster.duration) + 30 : duration + 30;
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
      const bI = bt <= bPeak ? bMax * (bt / bPeak) : bMax * Math.exp(-(bt - bPeak) / (bDur * 0.5));
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
  const boosterData = booster?.enabled ? { time: booster.time, intensity: Math.min(6, (booster.dose / src.doses.moderate) * 4), peak: src.peak, duration: src.duration } : null;
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

// ─── DOSE SLIDER WITH MANUAL INPUT ───────────────────────────────────────────
function DoseSlider({ label, value, min, max, step, unit, onChange, accentColor, doseLabel }) {
  const acc = accentColor || C.teal;
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const nudge = (mult) => {
    const newVal = Math.max(min, Math.min(max, parseFloat((value + mult * step).toFixed(6))));
    onChange(newVal);
  };

  const startEdit = () => {
    setInputVal(value.toFixed(value < 1 ? 2 : 1));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 10);
  };
  const commitEdit = () => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      onChange(Math.max(min, Math.min(max, parsed)));
    }
    setEditing(false);
  };
  const handleKey = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditing(false);
  };

  const btnStyle = (size) => ({
    width: size === "lg" ? 32 : 28, height: 30, borderRadius: 8, border: `1px solid ${C.border}`,
    background: C.surfaceLight, color: C.tealSoft, cursor: "pointer",
    fontSize: size === "lg" ? 14 : 11, display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 0.12s", letterSpacing: size === "sm" ? "-2px" : "0", fontFamily: "monospace"
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: C.greyDim, fontSize: 13, fontFamily: "'Merriweather Sans', sans-serif" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {doseLabel && <span style={{ color: doseLabel.color, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>{doseLabel.label}</span>}
          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input ref={inputRef} value={inputVal} onChange={e => setInputVal(e.target.value)} onBlur={commitEdit} onKeyDown={handleKey}
                style={{ width: 70, background: C.surfaceLight, border: `1px solid ${C.teal}`, borderRadius: 6, color: C.white, fontWeight: 700, fontSize: 15, fontFamily: "'Merriweather Sans', sans-serif", padding: "2px 6px", textAlign: "right", outline: "none" }} />
              <span style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{unit}</span>
            </div>
          ) : (
            <button onClick={startEdit} title="Click to type a value" style={{ background: "none", border: "none", cursor: "text", padding: "2px 4px", borderRadius: 6, borderBottom: `1px dashed ${C.teal}44`, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: C.white, fontWeight: 700, fontSize: 15, fontFamily: "'Merriweather Sans', sans-serif" }}>{value.toFixed(value < 1 ? 2 : 1)}</span>
              <span style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{unit}</span>
            </button>
          )}
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
          <p style={{ color: C.greyDim, fontSize: 11, margin: 0, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>All information is derived from published peer-reviewed scientific literature or primary sources. No information is generated without a verified source.</p>
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
            {sources.length === 0
              ? <p style={{ color: C.greyDim, fontFamily: "'Merriweather Sans', sans-serif" }}>No sources found.</p>
              : sources.map((s, i) => (
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

// ─── HISTORY MODAL ────────────────────────────────────────────────────────────
function HistoryModal({ substances, combinations, onClose }) {
  const [activeId, setActiveId] = useState(null);
  const all = [...substances, ...combinations];
  const active = activeId ? all.find(s => s.id === activeId) : null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: 16, padding: 26, maxWidth: 660, width: "100%", maxHeight: "88vh", overflowY: "auto", border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: C.tealSoft, fontFamily: "'Merriweather', serif", margin: 0, fontSize: 18 }}>
            {active ? (
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
                {active.name}
              </span>
            ) : "Medicine Descriptions & History"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.greyDim, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {!active ? (
          <>
            <p style={{ color: C.greyDim, fontSize: 12, marginBottom: 18, fontFamily: "'Merriweather Sans', sans-serif", lineHeight: 1.6 }}>
              Select a medicine to read its description and history — from ancient ceremonial roots to modern clinical research.
            </p>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Merriweather Sans', sans-serif" }}>Single Substances</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {substances.map(s => (
                  <button key={s.id} onClick={() => setActiveId(s.id)} style={{ padding: "10px 8px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "center", lineHeight: 1.25, transition: "all 0.15s" }}>
                    <div>{s.name}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{s.category}</div>
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
                    <div style={{ fontSize: 11, opacity: 0.65 }}>{c.components.map(id => substances.find(s => s.id === id)?.name).join(" + ")}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 14, padding: "6px 12px", background: `${C.teal}18`, borderRadius: 8, display: "inline-block" }}>
              <span style={{ color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>{active.isCombination ? "Combination" : active.category}</span>
            </div>
            <p style={{ color: C.grey, fontSize: 14, lineHeight: 1.85, fontFamily: "'Merriweather', serif", fontWeight: 300, margin: "0 0 20px" }}>
              {active.history || active.description || "No history available for this entry."}
            </p>
            {(active.historySources || []).length > 0 && (
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>Sources for This History</div>
                {(active.historySources || []).map(id => {
                  const s = SOURCES[id];
                  if (!s) return null;
                  return (
                    <div key={id} style={{ marginBottom: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, borderLeft: `3px solid ${C.teal}55` }}>
                      <div style={{ color: C.white, fontSize: 12, fontWeight: 600, marginBottom: 3, fontFamily: "'Merriweather', serif" }}>{s.title}</div>
                      <div style={{ color: C.grey, fontSize: 11, marginBottom: 4, fontFamily: "'Merriweather Sans', sans-serif" }}>{s.authors} — <em>{s.journal}</em>, {s.year}</div>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontSize: 10, wordBreak: "break-all", fontFamily: "'Merriweather Sans', sans-serif" }}>{s.url}</a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HISTORY PAGE (inline, no modal overlay) ──────────────────────────────────
function HistoryPage({ substances, combinations }) {
  const [activeId, setActiveId] = useState(null);
  const all = [...substances, ...combinations];
  const active = activeId ? all.find(s => s.id === activeId) : null;

  return (
    <div style={{ paddingBottom: 40 }}>
      {active ? (
        <>
          <button onClick={() => setActiveId(null)} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer", fontSize: 14, padding: "0 0 16px", fontFamily: "'Merriweather Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
            ← Back to all medicines
          </button>
          <h2 style={{ color: C.tealSoft, fontFamily: "'Merriweather', serif", margin: "0 0 10px", fontSize: 22 }}>{active.name}</h2>
          <div style={{ marginBottom: 14, padding: "6px 12px", background: `${C.teal}18`, borderRadius: 8, display: "inline-block" }}>
            <span style={{ color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>{active.isCombination ? "Combination" : active.category}</span>
          </div>
          <p style={{ color: C.grey, fontSize: 14, lineHeight: 1.85, fontFamily: "'Merriweather', serif", fontWeight: 300, margin: "0 0 20px" }}>
            {active.history || active.description || "No history available for this entry."}
          </p>
          {(active.historySources || []).length > 0 && (
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>Sources for This History</div>
              {(active.historySources || []).map(id => {
                const s = SOURCES[id];
                if (!s) return null;
                return (
                  <div key={id} style={{ marginBottom: 10, padding: "10px 12px", background: C.bg, borderRadius: 8, borderLeft: `3px solid ${C.teal}55` }}>
                    <div style={{ color: C.white, fontSize: 12, fontWeight: 600, marginBottom: 3, fontFamily: "'Merriweather', serif" }}>{s.title}</div>
                    <div style={{ color: C.grey, fontSize: 11, marginBottom: 4, fontFamily: "'Merriweather Sans', sans-serif" }}>{s.authors} — <em>{s.journal}</em>, {s.year}</div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, fontSize: 10, wordBreak: "break-all", fontFamily: "'Merriweather Sans', sans-serif" }}>{s.url}</a>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 style={{ color: C.tealSoft, fontFamily: "'Merriweather', serif", margin: "0 0 6px", fontSize: 20 }}>Medicine Descriptions & History</h2>
          <p style={{ color: C.greyDim, fontSize: 12, marginBottom: 20, fontFamily: "'Merriweather Sans', sans-serif", lineHeight: 1.6 }}>
            Select a medicine to read its description and history — from ancient ceremonial roots to modern clinical research.
          </p>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Merriweather Sans', sans-serif" }}>Single Substances</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {substances.map(s => (
                <button key={s.id} onClick={() => setActiveId(s.id)} style={{ padding: "12px 8px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "center", lineHeight: 1.25, transition: "all 0.15s" }}>
                  <div>{s.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{s.category}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Merriweather Sans', sans-serif" }}>Combinations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {combinations.map(c => (
                <button key={c.id} onClick={() => setActiveId(c.id)} style={{ padding: "12px 14px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.65 }}>{c.components.map(id => substances.find(s => s.id === id)?.name).join(" + ")}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
async function storageGet(key) {
  try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function storageSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val), true); } catch {}
}

// ─── TRIP REPORT FORM ────────────────────────────────────────────────────────
const INTENSITY_LEVELS = ["1 – Threshold", "2 – Light", "3 – Moderate", "4 – Strong", "5 – Heavy"];
const SETTINGS = ["Home (solo)", "Home (with others)", "Nature / Outdoors", "Ceremony / Retreat", "Clinical / Therapeutic", "Other"];
const MOODS = ["🌟 Profound", "💚 Healing", "😌 Peaceful", "🔥 Challenging", "😰 Difficult", "🌀 Confusing", "😂 Joyful", "😢 Cathartic", "⚡ Intense"];

function TripReportForm({ substances, combinations, onSave, onCancel }) {
  const all = [...substances, ...combinations];
  const [step, setStep] = useState(1); // 1=substance, 2=details, 3=report
  const [form, setForm] = useState({
    substanceId: "", substanceName: "",
    date: new Date().toISOString().split("T")[0],
    dose: "", unit: "", intensity: "", setting: "",
    mood: "", title: "", report: "", integration: "",
    anonymous: true,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectSubstance = (item) => {
    const u = item.is5MeO ? "mg" : item.isKetamine ? "mg" : item.unit || "mg";
    upd("substanceId", item.id);
    upd("substanceName", item.name);
    upd("unit", u);
    setStep(2);
  };

  const inputStyle = {
    width: "100%", background: C.surfaceLight, border: `1px solid ${C.border}`,
    borderRadius: 10, color: C.white, fontSize: 13, padding: "11px 14px",
    fontFamily: "'Merriweather Sans', sans-serif", outline: "none", boxSizing: "border-box",
    marginTop: 6,
  };
  const labelStyle = { color: C.greyDim, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif" };
  const chipBtn = (val, current, onClick, accent) => {
    const sel = val === current;
    const ac = accent || C.teal;
    return (
      <button key={val} onClick={() => onClick(val)} style={{
        padding: "7px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer",
        background: sel ? `${ac}33` : C.surfaceLight, color: sel ? ac : C.greyDim,
        border: `1px solid ${sel ? ac : C.border}`, fontFamily: "'Merriweather Sans', sans-serif",
        transition: "all 0.14s", whiteSpace: "nowrap",
      }}>{val}</button>
    );
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.report.trim()) return;
    onSave({
      ...form,
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {["Substance", "Details", "Your Report"].map((s, i) => {
          const active = step === i + 1;
          const done = step > i + 1;
          return (
            <div key={s} onClick={() => done ? setStep(i + 1) : null} style={{
              flex: 1, padding: "8px 4px", textAlign: "center", borderRadius: 8,
              background: active ? C.teal : done ? `${C.teal}33` : C.surfaceLight,
              color: active ? C.bg : done ? C.teal : C.greyDim,
              fontSize: 11, fontWeight: active ? 700 : 500,
              fontFamily: "'Merriweather Sans', sans-serif",
              cursor: done ? "pointer" : "default",
              border: `1px solid ${active ? C.teal : done ? `${C.teal}55` : C.border}`,
              transition: "all 0.15s",
            }}>{s}</div>
          );
        })}
      </div>

      {/* Step 1: Substance */}
      {step === 1 && (
        <div>
          <div style={{ color: C.white, fontSize: 16, fontFamily: "'Merriweather', serif", fontWeight: 700, marginBottom: 6 }}>Which medicine?</div>
          <div style={{ color: C.greyDim, fontSize: 13, marginBottom: 20, fontFamily: "'Merriweather Sans', sans-serif" }}>Select the primary substance for this report.</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Single Substances</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {substances.map(s => (
                <button key={s.id} onClick={() => selectSubstance(s)} style={{
                  padding: "11px 8px", background: C.surfaceLight, color: C.tealSoft,
                  border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, fontFamily: "'Merriweather Sans', sans-serif",
                  textAlign: "center", lineHeight: 1.25, transition: "all 0.15s",
                }}>
                  <div>{s.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{s.category}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ ...labelStyle, marginBottom: 10, marginTop: 16 }}>Combinations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {combinations.map(c => (
                <button key={c.id} onClick={() => selectSubstance(c)} style={{
                  padding: "12px 14px", background: C.surfaceLight, color: C.tealSoft,
                  border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer",
                  fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left",
                  transition: "all 0.15s",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.65 }}>
                    {c.components.map(id => substances.find(s => s.id === id)?.name).join(" + ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ padding: "12px 16px", background: `${C.teal}18`, borderRadius: 12, borderLeft: `3px solid ${C.teal}` }}>
            <span style={{ color: C.teal, fontWeight: 700, fontFamily: "'Merriweather Sans', sans-serif" }}>{form.substanceName}</span>
          </div>

          <div>
            <div style={labelStyle}>Date</div>
            <input type="date" value={form.date} onChange={e => upd("date", e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div>
              <div style={labelStyle}>Dose</div>
              <input type="number" placeholder="e.g. 25" value={form.dose} onChange={e => upd("dose", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={labelStyle}>Unit</div>
              <input type="text" placeholder="mg" value={form.unit} onChange={e => upd("unit", e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Intensity Experienced</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTENSITY_LEVELS.map(l => chipBtn(l, form.intensity, v => upd("intensity", v)))}
            </div>
          </div>

          <div>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Setting</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SETTINGS.map(s => chipBtn(s, form.setting, v => upd("setting", v), C.tealSoft))}
            </div>
          </div>

          <div>
            <div style={{ ...labelStyle, marginBottom: 10 }}>Overall Mood / Tone</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOODS.map(m => chipBtn(m, form.mood, v => upd("mood", v), C.tealSat))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceLight, color: C.greyDim, fontSize: 13, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif" }}>← Back</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: 13, borderRadius: 10, border: `1px solid ${C.teal}`, background: C.teal, color: C.bg, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif" }}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3: The Report */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ padding: "10px 16px", background: `${C.teal}18`, borderRadius: 12, borderLeft: `3px solid ${C.teal}`, display: "flex", gap: 16 }}>
            <span style={{ color: C.teal, fontWeight: 700, fontFamily: "'Merriweather Sans', sans-serif" }}>{form.substanceName}</span>
            {form.dose && <span style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{form.dose} {form.unit}</span>}
            {form.intensity && <span style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{form.intensity.split(" – ")[1]}</span>}
          </div>

          <div>
            <div style={labelStyle}>Report Title *</div>
            <input type="text" placeholder="Give your experience a title..." value={form.title} onChange={e => upd("title", e.target.value)} style={inputStyle} />
          </div>

          <div>
            <div style={labelStyle}>Trip Report *</div>
            <div style={{ color: C.greyDim, fontSize: 11, marginTop: 4, marginBottom: 6, fontFamily: "'Merriweather Sans', sans-serif" }}>
              Describe your experience in as much or as little detail as you'd like.
            </div>
            <textarea value={form.report} onChange={e => upd("report", e.target.value)} placeholder="Describe what happened — onset, peak, duration, notable moments, thoughts, visions, emotions..." rows={8}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, marginTop: 0 }} />
          </div>

          <div>
            <div style={labelStyle}>Integration & Reflections</div>
            <div style={{ color: C.greyDim, fontSize: 11, marginTop: 4, marginBottom: 6, fontFamily: "'Merriweather Sans', sans-serif" }}>
              Optional: What did you take away? What are you still processing?
            </div>
            <textarea value={form.integration} onChange={e => upd("integration", e.target.value)} placeholder="Insights, changes in perspective, things you want to remember, questions that arose..." rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, marginTop: 0 }} />
          </div>

          <div style={{ padding: "12px 16px", background: C.surfaceLight, borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <input type="checkbox" id="anon" checked={form.anonymous} onChange={e => upd("anonymous", e.target.checked)}
              style={{ width: 18, height: 18, accentColor: C.teal, cursor: "pointer" }} />
            <label htmlFor="anon" style={{ color: C.grey, fontSize: 13, fontFamily: "'Merriweather Sans', sans-serif", cursor: "pointer" }}>
              Submit anonymously (no name attached)
            </label>
          </div>

          <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.08)", borderRadius: 8, borderLeft: "2px solid #f59e0b" }}>
            <p style={{ margin: 0, color: "#fcd34d", fontSize: 11, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>
              These reports are shared with all users of this app. Do not include personally identifying information if submitting anonymously. This is a community resource — write with care for others who may read it.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surfaceLight, color: C.greyDim, fontSize: 13, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif" }}>← Back</button>
            <button onClick={handleSave} disabled={!form.title.trim() || !form.report.trim()} style={{ flex: 2, padding: 13, borderRadius: 10, border: `1px solid ${C.teal}`, background: (!form.title.trim() || !form.report.trim()) ? C.surfaceLight : C.teal, color: (!form.title.trim() || !form.report.trim()) ? C.greyDim : C.bg, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", transition: "all 0.15s" }}>
              Submit Report ✓
            </button>
          </div>
        </div>
      )}

      {step !== 1 && (
        <button onClick={onCancel} style={{ marginTop: 12, width: "100%", padding: 10, borderRadius: 10, border: "none", background: "none", color: C.greyDim, fontSize: 12, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif" }}>
          Cancel
        </button>
      )}
    </div>
  );
}

// ─── SINGLE TRIP REPORT VIEW ─────────────────────────────────────────────────
function TripReportDetail({ report, onBack, substances, combinations }) {
  const all = [...substances, ...combinations];
  const substance = all.find(s => s.id === report.substanceId);
  const intensityNum = report.intensity ? parseInt(report.intensity[0]) : null;
  const intensityColors = [C.tealSoft, C.teal, C.tealSat, C.warning, C.danger];
  const iColor = intensityNum ? intensityColors[intensityNum - 1] : C.greyDim;

  return (
    <div style={{ paddingBottom: 40 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.teal, cursor: "pointer", fontSize: 13, padding: "0 0 20px", fontFamily: "'Merriweather Sans', sans-serif" }}>
        ← Back to reports
      </button>

      {/* Header card */}
      <div style={{ background: C.surface, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ padding: "3px 12px", borderRadius: 20, background: `${C.teal}22`, color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>
            {substance?.category || report.substanceName}
          </span>
          <span style={{ padding: "3px 12px", borderRadius: 20, background: `${C.teal}22`, color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>
            {report.substanceName}
          </span>
          {report.mood && (
            <span style={{ padding: "3px 12px", borderRadius: 20, background: `${C.tealSat}22`, color: C.tealSat, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>
              {report.mood}
            </span>
          )}
        </div>
        <h2 style={{ margin: "0 0 16px", color: C.white, fontSize: 19, fontFamily: "'Merriweather', serif", fontWeight: 700, lineHeight: 1.3 }}>{report.title}</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {report.date && <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>📅 {report.date}</div>}
          {report.dose && <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>💊 {report.dose} {report.unit}</div>}
          {report.setting && <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>📍 {report.setting}</div>}
          {report.intensity && <div style={{ color: iColor, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif", fontWeight: 600 }}>⚡ {report.intensity}</div>}
          {report.anonymous && <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>👤 Anonymous</div>}
        </div>
      </div>

      {/* Report body */}
      <div style={{ background: C.surface, borderRadius: 16, padding: 22, border: `1px solid ${C.border}`, marginBottom: 14 }}>
        <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif", marginBottom: 14 }}>Experience Report</div>
        <p style={{ color: C.grey, fontSize: 14, lineHeight: 1.9, fontFamily: "'Merriweather', serif", fontWeight: 300, margin: 0, whiteSpace: "pre-wrap" }}>{report.report}</p>
      </div>

      {report.integration && (
        <div style={{ background: C.surface, borderRadius: 16, padding: 22, border: `1px solid ${C.border}` }}>
          <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif", marginBottom: 14 }}>Integration & Reflections</div>
          <p style={{ color: C.grey, fontSize: 14, lineHeight: 1.9, fontFamily: "'Merriweather', serif", fontWeight: 300, margin: 0, whiteSpace: "pre-wrap" }}>{report.integration}</p>
        </div>
      )}
    </div>
  );
}

// ─── TRIP REPORTS PAGE ────────────────────────────────────────────────────────
function TripReportsPage({ substances, combinations }) {
  const [view, setView] = useState("grid"); // grid | list | form | detail
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [selectedTab, setSelectedTab] = useState("substances");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const STORAGE_KEY = "tam_trip_reports_v1";

  const loadReports = useCallback(async () => {
    setLoading(true);
    const data = await storageGet(STORAGE_KEY);
    setReports(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handleSave = async (report) => {
    setSaving(true);
    const updated = [report, ...reports];
    await storageSet(STORAGE_KEY, updated);
    setReports(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setView("grid"); }, 1600);
  };

  const selectSubstance = (item) => {
    setSelectedSubstance(item);
    setView("list");
  };

  const substanceReports = selectedSubstance
    ? reports.filter(r => r.substanceId === selectedSubstance.id)
    : [];

  const all = [...substances, ...combinations];
  const tabBtn = (active, label, onClick) => (
    <button onClick={onClick} style={{ flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 600, fontFamily: "'Merriweather Sans', sans-serif", background: active ? C.teal : "transparent", color: active ? C.bg : C.greyDim, border: "none", cursor: "pointer", borderRadius: 8, transition: "all 0.18s ease" }}>{label}</button>
  );

  // ── Detail view
  if (view === "detail" && selectedReport) {
    return <TripReportDetail report={selectedReport} onBack={() => setView("list")} substances={substances} combinations={combinations} />;
  }

  // ── New report form
  if (view === "form") {
    if (saving) return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ color: C.teal, fontSize: 28, marginBottom: 12 }}>⏳</div>
        <div style={{ color: C.grey, fontFamily: "'Merriweather Sans', sans-serif" }}>Saving your report...</div>
      </div>
    );
    if (saved) return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ color: C.tealSat, fontSize: 48, marginBottom: 16 }}>✓</div>
        <div style={{ color: C.white, fontSize: 18, fontFamily: "'Merriweather', serif", fontWeight: 700, marginBottom: 8 }}>Report Saved</div>
        <div style={{ color: C.greyDim, fontFamily: "'Merriweather Sans', sans-serif" }}>Your experience has been added to the community library.</div>
      </div>
    );
    return <TripReportForm substances={substances} combinations={combinations} onSave={handleSave} onCancel={() => setView("grid")} />;
  }

  // ── Reports list for a substance
  if (view === "list" && selectedSubstance) {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={() => setView("grid")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.teal, cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "'Merriweather Sans', sans-serif" }}>
            ← All Substances
          </button>
          <button onClick={() => setView("form")} style={{ padding: "9px 18px", borderRadius: 20, background: C.teal, color: C.bg, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Merriweather Sans', sans-serif" }}>
            + Add Report
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ padding: "3px 12px", borderRadius: 20, background: `${C.teal}22`, color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>
              {selectedSubstance.isCombination ? "Combination" : selectedSubstance.category}
            </span>
            <span style={{ color: C.white, fontSize: 18, fontWeight: 700, fontFamily: "'Merriweather', serif" }}>{selectedSubstance.name}</span>
          </div>
          <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>
            {substanceReports.length === 0 ? "No reports yet for this substance" : `${substanceReports.length} report${substanceReports.length === 1 ? "" : "s"}`}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.greyDim, fontFamily: "'Merriweather Sans', sans-serif" }}>Loading reports...</div>
        ) : substanceReports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: C.surface, borderRadius: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
            <div style={{ color: C.white, fontSize: 16, fontFamily: "'Merriweather', serif", fontWeight: 700, marginBottom: 8 }}>No reports yet</div>
            <div style={{ color: C.greyDim, fontSize: 13, marginBottom: 24, fontFamily: "'Merriweather Sans', sans-serif" }}>Be the first to share an experience with {selectedSubstance.name}.</div>
            <button onClick={() => setView("form")} style={{ padding: "12px 28px", borderRadius: 12, background: C.teal, color: C.bg, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Merriweather Sans', sans-serif" }}>
              Write a Report
            </button>
          </div>
        ) : substanceReports.map(r => {
          const intensityNum = r.intensity ? parseInt(r.intensity[0]) : null;
          const intensityColors = [C.tealSoft, C.teal, C.tealSat, C.warning, C.danger];
          const iColor = intensityNum ? intensityColors[intensityNum - 1] : C.greyDim;
          return (
            <div key={r.id} onClick={() => { setSelectedReport(r); setView("detail"); }}
              style={{ background: C.surface, borderRadius: 14, padding: 18, border: `1px solid ${C.border}`, marginBottom: 10, cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ color: C.white, fontSize: 15, fontFamily: "'Merriweather', serif", fontWeight: 700, lineHeight: 1.3, flex: 1, marginRight: 10 }}>{r.title}</div>
                {r.intensity && <span style={{ color: iColor, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif", whiteSpace: "nowrap" }}>⚡ {r.intensity.split(" – ")[1]}</span>}
              </div>
              <div style={{ color: C.grey, fontSize: 13, fontFamily: "'Merriweather Sans', sans-serif", lineHeight: 1.5, marginBottom: 12, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                {r.report}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {r.date && <span style={{ color: C.greyDim, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>📅 {r.date}</span>}
                {r.dose && <span style={{ color: C.greyDim, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>💊 {r.dose} {r.unit}</span>}
                {r.mood && <span style={{ color: C.greyDim, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>{r.mood}</span>}
                {r.setting && <span style={{ color: C.greyDim, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>📍 {r.setting}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Substance grid (default)
  const substancesWithCounts = substances.map(s => ({ ...s, count: reports.filter(r => r.substanceId === s.id).length }));
  const combinationsWithCounts = combinations.map(c => ({ ...c, count: reports.filter(r => r.substanceId === c.id).length }));

  return (
    <div>
      {/* Intro + Add button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 4 }}>
        <div>
          <div style={{ color: C.white, fontSize: 16, fontFamily: "'Merriweather', serif", fontWeight: 700, marginBottom: 4 }}>Community Trip Reports</div>
          <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>
            {loading ? "Loading..." : `${reports.length} report${reports.length === 1 ? "" : "s"} shared by the community`}
          </div>
        </div>
        <button onClick={() => setView("form")} style={{ padding: "10px 18px", borderRadius: 20, background: C.teal, color: C.bg, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Merriweather Sans', sans-serif", flexShrink: 0, marginLeft: 12 }}>
          + Write Report
        </button>
      </div>

      {/* Tabs + grid */}
      <div style={{ background: C.surface, borderRadius: 16, padding: 18, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.bg, borderRadius: 10, padding: 4 }}>
          {tabBtn(selectedTab === "substances", "Single Substances", () => setSelectedTab("substances"))}
          {tabBtn(selectedTab === "combinations", "Combinations", () => setSelectedTab("combinations"))}
        </div>
        {selectedTab === "substances" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {substancesWithCounts.map(s => (
              <button key={s.id} onClick={() => selectSubstance(s)} style={{ padding: "11px 8px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'Merriweather Sans', sans-serif", textAlign: "center", lineHeight: 1.25, transition: "all 0.15s ease" }}>
                <div>{s.name}</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3 }}>{s.count > 0 ? `${s.count} report${s.count === 1 ? "" : "s"}` : s.category}</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {combinationsWithCounts.map(c => (
              <button key={c.id} onClick={() => selectSubstance(c)} style={{ padding: "13px 16px", background: C.surfaceLight, color: C.tealSoft, border: `1px solid ${C.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", textAlign: "left", lineHeight: 1.3, transition: "all 0.15s ease" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{c.count > 0 ? `${c.count} report${c.count === 1 ? "" : "s"}` : c.components.map(id => substances.find(s => s.id === id)?.name).join(" + ")}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent reports preview */}
      {!loading && reports.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif", marginBottom: 12 }}>Recent Reports</div>
          {reports.slice(0, 3).map(r => {
            const subst = all.find(s => s.id === r.substanceId);
            return (
              <div key={r.id} onClick={() => {
                const s = all.find(x => x.id === r.substanceId);
                if (s) { setSelectedSubstance(s); setSelectedReport(r); setView("detail"); }
              }} style={{ background: C.surface, borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: `${C.teal}22`, color: C.teal, fontSize: 10, fontFamily: "'Merriweather Sans', sans-serif" }}>{r.substanceName}</span>
                  {r.mood && <span style={{ color: C.greyDim, fontSize: 11 }}>{r.mood}</span>}
                </div>
                <div style={{ color: C.white, fontSize: 14, fontFamily: "'Merriweather', serif", fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
                <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.report}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── RESOURCE LIBRARY PAGE ────────────────────────────────────────────────────
function ResourceLibraryPage() {
  const RESOURCES = [
    { category: "Integration Support", emoji: "🌿", items: [
      { name: "MAPS (Multidisciplinary Association for Psychedelic Studies)", url: "https://maps.org", desc: "Leading nonprofit research organization for psychedelic-assisted therapy" },
      { name: "Zendo Project", url: "https://www.zendoproject.org", desc: "Psychedelic harm reduction and support at events and communities" },
      { name: "Fireside Project", url: "https://firesideproject.org", desc: "Psychedelic peer support line: 62-FIRESIDE (1-623-473-7433)" },
      { name: "PRISM", url: "https://prism.org.au", desc: "Psychedelic Research in Science & Medicine — Australia" },
    ]},
    { category: "Education & Research", emoji: "📚", items: [
      { name: "Erowid", url: "https://erowid.org", desc: "Comprehensive library of psychoactive substance information and trip reports" },
      { name: "PsychonautWiki", url: "https://psychonautwiki.org", desc: "Community-sourced encyclopedia of psychoactive substances" },
      { name: "Psychedelic Alpha", url: "https://psychedelicalpha.com", desc: "News and analysis of the psychedelic industry and research landscape" },
      { name: "The Third Wave", url: "https://thethirdwave.co", desc: "Guides, courses, and community for intentional psychedelic use" },
    ]},
    { category: "Harm Reduction", emoji: "🛡️", items: [
      { name: "DanceSafe", url: "https://dancesafe.org", desc: "Harm reduction nonprofit with drug checking services and education" },
      { name: "TripSit", url: "https://tripsit.me", desc: "Real-time drug information, interaction checker, and live chat support" },
      { name: "Reagent Testing Australia", url: "https://reagenttesting.com.au", desc: "Reagent test kits for identifying substances before use" },
      { name: "Drug Policy Alliance", url: "https://drugpolicy.org", desc: "Advocacy organization working to end the war on drugs" },
    ]},
    { category: "Clinical Trials & Research", emoji: "🔬", items: [
      { name: "Johns Hopkins Center for Psychedelic Research", url: "https://hopkinspsychedelic.org", desc: "Leading academic research center for psilocybin and other psychedelics" },
      { name: "NYU Langone Center for Psychedelic Medicine", url: "https://med.nyu.edu/departments-institutes/psychiatry/research/psychedelic-medicine", desc: "Clinical research into MDMA, psilocybin, and ketamine therapies" },
      { name: "Imperial College London Centre for Psychedelic Research", url: "https://www.imperial.ac.uk/psychedelic-research-centre", desc: "UK's first psychedelic research centre, led by Dr. Robin Carhart-Harris" },
      { name: "ClinicalTrials.gov – Psychedelics", url: "https://clinicaltrials.gov/search?term=psychedelic", desc: "Search all active and completed psychedelic clinical trials worldwide" },
    ]},
    { category: "Books & Documentaries", emoji: "📖", items: [
      { name: "How to Change Your Mind — Michael Pollan", url: "https://michaelpollan.com/books/how-to-change-your-mind/", desc: "Accessible, deeply researched exploration of psychedelics and the science of consciousness" },
      { name: "The Psychedelic Explorer's Guide — James Fadiman", url: "https://www.jamesfadiman.com", desc: "Practical guide to psychedelic journeys for personal growth and therapeutic purpose" },
      { name: "DMT: The Spirit Molecule — Rick Strassman", url: "https://www.rickstrassman.com", desc: "Chronicle of clinical DMT research and the endogenous DMT hypothesis" },
      { name: "PiHKAL & TiHKAL — Alexander Shulgin", url: "https://erowid.org/library/books_online/pihkal/pihkal.shtml", desc: "Shulgin's landmark synthesis of phenethylamines and tryptamines with first-person accounts" },
    ]},
  ];

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: C.white, fontSize: 16, fontFamily: "'Merriweather', serif", fontWeight: 700, marginBottom: 6 }}>Resource Library</div>
        <div style={{ color: C.greyDim, fontSize: 13, fontFamily: "'Merriweather Sans', sans-serif", lineHeight: 1.6 }}>
          Curated resources for education, harm reduction, integration support, and clinical research.
        </div>
      </div>
      {RESOURCES.map(section => (
        <div key={section.category} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>{section.emoji}</span>
            <div style={{ color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif" }}>{section.category}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {section.items.map(item => (
              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "14px 16px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, textDecoration: "none", transition: "all 0.15s", borderLeft: `3px solid ${C.teal}55` }}>
                <div style={{ color: C.tealSoft, fontSize: 13, fontWeight: 600, fontFamily: "'Merriweather Sans', sans-serif", marginBottom: 4 }}>{item.name} ↗</div>
                <div style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif", lineHeight: 1.5 }}>{item.desc}</div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const SL = { color: C.greyDim, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Merriweather Sans', sans-serif", marginBottom: 14 };

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState("dosages"); // dosages | reports | library
  const [selected, setSelected] = useState(SUBSTANCES[0]);
  const [dose, setDose] = useState(SUBSTANCES[0].doses.moderate);
  const [comboDoses, setComboDoses] = useState({});
  const [showSources, setShowSources] = useState(false);
  const [showAllRefs, setShowAllRefs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
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
  const currentEffects = !isCombination ? ((meoData || roaData || selected).effects[effectsCat] || (meoData || roaData || selected).effects.moderate) : null;
  const doseLabel = !isCombination ? getDoseCategoryLabel(activeDoses || selected.doses, dose) : null;
  const doseStep = activeDoses ? Math.max(0.001, (activeDoses.heavy * 1.5) / 200) : 1;
  const boosterStep = activeDoses ? Math.max(0.001, activeDoses.moderate / 100) : 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, fontFamily: "'Merriweather Sans', sans-serif", paddingBottom: 60 }}>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Merriweather+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "22px 20px 18px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Merriweather', serif", fontWeight: 700, color: C.tealSoft, marginBottom: 4, fontSize: "clamp(15px,3.5vw,20px)", letterSpacing: "0.02em" }}>Tam Integration</div>
        <h1 style={{ margin: 0, fontSize: "clamp(13px,2.8vw,16px)", fontWeight: 400, fontFamily: "'Merriweather', serif", fontStyle: "italic", color: C.grey, lineHeight: 1.35 }}>Guide to Popular Molecules</h1>
        <p style={{ margin: "7px 0 0", color: C.greyDim, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif" }}>Evidence-based psychedelic substance reference</p>
      </div>

      {/* Nav Bar — 4 tabs in 2×2 grid */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "10px 16px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            { id: "dosages",  label: "Dosages + Effects",       emoji: "⚗️" },
            { id: "history",  label: "Descriptions + History",  emoji: "📜" },
            { id: "library",  label: "Resource Library",        emoji: "📚" },
            { id: "reports",  label: "Trip Reports",            emoji: "📝" },
          ].map(({ id, label, emoji }) => {
            const isActive = activePage === id;
            return (
              <button key={id} onClick={() => setActivePage(id)} style={{
                padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                background: isActive ? C.teal : C.surfaceLight,
                color: isActive ? C.bg : C.greyDim,
                border: `1px solid ${isActive ? C.teal : C.border}`,
                fontSize: "clamp(10px, 2.2vw, 13px)", fontWeight: isActive ? 700 : 500,
                fontFamily: "'Merriweather Sans', sans-serif",
                transition: "all 0.15s ease",
                boxShadow: isActive ? `0 0 12px ${C.teal}44` : "none",
                lineHeight: 1.3, textAlign: "center",
              }}>
                <div style={{ fontSize: "clamp(14px, 3vw, 18px)", marginBottom: 3 }}>{emoji}</div>
                <div>{label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 0" }}>

        {/* ── Resource Library page */}
        {activePage === "library" && <ResourceLibraryPage />}

        {/* ── Trip Reports page */}
        {activePage === "reports" && <TripReportsPage substances={SUBSTANCES} combinations={COMBINATIONS} />}

        {/* ── Descriptions + History page */}
        {activePage === "history" && <HistoryPage substances={SUBSTANCES} combinations={COMBINATIONS} />}

        {/* ── Dosages + Effects page */}
        {activePage === "dosages" && (<>
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

            {isCombination && (
              <div style={{ margin: "12px 0 0", padding: 16, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <p style={{ margin: "0 0 12px", color: C.grey, fontSize: 13, lineHeight: 1.7, fontFamily: "'Merriweather', serif", fontWeight: 300 }}>{selected.description}</p>
                <div style={{ padding: "10px 12px", background: C.bg, borderRadius: 8 }}>
                  <span style={{ color: C.teal, fontSize: 11, fontFamily: "'Merriweather Sans', sans-serif", fontWeight: 700 }}>TIMING: </span>
                  <span style={{ color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>{selected.timing}</span>
                </div>
              </div>
            )}

            {/* Ketamine ROA */}
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
                {roaData && <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `2px solid ${C.teal}55` }}><p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>{roaData.notes}</p></div>}
              </div>
            )}

            {/* 5-MeO Source */}
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
                {meoData && <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `2px solid ${C.teal}55` }}><p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>{meoData.notes}</p></div>}
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
                      return <button key={opt} onClick={() => setBooster(b => ({ ...b, enabled: opt === "Yes" }))} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, fontFamily: "'Merriweather Sans', sans-serif", cursor: "pointer", border: `1px solid ${isActive ? C.teal : C.border}`, background: isActive ? C.teal : C.surfaceLight, color: isActive ? C.bg : C.greyDim, transition: "all 0.15s" }}>{opt}</button>;
                    })}
                  </div>
                </div>
                {booster.enabled && (
                  <>
                    {selected.boosterInfo && <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `2px solid ${C.tealSat}55`, marginBottom: 16 }}><p style={{ margin: 0, color: C.greyDim, fontSize: 12, lineHeight: 1.6, fontFamily: "'Merriweather Sans', sans-serif" }}>{selected.boosterInfo}</p></div>}
                    <div style={{ marginBottom: 16 }}>
                      <DoseSlider label="Time after initial dose" value={booster.time} min={15} max={Math.round(activeSrc.duration * 0.7)} step={5} unit="min"
                        onChange={val => setBooster(b => ({ ...b, time: val }))} accentColor={C.tealSat} />
                    </div>
                    <DoseSlider label="Booster amount" value={booster.dose} min={0} max={activeDoses?.moderate || 50} step={boosterStep} unit={activeUnit || "mg"}
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

            {/* Three action buttons */}
            <button onClick={() => setShowSources(true)} style={{ margin: "14px 0 0", width: "100%", padding: 14, background: `${C.teal}18`, border: `1px solid ${C.teal}55`, borderRadius: 12, color: C.teal, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📚 View Sources & References ({allSourceIds.length})
            </button>
            <button onClick={() => setShowAllRefs(true)} style={{ margin: "8px 0 0", width: "100%", padding: 14, background: `${C.tealSoft}12`, border: `1px solid ${C.tealSoft}44`, borderRadius: 12, color: C.tealSoft, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              📖 View All References & Sources
            </button>
            <button onClick={() => setShowHistory(true)} style={{ margin: "8px 0 0", width: "100%", padding: 14, background: `${C.tealSat}12`, border: `1px solid ${C.tealSat}44`, borderRadius: 12, color: C.tealSat, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Merriweather Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              🌿 Medicine Descriptions & History
            </button>
          </>
        )}

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
          <p style={{ margin: "0 0 6px", color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>© {new Date().getFullYear()} Tam Integration. All rights reserved.</p>
          <p style={{ margin: 0, color: C.greyDim, fontSize: 12, fontFamily: "'Merriweather Sans', sans-serif" }}>
            To learn more about Tam Integration, visit{" "}
            <a href="https://tamintegration.com" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: "none", borderBottom: `1px solid ${C.teal}55` }}>tamintegration.com</a>
          </p>
        </div>
      </div>

      {showSources && <SourcesModal sourceIds={allSourceIds} onClose={() => setShowSources(false)} />}
      {showAllRefs && <AllReferencesModal substances={SUBSTANCES} combinations={COMBINATIONS} onClose={() => setShowAllRefs(false)} />}
      {showHistory && <HistoryModal substances={SUBSTANCES} combinations={COMBINATIONS} onClose={() => setShowHistory(false)} />}
    </div>
  );
}
const SUBSTANCES = [
  { id: "psilocybin", name: "Psilocybin", category: "Tryptamine", unit: "mg", doses: { threshold: 1, light: 3, moderate: 15, strong: 25, heavy: 40 }, onset: 30, peak: 120, duration: 360, history: "Psilocybin is the prodrug of psilocin, the active compound found naturally in over 200 species of fungi, primarily of the genus Psilocybe. Indigenous Mesoamerican cultures — particularly the Mazatec people of Oaxaca, Mexico — have used psilocybin mushrooms in healing ceremonies called veladas for thousands of years. The Mazatec healer María Sabina became the first indigenous practitioner to allow outsiders to participate in these ceremonies, leading to the 1957 Life magazine article by R. Gordon Wasson that introduced psilocybin mushrooms to Western culture. Swiss chemist Albert Hofmann isolated and synthesized psilocybin in 1958, opening the door to psychiatric research. Timothy Leary and Richard Alpert conducted the Harvard Psilocybin Project in the early 1960s. Following scheduling in the 1970s, research effectively halted for three decades. The current renaissance — led by Johns Hopkins, NYU, and Imperial College London — has produced compelling evidence for psilocybin in treating depression, addiction, anxiety, and end-of-life distress.", effects: { light: ["Mild perceptual shifts", "Enhanced colors and visual acuity", "Gentle mood lift", "Increased introspection"], moderate: ["Visual patterns, fractals, and distortions", "Emotional openness and vulnerability", "Altered time perception", "Philosophical insights"], strong: ["Strong visual hallucinations", "Ego dissolution", "Profound emotional experiences, catharsis", "Synesthesia possible"], heavy: ["Complete ego dissolution", "Intense visual phenomena and geometry", "Mystical or transcendent experiences", "Challenging confrontations with fear, grief, or trauma"] }, safety: ["Do not combine with lithium — risk of seizures", "Caution with SSRIs", "Avoid if personal or family history of psychosis or schizophrenia", "Set, setting, and a trusted sitter strongly recommended at moderate+ doses"], boosterInfo: "A booster of 25–50% of the initial dose taken 60–90 minutes in can extend the peak. Rapid tolerance develops, so boosters are less effective than the initial dose.", sources: ["source_psilocybin_1", "source_psilocybin_2", "source_psilocybin_3", "source_redosing_1"], historySources: ["source_psilocybin_history_1", "source_psilocybin_history_2"] },
  { id: "lsd", name: "LSD", category: "Lysergamide", unit: "μg", doses: { threshold: 25, light: 75, moderate: 150, strong: 300, heavy: 600 }, onset: 45, peak: 240, duration: 720, history: "Lysergic acid diethylamide (LSD-25) was first synthesized by Swiss chemist Albert Hofmann at Sandoz Laboratories on November 16, 1938. Hofmann accidentally absorbed a small amount through his fingertips in 1943, experiencing the world's first LSD trip on April 16th — a date now known as 'Bicycle Day.' Sandoz released LSD commercially in 1947 as Delysid for psychiatric use. By the early 1960s, thousands of clinical studies explored its use in treating alcoholism, anxiety, and depression. Cultural figures including Aldous Huxley, Timothy Leary, and Ken Kesey propelled it into counterculture, leading to its Schedule I classification in 1968, effectively halting research for decades. Today a robust scientific renaissance at Johns Hopkins, NYU, and MAPS is re-examining LSD's therapeutic potential.", effects: { light: ["Mild euphoria and energy", "Sensory enhancement", "Slight perceptual changes", "Increased sociability"], moderate: ["Visual fractals, color intensification", "Amplified emotions", "Synesthesia common", "Deep empathy and connection"], strong: ["Intense open and closed-eye hallucinations", "Ego dissolution possible", "Profound insights", "Challenging emotional experiences possible"], heavy: ["Complete ego dissolution", "Overwhelming sensory and cognitive input", "Visionary and mystical experiences", "Very long duration — 12–18 hours at high doses"] }, safety: ["Avoid with SSRIs, MAOIs, or lithium", "High risk of anxiety at doses above 200μg in unfamiliar settings", "Very long duration — have the full day and next morning free", "Test strips essential — LSD is commonly counterfeited", "Doses above 400μg for very experienced individuals only"], boosterInfo: "Not generally recommended — extends an already very long experience to 16–20 hours. Rapid tolerance also reduces effectiveness.", sources: ["source_lsd_1", "source_lsd_2", "source_redosing_1", "source_lsd_tolerance"], historySources: ["source_lsd_history_1", "source_lsd_history_2"] },
  { id: "dmt", name: "DMT", category: "Tryptamine", unit: "mg", doses: { threshold: 10, light: 25, moderate: 40, strong: 60, heavy: 80 }, onset: 0.5, peak: 5, duration: 15, history: "N,N-Dimethyltryptamine (DMT) is a tryptamine molecule found throughout the natural world — in plants, animals, and possibly endogenously in humans. Its psychedelic properties were first published by ethnobotanist Richard Evans Schultes in 1946. Hungarian chemist Stephen Szára first documented its psychedelic effects in humans in 1956. DMT has been used for millennia in South American shamanic traditions in the form of snuffs (yopo, epená) and in ayahuasca brews. Rick Strassman's groundbreaking research at the University of New Mexico in the 1990s — detailed in his 2000 book DMT: The Spirit Molecule — brought DMT to mainstream scientific and popular attention.", effects: { light: ["Mild visual effects — shifting patterns", "Body warmth and tingling", "Slight mood shift"], moderate: ["Strong geometric and fractal visuals", "Rapid onset within seconds", "Entity contact reported", "Profound awe"], strong: ["Breakthrough — complete departure from consensus reality", "Complex alternate environments", "Meeting entities", "Overwhelming sense of love or fear"], heavy: ["Total immersion in alternate reality", "Time dissolves completely", "Intense and often indescribable experiences"] }, safety: ["Extremely short but one of the most intense psychedelics", "Must be seated or lying down — complete loss of physical awareness", "MAOIs dramatically extend and intensify effects — potentially dangerous", "Respiratory distress possible at very high doses"], boosterInfo: "Due to its extremely short duration (10–15 minutes), booster dosing is unusual. Wait for effects to fully subside before considering a second dose.", sources: ["source_dmt_1", "source_dmt_2"], historySources: ["source_dmt_history_1"] },
  { id: "mescaline", name: "Mescaline", category: "Phenethylamine", unit: "mg", doses: { threshold: 100, light: 200, moderate: 350, strong: 500, heavy: 700 }, onset: 60, peak: 240, duration: 720, history: "Mescaline (3,4,5-trimethoxyphenethylamine) is a phenethylamine psychedelic found primarily in the peyote cactus (Lophophora williamsii) and secondarily in San Pedro and Peruvian torch cacti. German pharmacologist Arthur Heffter isolated it from peyote in 1897. Mescaline has been used in ceremonial and healing contexts by indigenous peoples of Mexico and the American Southwest for at least 5,700 years. In 1952–1954, Aldous Huxley famously experimented with mescaline, documenting his experience in The Doors of Perception. Alexander 'Sasha' Shulgin synthesized hundreds of mescaline analogs (detailed in PiHKAL, 1991), profoundly expanding the field of psychedelic pharmacology.", effects: { light: ["Mild euphoria and warmth", "Color and texture enhancement", "Nausea common on come-up", "Increased sociability"], moderate: ["Visual hallucinations — flowing colors, geometric patterns", "Deep empathy and emotional openness", "Strong connection to nature", "Philosophical and spiritual insights"], strong: ["Complex visual phenomena and vivid hallucinations", "Profound emotional release", "Spiritual and transcendent experiences"], heavy: ["Overwhelming visionary states", "Intense nausea possible", "Very long duration — 12+ hours"] }, safety: ["Nausea is very common — fasting beforehand helps", "Extremely long duration requires thorough preparation", "Caution with cardiovascular conditions"], boosterInfo: "Uncommon due to already very long duration (10–12 hours). A booster taken 1–2 hours in can deepen the experience but will significantly extend total duration.", sources: ["source_mescaline_1", "source_mescaline_2"], historySources: ["source_mescaline_history_1", "source_mescaline_history_2"] },
  { id: "peyote", name: "Peyote", category: "Phenethylamine", unit: "buttons", doses: { threshold: 2, light: 4, moderate: 8, strong: 12, heavy: 16 }, onset: 60, peak: 240, duration: 720, history: "Peyote (Lophophora williamsii) is a small, spineless cactus native to the Chihuahuan Desert of northern Mexico and southern Texas. Archaeological evidence dates ceremonial use to approximately 5,700 years ago (3780–3660 BCE). The plant contains over 50 alkaloids including mescaline (3–6% of dry weight), pellotine, anhalonidine, and hordenine. For the Wixaritari (Huichol) people, peyote is the very soul of their religion — considered a divine sacrament. Their annual pilgrimage to Wirikuta is one of the world's most profound living examples of plant-based spiritual practice. The Native American Church, formally incorporated in Oklahoma in 1918, uses peyote as its central sacrament across over 40 tribes in North America. Peyote was classified as Schedule I in the US in 1970, though NAC members remain legally protected. The plant is critically slow-growing — up to 30 years to reach golf-ball size — and populations are under pressure from overharvesting.", effects: { light: ["Mild euphoria and warmth", "Color and texture enhancement", "Nausea on come-up", "Increased sociability and openness"], moderate: ["Visual hallucinations — flowing colors, geometric patterns", "Deep empathy and emotional openness", "Connection to nature and the sacred", "Philosophical and spiritual insights"], strong: ["Complex visual phenomena and vivid hallucinations", "Profound emotional release and catharsis", "Deep spiritual and transcendent experiences"], heavy: ["Overwhelming visionary states", "Intense nausea and physical discomfort possible", "Very long duration — 12+ hours"] }, safety: ["Nausea and vomiting very common — fast beforehand", "Extremely bitter taste — buttons are often chewed raw or made into tea", "Extremely long duration requires thorough preparation", "Caution with cardiovascular conditions", "Endangered cactus — overharvesting is an ongoing ecological concern"], boosterInfo: "In ceremonial contexts, additional buttons are sometimes taken as the experience plateaus. A supplemental dose 1–2 hours in will significantly extend the already very long duration.", sources: ["source_mescaline_1", "source_mescaline_2", "source_peyote_1", "source_peyote_2"], historySources: ["source_peyote_history_1", "source_peyote_history_2"] },
  { id: "5meo_dmt", name: "5-MeO-DMT", category: "Tryptamine", unit: "mg", is5MeO: true, doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 }, onset: 0.3, peak: 5, duration: 20, history: "5-Methoxy-N,N-dimethyltryptamine (5-MeO-DMT) is a naturally occurring tryptamine found in dozens of plant species and in the parotoid gland venom of the Sonoran Desert toad (Incilius alvarius). Its synthesis was first described in 1936 by Hoshino and Shimodaira, though its psychedelic properties in humans were not formally documented until Alexander Shulgin reported them in 1970, later detailed in his 1997 book TiHKAL. The toad as a source was first described publicly in 1984 in an underground pamphlet by Ken Nelson (writing as Albert Most). Phase 1 clinical trials of synthetic 5-MeO-DMT (GH001) were published in 2021 by Reckweg et al., demonstrating safety and psychoactive profiles in healthy volunteers.", effects: { light: ["Mild body load and pressure", "Slight perceptual shift"], moderate: ["Strong dissociation from body and environment", "Unity consciousness", "Overwhelming and sudden onset"], strong: ["Complete ego dissolution", "Non-dual awareness", "Intense body sensations", "Challenging to process without preparation"], heavy: ["Total loss of individual self", "Potentially terrifying or profoundly blissful", "Reported 'white out' — complete dissolution of all content"] }, safety: ["One of the most potent psychedelics by weight — active at 1mg", "NEVER combine with MAOIs — can be fatal", "Vocalization, writhing, and loss of physical control are common", "Requires an experienced, trained sitter"], boosterInfo: "Booster dosing with 5-MeO-DMT is not recommended. The experience is already overwhelming at active doses.", sources: ["source_5meo_1", "source_5meo_2", "source_5meo_uthaug", "source_5meo_davis", "source_5meo_reckweg", "source_5meo_clinical"], historySources: ["source_5meo_history_1", "source_5meo_reckweg"] },
  { id: "ayahuasca", name: "Ayahuasca", category: "Tryptamine", unit: "mL", doses: { threshold: 25, light: 50, moderate: 75, strong: 100, heavy: 150 }, onset: 30, peak: 120, duration: 300, history: "Ayahuasca is a psychoactive brew traditionally prepared by combining the bark of the Banisteriopsis caapi vine (containing harmala alkaloids that act as MAO inhibitors) with the leaves of Psychotria viridis or Diplopterys cabrerana (which contain DMT). The word 'ayahuasca' comes from Quechua and means 'vine of the soul.' It has been used for healing and divination by indigenous Amazonian peoples for centuries. In Brazil, ayahuasca is the sacrament of syncretic religious movements including Santo Daime (founded 1930) and União do Vegetal (founded 1961), both of which have achieved legal recognition. Religious ayahuasca use received federal protection in the United States in 2006. The global retreat industry has brought millions into contact with ayahuasca, with emerging research documenting potential benefits for depression, addiction, PTSD, and grief.", effects: { light: ["Mild visions — shifting colors and patterns", "Emotional introspection and sensitivity", "Nausea on come-up"], moderate: ["Purging common — considered part of the healing process", "Vivid narrative visions", "Entity contact reported", "Deep emotional release"], strong: ["Deep trauma processing", "Overwhelming visual and emotional experiences", "Ego dissolution", "Profound healing or confrontation with shadow material"], heavy: ["Complete loss of consensus reality for extended periods", "Intense physical and emotional purging", "Hours of sustained visionary states — can be 4–6 hours"] }, safety: ["Contains MAOI (harmaline) — extensive drug interactions including SSRIs, stimulants, many foods", "Must follow dietary restrictions (avoid tyramine-rich foods) before ceremony", "Should only be taken in a ceremonial or medically supervised context", "People with heart conditions, hypertension, or psychiatric diagnoses should consult a physician first"], boosterInfo: "In ceremonial contexts, a second cup is sometimes offered 1–2 hours in. This is typically at the facilitator's discretion.", sources: ["source_ayahuasca_1", "source_ayahuasca_2", "source_ayahuasca_3"], historySources: ["source_ayahuasca_history_1", "source_ayahuasca_history_2"] },
  { id: "salvinorin_a", name: "Salvinorin A", category: "Terpenoid", unit: "mg", doses: { threshold: 0.2, light: 0.5, moderate: 1, strong: 2, heavy: 3 }, onset: 0.2, peak: 3, duration: 10, history: "Salvinorin A is the primary active compound in Salvia divinorum, a plant native to a small region of the Mazatec Sierra in Oaxaca, Mexico. The Mazatec people use Salvia divinorum (called 'Ska María Pastora') as a shamanic healing plant, consumed by chewing fresh leaves. The psychoactive properties of Salvia divinorum were first documented by ethnobotanists R. Gordon Wasson and Albert Hofmann in 1962. Salvinorin A was first isolated in 1982. Crucially, salvinorin A is unique among naturally occurring psychedelics in being a potent and selective kappa-opioid receptor agonist — rather than the 5-HT2A serotonergic mechanism shared by all other classic psychedelics. This makes it pharmacologically one-of-a-kind. Salvia divinorum is not scheduled federally in the United States, though many individual states have restricted it.", effects: { light: ["Mild perceptual changes", "Laughter and giddiness", "Mild color and texture enhancement"], moderate: ["Strong dissociation from current reality", "Reality distortion and overlapping dimensions", "Loss of body awareness"], strong: ["Complete dissociation from physical surroundings", "Sensation of dimensional or spatial travel", "Entity or presence contact reported"], heavy: ["Total departure from ordinary reality", "Inability to form new memories during experience", "Extremely disorienting and confusing — often frightening"] }, safety: ["Shortest duration of any major psychedelic — 5–15 minutes — but extremely intense", "Must be in a physically safe environment — complete loss of motor control occurs", "Not appropriate for anxious individuals or those without experience", "A sober sitter is essential"], boosterInfo: "Due to its extremely short duration, booster dosing is unusual. If a deeper experience is desired, this is better addressed through initial dosing.", sources: ["source_salvinorin_1", "source_salvinorin_2"], historySources: ["source_salvinorin_history_1"] },
  { id: "ibogaine", name: "Ibogaine", category: "Indole Alkaloid", unit: "mg/kg", doses: { threshold: 1, light: 5, moderate: 10, strong: 15, heavy: 20 }, onset: 60, peak: 240, duration: 1440, history: "Ibogaine is a naturally occurring psychoactive alkaloid found in the bark of the Tabernanthe iboga shrub native to Central Africa. Iboga has been used for centuries by Bwiti practitioners in Gabon as the central sacrament of initiation ceremonies. Ibogaine was first isolated in 1901. The most significant modern development was the 1962 discovery by Howard Lotsof — a heroin addict — that ibogaine appeared to eliminate his opioid cravings and withdrawal symptoms after a single dose. This observation launched decades of research into ibogaine as a treatment for opioid use disorder, addiction, and PTSD. Clinical use expanded in Mexico, New Zealand, and Europe. Its cardiac risk profile (QT prolongation) remains the primary obstacle to formal regulatory approval.", effects: { light: ["Mild stimulation and wakefulness", "Introspection and memory recall", "Mild visual effects"], moderate: ["Waking dreamlike visions — like a living film of your life", "Life review — memories surfacing with emotional weight", "Ataxia", "Nausea and vomiting common"], strong: ["Intense sustained visions — often biographical or archetypal", "Confrontation with past trauma, relationships, and decisions", "Hours of continuous introspective journey"], heavy: ["36+ hour experience", "Profound psychological reckoning", "Serious cardiac risk increases with dose — medical monitoring essential"] }, safety: ["SERIOUS CARDIAC RISK — ibogaine prolongs the QT interval and can cause fatal arrhythmia", "Requires a full cardiac workup including EKG before any use", "Only appropriate under direct medical supervision with cardiac monitoring", "Many drug interactions — especially lethal with opioids, stimulants, and SSRIs"], boosterInfo: "Booster dosing with ibogaine carries serious cardiac risk. Any supplemental dosing must be conducted under direct medical supervision only.", sources: ["source_ibogaine_1", "source_ibogaine_2"], historySources: ["source_ibogaine_history_1"] },
  { id: "mdma", name: "MDMA", category: "Empathogen", unit: "mg", doses: { threshold: 50, light: 80, moderate: 120, strong: 150, heavy: 200 }, onset: 45, peak: 90, duration: 240, history: "3,4-Methylenedioxymethamphetamine (MDMA) was first synthesized in 1912 by German chemist Anton Köllisch at Merck. In 1976, Alexander 'Sasha' Shulgin re-synthesized it, recognizing its profound psychotherapeutic potential and introducing it to therapist Leo Zeff, who in turn introduced it to an estimated 4,000 therapists and patients in the late 1970s and early 1980s. MDMA was placed on Schedule I in the US in 1985. Despite scheduling, it became one of the most widely used recreational drugs in the 1990s rave culture, known as Ecstasy or Molly. MAPS began Phase 3 clinical trials of MDMA-assisted therapy for PTSD in 2018, with results published in Nature Medicine in 2021 showing an unprecedented 67% of participants no longer met PTSD criteria after treatment.", effects: { light: ["Mild euphoria and warmth", "Increased sociability", "Slight sensory enhancement"], moderate: ["Strong empathy and emotional connection", "Euphoria and well-being", "Increased physical energy", "Emotional openness", "Tactile enhancement"], strong: ["Intense euphoria", "Profound emotional bonding", "Potential anxiety, jaw clenching, or overheating", "Strong stimulant effects"], heavy: ["Risk of dangerous hyperthermia", "Cardiovascular strain", "Severe comedown in days following", "Risk of serotonin syndrome"] }, safety: ["Stay hydrated — about 500mL per hour if dancing, less if sedentary — overhydration is also dangerous", "Avoid frequent redosing — increases neurotoxicity risk", "Never combine with MAOIs, SSRIs, or other stimulants", "Space use by at least 3 months to reduce neurotoxicity risk"], boosterInfo: "A small booster (half the initial dose) taken 60–90 minutes in is common. Keep boosters to 50–75mg maximum. Redosing MDMA significantly increases neurotoxicity risk and worsens the comedown.", sources: ["source_mdma_1", "source_mdma_2", "source_mdma_3"], historySources: ["source_mdma_history_1", "source_mdma_history_2"] },
  { id: "mda", name: "MDA", category: "Empathogen", unit: "mg", doses: { threshold: 40, light: 80, moderate: 120, strong: 160, heavy: 200 }, onset: 45, peak: 120, duration: 360, history: "3,4-Methylenedioxyamphetamine (MDA), known as 'the Love Drug' or 'sass', predates MDMA and was first synthesized in 1910 by G. Mannich and W. Jacobsohn. Its psychoactive properties were first studied systematically by Gordon Alles in 1959. MDA was used in psychotherapy in the 1960s — particularly by Claudio Naranjo, who documented his findings in The Healing Journey (1973). Like MDMA, it was placed on Schedule I in 1970. MDA has a more pronouncedly psychedelic character than MDMA — producing stronger visual effects alongside its empathogenic properties — as well as a longer duration (6–8 hours) and a steeper neurotoxicity profile based on animal studies.", effects: { light: ["Euphoria and warmth", "Mild visual effects", "Increased energy and motivation"], moderate: ["Empathy and emotional openness", "Visual distortions and mild hallucinations", "Stimulation and desire to move"], strong: ["More psychedelic character than MDMA", "Visual hallucinations can be significant", "Intense emotional experiences"], heavy: ["Strong visual hallucinations", "High cardiovascular load", "Significant neurotoxicity risk — higher than MDMA"] }, safety: ["More neurotoxic to serotonin neurons than MDMA based on animal studies", "Higher cardiovascular risk than MDMA", "Avoid combination with other stimulants, serotonergics, or MAOIs", "Longer duration means more prolonged cardiovascular stress"], boosterInfo: "Booster dosing with MDA is not recommended due to its higher neurotoxicity profile and already longer duration.", sources: ["source_mda_1", "source_mda_2"], historySources: ["source_mda_history_1"] },
  { id: "ketamine", name: "Ketamine", category: "Dissociative", unit: "mg", isKetamine: true, doses: { threshold: 20, light: 50, moderate: 100, strong: 150, heavy: 300 }, onset: 5, peak: 20, duration: 60, history: "Ketamine was first synthesized in 1962 by Calvin Stevens at Parke-Davis, developed as a rapid-onset dissociative anesthetic to replace PCP. The FDA approved ketamine as an anesthetic in 1970, and it was widely used on battlefields during the Vietnam War. John Lilly documented ketamine's dissociative and mystical dimensions, and Marcia Moore's book Journeys into the Bright World (1978) detailed its psychological potential. The pivotal clinical development came in 2000, when Carlos Zarate and Dennis Charney at the National Institute of Mental Health demonstrated that IV ketamine produced rapid antidepressant effects within hours. This led to the 2019 FDA approval of esketamine (Spravato) nasal spray for treatment-resistant depression.", effects: { light: ["Mild dissociation and dreaminess", "Analgesia", "Relaxation and sedation", "Mild euphoria and floating sensation"], moderate: ["Strong dissociation from physical surroundings", "Approaching the K-hole threshold", "Altered sense of body size", "Dreamlike and surreal states"], strong: ["K-hole — complete dissociation from physical reality", "Out-of-body experiences", "Amnesia possible"], heavy: ["Total loss of self and physical environment", "Profound dissociation", "Respiratory depression risk — do not combine with other depressants"] }, safety: ["High addiction potential with frequent or daily use", "Bladder and urinary tract damage with chronic heavy use — irreversible in severe cases", "Never drive or operate machinery", "Do not combine with alcohol, benzodiazepines, or opioids"], boosterInfo: "Booster dosing is route-dependent. For lozenge/troche, a supplemental 25–50% of the initial dose may be taken 45–60 minutes in. For IM/IV, supplemental dosing should only be administered by medical professionals.", sources: ["source_ketamine_1", "source_ketamine_2", "source_ketamine_statpearls", "source_ketamine_rolan_2014"], historySources: ["source_ketamine_history_1", "source_ketamine_history_2"] },
  { id: "pcp", name: "PCP", category: "Dissociative", unit: "mg", doses: { threshold: 1, light: 3, moderate: 8, strong: 15, heavy: 25 }, onset: 5, peak: 30, duration: 360, history: "Phencyclidine (PCP) was synthesized in 1956 by Victor Maddox and first developed as a general anesthetic by Parke-Davis under the name Sernyl. It was withdrawn from human use by 1965 due to severe psychiatric side effects — including prolonged agitation, hallucinations, delirium, and psychosis. It continued to be used in veterinary medicine until the 1970s. PCP became a major recreational drug in the 1970s and early 1980s under names including 'angel dust.' PCP was scheduled as Schedule II in 1978. Pharmacologically, PCP is notable as the prototype NMDA receptor antagonist, and its model of psychosis was instrumental in shaping the glutamatergic hypothesis of schizophrenia, which remains influential in psychiatric research today.", effects: { light: ["Mild dissociation and numbness", "Euphoria and mood elevation", "Slight perceptual distortions"], moderate: ["Strong dissociation from surroundings", "Analgesia — complete insensitivity to pain", "Perceptual distortions and disorganized thinking"], strong: ["Complete dissociation from reality", "Psychosis-like states — paranoia, hallucinations", "Extreme disorientation"], heavy: ["Severe psychosis", "Agitation, aggression, or violent behavior possible", "Medical emergency risk"] }, safety: ["High risk of psychosis and erratic behavior at moderate to high doses", "Very long and highly unpredictable duration — can last 6–24 hours", "Extremely high addiction potential", "Analgesia means physical injuries may not be felt during the experience"], boosterInfo: "Booster dosing with PCP is extremely inadvisable. The unpredictable duration and psychosis risk are already high at standard doses.", sources: ["source_pcp_1"], historySources: ["source_pcp_history_1"] },
  { id: "2cb", name: "2C-B", category: "Phenethylamine", unit: "mg", doses: { threshold: 5, light: 15, moderate: 25, strong: 35, heavy: 50 }, onset: 45, peak: 120, duration: 300, history: "2,5-Dimethoxy-4-bromophenethylamine (2C-B) was first synthesized by Alexander 'Sasha' Shulgin in 1974 and is documented in detail in his landmark 1991 book PiHKAL. In the late 1970s and 1980s, 2C-B was used by therapists as a psychotherapy adjunct. Following the scheduling of MDMA in 1985, 2C-B briefly became available commercially in Germany under the brand name Nexus. It was placed on Schedule I in the United States in 1994. 2C-B is notable for its particularly steep dose-response curve — the difference between a mild and overwhelming experience can be as little as 5–10mg — and for its pronounced visual effects relative to its overall intensity.", effects: { light: ["Color and contrast enhancement", "Mild euphoria and wellbeing", "Increased sensory awareness"], moderate: ["Visual effects — breathing walls, color shifts, mild geometry", "Euphoria and positive mood", "Sensory enhancement"], strong: ["Strong visual distortions and hallucinations", "Deep introspection", "Emotional release", "High physical energy"], heavy: ["Intense hallucinations similar to LSD or psilocybin", "Overwhelming experience possible", "Significant body load"] }, safety: ["Highly dose-sensitive — small increases produce dramatically larger effects", "Avoid with MAOIs", "Nausea common on come-up at higher doses", "If insufflated, onset is much faster — doses must be reduced significantly"], boosterInfo: "2C-B is highly dose-sensitive, making booster dosing risky. A small booster (5–10mg) taken 45–60 minutes in is feasible, but err heavily on the side of caution.", sources: ["source_2cb_1", "source_2cb_2"], historySources: ["source_2cb_history_1"] },
  { id: "25i_nbome", name: "25I-NBOMe", category: "Phenethylamine", unit: "μg", doses: { threshold: 200, light: 500, moderate: 900, strong: 1500, heavy: 2000 }, onset: 30, peak: 120, duration: 480, history: "25I-NBOMe was first synthesized in 2003 by Ralf Heim at the Free University of Berlin, and further characterized by pharmacologist David Nichols' lab in 2010 as a potent 5-HT2A receptor agonist useful as a research tool. It was never intended for human consumption. Around 2010–2011, it emerged in illicit markets — often sold on blotter paper as LSD. Between 2012 and 2015, multiple fatalities were attributed to 25I-NBOMe and related NBOMe compounds, primarily from cardiovascular crisis. It was placed on Schedule I in the US in 2013. Reagent test kits (Ehrlich, Hofmann) remain an essential harm reduction tool for distinguishing LSD from NBOMe compounds.", effects: { light: ["Visual effects and color enhancement", "Stimulation and alertness", "Mood change — euphoria or anxiety"], moderate: ["Strong visual hallucinations", "Pronounced stimulant effects", "Vasoconstriction — cold hands and feet"], strong: ["Intense hallucinations comparable to high-dose LSD", "Significant tachycardia and hypertension", "Stimulant overdrive — agitation possible"], heavy: ["Severe cardiovascular strain", "Seizure risk", "Medical emergency — multiple fatalities reported at this dose range"] }, safety: ["⚠ ASSOCIATED WITH MULTIPLE CONFIRMED FATALITIES — extreme caution required", "Vasoconstriction can be severe and medically dangerous", "Frequently sold on blotter as LSD — always reagent test before use", "Bitter taste under the tongue is a warning sign — LSD is tasteless"], boosterInfo: "⚠ Booster dosing with 25I-NBOMe is extremely dangerous and not recommended under any circumstances.", sources: ["source_25i_1", "source_25i_2"], historySources: ["source_25i_history_1"] },
];

const COMBINATIONS = [
  { id: "candy_flip", name: "Candy Flip", isCombination: true, description: "LSD + MDMA — produces an extremely euphoric, visually enhanced empathogenic experience.", components: ["lsd", "mdma"], timing: "MDMA is typically taken 3–4 hours into the LSD experience, timed so both substances are peaking simultaneously.", history: "The 'candy flip' emerged from rave and club culture of the late 1980s and 1990s, where LSD and MDMA were both widely available and commonly co-used. The combination became popular because the MDMA was believed to smooth LSD's edge while the LSD was said to extend and deepen the MDMA experience. The serotonergic synergy between 5-HT2A agonism (LSD) and serotonin release (MDMA) is believed to underlie both the enhanced effects and the elevated risk of serotonin toxicity at higher doses.", safety: ["Very high body temperature risk — hyperthermia is a serious danger", "Extreme cardiovascular load from both substances", "Serotonin syndrome risk if doses are high", "Very long experience — 14–18 hours total", "Hydration is essential but do not overhydrate", "Not recommended for beginners"], sources: ["source_candy_flip_1", "source_mdma_2", "source_lsd_2"], historySources: ["source_candy_flip_1"] },
  { id: "jedi_flip", name: "Jedi Flip", isCombination: true, description: "Psilocybin + LSD + MDMA — an advanced triple combination. Extremely intense and long-lasting. Reserved for very experienced individuals only.", components: ["psilocybin", "lsd", "mdma"], timing: "LSD is taken first. Psilocybin is added 1–2 hours later. MDMA is timed to overlap with the combined peaks — approximately 3–4 hours after LSD.", history: "The 'Jedi flip' is a third-generation combination building on the candy flip, adding psilocybin for a tri-combination considered one of the most intense psychedelic experiences achievable through oral substances. It is almost entirely a product of online psychedelic communities and is discussed far more often than it is practiced. There is no formal research specifically on this combination.", safety: ["For very experienced psychedelic users only", "Extremely high risk profile — cardiovascular, thermoregulatory, and neurological stress", "Medical support or an experienced harm-reduction sitter strongly advised", "Not recommended for anyone with a history of anxiety, cardiovascular issues, or psychiatric conditions", "Duration can exceed 18–24 hours"], sources: ["source_candy_flip_1", "source_psilocybin_2", "source_lsd_2", "source_mdma_2"], historySources: ["source_psilocybin_2", "source_lsd_1"] },
  { id: "hippie_flip", name: "Hippie Flip", isCombination: true, description: "Psilocybin + MDMA — combines the emotional depth, introspection, and visuals of psilocybin with the euphoria, empathy, and energy of MDMA.", components: ["psilocybin", "mdma"], timing: "MDMA can be taken simultaneously with psilocybin, or 1–2 hours into the psilocybin experience to time the MDMA peak with the psilocybin plateau.", history: "The 'hippie flip' is a widely used combination in both recreational and therapeutic contexts. MAPS and other researchers have explored MDMA + psilocybin as a potential therapeutic pairing, with the MDMA theorized to reduce anxiety during the psilocybin experience while the psilocybin deepens the introspective work. The combination is more manageable than LSD-based combinations because psilocybin has a shorter duration and less stimulant character.", safety: ["Serotonin syndrome risk at high doses — keep doses conservative", "Monitor body temperature — risk of overheating especially if active", "Heart rate elevation from both substances — not suitable for those with cardiac concerns"], sources: ["source_psilocybin_2", "source_mdma_1", "source_mdma_2"], historySources: ["source_psilocybin_2", "source_mdma_1"] },
];
