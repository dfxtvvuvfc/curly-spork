import { ProxyConfig, ProtocolType } from '../types/config';

// Safe base64 encoding with UTF-8 support
export function safeBtoa(str: string): string {
  try {
    return window.btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return window.btoa(str);
  }
}

// Generate random valid UUID v4
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Build standard, tested proxy URI
export function generateProxyUri(config: Omit<ProxyConfig, 'uri' | 'id' | 'createdAt'>): string {
  const { protocol, server, port, uuid, transport, path, host, sni, security, name, flow, pbk, sid, fp } = config;
  const safeName = encodeURIComponent(name || 'V2Ray-Node');
  const safePath = encodeURIComponent(path || '/');
  const safeHost = encodeURIComponent(host || sni);
  const fingerprint = fp || 'chrome';

  if (protocol === 'vless') {
    const params = new URLSearchParams();
    params.set('encryption', 'none');
    params.set('security', security || 'tls');
    if (sni) params.set('sni', sni);
    params.set('fp', fingerprint);
    params.set('type', transport);

    if (transport === 'ws') {
      if (host) params.set('host', host);
      if (path) params.set('path', path);
    } else if (transport === 'grpc') {
      if (path) params.set('serviceName', path.replace(/^\//, ''));
      params.set('mode', 'gun');
    } else if (transport === 'httpupgrade') {
      if (host) params.set('host', host);
      if (path) params.set('path', path);
    }

    if (security === 'reality') {
      if (pbk) params.set('pbk', pbk);
      if (sid) params.set('sid', sid);
      if (flow) params.set('flow', flow);
    }

    return `vless://${uuid}@${server}:${port}?${params.toString()}#${safeName}`;
  }

  if (protocol === 'vmess') {
    const vmessObj = {
      v: '2',
      ps: name || 'VMess-Node',
      add: server,
      port: port,
      id: uuid,
      aid: '0',
      scy: 'auto',
      net: transport === 'grpc' ? 'grpc' : 'ws',
      type: 'none',
      host: host || sni,
      path: path || '/',
      tls: security === 'tls' ? 'tls' : '',
      sni: sni || host,
      alpn: 'h2,http/1.1',
      fp: fingerprint,
    };
    return `vmess://${safeBtoa(JSON.stringify(vmessObj, null, 2))}`;
  }

  if (protocol === 'trojan') {
    const params = new URLSearchParams();
    params.set('security', security || 'tls');
    if (sni) params.set('sni', sni);
    params.set('fp', fingerprint);
    params.set('alpn', 'h2,http/1.1');
    params.set('type', transport);

    if (transport === 'ws') {
      if (host) params.set('host', host);
      if (path) params.set('path', path);
    } else if (transport === 'grpc') {
      if (path) params.set('serviceName', path.replace(/^\//, ''));
    }

    return `trojan://${uuid}@${server}:${port}?${params.toString()}#${safeName}`;
  }

  if (protocol === 'shadowsocks') {
    const userInfo = safeBtoa(`chacha20-ietf-poly1305:${uuid}`);
    return `ss://${userInfo}@${server}:${port}#${safeName}`;
  }

  return '';
}

// Generate Sing-box JSON configuration for all nodes
export function generateSingboxConfig(configs: ProxyConfig[]): string {
  const outbounds: any[] = [
    {
      type: 'selector',
      tag: 'انتخاب خودکار یا دستی',
      outbounds: ['تست خودکار پینگ (URL-Test)', ...configs.map((c) => c.name), 'direct'],
    },
    {
      type: 'urltest',
      tag: 'تست خودکار پینگ (URL-Test)',
      outbounds: configs.map((c) => c.name),
      url: 'https://www.gstatic.com/generate_204',
      interval: '3m',
      tolerance: 50,
    },
  ];

  configs.forEach((c) => {
    if (c.protocol === 'vless') {
      const node: any = {
        type: 'vless',
        tag: c.name,
        server: c.server,
        server_port: c.port,
        uuid: c.uuid,
        flow: c.flow || '',
        tls: {
          enabled: c.security === 'tls' || c.security === 'reality',
          server_name: c.sni || c.host,
          insecure: false,
          utls: {
            enabled: true,
            fingerprint: c.fp || 'chrome',
          },
        },
      };

      if (c.security === 'reality' && c.pbk) {
        node.tls.reality = {
          enabled: true,
          public_key: c.pbk,
          short_id: c.sid || '',
        };
      }

      if (c.transport === 'ws') {
        node.transport = {
          type: 'ws',
          path: c.path || '/',
          headers: {
            Host: c.host || c.sni,
          },
        };
      } else if (c.transport === 'grpc') {
        node.transport = {
          type: 'grpc',
          service_name: c.path ? c.path.replace(/^\//, '') : 'grpc',
        };
      }
      outbounds.push(node);
    } else if (c.protocol === 'vmess') {
      const node: any = {
        type: 'vmess',
        tag: c.name,
        server: c.server,
        server_port: c.port,
        uuid: c.uuid,
        security: 'auto',
        alter_id: 0,
        tls: {
          enabled: c.security === 'tls',
          server_name: c.sni || c.host,
          utls: {
            enabled: true,
            fingerprint: c.fp || 'chrome',
          },
        },
      };
      if (c.transport === 'ws') {
        node.transport = {
          type: 'ws',
          path: c.path || '/',
          headers: { Host: c.host || c.sni },
        };
      }
      outbounds.push(node);
    } else if (c.protocol === 'trojan') {
      const node: any = {
        type: 'trojan',
        tag: c.name,
        server: c.server,
        server_port: c.port,
        password: c.uuid,
        tls: {
          enabled: true,
          server_name: c.sni || c.host,
          utls: {
            enabled: true,
            fingerprint: c.fp || 'chrome',
          },
        },
      };
      if (c.transport === 'ws') {
        node.transport = {
          type: 'ws',
          path: c.path || '/',
          headers: { Host: c.host || c.sni },
        };
      }
      outbounds.push(node);
    }
  });

  outbounds.push(
    { type: 'direct', tag: 'direct' },
    { type: 'block', tag: 'block' },
    { type: 'dns', tag: 'dns-out' }
  );

  const singbox = {
    log: { level: 'warn', timestamp: true },
    dns: {
      servers: [
        { tag: 'google', address: 'tls://8.8.8.8' },
        { tag: 'local', address: 'https://1.1.1.1/dns-query', detour: 'direct' },
      ],
      rules: [
        { outbound: 'any', server: 'local' },
        { domain_suffix: ['.ir', '.tehran.ir', '.shaparak.ir'], server: 'local' },
      ],
      strategy: 'prefer_ipv4',
    },
    inbounds: [
      {
        type: 'mixed',
        tag: 'mixed-in',
        listen: '127.0.0.1',
        listen_port: 2080,
      },
      {
        type: 'tun',
        tag: 'tun-in',
        interface_name: 'tun0',
        inet4_address: '172.19.0.1/30',
        auto_route: true,
        strict_route: true,
        stack: 'system',
        sniff: true,
      },
    ],
    outbounds: outbounds,
    route: {
      rules: [
        { protocol: 'dns', outbound: 'dns-out' },
        { geoip: 'ir', outbound: 'direct' },
        { geosite: 'category-ir', outbound: 'direct' },
        { geosite: 'category-ads-all', outbound: 'block' },
      ],
      auto_detect_interface: true,
    },
  };

  return JSON.stringify(singbox, null, 2);
}

// Generate Clash Meta YAML configuration
export function generateClashYaml(configs: ProxyConfig[]): string {
  const proxies = configs
    .map((c) => {
      if (c.protocol === 'vless') {
        let y = `  - name: "${c.name}"\n    type: vless\n    server: ${c.server}\n    port: ${c.port}\n    uuid: ${c.uuid}\n    network: ${c.transport}\n    tls: ${c.security === 'tls' || c.security === 'reality'}\n    udp: true\n    servername: ${c.sni || c.host}\n    client-fingerprint: ${c.fp || 'chrome'}`;
        if (c.transport === 'ws') {
          y += `\n    ws-opts:\n      path: "${c.path || '/'}"\n      headers:\n        Host: ${c.host || c.sni}`;
        } else if (c.transport === 'grpc') {
          y += `\n    grpc-opts:\n      grpc-service-name: "${c.path ? c.path.replace(/^\//, '') : 'grpc'}"`;
        }
        if (c.security === 'reality') {
          y += `\n    reality-opts:\n      public-key: ${c.pbk || ''}\n      short-id: ${c.sid || ''}`;
        }
        return y;
      }
      if (c.protocol === 'vmess') {
        let y = `  - name: "${c.name}"\n    type: vmess\n    server: ${c.server}\n    port: ${c.port}\n    uuid: ${c.uuid}\n    alterId: 0\n    cipher: auto\n    udp: true\n    tls: ${c.security === 'tls'}\n    servername: ${c.sni || c.host}\n    network: ${c.transport}\n    client-fingerprint: ${c.fp || 'chrome'}`;
        if (c.transport === 'ws') {
          y += `\n    ws-opts:\n      path: "${c.path || '/'}"\n      headers:\n        Host: ${c.host || c.sni}`;
        }
        return y;
      }
      if (c.protocol === 'trojan') {
        let y = `  - name: "${c.name}"\n    type: trojan\n    server: ${c.server}\n    port: ${c.port}\n    password: ${c.uuid}\n    udp: true\n    sni: ${c.sni || c.host}\n    client-fingerprint: ${c.fp || 'chrome'}\n    network: ${c.transport}`;
        if (c.transport === 'ws') {
          y += `\n    ws-opts:\n      path: "${c.path || '/'}"\n      headers:\n        Host: ${c.host || c.sni}`;
        }
        return y;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');

  const names = configs.map((c) => `      - "${c.name}"`).join('\n');

  return `port: 7890
socks-port: 7891
mixed-port: 7892
allow-lan: true
mode: rule
log-level: info
unified-delay: true

dns:
  enable: true
  listen: 0.0.0.0:53
  enhanced-mode: fake-ip
  nameserver:
    - 8.8.8.8
    - 1.1.1.1
  fallback:
    - https://dns.cloudflare.com/dns-query

proxies:
${proxies}

proxy-groups:
  - name: "انتخاب دستی یا خودکار"
    type: select
    proxies:
      - "تست خودکار پینگ (Auto)"
${names}
      - DIRECT

  - name: "تست خودکار پینگ (Auto)"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    proxies:
${names}

rules:
  - GEOIP,IR,DIRECT
  - DOMAIN-SUFFIX,ir,DIRECT
  - MATCH,انتخاب دستی یا خودکار
`;
}
