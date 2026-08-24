import { Scenario } from '@/types/simulation';

export const SCENARIOS: Scenario[] = [
  {
    id: 'redis-cache-flow',
    name: 'Redis In-Memory Caching (Hit vs Miss)',
    category: 'System Design',
    difficulty: 'Beginner',
    tag: 'Caching & Latency',
    summary: 'Visualizing how Redis In-Memory caching reduces database disk I/O and slashes response latency from 85ms to 2ms.',
    conceptExplanation: 'Cache-Aside Pattern: Jab client request bhejta hai, pehle fast RAM-based Redis cache check hota hai. Agar data mil gaya (Hit), to 2ms mein response chala jata hai. Agar data nahi mila (Miss), tabhi heavy SQL database query hoti hai aur result ko Redis mein TTL ke saath store kiya jata hai.',
    realWorldExample: 'Instagram User Profile fetching, Netflix Video Metadata loading, Twitter Feeds.',
    nodes: [
      {
        id: 'client-browser',
        name: 'Client Browser',
        sublabel: 'Mobile / Web App',
        type: 'client',
        position: [-6, 0, 0],
        state: 'idle',
        description: 'End-user initiating HTTP REST / GraphQL requests.',
        metrics: { latencyMs: 0, qps: 120, statusText: 'Online' },
        specs: { Device: 'Chrome 124 / iOS', Protocol: 'HTTP/2 + TLS 1.3' }
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        sublabel: 'Nginx / Kong',
        type: 'gateway',
        position: [-2, 0, 0],
        state: 'idle',
        description: 'Reverse proxy, SSL termination, and routing engine.',
        metrics: { cpuUsage: 18, memoryUsage: '450MB', latencyMs: 0.8, statusText: 'Healthy' },
        specs: { Engine: 'Kong / OpenResty', Workers: '8 Cores' }
      },
      {
        id: 'redis-cache',
        name: 'Redis Cache',
        sublabel: 'In-Memory (RAM)',
        type: 'cache',
        position: [2, 2.8, 0],
        state: 'idle',
        description: 'Ultra-fast in-memory key-value store with sub-millisecond lookups.',
        metrics: { memoryUsage: '4.2GB / 8GB', hitRate: 94.2, latencyMs: 1.2, statusText: 'Hot Cache' },
        specs: { Architecture: 'Redis Cluster v7.2', MaxMemory: 'LRU Policy' }
      },
      {
        id: 'postgres-db',
        name: 'PostgreSQL DB',
        sublabel: 'NVMe Disk Storage',
        type: 'database',
        position: [6, -1.8, 0],
        state: 'idle',
        description: 'Relational ACID database for persistent record storage.',
        metrics: { cpuUsage: 64, memoryUsage: '16GB', latencyMs: 82.5, statusText: 'Disk I/O Active' },
        specs: { Engine: 'PostgreSQL 16', Storage: 'NVMe SSD with B-Tree Index' }
      }
    ],
    connections: [
      { id: 'conn-client-gw', from: 'client-browser', to: 'api-gateway', label: 'HTTP Request', color: '#38bdf8' },
      { id: 'conn-gw-redis', from: 'api-gateway', to: 'redis-cache', label: 'GET key (RAM)', color: '#f43f5e', curveOffset: [0, 0.5, 0] },
      { id: 'conn-gw-db', from: 'api-gateway', to: 'postgres-db', label: 'SQL Query (Disk)', color: '#10b981', curveOffset: [0, -0.5, 0] },
      { id: 'conn-redis-db', from: 'redis-cache', to: 'postgres-db', label: 'Cache Sync', color: '#a855f7' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Client Initiates API Request',
        subtitle: 'HTTP GET /api/v1/users/1042',
        hinglishNarration: 'User app open karta hai aur user profile request API Gateway tak travel karti hai. Yeh standard TLS 1.3 secured HTTP packet hai.',
        whyItMatters: 'API Gateway act karta hai single entry point jahan rate limiting, auth token validation aur load balancing handle hoti hai.',
        activeNodeIds: ['client-browser', 'api-gateway'],
        activePath: { from: 'client-browser', to: 'api-gateway', packetType: 'http_request', label: 'GET /user/1042', color: '#38bdf8' },
        nodeStates: { 'client-browser': 'active', 'api-gateway': 'processing' },
        latencyMs: 12,
        cumulativeLatencyMs: 12,
        throughputRps: 1250,
        cacheHitRatio: 92,
        codeSnippet: {
          filename: 'client.ts',
          language: 'typescript',
          code: `// Client making profile request\nconst response = await fetch('https://api.system.io/v1/users/1042', {\n  headers: { 'Authorization': 'Bearer eyJhbGciOi...' }\n});\nconst userProfile = await response.json();`
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Checking Redis In-Memory Cache (RAM Lookup)',
        subtitle: 'GET user:profile:1042',
        hinglishNarration: 'Gateway database ko hit karne ke bajaye pehle Redis RAM mein key check karta hai. Memory lookup ultra-fast O(1) time complexity mein hota hai.',
        whyItMatters: 'Disk I/O 1000x slow hota hai RAM ke comparison mein. Pehle cache check karne se DB load 90% tak kam ho jata hai.',
        activeNodeIds: ['api-gateway', 'redis-cache'],
        activePath: { from: 'api-gateway', to: 'redis-cache', packetType: 'cache_lookup', label: 'GET user:profile:1042', color: '#f43f5e' },
        nodeStates: { 'api-gateway': 'active', 'redis-cache': 'processing' },
        latencyMs: 1.5,
        cumulativeLatencyMs: 13.5,
        throughputRps: 15400,
        cacheHitRatio: 94.5,
        codeSnippet: {
          filename: 'gatewayService.ts',
          language: 'typescript',
          code: `// Fast RAM lookup\nconst cachedUser = await redis.get('user:profile:1042');\nif (cachedUser) {\n  return JSON.parse(cachedUser); // CACHE HIT -> Instant return!\n}`
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: ⚡ CACHE HIT — Sub-2ms Instant Response',
        subtitle: 'Status 200 OK (from RAM)',
        hinglishNarration: 'Redis mein key exist karti thi! Data instant serialize hokar client ko 2ms ke andar deliver ho gaya. PostgreSQL ko touch bhi nahi karna pada!',
        whyItMatters: 'P99 Latency under 5ms maintain hoti hai aur single Redis node 100k+ requests per second serve kar sakta hai.',
        activeNodeIds: ['redis-cache', 'api-gateway', 'client-browser'],
        activePath: { from: 'redis-cache', to: 'client-browser', packetType: 'cache_hit', label: '200 OK (Cached Data)', color: '#22c55e' },
        nodeStates: { 'redis-cache': 'hit', 'client-browser': 'success' },
        latencyMs: 1.8,
        cumulativeLatencyMs: 15.3,
        throughputRps: 28000,
        cacheHitRatio: 96.8,
        codeSnippet: {
          filename: 'responseHeader.http',
          language: 'http',
          code: `HTTP/1.1 200 OK\nContent-Type: application/json\nX-Cache: HIT\nX-Response-Time: 1.8ms\nCache-Control: public, max-age=3600\n\n{ "id": 1042, "name": "Krishna Chaitanya", "tier": "PRO" }`
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: ⚠️ CACHE MISS Scenario — Querying PostgreSQL',
        subtitle: 'Key Expired / Not Found -> Heavy Disk I/O',
        hinglishNarration: 'Maan lo key Redis mein expire ho chuki thi (Cache Miss). Ab Gateway ko heavy PostgreSQL Database se NVMe disk read karke data nikalna padega.',
        whyItMatters: 'Agar millions of concurrent users ek sath Cache Miss trigger karein to DB crash ho sakta hai (Cache Stampede / Thundering Herd Problem).',
        activeNodeIds: ['api-gateway', 'postgres-db'],
        activePath: { from: 'api-gateway', to: 'postgres-db', packetType: 'db_query', label: 'SELECT * FROM users WHERE id=1042', color: '#f59e0b' },
        nodeStates: { 'redis-cache': 'miss', 'postgres-db': 'processing' },
        latencyMs: 78.4,
        cumulativeLatencyMs: 93.7,
        throughputRps: 1800,
        cacheHitRatio: 72.0,
        codeSnippet: {
          filename: 'userRepository.ts',
          language: 'sql',
          code: `-- Heavy Disk B-Tree Index Seek\nSELECT id, name, email, avatar_url, settings \nFROM users \nWHERE id = 1042 AND status = 'ACTIVE' \nLIMIT 1;`
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Cache Population with TTL (Time-To-Live)',
        subtitle: 'SETEX user:profile:1042 3600 (1 Hour TTL)',
        hinglishNarration: 'PostgreSQL se data aate hi Gateway usse Redis mein 1 ghante (3600s) ke TTL ke sath save kar deta hai aur client ko final response bhej deta hai.',
        whyItMatters: 'TTL zaroori hai taaki stale data na rahe aur memory automatically release hoti rahe.',
        activeNodeIds: ['postgres-db', 'redis-cache', 'client-browser'],
        activePath: { from: 'postgres-db', to: 'redis-cache', packetType: 'db_write', label: 'SETEX user:1042 3600 {...}', color: '#a855f7' },
        nodeStates: { 'postgres-db': 'success', 'redis-cache': 'active', 'client-browser': 'success' },
        latencyMs: 14.2,
        cumulativeLatencyMs: 107.9,
        throughputRps: 5200,
        cacheHitRatio: 88.4,
        codeSnippet: {
          filename: 'cacheAside.ts',
          language: 'typescript',
          code: `// Write back to Cache with 1 hour expiration\nawait redis.setex('user:profile:1042', 3600, JSON.stringify(dbUser));\n\n// Send final payload to client\nres.status(200).json(dbUser);`
        }
      }
    ]
  },
  {
    id: 'kafka-event-driven',
    name: 'Event-Driven Pub/Sub with Apache Kafka',
    category: 'System Design',
    difficulty: 'Intermediate',
    tag: 'Asynchronous Architecture',
    summary: 'Decoupling services using Kafka partitioned distributed log for high throughput and zero-loss order processing.',
    conceptExplanation: 'Event-Driven Architecture: Synchronous HTTP calls ke bajaye Producer ek event publish karta hai message queue mein aur turant 202 Accepted response le leta hai. Multiple background workers (Payment, Email, Inventory) independently stream se events consume karte hain.',
    realWorldExample: 'Uber Ride Booking, Amazon E-Commerce Checkout, Swiggy Live Order Pipeline.',
    nodes: [
      {
        id: 'client-checkout',
        name: 'Shopper App',
        sublabel: 'User Checkout',
        type: 'client',
        position: [-6, 0, 0],
        state: 'idle',
        description: 'Customer placing a $250 purchase order.',
        metrics: { latencyMs: 0, statusText: 'Ready' }
      },
      {
        id: 'order-gateway',
        name: 'Order API Service',
        sublabel: 'Event Producer',
        type: 'gateway',
        position: [-2.5, 0, 0],
        state: 'idle',
        description: 'Ingestion microservice that validates schema and publishes events.',
        metrics: { cpuUsage: 22, memoryUsage: '600MB', qps: 8500, statusText: 'Producer OK' }
      },
      {
        id: 'kafka-cluster',
        name: 'Kafka Message Bus',
        sublabel: 'Topic: order-events (Partition 0-3)',
        type: 'queue',
        position: [1.5, 0, 0],
        state: 'idle',
        description: 'Distributed commit log partitioned across brokers with replication.',
        metrics: { queueDepth: 1420, throughputRps: 50000, latencyMs: 2.1, statusText: 'Log Streaming' }
      },
      {
        id: 'payment-worker',
        name: 'Payment Service',
        sublabel: 'Consumer Group A',
        type: 'worker',
        position: [6, 2.5, 0],
        state: 'idle',
        description: 'Deducts balance via Stripe/Razorpay webhook.',
        metrics: { cpuUsage: 45, latencyMs: 250, statusText: 'Listening' }
      },
      {
        id: 'notification-worker',
        name: 'Notification Worker',
        sublabel: 'Consumer Group B',
        type: 'worker',
        position: [6, -2.5, 0],
        state: 'idle',
        description: 'Sends SMS, WhatsApp, and email invoice.',
        metrics: { cpuUsage: 12, latencyMs: 45, statusText: 'Listening' }
      }
    ],
    connections: [
      { id: 'c1', from: 'client-checkout', to: 'order-gateway', label: 'POST /orders', color: '#38bdf8' },
      { id: 'c2', from: 'order-gateway', to: 'kafka-cluster', label: 'kafka.send(OrderPlaced)', color: '#f59e0b' },
      { id: 'c3', from: 'kafka-cluster', to: 'payment-worker', label: 'Consume (Group A)', color: '#10b981', curveOffset: [0, 0.5, 0] },
      { id: 'c4', from: 'kafka-cluster', to: 'notification-worker', label: 'Consume (Group B)', color: '#8b5cf6', curveOffset: [0, -0.5, 0] }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Order Placement Request',
        subtitle: 'POST /api/v1/orders { items: 3, total: $250 }',
        hinglishNarration: 'Shopper "Place Order" click karta hai. Heavy blocking synchronous call ke bajaye hum async architecture use karenge.',
        whyItMatters: 'Agar payment ya notification down bhi ho, shopper ka checkout fail nahi hoga.',
        activeNodeIds: ['client-checkout', 'order-gateway'],
        activePath: { from: 'client-checkout', to: 'order-gateway', packetType: 'http_request', color: '#38bdf8' },
        nodeStates: { 'client-checkout': 'active', 'order-gateway': 'processing' },
        latencyMs: 8,
        cumulativeLatencyMs: 8,
        throughputRps: 4500,
        cacheHitRatio: 0,
        codeSnippet: {
          filename: 'orderController.ts',
          language: 'typescript',
          code: `// Fast non-blocking ingestion\napp.post('/orders', async (req, res) => {\n  const order = validateOrder(req.body);\n  await kafkaProducer.send({\n    topic: 'order-events',\n    messages: [{ key: order.id, value: JSON.stringify(order) }]\n  });\n  return res.status(202).json({ status: 'ACCEPTED', orderId: order.id });\n});`
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Append Event to Kafka Distributed Log',
        subtitle: 'Partition 2 Append (Offset 98402)',
        hinglishNarration: 'Order service event ko Kafka topic ke partition log mein zero-copy write ke sath append kar deti hai (1.2ms latency).',
        whyItMatters: 'Kafka sequential disk writes use karta hai jo memory ke barabar fast hoti hain aur disk failover support karti hain.',
        activeNodeIds: ['order-gateway', 'kafka-cluster'],
        activePath: { from: 'order-gateway', to: 'kafka-cluster', packetType: 'queue_publish', color: '#f59e0b' },
        nodeStates: { 'order-gateway': 'active', 'kafka-cluster': 'processing' },
        latencyMs: 2.1,
        cumulativeLatencyMs: 10.1,
        throughputRps: 65000,
        cacheHitRatio: 0,
        codeSnippet: {
          filename: 'kafkaRecord.json',
          language: 'json',
          code: `{\n  "topic": "order-events",\n  "partition": 2,\n  "offset": 98402,\n  "timestamp": 1724457600,\n  "key": "ord_9942",\n  "payload": { "userId": 1042, "amount": 250.00, "status": "PENDING" }\n}`
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Instant 202 Accepted Response to Client',
        subtitle: 'User UX is snappy (<15ms)',
        hinglishNarration: 'Shopper ko turant screen par "Order Confirmed!" dikh jata hai. User ko payment ya email hone ka wait nahi karna pada.',
        whyItMatters: 'High conversion rate ke liye UX response time under 100ms hona mandatory hai.',
        activeNodeIds: ['order-gateway', 'client-checkout'],
        activePath: { from: 'order-gateway', to: 'client-checkout', packetType: 'http_response', color: '#22c55e' },
        nodeStates: { 'order-gateway': 'success', 'client-checkout': 'success' },
        latencyMs: 4.5,
        cumulativeLatencyMs: 14.6,
        throughputRps: 12000,
        cacheHitRatio: 0,
        codeSnippet: {
          filename: 'response.http',
          language: 'http',
          code: `HTTP/1.1 202 Accepted\nContent-Type: application/json\n\n{ "status": "QUEUED", "orderId": "ord_9942", "estimatedDelivery": "25 mins" }`
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Fan-Out Asynchronous Consumer Processing',
        subtitle: 'Independent Consumer Groups Processing in Parallel',
        hinglishNarration: 'Kafka se Payment Service aur Notification Service dono alag-alag speeds par simultaneously event pull karke process karte hain.',
        whyItMatters: 'Loose coupling: Agar Notification service slow bhi ho jaye, Payment processing par 0% effect padta hai.',
        activeNodeIds: ['kafka-cluster', 'payment-worker', 'notification-worker'],
        activePath: { from: 'kafka-cluster', to: 'payment-worker', packetType: 'queue_consume', color: '#10b981' },
        nodeStates: { 'kafka-cluster': 'active', 'payment-worker': 'processing', 'notification-worker': 'processing' },
        latencyMs: 180,
        cumulativeLatencyMs: 194.6,
        throughputRps: 24000,
        cacheHitRatio: 0,
        codeSnippet: {
          filename: 'paymentConsumer.ts',
          language: 'typescript',
          code: `// Worker listening to topic\nawait consumer.run({\n  eachMessage: async ({ message }) => {\n    const order = JSON.parse(message.value.toString());\n    await stripe.charges.create({ amount: order.amount, customer: order.userId });\n    console.log(\`✅ Payment captured for order \${order.id}\`);\n  }\n});`
        }
      }
    ]
  },
  {
    id: 'rate-limiter-token-bucket',
    name: 'Distributed Rate Limiter (Token Bucket Algorithm)',
    category: 'System Design',
    difficulty: 'Intermediate',
    tag: 'DDoS & Traffic Shaping',
    summary: 'Protecting downstream microservices from traffic spikes and DDoS attacks using Redis sliding window & token bucket.',
    conceptExplanation: 'Token Bucket Algorithm: Har user/IP ko ek bucket allocate hoti hai jisme fixed rate se tokens add hote hain. Har request 1 token consume karti hai. Jab bucket khali ho jati hai, incoming requests ko 429 Too Many Requests ke saath block kar diya jata hai.',
    realWorldExample: 'Cloudflare DDoS Shield, GitHub API Rate Limits (5,000 req/hr), OpenAI Token Rate Limiting.',
    nodes: [
      {
        id: 'client-burst',
        name: 'Traffic Generator',
        sublabel: 'Burst / Bot Traffic (120 req/s)',
        type: 'client',
        position: [-6, 0, 0],
        state: 'idle',
        description: 'Simulated high-frequency automated traffic stream.',
        metrics: { qps: 120, statusText: 'Flooding' }
      },
      {
        id: 'rate-limiter-edge',
        name: 'Edge Rate Limiter',
        sublabel: 'Token Bucket Middleware',
        type: 'gateway',
        position: [-1.5, 0, 0],
        state: 'idle',
        description: 'Evaluates token counters in distributed Redis cache in <0.5ms.',
        metrics: { cpuUsage: 8, latencyMs: 0.4, statusText: 'Evaluating Tokens' }
      },
      {
        id: 'token-redis',
        name: 'Redis Token Store',
        sublabel: 'Atomic Lua Scripts',
        type: 'cache',
        position: [2, 2.5, 0],
        state: 'idle',
        description: 'Stores bucket capacity and last refill timestamps.',
        metrics: { memoryUsage: '120MB', latencyMs: 0.6, statusText: 'Bucket Capacity: 10/10' }
      },
      {
        id: 'core-backend',
        name: 'Core Backend Service',
        sublabel: 'Protected API Server',
        type: 'worker',
        position: [6, -1.5, 0],
        state: 'idle',
        description: 'Resource-intensive application microservice.',
        metrics: { cpuUsage: 14, latencyMs: 45, statusText: 'Load Stable' }
      }
    ],
    connections: [
      { id: 'r1', from: 'client-burst', to: 'rate-limiter-edge', label: '100+ Requests Burst', color: '#f43f5e' },
      { id: 'r2', from: 'rate-limiter-edge', to: 'token-redis', label: 'EVALSHA token_bucket.lua', color: '#f59e0b' },
      { id: 'r3', from: 'rate-limiter-edge', to: 'core-backend', label: 'Forward Allowed Request', color: '#10b981' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Normal Request Allowed (Tokens Available)',
        subtitle: 'Bucket: 10 Tokens -> Consumes 1 Token',
        hinglishNarration: 'Normal traffic jab request bhejta hai, rate limiter Redis se token check karta hai. Token available hai, isliye request Backend ko forward ho jati hai.',
        whyItMatters: 'Legitimate users ko zero friction aur smooth performance milti hai.',
        activeNodeIds: ['client-burst', 'rate-limiter-edge', 'core-backend'],
        activePath: { from: 'rate-limiter-edge', to: 'core-backend', packetType: 'http_request', color: '#10b981' },
        nodeStates: { 'rate-limiter-edge': 'success', 'core-backend': 'processing' },
        latencyMs: 1.2,
        cumulativeLatencyMs: 1.2,
        throughputRps: 100,
        cacheHitRatio: 100,
        codeSnippet: {
          filename: 'rateLimiter.lua',
          language: 'lua',
          code: `-- Atomic Redis Token Bucket Execution\nlocal key = KEYS[1]\nlocal limit = tonumber(ARGV[1])\nlocal current = tonumber(redis.call('get', key) or "0")\n\nif current + 1 <= limit then\n  redis.call('incrby', key, 1)\n  return 1 -- ALLOWED\nelse\n  return 0 -- RATE LIMITED\nend`
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: 🚨 High Traffic Burst / DDoS Attempt',
        subtitle: '150 req/sec exceeding 10 tokens limit',
        hinglishNarration: 'Botnet ya crawler sudden 150 requests bhejta hai. Bucket ke saare 10 tokens instant exhaust ho jate hain.',
        whyItMatters: 'Agar rate limiter na ho, to backend database connections exhaust ho jayenge aur cascading failure ho jayega.',
        activeNodeIds: ['client-burst', 'rate-limiter-edge'],
        activePath: { from: 'client-burst', to: 'rate-limiter-edge', packetType: 'rate_limited', color: '#ef4444' },
        nodeStates: { 'client-burst': 'error', 'rate-limiter-edge': 'warning', 'token-redis': 'miss' },
        latencyMs: 0.5,
        cumulativeLatencyMs: 1.7,
        throughputRps: 15000,
        cacheHitRatio: 0,
        codeSnippet: {
          filename: 'rateLimitResponse.http',
          language: 'http',
          code: `HTTP/1.1 429 Too Many Requests\nRetry-After: 60\nX-RateLimit-Limit: 10\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1724457660\n\n{\n  "error": "Too Many Requests",\n  "message": "Token bucket exhausted. Please wait 60s."\n}`
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Backend Remains 100% Protected & Stable',
        subtitle: 'Zero CPU Spikes on Core DB / Microservices',
        hinglishNarration: 'Tamam 140 unauthorized requests Edge par hi drop ho gayi. Backend CPU stable 14% par chal raha hai!',
        whyItMatters: 'System resilience and cost saving — backend compute aur database queries waste nahi hui.',
        activeNodeIds: ['rate-limiter-edge', 'core-backend'],
        activePath: null,
        nodeStates: { 'rate-limiter-edge': 'idle', 'core-backend': 'success' },
        latencyMs: 0.2,
        cumulativeLatencyMs: 1.9,
        throughputRps: 200,
        cacheHitRatio: 100,
        codeSnippet: {
          filename: 'healthCheck.json',
          language: 'json',
          code: `{\n  "service": "core-backend",\n  "status": "HEALTHY",\n  "cpuUsage": "14%",\n  "activeConnections": 12,\n  "droppedRequestsAtEdge": 140\n}`
        }
      }
    ]
  },
  {
    id: 'lru-cache-dsa',
    name: 'LRU Cache (Least Recently Used) — DSA Visualizer',
    category: 'DSA & Algorithms',
    difficulty: 'Advanced',
    tag: 'Doubly Linked List + HashMap',
    summary: 'Mastering O(1) Get and Put operations using Doubly Linked List for order tracking and Hash Map for O(1) direct lookup.',
    conceptExplanation: 'LRU Cache: HashMap hume O(1) key-to-node memory address lookup deta hai. Doubly Linked List hume O(1) head insertion aur O(1) tail eviction deta hai. Jab bhi koi node access hoti hai, usse DLL ke head par move kar diya jata hai.',
    realWorldExample: 'Browser History Tab switching, Operating System Page Replacement, Redis LRU memory eviction.',
    nodes: [
      {
        id: 'lru-hashmap',
        name: 'Hash Map Lookup',
        sublabel: 'Key -> Node Address Map',
        type: 'node',
        position: [-4.5, 2, 0],
        state: 'idle',
        description: 'Provides O(1) fast pointer retrieval for any key.',
        metrics: { latencyMs: 0.1, statusText: 'O(1) Access' }
      },
      {
        id: 'lru-head',
        name: 'DLL Head (MRU)',
        sublabel: 'Most Recently Used Node',
        type: 'node',
        position: [0, 2, 0],
        state: 'idle',
        description: 'New and recently accessed nodes are placed right after Head.',
        metrics: { statusText: 'Head Pointer' }
      },
      {
        id: 'lru-tail',
        name: 'DLL Tail (LRU)',
        sublabel: 'Least Recently Used Node',
        type: 'node',
        position: [4.5, 2, 0],
        state: 'idle',
        description: 'When capacity is full, the node before Tail is evicted in O(1).',
        metrics: { statusText: 'Tail Pointer (Eviction Candidate)' }
      },
      {
        id: 'lru-cold-storage',
        name: 'Evicted Cold Storage',
        sublabel: 'Garbage Collected / Disk',
        type: 'database',
        position: [4.5, -2, 0],
        state: 'idle',
        description: 'Evicted item cleared from memory.',
        metrics: { statusText: 'Capacity: 3/3' }
      }
    ],
    connections: [
      { id: 'l1', from: 'lru-hashmap', to: 'lru-head', label: 'Pointer Lookup', color: '#38bdf8' },
      { id: 'l2', from: 'lru-head', to: 'lru-tail', label: 'Doubly Linked Chain <->', color: '#10b981' },
      { id: 'l3', from: 'lru-tail', to: 'lru-cold-storage', label: 'Evict Node', color: '#ef4444' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: O(1) Get Operation & Move to Head',
        subtitle: 'get("node_B") -> Found in HashMap',
        hinglishNarration: 'User "node_B" ko access karta hai. HashMap se direct pointer mila. Ab node_B ko list se unhook karke HEAD ke turant baad MRU position par laga diya jata hai.',
        whyItMatters: 'Pure array use karne par O(N) shifting hoti, par Doubly Linked List mein node shifting exact O(1) pointer updates mein hoti hai.',
        activeNodeIds: ['lru-hashmap', 'lru-head'],
        activePath: { from: 'lru-hashmap', to: 'lru-head', packetType: 'cache_hit', color: '#38bdf8' },
        nodeStates: { 'lru-hashmap': 'hit', 'lru-head': 'active' },
        latencyMs: 0.1,
        cumulativeLatencyMs: 0.1,
        throughputRps: 500000,
        cacheHitRatio: 100,
        codeSnippet: {
          filename: 'LRUCache.ts',
          language: 'typescript',
          code: `get(key: K): V | -1 {\n  if (!this.map.has(key)) return -1;\n  const node = this.map.get(key)!;\n  this.removeNode(node);      // Unlink in O(1)\n  this.addToHead(node);       // Move to Head (MRU) in O(1)\n  return node.value;\n}`
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Capacity Full — Evicting Tail (LRU Node)',
        subtitle: 'put("node_E", value) when capacity = 3',
        hinglishNarration: 'Nayi key "node_E" insert karni hai par capacity full (3/3) hai. TAIL ke pehle wali least recently used node ko unhook karke HashMap se delete kar diya jata hai.',
        whyItMatters: 'Memory overflow hone se bachta hai aur automatically cold data flush ho jata hai.',
        activeNodeIds: ['lru-tail', 'lru-cold-storage'],
        activePath: { from: 'lru-tail', to: 'lru-cold-storage', packetType: 'cache_miss', color: '#ef4444' },
        nodeStates: { 'lru-tail': 'miss', 'lru-cold-storage': 'warning' },
        latencyMs: 0.1,
        cumulativeLatencyMs: 0.2,
        throughputRps: 450000,
        cacheHitRatio: 66,
        codeSnippet: {
          filename: 'eviction.ts',
          language: 'typescript',
          code: `put(key: K, value: V): void {\n  if (this.map.size >= this.capacity) {\n    const lruNode = this.tail.prev!; // Node before dummy tail\n    this.removeNode(lruNode);         // Unlink in O(1)\n    this.map.delete(lruNode.key);     // Remove from map\n  }\n  const newNode = new Node(key, value);\n  this.addToHead(newNode);\n  this.map.set(key, newNode);\n}`
        }
      }
    ]
  }
];
