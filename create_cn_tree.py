import os

tree = """
├──introduction/                          [37 topics]
│   │
│   ├── core-concepts/
│   │   ├── introduction-to-computer-networks.tsx       # What is a network, why it matters
│   │   ├── goals-of-networking.tsx                     # Resource sharing, communication, reliability
│   │   ├── applications-of-networks.tsx                # Business, home, mobile, social uses
│   │   ├── network-components.tsx                      # Hosts, links, routers, protocols
│   │   ├── network-criteria.tsx                        # Performance, reliability, security
│   │   ├── network-architecture.tsx                    # Layered design philosophy
│   │   ├── internet-basics.tsx                         # History, structure, ISPs, backbone
│   │   ├── protocols-and-standards.tsx                 # What protocols are, why standards exist
│   │   └── rfc-standards.tsx                           # IETF, RFC process, key RFCs
│   │
│   ├── types-of-networks/
│   │   ├── types-of-networks.tsx                       # Overview of all network categories
│   │   ├── lan.tsx                                     # Local Area Network — Ethernet, Wi-Fi
│   │   ├── man.tsx                                     # Metropolitan Area Network — city scale
│   │   ├── wan.tsx                                     # Wide Area Network — MPLS, leased lines
│   │   ├── pan.tsx                                     # Personal Area Network — Bluetooth, USB
│   │   ├── client-server-model.tsx                     # Centralized architecture, roles
│   │   └── peer-to-peer-model.tsx                      # Decentralized architecture, BitTorrent
│   │
│   ├── topologies/
│   │   ├── network-topologies.tsx                      # Physical vs logical topology
│   │   ├── bus-topology.tsx                            # Single backbone, termination
│   │   ├── star-topology.tsx                           # Central hub/switch model
│   │   ├── ring-topology.tsx                           # Token passing, SONET rings
│   │   ├── mesh-topology.tsx                           # Full mesh vs partial mesh
│   │   ├── tree-topology.tsx                           # Hierarchical star extension
│   │   └── hybrid-topology.tsx                         # Combined topologies in enterprise
│   │
│   ├── networking-devices/
│   │   ├── networking-devices.tsx                      # Overview of all devices
│   │   ├── hub.tsx                                     # Layer 1, broadcast domain
│   │   ├── switch.tsx                                  # Layer 2, MAC table, forwarding
│   │   ├── router.tsx                                  # Layer 3, IP routing, interfaces
│   │   ├── bridge.tsx                                  # Connects LAN segments
│   │   ├── gateway.tsx                                 # Protocol translation
│   │   ├── repeater.tsx                                # Signal regeneration, Layer 1
│   │   └── modem.tsx                                   # Modulation/demodulation, DSL, cable
│   │
│   └── reference-models/
│       ├── osi-model.tsx                               # 7 layers — roles and responsibilities
│       ├── tcp-ip-model.tsx                            # 4-layer DARPA model
│       ├── osi-vs-tcp-ip.tsx                           # Comparison, why TCP/IP won
│       └── encapsulation-decapsulation.tsx             # PDU wrapping at each layer
│
├── physical-layer/                        [32 topics]
│   │
│   ├── fundamentals/
│   │   ├── physical-layer-introduction.tsx             # Role, responsibilities, standards
│   │   ├── functions-of-physical-layer.tsx             # Bit transmission, encoding, timing
│   │   ├── analog-signals.tsx                          # Sine waves, amplitude, frequency, phase
│   │   ├── digital-signals.tsx                         # Bit levels, encoding schemes
│   │   ├── periodic-signals.tsx                        # Repeating waveforms, period, frequency
│   │   ├── non-periodic-signals.tsx                    # Aperiodic signals, Fourier analysis
│   │   ├── signal-transmission.tsx                     # Baseband vs broadband
│   │   └── transmission-impairments.tsx                # Attenuation, distortion, noise
│   │
│   ├── performance-metrics/
│   │   ├── bandwidth.tsx                               # Hertz vs bps, data rate
│   │   ├── throughput.tsx                              # Actual vs theoretical rate
│   │   ├── latency.tsx                                 # Propagation, transmission, queuing
│   │   └── jitter.tsx                                  # Delay variation, impact on VoIP/video
│   │
│   ├── transmission-media/
│   │   ├── guided-media.tsx                            # Wired media overview
│   │   ├── unguided-media.tsx                          # Wireless media overview
│   │   ├── twisted-pair-cable.tsx                      # UTP, STP, Cat5/6/7, crosstalk
│   │   ├── coaxial-cable.tsx                           # Baseband, broadband, RG types
│   │   ├── optical-fiber.tsx                           # Single-mode, multi-mode, connectors
│   │   ├── radio-waves.tsx                             # AM/FM, omni-directional propagation
│   │   ├── microwaves.tsx                              # Line-of-sight, satellite uplinks
│   │   └── infrared.tsx                                # Short-range, IrDA, TV remotes
│   │
│   ├── switching/
│   │   ├── circuit-switching.tsx                       # Dedicated path, PSTN, pros/cons
│   │   ├── packet-switching.tsx                        # Store-and-forward, datagram
│   │   └── message-switching.tsx                       # Store-and-forward entire message
│   │
│   ├── multiplexing/
│   │   ├── multiplexing.tsx                            # Combining signals on shared medium
│   │   ├── fdm.tsx                                     # Frequency Division Multiplexing
│   │   ├── tdm.tsx                                     # Time Division Multiplexing
│   │   ├── wdm.tsx                                     # Wavelength Division — fiber optics
│   │   └── spread-spectrum.tsx                         # FHSS, DSSS, anti-jamming
│   │
│   └── systems-and-theorems/
│       ├── telephone-network.tsx                       # PSTN, local loop, CO, trunk lines
│       ├── cellular-communication.tsx                  # Cell structure, frequency reuse
│       ├── nyquist-theorem.tsx                         # Max data rate for noiseless channel
│       └── shannon-capacity.tsx                        # Channel capacity with noise (SNR)
│
├──data-link-layer/                       [34 topics]
│   │
│   ├── framing/
│   │   ├── data-link-layer-introduction.tsx            # Sublayers, services, responsibilities
│   │   ├── framing.tsx                                 # Delimiting frames, byte/bit methods
│   │   ├── character-stuffing.tsx                      # Escape character insertion
│   │   └── bit-stuffing.tsx                            # Flag sequence, zero insertion
│   │
│   ├── error-control/
│   │   ├── error-detection.tsx                         # Overview of detection techniques
│   │   ├── parity-check.tsx                            # Single-bit, two-dimensional parity
│   │   ├── checksum.tsx                                # 1s complement addition, TCP/UDP use
│   │   ├── cyclic-redundancy-check.tsx                 # CRC polynomial, shift register
│   │   ├── hamming-code.tsx                            # SEC-DED, bit positions, parity bits
│   │   └── error-correction.tsx                        # FEC vs ARQ, retransmission
│   │
│   ├── flow-control-and-arq/
│   │   ├── flow-control.tsx                            # Stop-and-wait vs sliding window
│   │   ├── stop-and-wait.tsx                           # Simplest protocol, efficiency
│   │   ├── sliding-window-protocol.tsx                 # Window size, piggybacking
│   │   ├── stop-and-wait-arq.tsx                       # ACK, NAK, timeout retransmission
│   │   ├── go-back-n.tsx                               # GBN window, cumulative ACK
│   │   └── selective-repeat.tsx                        # SR window, individual NAK
│   │
│   ├── protocols/
│   │   ├── hdlc.tsx                                    # High-Level Data Link Control
│   │   └── ppp.tsx                                     # Point-to-Point Protocol, LCP, NCP
│   │
│   ├── mac-sublayer/
│   │   ├── mac-sublayer.tsx                            # Media Access Control overview
│   │   ├── aloha.tsx                                   # Pure ALOHA — random access
│   │   ├── slotted-aloha.tsx                           # Time-slotted improvement
│   │   ├── csma.tsx                                    # Carrier Sense Multiple Access
│   │   ├── csma-cd.tsx                                 # Collision Detection — Ethernet
│   │   ├── csma-ca.tsx                                 # Collision Avoidance — Wi-Fi
│   │   └── channelization.tsx                          # FDMA, TDMA, CDMA
│   │
│   └── ethernet-and-switching/
│       ├── ethernet.tsx                                # IEEE 802.3, frame format, 10 Mbps
│       ├── fast-ethernet.tsx                           # 100BASE-TX, autonegotiation
│       ├── gigabit-ethernet.tsx                        # 1000BASE-T, fiber variants
│       ├── ieee-802-standards.tsx                      # 802.3, 802.11, 802.15 family
│       ├── wireless-lan.tsx                            # 802.11 a/b/g/n/ac/ax
│       ├── bridges.tsx                                 # Transparent bridge, learning
│       ├── switches.tsx                                # Layer 2 switching, MAC table
│       ├── vlan.tsx                                    # Virtual LAN, 802.1Q tagging
│       └── spanning-tree-protocol.tsx                  # STP, RSTP, loop prevention
│
├─network-layer/                         [30 topics]
│   │
│   ├── addressing/
│   │   ├── network-layer-introduction.tsx              # Routing, forwarding, addressing
│   │   ├── logical-addressing.tsx                      # IP addressing concepts
│   │   ├── ipv4-addressing.tsx                         # Dotted decimal, 32-bit structure
│   │   ├── ipv4-classes.tsx                            # Class A/B/C/D/E, default masks
│   │   ├── subnetting.tsx                              # CIDR notation, subnet calculation
│   │   ├── supernetting.tsx                            # Route aggregation, summary routes
│   │   ├── cidr.tsx                                    # Classless Inter-Domain Routing
│   │   ├── vlsm.tsx                                    # Variable Length Subnet Masking
│   │   ├── ipv6-addressing.tsx                         # 128-bit, colon-hex, types
│   │   └── ipv4-vs-ipv6.tsx                            # Header comparison, transition
│   │
│   ├── protocols/
│   │   ├── arp.tsx                                     # Address Resolution Protocol
│   │   ├── rarp.tsx                                    # Reverse ARP — diskless stations
│   │   ├── icmp.tsx                                    # Error reporting, ping, traceroute
│   │   ├── igmp.tsx                                    # Multicast group management
│   │   ├── dhcp.tsx                                    # Dynamic IP allocation, DORA
│   │   ├── nat.tsx                                     # Network Address Translation, PAT
│   │   └── tunneling.tsx                               # Encapsulation, VPN, 6to4
│   │
│   ├── routing/
│   │   ├── static-routing.tsx                          # Manual routes, admin distance
│   │   ├── dynamic-routing.tsx                         # Protocol-driven updates
│   │   ├── routing-algorithms.tsx                      # Bellman-Ford, Dijkstra overview
│   │   ├── distance-vector-routing.tsx                 # Count-to-infinity, split horizon
│   │   ├── link-state-routing.tsx                      # LSA flooding, SPF tree
│   │   ├── rip.tsx                                     # Routing Information Protocol v1/v2
│   │   ├── ospf.tsx                                    # Open Shortest Path First, areas
│   │   ├── bgp.tsx                                     # Border Gateway Protocol, AS, eBGP
│   │   └── routing-tables.tsx                          # Longest prefix match, FIB, RIB
│   │
│   └── congestion-and-delivery/
│       ├── congestion-control.tsx                      # Open-loop vs closed-loop
│       ├── qos.tsx                                     # Quality of Service, DSCP, queuing
│       ├── fragmentation.tsx                           # MTU, fragment offset, reassembly
│       └── packet-forwarding.tsx                       # Store-and-forward, cut-through
│
├──transport-layer/                       [20 topics]
│   │
│   ├── fundamentals/
│   │   ├── transport-layer-introduction.tsx            # End-to-end delivery, port model
│   │   ├── process-to-process-delivery.tsx             # Socket = IP + Port
│   │   ├── port-numbers.tsx                            # Well-known, registered, ephemeral
│   │   ├── multiplexing-demultiplexing.tsx             # Combining/separating streams
│   │   ├── connectionless-service.tsx                  # Best-effort, no state
│   │   └── connection-oriented-service.tsx             # Setup, data transfer, teardown
│   │
│   ├── udp/
│   │   ├── udp.tsx                                     # User Datagram Protocol overview
│   │   └── udp-header.tsx                              # Src port, dst port, length, checksum
│   │
│   ├── tcp/
│   │   ├── tcp.tsx                                     # Transmission Control Protocol overview
│   │   ├── tcp-header.tsx                              # All 10 fields explained
│   │   ├── sequence-numbers.tsx                        # ISN, byte numbering, ordering
│   │   ├── acknowledgements.tsx                        # Cumulative ACK, delayed ACK
│   │   ├── tcp-three-way-handshake.tsx                 # SYN → SYN-ACK → ACK
│   │   ├── tcp-connection-termination.tsx              # FIN / RST, TIME_WAIT
│   │   ├── tcp-timers.tsx                              # RTO, persist, keepalive, TIME_WAIT
│   │   ├── flow-control-tcp.tsx                        # Receive window, zero window
│   │   └── congestion-control-tcp.tsx                  # Slow start, AIMD, CUBIC, BBR
│   │
│   └── advanced/
│       ├── leaky-bucket-algorithm.tsx                  # Traffic shaping at constant rate
│       ├── token-bucket-algorithm.tsx                  # Burst allowance, token rate
│       └── sctp.tsx                                    # Stream Control Transmission Protocol
│
├──application-layer/                     [22 topics]
│   │
│   ├── naming-and-addressing/
│   │   ├── application-layer-introduction.tsx          # User-facing protocols, socket API
│   │   └── dns.tsx                                     # Domain resolution, hierarchy, records
│   │
│   ├── file-transfer/
│   │   ├── ftp.tsx                                     # File Transfer Protocol, active/passive
│   │   └── tftp.tsx                                    # Trivial FTP — UDP-based, firmware
│   │
│   ├── email/
│   │   ├── smtp.tsx                                    # Simple Mail Transfer Protocol
│   │   ├── pop3.tsx                                    # Post Office Protocol v3
│   │   ├── imap.tsx                                    # Internet Message Access Protocol
│   │   └── mime.tsx                                    # Multipurpose Internet Mail Extensions
│   │
│   ├── web/
│   │   ├── http.tsx                                    # HTTP/1.1, methods, status codes
│   │   ├── https.tsx                                   # TLS handshake, certificates
│   │   ├── proxy-servers.tsx                           # Forward/reverse proxy, caching
│   │   └── caching.tsx                                 # Cache-Control, ETags, CDN
│   │
│   ├── remote-access/
│   │   ├── telnet.tsx                                  # Unencrypted terminal access
│   │   └── ssh.tsx                                     # Secure Shell, key exchange
│   │
│   ├── management-and-streaming/
│   │   ├── snmp.tsx                                    # Network management, MIB, OIDs
│   │   ├── dhcp-application.tsx                        # DHCP at application layer view
│   │   ├── ntp.tsx                                     # Network Time Protocol, stratum
│   │   ├── rtp.tsx                                     # Real-time Transport Protocol
│   │   └── rtsp.tsx                                    # Real-Time Streaming Protocol
│   │
│   └── modern/
│       ├── web-services.tsx                            # SOAP, REST, WSDL, XML
│       ├── apis.tsx                                    # REST APIs, JSON, HTTP verbs
│       └── socket-programming.tsx                      # BSD sockets, TCP/UDP client-server
│
├──wireless-networks/                     [18 topics]
│   │
│   ├── fundamentals/
│   │   ├── wireless-network-introduction.tsx           # Spectrum, challenges, standards
│   │   ├── wifi.tsx                                    # 802.11 standards, SSID, security
│   │   ├── bluetooth.tsx                               # Piconet, scatternet, BLE
│   │   ├── infrared-communication.tsx                  # IrDA, line-of-sight limits
│   │   ├── rfid.tsx                                    # Radio Frequency ID, tags, readers
│   │   └── nfc.tsx                                     # Near Field Communication, payments
│   │
│   ├── cellular-and-mobile/
│   │   ├── satellite-networks.tsx                      # LEO, MEO, GEO, Starlink
│   │   ├── mobile-ip.tsx                               # Home agent, foreign agent, tunneling
│   │   ├── gsm.tsx                                     # 2G — architecture, handoff
│   │   ├── cdma.tsx                                    # Code Division Multiple Access
│   │   ├── 3g-networks.tsx                             # UMTS, WCDMA, HSPA
│   │   ├── 4g-lte.tsx                                  # OFDM, MIMO, EPC architecture
│   │   └── 5g-networks.tsx                             # mmWave, NR, network slicing, MEC
│   │
│   └── advanced-wireless/
│       ├── handoff-techniques.tsx                      # Hard/soft handoff, decision triggers
│       ├── wireless-security.tsx                       # WEP, WPA2, WPA3, 802.1X
│       ├── manet.tsx                                   # Mobile Ad Hoc Networks, routing
│       ├── vanet.tsx                                   # Vehicular Ad Hoc Networks, V2X
│       └── iot-networking.tsx                          # MQTT, CoAP, Zigbee, LoRaWAN
│
├──network-security/                      [31 topics]
│   │
│   ├── principles/
│   │   ├── network-security-introduction.tsx           # CIA triad, threat landscape
│   │   ├── confidentiality.tsx                         # Encryption, access control
│   │   ├── integrity.tsx                               # Hashing, MACs, digital signatures
│   │   └── availability.tsx                            # Redundancy, DDoS mitigation, SLAs
│   │
│   ├── cryptography/
│   │   ├── cryptography-basics.tsx                     # Plaintext, ciphertext, keys
│   │   ├── symmetric-encryption.tsx                    # Shared key, block vs stream ciphers
│   │   ├── asymmetric-encryption.tsx                   # Public/private key pair
│   │   ├── rsa-algorithm.tsx                           # Prime factorization, key generation
│   │   ├── des.tsx                                     # Data Encryption Standard — 56-bit
│   │   ├── aes.tsx                                     # Advanced Encryption Standard — 128/256
│   │   ├── hash-functions.tsx                          # MD5, SHA-1, SHA-256, properties
│   │   ├── digital-signatures.tsx                      # Sign with private, verify with public
│   │   ├── certificates.tsx                            # X.509, fields, certificate chain
│   │   └── pki.tsx                                     # Public Key Infrastructure, CA, CRL
│   │
│   ├── secure-protocols/
│   │   ├── ssl-tls.tsx                                 # TLS 1.2/1.3, handshake, cipher suites
│   │   ├── ipsec.tsx                                   # AH, ESP, IKE, transport/tunnel mode
│   │   └── vpn.tsx                                     # Site-to-site, remote access, protocols
│   │
│   ├── defense-mechanisms/
│   │   ├── firewalls.tsx                               # Packet filter, stateful, NGFW
│   │   ├── intrusion-detection-system.tsx              # Signature-based, anomaly-based IDS
│   │   ├── intrusion-prevention-system.tsx             # Inline IPS, active blocking
│   │   ├── authentication-mechanisms.tsx               # Passwords, MFA, biometrics, OAuth
│   │   └── access-control.tsx                          # DAC, MAC, RBAC, ABAC
│   │
│   └── threats-and-attacks/
│       ├── malware.tsx                                 # Categories, lifecycle, detection
│       ├── viruses.tsx                                 # Infection, replication, payloads
│       ├── worms.tsx                                   # Self-propagating, WannaCry example
│       ├── trojans.tsx                                 # Disguised malware, RATs, backdoors
│       ├── phishing.tsx                                # Spear phishing, vishing, smishing
│       ├── spoofing.tsx                                # IP, ARP, DNS, email spoofing
│       ├── dos-attacks.tsx                             # Denial of Service techniques
│       ├── ddos-attacks.tsx                            # Botnets, amplification, mitigation
│       └── network-security-protocols.tsx              # Kerberos, RADIUS, TACACS+
│
├──advanced-networking/                   [19 topics]
│   │
│   ├── modern-architectures/
│   │   ├── mpls.tsx                                    # Multi-Protocol Label Switching
│   │   ├── software-defined-networking.tsx             # Control/data plane separation
│   │   ├── network-function-virtualization.tsx         # NFV, VNF, MANO
│   │   ├── cloud-networking.tsx                        # VPC, subnets, security groups
│   │   ├── data-center-networking.tsx                  # Fat-tree, spine-leaf, ECMP
│   │   ├── cdn.tsx                                     # Content Delivery Networks, PoPs
│   │   ├── overlay-networks.tsx                        # VXLAN, GRE, tunneling
│   │   └── peer-to-peer-networks.tsx                   # DHT, Chord, BitTorrent internals
│   │
│   ├── distributed-and-edge/
│   │   ├── grid-computing.tsx                          # Distributed processing, BOINC
│   │   ├── edge-computing.tsx                          # Processing near source, latency
│   │   ├── fog-computing.tsx                           # Edge-cloud continuum, IoT
│   │   └── sd-wan.tsx                                  # Software-Defined WAN, underlay
│   │
│   └── operations-and-emerging/
│       ├── network-automation.tsx                      # Ansible, Python, YANG, NETCONF
│       ├── intent-based-networking.tsx                 # IBN, closed-loop, Cisco DNA
│       ├── zero-trust-networking.tsx                   # Never trust, always verify, ZTNA
│       ├── ai-in-networking.tsx                        # AIOps, anomaly detection, self-healing
│       ├── network-monitoring.tsx                      # SNMP, NetFlow, syslog, dashboards
│       ├── traffic-engineering.tsx                     # MPLS TE, RSVP, constraint routing
│       └── load-balancing.tsx                          # L4/L7 LB, algorithms, health checks
│
├──practical-labs/                        [14 topics]
│   │
│   ├── command-line-tools/
│   │   ├── ping-command.tsx                            # ICMP echo, RTT, packet loss
│   │   ├── traceroute-command.tsx                      # TTL decrement, hop-by-hop path
│   │   ├── ipconfig-ifconfig.tsx                       # Interface info, Windows vs Linux
│   │   └── nslookup.tsx                                # DNS queries, A, MX, CNAME records
│   │
│   ├── packet-analysis/
│   │   ├── wireshark-basics.tsx                        # Capture filters, display filters
│   │   └── packet-sniffing.tsx                         # Promiscuous mode, ethics, tcpdump
│   │
│   └── network-configuration/
│       ├── cisco-packet-tracer.tsx                     # Simulation, device setup, CLI
│       ├── network-configuration.tsx                   # IP assignment, gateway, DNS config
│       ├── router-configuration.tsx                    # IOS commands, interfaces, routing
│       ├── vlan-configuration.tsx                      # VLAN creation, trunk/access ports
│       ├── static-routing-configuration.tsx            # ip route command, next-hop
│       ├── dns-configuration.tsx                       # Zone files, A records, PTR records
│       ├── firewall-configuration.tsx                  # ACLs, iptables, stateful rules
│       └── socket-programming-lab.tsx                  # TCP/UDP client-server in Python
│
└──interview-prep/                        [18 topics]
    │
    ├── model-and-protocol-questions/
    │   ├── osi-model-interview.tsx                     # All 7 layers, mnemonics, functions
    │   ├── tcp-vs-udp.tsx                              # When to use each, header comparison
    │   ├── ipv4-vs-ipv6.tsx                            # Key differences, migration
    │   └── http-vs-https.tsx                           # TLS overhead, certificates, HSTS
    │
    ├── addressing-and-routing/
    │   ├── subnetting-interview.tsx                    # Subnet calculation walkthroughs
    │   ├── routing-vs-forwarding.tsx                   # Control plane vs data plane
    │   ├── arp-working.tsx                             # ARP request/reply, ARP cache
    │   └── nat-interview.tsx                           # NAT types, why it exists
    │
    ├── devices-and-concepts/
    │   ├── switch-vs-router.tsx                        # Layer 2 vs Layer 3 differences
    │   ├── hub-vs-switch.tsx                           # Broadcast vs unicast forwarding
    │   ├── vlan-interview.tsx                          # VLAN purpose, tagging, benefits
    │   └── ethernet-interview.tsx                      # CSMA/CD, frame format, speeds
    │
    └── performance-and-security/
        ├── congestion-control-interview.tsx            # TCP algorithms explained clearly
        ├── flow-control-interview.tsx                  # Window-based flow control
        ├── tcp-handshake-interview.tsx                 # 3-way handshake, 4-way teardown
        ├── firewall-working.tsx                        # Packet filtering mechanics
        └── ssl-tls-interview.tsx                       # Handshake steps, certificates, SNI
"""

