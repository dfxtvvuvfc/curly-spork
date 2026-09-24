export type ProtocolType = 'vless' | 'vmess' | 'trojan' | 'shadowsocks';
export type TransportType = 'ws' | 'grpc' | 'tcp' | 'httpupgrade';
export type SecurityType = 'tls' | 'reality' | 'none';
export type OperatorType = 'mci' | 'irancell' | 'rightel' | 'telecom' | 'all';

export interface ProxyConfig {
  id: string;
  name: string;
  protocol: ProtocolType;
  server: string; // Clean IP or domain used as server address
  port: number;
  uuid: string; // UUID or Password
  transport: TransportType;
  path: string;
  host: string; // SNI / Host header
  sni: string;
  security: SecurityType;
  proxyIp?: string; // Proxy IP for Cloudflare worker proxying
  earlyData?: boolean; // ?ed=2048
  flow?: string;
  pbk?: string; // Reality Public Key
  sid?: string; // Reality Short ID
  fp?: string; // Fingerprint: chrome, firefox, safari
  operator: OperatorType;
  fragment?: {
    enabled: boolean;
    packets: string;
    length: string;
    interval: string;
  };
  createdAt: number;
  uri: string;
}

export interface CleanIpItem {
  id: string;
  ip: string;
  operator: OperatorType;
  ispName: string;
  ping: number | null; // ms
  status: 'idle' | 'testing' | 'success' | 'failed';
  lastTested?: number;
}
