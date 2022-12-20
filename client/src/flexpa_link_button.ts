function displayFlexpaLinkButton() {
  return (/* html */`
    <div class="link-section">
        <div id="flexpa-link-btn" class="launch-btn">
            <span class="icon-container">
                <svg aria-hidden="true" class="lock-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </span>
            Connect your health plan with Flexpa Link
        </div>
        Use a
        &nbsp;<a href="https://www.flexpa.com/docs/getting-started/test-mode#test-mode-logins" target="_blank">test mode login</a>&nbsp; 
        to authenticate in the modal that appears.
    </div>
    `);
}
export default displayFlexpaLinkButton;
