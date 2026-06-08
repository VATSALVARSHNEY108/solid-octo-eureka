computer-networks/
│
├── 01-introduction/                                          [37 topics]
│   │
│   ├── 01-core-concepts/
│   │   ├── 001-introduction-to-computer-networks.tsx        # What is a network, why it matters
│   │   ├── 002-goals-of-networking.tsx                      # Resource sharing, communication, reliability
│   │   ├── 003-applications-of-networks.tsx                 # Business, home, mobile, social uses
│   │   ├── 004-network-components.tsx                       # Hosts, links, routers, protocols
│   │   ├── 005-network-criteria.tsx                         # Performance, reliability, security
│   │   ├── 006-network-architecture.tsx                     # Layered design philosophy
│   │   ├── 007-internet-basics.tsx                          # History, structure, ISPs, backbone
│   │   ├── 008-protocols-and-standards.tsx                  # What protocols are, why standards exist
│   │   └── 009-rfc-standards.tsx                            # IETF, RFC process, key RFCs
│   │
│   ├── 02-types-of-networks/
│   │   ├── 010-types-of-networks.tsx                        # Overview of all network categories
│   │   ├── 011-lan.tsx                                      # Local Area Network — Ethernet, Wi-Fi
│   │   ├── 012-man.tsx                                      # Metropolitan Area Network — city scale
│   │   ├── 013-wan.tsx                                      # Wide Area Network — MPLS, leased lines
│   │   ├── 014-pan.tsx                                      # Personal Area Network — Bluetooth, USB
│   │   ├── 015-client-server-model.tsx                      # Centralized architecture, roles
│   │   └── 016-peer-to-peer-model.tsx                       # Decentralized architecture, BitTorrent
│   │
│   ├── 03-topologies/
│   │   ├── 017-network-topologies.tsx                       # Physical vs logical topology
│   │   ├── 018-bus-topology.tsx                             # Single backbone, termination
│   │   ├── 019-star-topology.tsx                            # Central hub/switch model
│   │   ├── 020-ring-topology.tsx                            # Token passing, SONET rings
│   │   ├── 021-mesh-topology.tsx                            # Full mesh vs partial mesh
│   │   ├── 022-tree-topology.tsx                            # Hierarchical star extension
│   │   └── 023-hybrid-topology.tsx                          # Combined topologies in enterprise
│   │
│   ├── 04-networking-devices/
│   │   ├── 024-networking-devices.tsx                       # Overview of all devices
│   │   ├── 025-hub.tsx                                      # Layer 1, broadcast domain
│   │   ├── 026-switch.tsx                                   # Layer 2, MAC table, forwarding
│   │   ├── 027-router.tsx                                   # Layer 3, IP routing, interfaces
│   │   ├── 028-bridge.tsx                                   # Connects LAN segments
│   │   ├── 029-gateway.tsx                                  # Protocol translation
│   │   ├── 030-repeater.tsx                                 # Signal regeneration, Layer 1
│   │   └── 031-modem.tsx                                    # Modulation/demodulation, DSL, cable
│   │
│   └── 05-reference-models/
│       ├── 032-osi-model.tsx                                # 7 layers — roles and responsibilities
│       ├── 033-tcp-ip-model.tsx                             # 4-layer DARPA model
│       ├── 034-osi-vs-tcp-ip.tsx                            # Comparison, why TCP/IP won
│       └── 035-encapsulation-decapsulation.tsx              # PDU wrapping at each layer
│
├── 02-physical-layer/                                        [32 topics]
│   │
│   ├── 01-fundamentals/
│   │   ├── 036-physical-layer-introduction.tsx              # Role, responsibilities, standards
│   │   ├── 037-functions-of-physical-layer.tsx              # Bit transmission, encoding, timing
│   │   ├── 038-analog-signals.tsx                           # Sine waves, amplitude, frequency, phase
│   │   ├── 039-digital-signals.tsx                          # Bit levels, encoding schemes
│   │   ├── 040-periodic-signals.tsx                         # Repeating waveforms, period, frequency
│   │   ├── 041-non-periodic-signals.tsx                     # Aperiodic signals, Fourier analysis
│   │   ├── 042-signal-transmission.tsx                      # Baseband vs broadband
│   │   └── 043-transmission-impairments.tsx                 # Attenuation, distortion, noise
│   │
│   ├── 02-performance-metrics/
│   │   ├── 044-bandwidth.tsx                                # Hertz vs bps, data rate
│   │   ├── 045-throughput.tsx                               # Actual vs theoretical rate
│   │   ├── 046-latency.tsx                                  # Propagation, transmission, queuing
│   │   └── 047-jitter.tsx                                   # Delay variation, impact on VoIP/video
│   │
│   ├── 03-transmission-media/
│   │   ├── 048-guided-media.tsx                             # Wired media overview
│   │   ├── 049-unguided-media.tsx                           # Wireless media overview
│   │   ├── 050-twisted-pair-cable.tsx                       # UTP, STP, Cat5/6/7, crosstalk
│   │   ├── 051-coaxial-cable.tsx                            # Baseband, broadband, RG types
│   │   ├── 052-optical-fiber.tsx                            # Single-mode, multi-mode, connectors
│   │   ├── 053-radio-waves.tsx                              # AM/FM, omni-directional propagation
│   │   ├── 054-microwaves.tsx                               # Line-of-sight, satellite uplinks
│   │   └── 055-infrared.tsx                                 # Short-range, IrDA, TV remotes
│   │
│   ├── 04-switching/
│   │   ├── 056-circuit-switching.tsx                        # Dedicated path, PSTN, pros/cons
│   │   ├── 057-packet-switching.tsx                         # Store-and-forward, datagram
│   │   └── 058-message-switching.tsx                        # Store-and-forward entire message
│   │
│   ├── 05-multiplexing/
│   │   ├── 059-multiplexing.tsx                             # Combining signals on shared medium
│   │   ├── 060-fdm.tsx                                      # Frequency Division Multiplexing
│   │   ├── 061-tdm.tsx                                      # Time Division Multiplexing
│   │   ├── 062-wdm.tsx                                      # Wavelength Division — fiber optics
│   │   └── 063-spread-spectrum.tsx                          # FHSS, DSSS, anti-jamming
│   │
│   └── 06-systems-and-theorems/
│       ├── 064-telephone-network.tsx                        # PSTN, local loop, CO, trunk lines
│       ├── 065-cellular-communication.tsx                   # Cell structure, frequency reuse
│       ├── 066-nyquist-theorem.tsx                          # Max data rate for noiseless channel
│       └── 067-shannon-capacity.tsx                         # Channel capacity with noise (SNR)
│
├── 03-data-link-layer/                                       [34 topics]
│   │
│   ├── 01-framing/
│   │   ├── 068-data-link-layer-introduction.tsx             # Sublayers, services, responsibilities
│   │   ├── 069-framing.tsx                                  # Delimiting frames, byte/bit methods
│   │   ├── 070-character-stuffing.tsx                       # Escape character insertion
│   │   └── 071-bit-stuffing.tsx                             # Flag sequence, zero insertion
│   │
│   ├── 02-error-control/
│   │   ├── 072-error-detection.tsx                          # Overview of detection techniques
│   │   ├── 073-parity-check.tsx                             # Single-bit, two-dimensional parity
│   │   ├── 074-checksum.tsx                                 # 1s complement addition, TCP/UDP use
│   │   ├── 075-cyclic-redundancy-check.tsx                  # CRC polynomial, shift register
│   │   ├── 076-hamming-code.tsx                             # SEC-DED, bit positions, parity bits
│   │   └── 077-error-correction.tsx                         # FEC vs ARQ, retransmission
│   │
│   ├── 03-flow-control-and-arq/
│   │   ├── 078-flow-control.tsx                             # Stop-and-wait vs sliding window
│   │   ├── 079-stop-and-wait.tsx                            # Simplest protocol, efficiency
│   │   ├── 080-sliding-window-protocol.tsx                  # Window size, piggybacking
│   │   ├── 081-stop-and-wait-arq.tsx                        # ACK, NAK, timeout retransmission
│   │   ├── 082-go-back-n.tsx                                # GBN window, cumulative ACK
│   │   └── 083-selective-repeat.tsx                         # SR window, individual NAK
│   │
│   ├── 04-protocols/
│   │   ├── 084-hdlc.tsx                                     # High-Level Data Link Control
│   │   └── 085-ppp.tsx                                      # Point-to-Point Protocol, LCP, NCP
│   │
│   ├── 05-mac-sublayer/
│   │   ├── 086-mac-sublayer.tsx                             # Media Access Control overview
│   │   ├── 087-aloha.tsx                                    # Pure ALOHA — random access
│   │   ├── 088-slotted-aloha.tsx                            # Time-slotted improvement
│   │   ├── 089-csma.tsx                                     # Carrier Sense Multiple Access
│   │   ├── 090-csma-cd.tsx                                  # Collision Detection — Ethernet
│   │   ├── 091-csma-ca.tsx                                  # Collision Avoidance — Wi-Fi
│   │   └── 092-channelization.tsx                           # FDMA, TDMA, CDMA
│   │
│   └── 06-ethernet-and-switching/
│       ├── 093-ethernet.tsx                                 # IEEE 802.3, frame format, 10 Mbps
│       ├── 094-fast-ethernet.tsx                            # 100BASE-TX, autonegotiation
│       ├── 095-gigabit-ethernet.tsx                         # 1000BASE-T, fiber variants
│       ├── 096-ieee-802-standards.tsx                       # 802.3, 802.11, 802.15 family
│       ├── 097-wireless-lan.tsx                             # 802.11 a/b/g/n/ac/ax
│       ├── 098-bridges.tsx                                  # Transparent bridge, learning
│       ├── 099-switches.tsx                                 # Layer 2 switching, MAC table
│       ├── 100-vlan.tsx                                     # Virtual LAN, 802.1Q tagging
│       └── 101-spanning-tree-protocol.tsx                   # STP, RSTP, loop prevention
│
├── 04-network-layer/                                         [30 topics]
│   │
│   ├── 01-addressing/
│   │   ├── 102-network-layer-introduction.tsx               # Routing, forwarding, addressing
│   │   ├── 103-logical-addressing.tsx                       # IP addressing concepts
│   │   ├── 104-ipv4-addressing.tsx                          # Dotted decimal, 32-bit structure
│   │   ├── 105-ipv4-classes.tsx                             # Class A/B/C/D/E, default masks
│   │   ├── 106-subnetting.tsx                               # CIDR notation, subnet calculation
│   │   ├── 107-supernetting.tsx                             # Route aggregation, summary routes
│   │   ├── 108-cidr.tsx                                     # Classless Inter-Domain Routing
│   │   ├── 109-vlsm.tsx                                     # Variable Length Subnet Masking
│   │   ├── 110-ipv6-addressing.tsx                          # 128-bit, colo