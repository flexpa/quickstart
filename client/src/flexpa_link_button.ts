function displayFlexpaLinkButton() {
    return (/* html */`
    <div class="link-section">
        Click the button below to link your health plan.
        <div id="flexpa-link-btn" class="launch-btn">
            <span class="icon-container">
                <svg aria-hidden="true" class="lock-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </span>
            Link your health plan
        </div>
    </div>
    `);
}
export default displayFlexpaLinkButton;
