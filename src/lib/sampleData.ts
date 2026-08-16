export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  badge: string;
  text: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'biology-mitosis',
    title: 'Cell Division: Mitosis & Cytokinesis',
    category: 'Biology',
    badge: 'Popular',
    text: `Mitosis is the process of nuclear division in eukaryotic cells that occurs when a parent cell divides to produce two genetically identical daughter cells. The cell cycle consists of Interphase (G1, S, and G2 phases) and M Phase (Mitosis and Cytokinesis). 

The four main stages of Mitosis are:
1. Prophase: Chromatin condenses into distinct chromosomes. The nuclear envelope breaks down, and the mitotic spindle fibers begin to form from centrioles.
2. Metaphase: Chromosomes align along the metaphase plate at the cell equator. Spindle fibers attach to the kinetochores of each sister chromatid.
3. Anaphase: Sister chromatids are pulled apart by shortening spindle fibers toward opposite poles of the cell, becoming individual chromosomes.
4. Telophase: Nuclear envelopes reform around the two sets of separated chromosomes, chromosomes begin to decondense back into chromatin, and the mitotic spindle dissolves.

Cytokinesis follows telophase, splitting the cytoplasm. In animal cells, a cleavage furrow formed by an actin microfilament ring pinches the cell into two. In plant cells, a cell plate forms along the equator to build a new cell wall. Mitosis is crucial for tissue growth, cell repair, and asexual reproduction.`
  },
  {
    id: 'cs-tcpip',
    title: 'Networking: TCP/IP Protocol Suite',
    category: 'Computer Science',
    badge: 'Tech',
    text: `The Transmission Control Protocol/Internet Protocol (TCP/IP) model is the fundamental communication framework for the Internet. It standardizes how data is packetized, addressed, transmitted, routed, and received.

The TCP/IP stack consists of four distinct layers:
1. Application Layer (Layer 4): Defines high-level protocols used by client applications to exchange data (e.g., HTTP, HTTPS, FTP, SMTP, DNS, SSH).
2. Transport Layer (Layer 3): Responsible for end-to-end communication, flow control, error detection, and port multiplexing. Key protocols are TCP (connection-oriented, reliable, three-way handshake SYN-SYN/ACK-ACK, ordered delivery) and UDP (connectionless, lightweight, low-latency streaming).
3. Internet Layer (Layer 2): Handles logical addressing and routing across disparate networks. Key protocols include IP (IPv4 and IPv6), ICMP (ping/diagnostics), and ARP (address resolution).
4. Network Access / Link Layer (Layer 1): Defines physical network hardware interfaces, framing, and MAC addressing (Ethernet, Wi-Fi 802.11).

Key concepts include Subnet Masking, NAT (Network Address Translation), CIDR notation, and TCP windowing flow control.`
  },
  {
    id: 'physics-thermo',
    title: 'Physics: Laws of Thermodynamics',
    category: 'Physics',
    badge: 'Core',
    text: `Thermodynamics is the branch of physical science dealing with heat, work, temperature, and energy transformation. It is governed by four fundamental laws:

1. Zeroth Law: If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other. This defines the concept of temperature and thermometry.
2. First Law (Law of Conservation of Energy): Energy cannot be created or destroyed, only transformed from one form to another. Mathematically: ΔU = Q - W, where ΔU is the change in internal energy, Q is heat added to the system, and W is work done by the system.
3. Second Law: In any natural spontaneous process, the total entropy (measure of disorder/randomness) of an isolated system always increases over time (ΔS_total > 0). Heat spontaneously flows from hotter objects to colder objects, never the reverse without external work.
4. Third Law: As the temperature of a system approaches Absolute Zero (0 Kelvin or -273.15°C), the entropy of a pure crystalline substance approaches a constant minimum value (zero).

Applications include Carnot heat engines, refrigeration cycles, phase transitions, and statistical mechanics.`
  },
  {
    id: 'history-rome',
    title: 'World History: Fall of the Roman Empire',
    category: 'History',
    badge: 'Humanities',
    text: `The Fall of the Western Roman Empire in 476 AD was a complex historical transformation resulting from interconnected political, economic, military, and social crises over centuries.

Major contributing factors included:
1. Internal Political Instability: Frequent civil wars, corruption, political assassination of emperors (the Crisis of the Third Century), and administrative decay weakened central governance.
2. Economic Crisis: Hyperinflation, heavy taxation, trade disruption, labor shortages due to reliance on slavery, and debasement of currency eroded financial stability.
3. Military Weakness & Mercenaries: Declining citizen recruitment forced Rome to rely heavily on Germanic mercenary soldiers (foederati), whose loyalty was to paymasters rather than Rome.
4. Barbarian Invasions: Incursions by Visigoths, Vandals, Ostrogoths, and Huns strained imperial defenses. Alaric sacked Rome in 410 AD, and Genseric sacked Rome in 455 AD.
5. Imperial Division: Emperor Diocletian divided the empire into Western and Eastern (Byzantine) halves in 285 AD. The Eastern Empire was far wealthier and survived until 1453 AD, while the Western Empire collapsed when Odoacer deposed Emperor Romulus Augustulus in 476 AD.`
  }
];
