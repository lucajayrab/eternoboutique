export default function HubSpotVerifyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">HubSpot Integration Verification</h1>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Run Diagnostic Test</h2>
        <p className="mb-4">
          Click the button below to run a diagnostic test that will send a test submission to HubSpot:
        </p>
        <a
          href="/api/hubspot-diagnostic"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Run HubSpot Diagnostic
        </a>
      </div>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Verify Submissions in HubSpot</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>After running the diagnostic or submitting a form, log in to your HubSpot account</li>
          <li>Go to Contacts &gt; Contacts</li>
          <li>In the search bar, enter the email address used in the submission</li>
          <li>If the contact exists, your integration is working correctly</li>
          <li>If not, check the diagnostic results for error messages</li>
        </ol>
      </div>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            <strong>Field Name Mismatch:</strong> HubSpot field names are case-sensitive and must match exactly
          </li>
          <li>
            <strong>Required Fields:</strong> Your HubSpot form might have required fields that aren't being provided
          </li>
          <li>
            <strong>GDPR/Consent:</strong> If your HubSpot account requires consent, make sure it's included in the
            payload
          </li>
          <li>
            <strong>Rate Limiting:</strong> HubSpot may rate-limit submissions if too many are sent in a short period
          </li>
          <li>
            <strong>Contact Filtering:</strong> New contacts might be filtered into lists you don't have access to
          </li>
        </ul>
      </div>

      <div className="p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">HubSpot API Documentation</h2>
        <p>For more information, refer to the official HubSpot Forms API documentation:</p>
        <a
          href="https://developers.hubspot.com/docs/api/marketing/forms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          HubSpot Forms API Documentation
        </a>
      </div>
    </div>
  )
}
