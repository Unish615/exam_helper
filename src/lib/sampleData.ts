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
    text: `The human heart is a four-chambered muscular organ that pumps blood continuously through the circulatory system. The four chambers consist of the Right Atrium, Right Ventricle, Left Atrium, and Left Ventricle.

Deoxygenated blood returning from the upper and lower body enters the Right Atrium via the Superior and Inferior Vena Cava. The Right Atrium contracts, pushing blood through the Tricuspid Valve into the Right Ventricle. When the Right Ventricle pumps, deoxygenated blood is driven through the Pulmonary Semilunar Valve into the Pulmonary Arteries to reach the lungs for gas exchange (releasing CO2 and picking up O2).

Freshly oxygenated blood returns from the lungs through the Pulmonary Veins into the Left Atrium. Blood passes through the Bicuspid (Mitral) Valve into the Left Ventricle. The Left Ventricle—having the thickest muscular myocardium wall—contracts forcefully to pump oxygenated blood through the Aortic Valve into the Aorta, distributing oxygen and nutrients to systemic body tissues.

Key concepts include Systemic vs Pulmonary Circulation, Cardiac Pacemaker (Sinoatrial Node), Coronary Arteries, and Systolic vs Diastolic Blood Pressure.`
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
  },
  {
    id: 'physics-thermo',
    title: 'Physics: Laws of Thermodynamics',
    category: 'Physics',
    badge: 'Core',
    text: `Thermodynamics governs heat, work, and energy transformation across four fundamental laws:

1. Zeroth Law: If two systems are in thermal equilibrium with a third system, they are in thermal equilibrium with each other (defines temperature).
2. First Law (Conservation of Energy): Energy cannot be created or destroyed: ΔU = Q - W.
3. Second Law: Total entropy (disorder) of an isolated system always increases in spontaneous processes (ΔS_total > 0). Heat spontaneously flows from hot to cold objects.
4. Third Law: As system temperature approaches Absolute Zero (0 Kelvin / -273.15°C), pure crystalline entropy approaches zero.`
  }
];
