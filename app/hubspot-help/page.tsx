export default function HubSpotHelpPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">HubSpot Integration Help</h1>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Finding Your HubSpot Form ID</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>Log in to your HubSpot account</li>
          <li>Go to Marketing &gt; Lead Capture &gt; Forms</li>
          <li>Find your "Customer Details" form and click on it</li>
          <li>Click on the "Actions" dropdown and select "Embed"</li>
          <li>
            In the embed code, look for a line that contains{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">formId: "YOUR_FORM_ID"</code>
          </li>
          <li>Copy that form ID (it should be a long string with hyphens)</li>
        </ol>
      </div>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Finding Your HubSpot Portal ID</h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>Log in to your HubSpot account</li>
          <li>Click on your profile icon in the top-right corner</li>
          <li>Select "Account Settings"</li>
          <li>Your Portal ID should be displayed at the top of the page</li>
        </ol>
      </div>

      <div className="mb-8 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Testing Your HubSpot Integration</h2>
        <p className="mb-4">Once you have your Portal ID and Form ID, you can test the integration with this URL:</p>
        <code className="block bg-gray-200 p-3 rounded overflow-x-auto">
          /api/hubspot-test?portalId=YOUR_PORTAL_ID&formId=YOUR_FORM_ID
        </code>
        <p className="mt-4">
          This will send a test submission to your HubSpot form and show you the complete response.
        </p>
      </div>

      <div className="p-4 border rounded bg-gray-50 text-red-600">
        <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>Incorrect Portal ID or Form ID</li>
          <li>Field names in the code don't match the internal field names in HubSpot</li>
          <li>Required fields in HubSpot that aren't being provided</li>
          <li>CORS restrictions (HubSpot blocking requests from your domain)</li>
        </ul>
      </div>
    </div>
  )
}
