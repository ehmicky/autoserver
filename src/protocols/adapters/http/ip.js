import { getClientIp } from 'request-ip'

// Retrieves request IP.
// Tries, in order:
//  - X-Client-IP [C]
//  - X-Forwarded-For [C]
//  - CF-Connecting-IP [C]
//  - True-Client-Ip [C]
//  - X-Real-IP [C]
//  - X-Cluster-Client-IP [C]
//  - X-Forwarded [C]
//  - Forwarded-For [C]
//  - REQ.connection.remoteAddress
//  - REQ.connection.socket.remoteAddress
//  - REQ.socket.remoteAddress
//  - REQ.info.remoteAddress
// If invalid IPv4|IPv6, throws.
// If unknown, returns undefined.
export const getIp = ({ specific: { req } }) => getClientIp(req) || ''
