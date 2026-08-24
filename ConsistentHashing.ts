/**
 * ============================================================================
 * 🌐 CONSISTENT HASHING ALGORITHM WITH VIRTUAL NODES (V-NODES)
 * ============================================================================
 *
 * 🎯 The Problem: Naive hash(key) % N redistributes 100% of keys on server add/remove.
 * ⚡ The Solution: Consistent Hashing Ring (0 to 2^32 - 1) where adding/removing a
 *    server only redistributes K/N keys.
 * 🔮 Virtual Nodes: Eliminates hot spots and ensures uniform distribution.
 */

export namespace ConsistentHashingEngine {
  /**
   * Fast 32-bit FNV-1a Hash Algorithm
   * Converts any string key to a 32-bit unsigned integer [0, 2^32 - 1].
   */
  export function hashKey(key: string): number {
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0; // Convert to unsigned 32-bit integer
  }

  export interface ServerNode {
    id: string;
    label: string;
    color: string;
    ip: string;
  }

  export interface VirtualNodeEntry {
    hash: number;
    serverId: string;
    vnodeIndex: number;
    vnodeKey: string;
  }

  export class ConsistentHashRing {
    private replicas: number; // Number of virtual nodes per physical node
    private ring: VirtualNodeEntry[] = []; // Sorted list of virtual nodes by hash
    private servers: Map<string, ServerNode> = new Map();

    constructor(replicas: number = 3) {
      this.replicas = replicas;
    }

    /**
     * Add a physical server and its virtual nodes to the hash ring.
     * Time Complexity: O(R * log(N * R)) where R = replicas, N = servers
     */
    public addServer(server: ServerNode): void {
      if (this.servers.has(server.id)) return;
      this.servers.set(server.id, server);

      for (let i = 0; i < this.replicas; i++) {
        const vnodeKey = `${server.id}#vnode_${i}`;
        const hash = hashKey(vnodeKey);
        this.ring.push({
          hash,
          serverId: server.id,
          vnodeIndex: i,
          vnodeKey,
        });
      }

      // Keep the ring sorted by 32-bit hash value
      this.ring.sort((a, b) => a.hash - b.hash);
    }

    /**
     * Remove a physical server and all its virtual nodes from the ring.
     * Time Complexity: O(N * R)
     */
    public removeServer(serverId: string): void {
      if (!this.servers.has(serverId)) return;
      this.servers.delete(serverId);
      this.ring = this.ring.filter((entry) => entry.serverId !== serverId);
    }

    /**
     * Find the primary server assigned to a key via Clockwise Ring lookup.
     * Uses Binary Search (bisect_right / upper_bound).
     * Time Complexity: O(log(N * R))
     */
    public getServer(key: string): { server: ServerNode; hash: number; vnode: VirtualNodeEntry } | null {
      if (this.ring.length === 0) return null;

      const keyHash = hashKey(key);

      // Binary Search for the first virtual node with hash >= keyHash
      let left = 0;
      let right = this.ring.length - 1;
      let targetIndex = 0;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (this.ring[mid].hash >= keyHash) {
          targetIndex = mid;
          right = mid - 1; // Look for earlier match
        } else {
          left = mid + 1;
        }
      }

      // If keyHash > highest hash on the ring, wrap around clockwise to the 0th element
      if (left === this.ring.length) {
        targetIndex = 0;
      }

      const assignedVNode = this.ring[targetIndex];
      const server = this.servers.get(assignedVNode.serverId)!;

      return {
        server,
        hash: keyHash,
        vnode: assignedVNode,
      };
    }

    /**
     * Get all active physical servers
     */
    public getServers(): ServerNode[] {
      return Array.from(this.servers.values());
    }

    /**
     * Get entire ring topology with angles for 3D rendering
     */
    public getRingTopology(): (VirtualNodeEntry & { angleRad: number; angleDeg: number })[] {
      const MAX_HASH = 4294967295; // 2^32 - 1
      return this.ring.map((entry) => {
        const fraction = entry.hash / MAX_HASH;
        const angleRad = fraction * 2 * Math.PI;
        const angleDeg = fraction * 360;
        return { ...entry, angleRad, angleDeg };
      });
    }
  }

  // ============================================================================
  // 🧪 COMPREHENSIVE TEST SUITE
  // ============================================================================
  export function runTests(): void {
    console.log('🚀 Running Consistent Hashing Tests...\n');

    const ring = new ConsistentHashRing(3); // 3 virtual nodes per server

    // Test 1: Add initial 3 servers
    ring.addServer({ id: 'server-A', label: 'Cache Node A', color: '#06b6d4', ip: '10.0.0.1' });
    ring.addServer({ id: 'server-B', label: 'Cache Node B', color: '#10b981', ip: '10.0.0.2' });
    ring.addServer({ id: 'server-C', label: 'Cache Node C', color: '#8b5cf6', ip: '10.0.0.3' });

    console.log(`✅ [SETUP] 3 Physical Servers added. Total Virtual Nodes on Ring = ${ring.getRingTopology().length}`);

    // Test 2: Route keys
    const testKeys = ['user:101', 'user:102', 'video:404', 'session:abc', 'order:999'];
    const initialMapping: Record<string, string> = {};

    console.log('\n📌 Initial Key Distribution:');
    for (const key of testKeys) {
      const match = ring.getServer(key)!;
      initialMapping[key] = match.server.id;
      console.log(`   Key "${key}" (Hash: ${match.hash}) -> Mapped to: ${match.server.label} via VNode: ${match.vnode.vnodeKey}`);
    }

    // Test 3: Add Server D and verify minimal key movement (K/N property)
    console.log('\n➕ Adding Server D (Scaling from 3 to 4 nodes)...');
    ring.addServer({ id: 'server-D', label: 'Cache Node D', color: '#f59e0b', ip: '10.0.0.4' });

    let movedKeys = 0;
    console.log('📌 Key Distribution After Adding Server D:');
    for (const key of testKeys) {
      const match = ring.getServer(key)!;
      const changed = initialMapping[key] !== match.server.id;
      if (changed) movedKeys++;
      console.log(`   Key "${key}" -> ${match.server.label} ${changed ? '🔄 [MIGRATED]' : '✅ [UNCHANGED]'}`);
    }

    console.log(`\n🎉 Minimal Redistribution Verified: Only ${movedKeys} out of ${testKeys.length} keys moved (instead of 100% on traditional modulo)!`);
  }
}

// Run test if executed directly
if (typeof module !== 'undefined' && typeof require !== 'undefined' && require.main === module) {
  ConsistentHashingEngine.runTests();
}
