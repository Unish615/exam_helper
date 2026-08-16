export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  badge: string;
  text: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'biology-heart',
    title: 'Anatomy: Human Heart Blood Flow & Circulation',
    category: 'Human Biology',
    badge: 'Popular',
    text: `The human heart is a four-chambered muscular organ that pumps blood continuously through systemic and pulmonary circulation circuits. The four chambers consist of the Right Atrium, Right Ventricle, Left Atrium, and Left Ventricle.

Deoxygenated blood returning from systemic body tissues enters the Right Atrium via the Superior and Inferior Vena Cava. Right Atrium contraction drives blood through the Tricuspid Valve into the Right Ventricle. When the Right Ventricle contracts, deoxygenated blood is driven through the Pulmonary Semilunar Valve into the Pulmonary Arteries leading to the lungs for gas exchange.

Freshly oxygenated blood returns from the lungs through the Pulmonary Veins into the Left Atrium. Blood flows past the Bicuspid (Mitral) Valve into the Left Ventricle. The Left Ventricle—having the thickest muscular myocardium wall—contracts forcefully to drive oxygenated blood through the Aortic Valve into the Aorta for distribution to systemic body tissues.

Key concepts include Systemic vs Pulmonary Circuits, Sinoatrial (SA) Node Pacemaker, Coronary Arteries, and Systolic vs Diastolic Blood Pressure.`
  },
  {
    id: 'plant-photosynthesis',
    title: 'Plant Physiology: Photosynthesis Process & Calvin Cycle',
    category: 'Botany',
    badge: 'Core',
    text: `Photosynthesis is the fundamental biochemical process by which photoautotrophic plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose. The general chemical equation is 6 CO2 + 6 H2O + light energy -> C6H12O6 + 6 O2.

Photosynthesis takes place inside plant Chloroplasts across two distinct stages:

1. Light-Dependent Reactions (Occur in Thylakoid Membranes):
Chlorophyll pigments absorb photons, exciting electrons in Photosystem II (P680) and Photosystem I (P700). Water molecules undergo photolysis (H2O -> 2 H+ + 2 e- + 1/2 O2), releasing oxygen gas as a byproduct. High-energy electrons flow down the Electron Transport Chain (ETC), generating a proton gradient across the thylakoid membrane to drive ATP Synthase (Photophosphorylation) producing ATP and NADPH.

2. Light-Independent Reactions / Calvin Cycle (Occur in the Stroma):
The enzyme RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) fixes atmospheric CO2 onto 5-carbon RuBP, creating unstable 6-carbon intermediates that split into 3-PGA (3-Phosphoglycerate). ATP and NADPH reduce 3-PGA into G3P (Glyceraldehyde-3-phosphate). For every 6 turns of the Calvin cycle, 2 G3P molecules exit to synthesize 1 glucose molecule, while remaining G3P molecules regenerate RuBP.

Key concepts include C3 vs C4 vs CAM pathways, Stomatal regulation, Light Intensity Saturation, and Chloroplast Granum stacks.`
  },
  {
    id: 'biology-mitosis',
    title: 'Cell Biology: Mitosis & Cytokinesis',
    category: 'Biology',
    badge: 'Core',
    text: `Mitosis is nuclear division in eukaryotic cells producing two genetically identical daughter cells. The cell cycle consists of Interphase (G1, S, G2) and M Phase (Mitosis and Cytokinesis).

Four main stages of Mitosis:
1. Prophase: Chromatin condenses into distinct chromosomes. Nuclear envelope breaks down; mitotic spindle forms.
2. Metaphase: Chromosomes align along the equatorial metaphase plate. Spindle fibers attach to kinetochores.
3. Anaphase: Sister chromatids separate toward opposite poles by shortening spindle fibers.
4. Telophase: Nuclear envelopes reform around separated chromosome sets; chromosomes decondense.

Cytokinesis splits the cytoplasm. In animal cells, a microfilament ring forms a Cleavage Furrow pinching the cell into two. In plant cells, vesicles form a Cell Plate along the equator to construct a rigid new cell wall.`
  },
  {
    id: 'cs-tcpip',
    title: 'Computer Science: TCP/IP Protocol Stack',
    category: 'Networking',
    badge: 'Tech',
    text: `The Transmission Control Protocol/Internet Protocol (TCP/IP) model standardizes network communication across four distinct layers:

1. Application Layer (Layer 4): High-level end-user protocols including HTTP, HTTPS, FTP, DNS, and SSH.
2. Transport Layer (Layer 3): End-to-end transport, port multiplexing, and reliability. TCP provides connection-oriented, ordered delivery via a 3-Way Handshake (SYN, SYN-ACK, ACK), while UDP offers connectionless, low-latency streaming.
3. Internet Layer (Layer 2): Logical addressing and packet routing across networks (IPv4, IPv6, ICMP, ARP).
4. Network Access / Link Layer (Layer 1): Hardware framing, MAC addressing, Ethernet, and Wi-Fi 802.11.

Key concepts include Subnet Masking, CIDR notation, NAT (Network Address Translation), and TCP Windowing flow control.`
  }
];
