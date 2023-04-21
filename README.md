<div align="center">
  <a href="https://dev.azure.com/investec/investec-cloud-experience/_git/ice-devops-tasks">
    <img 
      width="128"
      height="128"
      src="https://cdn-icons-png.flaticon.com/128/4252/4252354.png"
    >
  </a>
  <h1 align="center">📜✔️ief-task</h1>
  <a href="https://dev.azure.com/investec/sandbox/_build/latest?definitionId=3659&branchName=main">
    <img src="https://dev.azure.com/prestonvtonder/sandbox/_apis/build/status/ief-task?branchName=main">
  </a>
</div>

## Overview

A task for managing Azure Active Directory B2C Identity Experience Framework. The task allows you to manage **Keysets**
and **Policies**.

## Usage

This task can be used to do the following.

* Keyset
  * Create: Create a new **trustFrameworkKeySet**.
  * Delete: Delete a **trustFrameworkKeySet**.
  * Generate: Generate a **trustFrameworkKey** and a secret automatically in the **trustFrameworkKeyset**.
  * UploadCertificate: Upload a base-64 encoded certificate to a **trustFrameworkKeyset**.
  * UploadPkcs12: Upload a PKCS12 format key (PFX) to a **trustFrameworkKeyset**.
  * UploadSecret: Upload a plain text secret to a trustFrameworkKeyset.
* Policy
  * Delete: Delete a set of **trustFrameworkPolicies**.
  * Upload: Upload a set **trustFrameworkPolicies** in batches.

### Inputs

* **command**: The command to use.
* **action**: The action to perform.
* **policies**: A directory containing all of the Trust Framework policies.
* **serviceConnection**: The name of a generic service connection from which the __client id__ and __client secret__ can be derived. The App Registration should belong to the same tenant as __tenantId__, with scopes __Policy.ReadWrite.All__.
* **tenantId**: The AAD B2C tenant ID.
