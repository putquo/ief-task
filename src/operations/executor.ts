import { Command, KeysetAction, PolicyAction } from '../models/enums';
import type { Action, ActionInputs } from '../models/types';
import { createKeysetAsync, deleteKeysetAsync, generateKeyAsync, uploadCertAsync, uploadPkcs12CertAsync, uploadSecretAsync } from '../utilities/keyset';
import { batchPolicies, createPolicyTree, deletePoliciesAsync, getPoliciesAsync, uploadPoliciesAsync } from '../utilities/policy';
import { getCertificate, getKey, getKeysetName, getPkcs12, getPoliciesFolder, getPoliciesToDelete, getSecret } from '../utilities/task';


const createKeysetAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const name = getKeysetName();
    await createKeysetAsync(inputs.client, name);
}

const deleteKeysetAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const name = getKeysetName();
    await deleteKeysetAsync(inputs.client, name);
}

const generateKeyKeysetAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const name = getKeysetName();
    const key = getKey();
    await generateKeyAsync(inputs.client, name, key);
}

const uploadCertificateKeysetAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const name = getKeysetName();
    const cert = getCertificate();
    await uploadCertAsync(inputs.client, name, cert);
}

const uploadPkcs12KeysetAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const name = getKeysetName();
    const cert = getPkcs12();
    await uploadPkcs12CertAsync(inputs.client, name, cert);
}

const uploadSecretKeysetAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const name = getKeysetName();
    const secret = getSecret();
    await uploadSecretAsync(inputs.client, name, secret);
}

const deletePolicyAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const policiesFolder = getPoliciesFolder();
    const policiesToDelete = getPoliciesToDelete(policiesFolder);
    const policies = await getPoliciesAsync(policiesFolder, policiesToDelete);
    await deletePoliciesAsync(inputs.client, policies);
}

const uploadPolicyAction: Action = async (inputs: ActionInputs): Promise<void> => {
    const policiesFolder = getPoliciesFolder();
    const policies = await getPoliciesAsync(policiesFolder);
    const roots = createPolicyTree(policies);
    const batches = batchPolicies(roots);
    await uploadPoliciesAsync(inputs.client, batches);
}

const keysetActions = new Map<KeysetAction, Action>([
    [ KeysetAction.Create, createKeysetAction ],
    [ KeysetAction.Delete, deleteKeysetAction ],
    [ KeysetAction.Generate, generateKeyKeysetAction ],
    [ KeysetAction.UploadCertificate, uploadCertificateKeysetAction ],
    [ KeysetAction.UploadPkcs12, uploadPkcs12KeysetAction ],
    [ KeysetAction.UploadSecret, uploadSecretKeysetAction ],
]);

const policyActions = new Map<PolicyAction, Action>([
    [ PolicyAction.Delete, deletePolicyAction ],
    [ PolicyAction.Upload, uploadPolicyAction ],
]);

export const actionExecutors = new Map<Command, Map<KeysetAction | PolicyAction, Action>>([
    [ Command.Keyset, keysetActions ],
    [ Command.Policy, policyActions ],
]);