base_dir = r"c:\Users\VATSAL VARSHNEY\OneDrive\Desktop\O(1)\content\computer-network"
os.makedirs(base_dir, exist_ok=True)

template = '''"use client";

import React from "react";
import {{ TheorySection }} from "../../../components/TheorySection";

export default function {COMPONENT}() {{
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TheorySection 
        title="{TITLE}"
        definition="This section covers {TITLE}."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={{["Key Point 1", "Key Point 2"]}}
      />
    </div>
  );
}}
'''

def to_camel(s):
    s = s.replace('.tsx', '')
    return ''.join(w.capitalize() for w in s.replace('-', ' ').split())

current_topic = ""
created_count = 0

for line in tree.strip().split('\n'):
    line = line.strip()
    if not line or 'QUICK REFERENCE' in line or 'RECOMMENDED STUDY PATH' in line or line.startswith('='):
        continue
    
    # Identify topic folder, e.g., ├──introduction/                          [37 topics]
    # Note that some might use ├─ instead of ├── depending on copy-paste, 
    # but the prompt specifically uses ├── and └── for the 10 top-level topics.
    # Alternatively, look for the '[XX topics]' pattern
    if ' topics]' in line and '/' in line:
        # e.g., "├──introduction/                          [37 topics]"
        # Split by '/' and take the part after '─'
        parts = line.split('/')
        if len(parts) > 1 and '[' in parts[1]:
            # parts[0] is "├──introduction" or "└──interview-prep"
            # or "├─network-layer"
            topic_str = parts[0]
            # Strip tree characters
            for char in ['├', '─', '└', '│', ' ']:
                topic_str = topic_str.replace(char, '')
            current_topic = topic_str.strip()
            os.makedirs(os.path.join(base_dir, current_topic), exist_ok=True)
            continue

    if '.tsx' in line:
        filename = line.split('.tsx')[0].split('─ ')[-1].strip() + '.tsx'
        if not filename.endswith('.tsx'):
            continue
        
        comp_name = to_camel(filename)
        title = filename.replace('.tsx', '').replace('-', ' ').title()
        
        path = os.path.join(base_dir, current_topic, filename)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(template.format(COMPONENT=comp_name, TITLE=title))
        created_count += 1

print(f"Successfully created {created_count} files in {base_dir}")
