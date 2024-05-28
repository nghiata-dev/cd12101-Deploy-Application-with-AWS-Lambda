import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJeuGEw0gzRi4gMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi03dndmYzRvM3F0MmkzMWlkLnVzLmF1dGgwLmNvbTAeFw0yNDA1Mjcw
NDUyNDNaFw0zODAyMDMwNDUyNDNaMCwxKjAoBgNVBAMTIWRldi03dndmYzRvM3F0
MmkzMWlkLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANJNOzuQ81T7WKSHhOlV0JHVNCnGPybgw0DRooxFT9cESxjqohQXiR8FUO1O
/wxPfEyWsMYEqafBlVXzLOZkDJgy9/jcWRP/rmk3EoxsGQYRh+zgk0V4bJreSVSk
GxlkqMrX8PBT/4cQmDv30OZnt1C1E29UoL/PV6Uuwxi1u5+IqJ+RYunB2TUPXO//
v/aSXUyYsvJPDM/MX8TVJIBhNwHteqnHFu4m6JbSIColGA1Vx1/FRkD/E8q7VZcx
Kv5q4gVwljCVXf69xyulI6WUA9ixhv3wV/kzwBGXpqwzSyRnl7pnHQhmQYY7EcMT
mt1vYhGQ3b3hFDuFDUcibmARRssCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUv71NSeHNdn4ThdhMZKrfHWeh1B8wDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQAoKQv9kUChHqQ3FeZFZx7jXFP7z0mElxZBq28Jy39B
1YwBdKcVIVQIXcapQ3mIyEriJNKKecNduhmbQEZqR/RCEyUqi80MKn1estDkApMq
iM/1BhfusYwLFYmCr/qDRJUiakdHjkj11U8n8yKdq5XT/sp/so36bStNXqsR8g+9
zDUZsDwfmUPZbdtCNQg2O/hxHowKlFakDbGWo2nJrtJkF3q/YD6s94E+LcdcPq2D
25WGZ9BWv41vDuEKc7/ZMeOGfmi8isyEMKFVbu33iFhYTmz4vmXdMSSALg5586IH
FQwFjjl+NaYAzuxvmzUuHZo8tKLA+lBEqSKIv5/H1G7p
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader) {
  const token = getToken(authHeader)

  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
