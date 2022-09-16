const config = {
  graphApi: {
    baseUri: 'https://graph.microsoft.com/beta/',
    keysetsEndpoint: 'trustFramework/keySets',
    policiesEndpoint: 'trustFramework/policies',
    scope: 'https://graph.microsoft.com/.default',
  },
  trustFrameworkPolicySchema: 'https://raw.githubusercontent.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/master/TrustFrameworkPolicy_0.3.0.0.xsd',
};

export default config;
