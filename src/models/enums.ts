export enum TaskInput {
  Action = 'action',
  Certificate = 'certificate',
  Command = 'command',
  ExpireAfter = 'expireAfter',
  Files = 'files',
  KeysetName = 'keysetName',
  KeyUsage = 'keyUsage',
  KeyType = 'keyType',
  NotBefore = 'notBefore',
  PfxContent = 'pfxContent',
  PfxPassword = 'pfxPassword',
  Policies = 'policies',
  Secret = 'secret',
  ServiceConnection = 'serviceConnection',
  TenantId = 'tenantId'
}

export enum Command {
  Keyset = 'keyset',
  Policy = 'policy',
}

export enum PolicyAction {
  Delete = 'delete',
  Upload = 'upload',
}

export enum KeysetAction {
  Create = 'create',
  Delete = 'delete',
  Generate = 'generate',
  UploadSecret = 'upload secret',
  UploadPkcs12 = 'upload PKCS12 certificate',
  UploadCertificate = 'upload certificate',
}

export enum KeyUsage {
  Encryption = 'enc',
  Signature = 'sig',
}

export enum KeyType {
  Oct = 'oct',
  Rsa = 'rsa',
}

export enum FileExtensions {
  Xml = '.xml',
}

export enum MimeTypes {
  ApplicationXml = 'application/xml',
}
