$base = 'C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content';
$oldName = 'computer-network';
$newName = 'computer-networks';
$oldPath = Join-Path $base $oldName;
$newPath = Join-Path $base $newName;
# Rename folder if it exists; otherwise create new one
if (Test-Path $oldPath) {
    Rename-Item -Path $oldPath -NewName $newName -Force;
} else {
    Write-Host "Folder $oldPath not found. Creating $newName.";
    New-Item -ItemType Directory -Path $newPath -Force | Out-Null;
}
# Define the structure as a nested hashtable
$structure = @{
    "01-introduction" = @{
        "01-core-concepts" = @(
            "001-introduction-to-computer-networks.tsx",
            "002-goals-of-networking.tsx",
            "003-applications-of-networks.tsx",
            "004-network-components.tsx",
            "005-network-criteria.tsx",
            "006-network-architecture.tsx",
            "007-internet-basics.tsx",
            "008-protocols-and-standards.tsx",
            "009-rfc-standards.tsx"
        );
        "02-types-of-networks" = @(
            "010-types-of-networks.tsx",
            "011-lan.tsx",
            "012-man.tsx",
            "013-wan.tsx",
            "014-pan.tsx",
            "015-client-server-model.tsx",
            "016-peer-to-peer-model.tsx"
        );
        "03-topologies" = @(
            "017-network-topologies.tsx",
            "018-bus-topology.tsx",
            "019-star-topology.tsx",
            "020-ring-topology.tsx",
            "021-mesh-topology.tsx",
            "022-tree-topology.tsx",
            "023-hybrid-topology.tsx"
        );
        "04-networking-devices" = @(
            "024-networking-devices.tsx",
            "025-hub.tsx",
            "026-switch.tsx",
            "027-router.tsx",
            "028-bridge.tsx",
            "029-gateway.tsx",
            "030-repeater.tsx",
            "031-modem.tsx"
        );
        "05-reference-models" = @(
            "032-osi-model.tsx",
            "033-tcp-ip-model.tsx",
            "034-osi-vs-tcp-ip.tsx",
            "035-encapsulation-decapsulation.tsx"
        );
    };
    "02-physical-layer" = @{
        "01-fundamentals" = @(
            "036-physical-layer-introduction.tsx",
            "037-functions-of-physical-layer.tsx",
            "038-analog-signals.tsx",
            "039-digital-signals.tsx",
            "040-periodic-signals.tsx",
            "041-non-periodic-signals.tsx",
            "042-signal-transmission.tsx",
            "043-transmission-impairments.tsx"
        );
        "02-performance-metrics" = @(
            "044-bandwidth.tsx",
            "045-throughput.tsx",
            "046-latency.tsx",
            "047-jitter.tsx"
        );
        "03-transmission-media" = @(
            "048-guided-media.tsx",
            "049-unguided-media.tsx",
            "050-twisted-pair-cable.tsx",
            "051-coaxial-cable.tsx",
            "052-optical-fiber.tsx",
            "053-radio-waves.tsx",
            "054-microwaves.tsx",
            "055-infrared.tsx"
        );
        "04-switching" = @(
            "056-circuit-switching.tsx",
            "057-packet-switching.tsx",
            "058-message-switching.tsx"
        );
        "05-multiplexing" = @(
            "059-multiplexing.tsx",
            "060-fdm.tsx",
            "061-tdm.tsx",
            "062-wdm.tsx",
            "063-spread-spectrum.tsx"
        );
        "06-systems-and-theorems" = @(
            "064-telephone-network.tsx",
            "065-cellular-communication.tsx",
            "066-nyquist-theorem.tsx",
            "067-shannon-capacity.tsx"
        );
    };
    "03-data-link-layer" = @{
        "01-framing" = @(
            "068-data-link-layer-introduction.tsx",
            "069-framing.tsx",
            "070-character-stuffing.tsx",
            "071-bit-stuffing.tsx"
        );
        "02-error-control" = @(
            "072-error-detection.tsx",
            "073-parity-check.tsx",
            "074-checksum.tsx",
            "075-cyclic-redundancy-check.tsx",
            "076-hamming-code.tsx",
            "077-error-correction.tsx"
        );
        "03-flow-control-and-arq" = @(
            "078-flow-control.tsx",
            "079-stop-and-wait.tsx",
            "080-sliding-window-protocol.tsx",
            "081-stop-and-wait-arq.tsx",
            "082-go-back-n.tsx",
            "083-selective-repeat.tsx"
        );
        "04-protocols" = @(
            "084-hdlc.tsx",
            "085-ppp.tsx"
        );
        "05-mac-sublayer" = @(
            "086-mac-sublayer.tsx",
            "087-aloha.tsx",
            "088-slotted-aloha.tsx",
            "089-csma.tsx",
            "090-csma-cd.tsx",
            "091-csma-ca.tsx",
            "092-channelization.tsx"
        );
        "06-ethernet-and-switching" = @(
            "093-ethernet.tsx",
            "094-fast-ethernet.tsx",
            "095-gigabit-ethernet.tsx",
            "096-ieee-802-standards.tsx",
            "097-wireless-lan.tsx",
            "098-bridges.tsx",
            "099-switches.tsx",
            "100-vlan.tsx",
            "101-spanning-tree-protocol.tsx"
        );
    };
    "04-network-layer" = @{
        "01-addressing" = @(
            "102-network-layer-introduction.tsx",
            "103-logical-addressing.tsx",
            "104-ipv4-addressing.tsx",
            "105-ipv4-classes.tsx",
            "106-subnetting.tsx",
            "107-supernetting.tsx",
            "108-cidr.tsx",
            "109-vlsm.tsx",
            "110-ipv6-addressing.tsx"
        )
    }
};

function New-Structure($parent, $tree) {
    foreach ($name in $tree.Keys) {
        $path = Join-Path $parent $name;
        if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path -Force | Out-Null }
        $content = $tree[$name];
        if ($content -is [System.Collections.Hashtable]) {
            New-Structure $path $content;
        } elseif ($content -is [System.Array]) {
            foreach ($file in $content) {
                $filePath = Join-Path $path $file;
                if (-not (Test-Path $filePath)) { New-Item -ItemType File -Path $filePath -Force | Out-Null }
            }
        }
    }
}

New-Structure $newPath $structure;
